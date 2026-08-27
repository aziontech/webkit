import { fireEvent, render, screen } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import CommandMenu from './command-menu.vue'
import CommandMenuEmpty from './command-menu-empty/command-menu-empty.vue'
import CommandMenuGroup from './command-menu-group/command-menu-group.vue'
import CommandMenuInput from './command-menu-input/command-menu-input.vue'
import CommandMenuItem from './command-menu-item/command-menu-item.vue'
import CommandMenuList from './command-menu-list/command-menu-list.vue'
import CommandMenuSeparator from './command-menu-separator/command-menu-separator.vue'

// The panel + backdrop are Teleported to <body> by the wrapped Dialog, so they
// escape the render container. Query them from document.body. A couple of
// frames let the portal mount + items register + the reset-active nextTick run.
const settle = async () => {
  await nextTick()
  await nextTick()
}

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)

const panel = () => byTestId('overlay-command-menu__panel')

/**
 * A realistic composed palette: Root (v-model:open) > Input + List > two Groups
 * (one holding a disabled item) separated by a Separator, plus an Empty state.
 * Flat sub-component tags (never dot-notation) so runtime templates resolve.
 */
const composed = (props: Record<string, unknown> = {}, inputProps: Record<string, unknown> = {}) =>
  defineComponent({
    components: {
      CommandMenu,
      CommandMenuInput,
      CommandMenuList,
      CommandMenuGroup,
      CommandMenuItem,
      CommandMenuEmpty,
      CommandMenuSeparator
    },
    setup() {
      const open = ref<boolean>(Boolean(props.defaultOpen ?? false))
      const onSelect = props.onSelect as ((...args: unknown[]) => void) | undefined
      return { props, inputProps, open, onSelect }
    },
    template: `
      <CommandMenu v-bind="props" v-model:open="open" @select="onSelect">
        <CommandMenuInput placeholder="Search commands…" v-bind="inputProps" />
        <CommandMenuList>
          <CommandMenuGroup heading="Actions">
            <CommandMenuItem value="deploy">Deploy Project</CommandMenuItem>
            <CommandMenuItem value="new-app">Create Application</CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuSeparator />
          <CommandMenuGroup heading="Navigation">
            <CommandMenuItem value="settings" disabled>Go to Settings</CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuEmpty>No commands found.</CommandMenuEmpty>
        </CommandMenuList>
      </CommandMenu>
    `
  })

/**
 * A palette whose first item carries a `prefix` and whose second does not — the
 * mixed case the reserved icon column exists for.
 */
const mixedPrefixes = () =>
  defineComponent({
    components: {
      CommandMenu,
      CommandMenuInput,
      CommandMenuList,
      CommandMenuGroup,
      CommandMenuItem
    },
    setup() {
      const open = ref(true)
      return { open }
    },
    template: `
      <CommandMenu v-model:open="open">
        <CommandMenuInput placeholder="Search commands…" />
        <CommandMenuList>
          <CommandMenuGroup heading="Actions">
            <CommandMenuItem value="deploy">
              <template #prefix><i class="pi pi-cloud-upload" aria-hidden="true" /></template>
              Deploy Project
            </CommandMenuItem>
            <CommandMenuItem value="new-app">Create Application</CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    `
  })

/**
 * A palette whose leading group is rendered CONDITIONALLY on the query — the shape a
 * consumer takes when the palette searches a data set and shows the results above its
 * static navigation (the console's global search). Those items register LAST (they mount
 * on the first keystroke) while rendering FIRST, which is what the DOM-ordered roving
 * list exists for.
 */
const conditionalResults = () =>
  defineComponent({
    components: {
      CommandMenu,
      CommandMenuInput,
      CommandMenuList,
      CommandMenuGroup,
      CommandMenuItem
    },
    setup() {
      const open = ref(true)
      const query = ref('')
      return { open, query }
    },
    template: `
      <CommandMenu v-model:open="open">
        <CommandMenuInput placeholder="Search commands…" @update:model-value="query = $event" />
        <CommandMenuList>
          <CommandMenuGroup v-if="query" heading="Resources">
            <CommandMenuItem value="res:storefront">storefront</CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Navigation">
            <CommandMenuItem value="nav:storage">Object Storage</CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    `
  })

afterEach(async () => {
  await settle()
})

describe('CommandMenu (overlay: wraps Dialog, composition + provide/inject)', () => {
  describe('closed state', () => {
    it('renders no Teleported panel while closed', async () => {
      const { getByTestId } = render(composed())
      await settle()

      expect(getByTestId('overlay-command-menu').getAttribute('data-state')).toBe('closed')
      expect(panel()).toBeNull()
    })
  })

  describe('opening via v-model:open', () => {
    it('mounts the role=dialog panel Teleported to document.body when open', async () => {
      const { getByTestId } = render(composed({ defaultOpen: true }))
      await settle()

      expect(getByTestId('overlay-command-menu').getAttribute('data-state')).toBe('open')

      const dialog = panel()
      expect(dialog).not.toBeNull()
      expect(dialog!.getAttribute('role')).toBe('dialog')

      // The input is a combobox wired to the list's id.
      const input = byTestId('overlay-command-menu__input')!.querySelector('input')!
      expect(input.getAttribute('role')).toBe('combobox')
      expect(input.getAttribute('aria-expanded')).toBe('true')
      expect(input.getAttribute('aria-controls')).toBe(byTestId('overlay-command-menu__list')!.id)
    })
  })

  describe('search field accessible name', () => {
    it('names the field with its placeholder text when no ariaLabel is given', async () => {
      render(composed({ defaultOpen: true }))
      await settle()

      const input = byTestId('overlay-command-menu__input')!.querySelector('input')!
      expect(screen.getByLabelText('Search commands…')).toBe(input)
      expect(input.getAttribute('aria-label')).toBe('Search commands…')
    })

    it('an explicit ariaLabel wins over the placeholder', async () => {
      render(composed({ defaultOpen: true }, { ariaLabel: 'Search actions' }))
      await settle()

      const input = byTestId('overlay-command-menu__input')!.querySelector('input')!
      expect(screen.getByLabelText('Search actions')).toBe(input)
      expect(input.getAttribute('placeholder')).toBe('Search commands…')
    })
  })

  describe('data-testid derivation', () => {
    it('uses the overlay-command-menu fallback on the root', async () => {
      const { getByTestId } = render(composed())
      await settle()
      expect(getByTestId('overlay-command-menu')).toBeTruthy()
    })

    it('a consumer-supplied data-testid wins', async () => {
      render(composed({ defaultOpen: true, 'data-testid': 'palette' }))
      await settle()
      expect(byTestId('palette__panel')).not.toBeNull()
      expect(byTestId('overlay-command-menu__panel')).toBeNull()
    })
  })

  describe('substring filtering', () => {
    it('filters items by the typed query and shows Empty when nothing matches', async () => {
      render(composed({ defaultOpen: true }))
      await settle()

      const deploy = screen.getByText('Deploy Project')
      const createApp = screen.getByText('Create Application')
      const empty = screen.getByText('No commands found.')

      // Everything visible, Empty hidden.
      expect(empty.style.display).toBe('none')

      const input = byTestId('overlay-command-menu__input')!.querySelector('input')!
      await fireEvent.update(input, 'deploy')
      await settle()

      // Only "Deploy Project" survives the filter.
      const deployRow = deploy.closest('[role="option"]') as HTMLElement
      const createRow = createApp.closest('[role="option"]') as HTMLElement
      expect(deployRow.style.display).not.toBe('none')
      expect(createRow.style.display).toBe('none')
      expect(empty.style.display).toBe('none')

      // A query that matches nothing surfaces the Empty state.
      await fireEvent.update(input, 'zzzzzzz')
      await settle()
      expect(empty.style.display).not.toBe('none')
    })
  })

  describe('roving navigation + activation', () => {
    it('ArrowDown + Enter activates the active item, emits select(event, value), and closes', async () => {
      const onSelect = vi.fn()
      render(composed({ defaultOpen: true, onSelect }))
      await settle()

      // Narrow to a single enabled item so the active target is deterministic.
      const input = byTestId('overlay-command-menu__input')!.querySelector('input')!
      await fireEvent.update(input, 'new-app')
      await settle()

      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await fireEvent.keyDown(input, { key: 'Enter' })
      await settle()

      expect(onSelect).toHaveBeenCalledTimes(1)
      const [event, value] = onSelect.mock.calls[0]
      expect(event).toBeInstanceOf(KeyboardEvent)
      expect(value).toBe('new-app')

      // Selecting closes the palette. DialogPortal keeps the panel mounted for
      // the exit animation, so assert the closed state on the root (as dialog does).
      expect(byTestId('overlay-command-menu')?.getAttribute('data-state')).toBe('closed')
    })
  })

  describe('a group rendered on the query roves where it renders', () => {
    // The consumer's `@update:model-value` on the Input reaches the field alongside the
    // context's own handler (Vue merges both), which is how a consumer learns the query
    // without the root exposing it.
    it('highlights the first row of the conditional group on the first keystroke', async () => {
      render(conditionalResults())
      await settle()

      const input = byTestId('overlay-command-menu__input')!.querySelector('input')!
      await fireEvent.update(input, 'sto')
      await settle()

      // Both rows match "sto" — the conditional one renders first, so it is the one the
      // highlight (and therefore Enter) lands on, even though it registered last.
      const rows = Array.from(
        document.body.querySelectorAll<HTMLElement>('[data-testid="overlay-command-menu__item"]')
      )
      expect(rows.map((row) => row.textContent?.trim())).toEqual(['storefront', 'Object Storage'])
      expect(rows[0].getAttribute('data-active')).toBe('true')
      expect(rows[1].getAttribute('data-active')).toBeNull()
    })

    it('ArrowDown walks the rows in DOM order, not registration order', async () => {
      render(conditionalResults())
      await settle()

      const input = byTestId('overlay-command-menu__input')!.querySelector('input')!
      await fireEvent.update(input, 'sto')
      await settle()

      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await settle()

      const rows = Array.from(
        document.body.querySelectorAll<HTMLElement>('[data-testid="overlay-command-menu__item"]')
      )
      expect(rows[1].getAttribute('data-active')).toBe('true')
    })
  })

  describe('disabled item', () => {
    it('does not activate or emit select on click', async () => {
      const onSelect = vi.fn()
      render(composed({ defaultOpen: true, onSelect }))
      await settle()

      const settings = screen.getByText('Go to Settings')
      const row = settings.closest('[role="option"]') as HTMLElement
      expect(row.getAttribute('aria-disabled')).toBe('true')

      await fireEvent.click(row)
      await settle()

      expect(onSelect).not.toHaveBeenCalled()
      expect(panel()).not.toBeNull()
    })
  })

  // Vitest browser mode compiles no Tailwind, so an emitted `px` cannot be
  // measured here. These assert the structural mechanism instead: the reserved
  // box either exists on every row or on none, which is what makes the label
  // edge single. Geometry is verified in the browser against the story.
  describe('one icon column for the whole list', () => {
    it('reserves the prefix box on every item once any item carries a prefix', async () => {
      render(mixedPrefixes())
      await settle()

      const items = Array.from(
        document.body.querySelectorAll<HTMLElement>('[data-testid="overlay-command-menu__item"]')
      )
      expect(items).toHaveLength(2)

      // Both rows get the box — the icon-less one reserves an empty column so its
      // label starts where the iconed row's does.
      for (const item of items) {
        const box = item.querySelector('[data-testid="overlay-command-menu__item__prefix"]')
        expect(box).not.toBeNull()
        expect(box?.className).toContain('size-4')
      }

      // Only the first actually holds a glyph.
      expect(items[0].querySelector('i.pi-cloud-upload')).not.toBeNull()
      expect(items[1].querySelector('i')).toBeNull()
    })

    it('reserves no column when no item carries a prefix', async () => {
      render(composed({ defaultOpen: true }))
      await settle()

      const items = Array.from(
        document.body.querySelectorAll<HTMLElement>('[data-testid="overlay-command-menu__item"]')
      )
      expect(items.length).toBeGreaterThan(0)
      for (const item of items) {
        expect(item.querySelector('[data-testid="overlay-command-menu__item__prefix"]')).toBeNull()
      }
    })
  })

  describe('group rhythm', () => {
    it('spaces a group that follows another group, but not one that follows a separator', async () => {
      render(composed({ defaultOpen: true }))
      await settle()

      const groups = Array.from(
        document.body.querySelectorAll<HTMLElement>('[data-testid="overlay-command-menu__group"]')
      )
      expect(groups).toHaveLength(2)

      // The variant is sibling-scoped, so both groups carry the same class and the
      // selector decides: it matches after a group, never after a separator.
      for (const group of groups) {
        expect(group.className).toContain('[:not([role=separator])+&]:mt-(--spacing-sm)')
      }

      // Group 2 here follows the separator, so the rule must not match it.
      expect(groups[1].previousElementSibling?.getAttribute('role')).toBe('separator')
    })

    it('gives the separator the same rhythm as the Dropdown group divider', async () => {
      render(composed({ defaultOpen: true }))
      await settle()

      const separator = document.body.querySelector<HTMLElement>(
        '[data-testid="overlay-command-menu__separator"]'
      )
      expect(separator).not.toBeNull()
      expect(separator?.className).toContain('mt-(--spacing-sm)')
      expect(separator?.className).toContain('mb-(--spacing-xs)')
      expect(separator?.className).toContain('border-t')
    })
  })

  describe('accessibility (axe on the open, Teleported palette)', () => {
    it('has no WCAG violations while open', async () => {
      render(composed({ defaultOpen: true }))
      await settle()

      expect(panel()).not.toBeNull()
      await expectNoA11yViolations(document.body)
    })
  })
})
