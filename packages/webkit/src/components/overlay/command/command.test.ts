import { fireEvent, render, screen } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import Command from './command.vue'
import CommandEmpty from './command-empty/command-empty.vue'
import CommandGroup from './command-group/command-group.vue'
import CommandInput from './command-input/command-input.vue'
import CommandItem from './command-item/command-item.vue'
import CommandList from './command-list/command-list.vue'
import CommandSeparator from './command-separator/command-separator.vue'

// The panel + backdrop are Teleported to <body> by the wrapped Dialog, so they
// escape the render container. Query them from document.body. A couple of
// frames let the portal mount + items register + the reset-active nextTick run.
const settle = async () => {
  await nextTick()
  await nextTick()
}

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)

const panel = () => byTestId('overlay-command__panel')

/**
 * A realistic composed palette: Root (v-model:open) > Input + List > two Groups
 * (one holding a disabled item) separated by a Separator, plus an Empty state.
 * Flat sub-component tags (never dot-notation) so runtime templates resolve.
 */
const composed = (props: Record<string, unknown> = {}, inputProps: Record<string, unknown> = {}) =>
  defineComponent({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandGroup,
      CommandItem,
      CommandEmpty,
      CommandSeparator
    },
    setup() {
      const open = ref<boolean>(Boolean(props.defaultOpen ?? false))
      const onSelect = props.onSelect as ((...args: unknown[]) => void) | undefined
      return { props, inputProps, open, onSelect }
    },
    template: `
      <Command v-bind="props" v-model:open="open" @select="onSelect">
        <CommandInput placeholder="Search commands…" v-bind="inputProps" />
        <CommandList>
          <CommandGroup heading="Actions">
            <CommandItem value="deploy">Deploy Project</CommandItem>
            <CommandItem value="new-app">Create Application</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem value="settings" disabled>Go to Settings</CommandItem>
          </CommandGroup>
          <CommandEmpty>No commands found.</CommandEmpty>
        </CommandList>
      </Command>
    `
  })

/**
 * A palette whose first item carries a `prefix` and whose second does not — the
 * mixed case that proves an icon-less row renders no prefix box at all.
 */
const mixedPrefixes = () =>
  defineComponent({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandGroup,
      CommandItem
    },
    setup() {
      const open = ref(true)
      return { open }
    },
    template: `
      <Command v-model:open="open">
        <CommandInput placeholder="Search commands…" />
        <CommandList>
          <CommandGroup heading="Actions">
            <CommandItem value="deploy">
              <template #prefix><i class="pi pi-cloud-upload" aria-hidden="true" /></template>
              Deploy Project
            </CommandItem>
            <CommandItem value="new-app">Create Application</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    `
  })

/** A palette whose leading group renders conditionally on the query (a data-set search above
 *  static navigation, like the console's global search): those items register LAST, on the
 *  first keystroke, while rendering FIRST, which is what the DOM-ordered roving list is for. */
const conditionalResults = () =>
  defineComponent({
    components: {
      Command,
      CommandInput,
      CommandList,
      CommandGroup,
      CommandItem
    },
    setup() {
      const open = ref(true)
      const query = ref('')
      return { open, query }
    },
    template: `
      <Command v-model:open="open">
        <CommandInput placeholder="Search commands…" @update:model-value="query = $event" />
        <CommandList>
          <CommandGroup v-if="query" heading="Resources">
            <CommandItem value="res:storefront">storefront</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Navigation">
            <CommandItem value="nav:storage">Object Storage</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    `
  })

afterEach(async () => {
  await settle()
})

describe('Command (overlay: wraps Dialog, composition + provide/inject)', () => {
  describe('closed state', () => {
    it('renders no Teleported panel while closed', async () => {
      const { getByTestId } = render(composed())
      await settle()

      expect(getByTestId('overlay-command').getAttribute('data-state')).toBe('closed')
      expect(panel()).toBeNull()
    })
  })

  describe('opening via v-model:open', () => {
    it('mounts the role=dialog panel Teleported to document.body when open', async () => {
      const { getByTestId } = render(composed({ defaultOpen: true }))
      await settle()

      expect(getByTestId('overlay-command').getAttribute('data-state')).toBe('open')

      const dialog = panel()
      expect(dialog).not.toBeNull()
      expect(dialog!.getAttribute('role')).toBe('dialog')

      // The input is a combobox wired to the list's id.
      const input = byTestId('overlay-command__input')!.querySelector('input')!
      expect(input.getAttribute('role')).toBe('combobox')
      expect(input.getAttribute('aria-expanded')).toBe('true')
      expect(input.getAttribute('aria-controls')).toBe(byTestId('overlay-command__list')!.id)
    })
  })

  describe('search field accessible name', () => {
    it('names the field with its placeholder text when no ariaLabel is given', async () => {
      render(composed({ defaultOpen: true }))
      await settle()

      const input = byTestId('overlay-command__input')!.querySelector('input')!
      expect(screen.getByLabelText('Search commands…')).toBe(input)
      expect(input.getAttribute('aria-label')).toBe('Search commands…')
    })

    it('an explicit ariaLabel wins over the placeholder', async () => {
      render(composed({ defaultOpen: true }, { ariaLabel: 'Search actions' }))
      await settle()

      const input = byTestId('overlay-command__input')!.querySelector('input')!
      expect(screen.getByLabelText('Search actions')).toBe(input)
      expect(input.getAttribute('placeholder')).toBe('Search commands…')
    })
  })

  describe('data-testid derivation', () => {
    it('uses the overlay-command fallback on the root', async () => {
      const { getByTestId } = render(composed())
      await settle()
      expect(getByTestId('overlay-command')).toBeTruthy()
    })

    it('a consumer-supplied data-testid wins', async () => {
      render(composed({ defaultOpen: true, 'data-testid': 'palette' }))
      await settle()
      expect(byTestId('palette__panel')).not.toBeNull()
      expect(byTestId('overlay-command__panel')).toBeNull()
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

      const input = byTestId('overlay-command__input')!.querySelector('input')!
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
      expect(byTestId('overlay-command__list')).not.toHaveAttribute('role')

      await fireEvent.update(input, '')
      await settle()
      expect(byTestId('overlay-command__list')).toHaveAttribute('role', 'listbox')
    })
  })

  describe('roving navigation + activation', () => {
    it('ArrowDown + Enter activates the active item, emits select(event, value), and closes', async () => {
      const onSelect = vi.fn()
      render(composed({ defaultOpen: true, onSelect }))
      await settle()

      // Narrow to a single enabled item so the active target is deterministic.
      const input = byTestId('overlay-command__input')!.querySelector('input')!
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
      expect(byTestId('overlay-command')?.getAttribute('data-state')).toBe('closed')
    })
  })

  describe('a group rendered on the query roves where it renders', () => {
    // The consumer's `@update:model-value` on the Input reaches the field alongside the
    // context's own handler (Vue merges both), which is how a consumer learns the query
    // without the root exposing it.
    it('highlights the first row of the conditional group on the first keystroke', async () => {
      render(conditionalResults())
      await settle()

      const input = byTestId('overlay-command__input')!.querySelector('input')!
      await fireEvent.update(input, 'sto')
      await settle()

      // Both rows match "sto" — the conditional one renders first, so it is the one the
      // highlight (and therefore Enter) lands on, even though it registered last.
      const rows = Array.from(
        document.body.querySelectorAll<HTMLElement>('[data-testid="overlay-command__item"]')
      )
      expect(rows.map((row) => row.textContent?.trim())).toEqual(['storefront', 'Object Storage'])
      expect(rows[0].getAttribute('data-active')).toBe('true')
      expect(rows[1].getAttribute('data-active')).toBeNull()
    })

    it('ArrowDown walks the rows in DOM order, not registration order', async () => {
      render(conditionalResults())
      await settle()

      const input = byTestId('overlay-command__input')!.querySelector('input')!
      await fireEvent.update(input, 'sto')
      await settle()

      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await settle()

      const rows = Array.from(
        document.body.querySelectorAll<HTMLElement>('[data-testid="overlay-command__item"]')
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
  // measured here. These assert the structural mechanism instead: the box is in
  // the DOM only for the row that supplies a glyph. Geometry is verified in the
  // browser against the story.
  describe('the prefix box belongs to the item that has a prefix', () => {
    it('renders the box only on the item that carries a prefix', async () => {
      render(mixedPrefixes())
      await settle()

      const items = Array.from(
        document.body.querySelectorAll<HTMLElement>('[data-testid="overlay-command__item"]')
      )
      expect(items).toHaveLength(2)

      const iconed = items[0].querySelector('[data-testid="overlay-command__item__prefix"]')
      expect(iconed).not.toBeNull()
      expect(iconed?.className).toContain('size-4')
      expect(items[0].querySelector('i.pi-cloud-upload')).not.toBeNull()

      // The icon-less row puts no empty box in the DOM, so it carries no indent.
      expect(items[1].querySelector('[data-testid="overlay-command__item__prefix"]')).toBeNull()
      expect(items[1].querySelector('i')).toBeNull()
    })

    it('renders no box at all when no item carries a prefix', async () => {
      render(composed({ defaultOpen: true }))
      await settle()

      const items = Array.from(
        document.body.querySelectorAll<HTMLElement>('[data-testid="overlay-command__item"]')
      )
      expect(items.length).toBeGreaterThan(0)
      for (const item of items) {
        expect(item.querySelector('[data-testid="overlay-command__item__prefix"]')).toBeNull()
      }
    })
  })

  describe('group rhythm', () => {
    it('spaces a group that follows another group, but not one that follows a separator', async () => {
      render(composed({ defaultOpen: true }))
      await settle()

      const groups = Array.from(
        document.body.querySelectorAll<HTMLElement>('[data-testid="overlay-command__group"]')
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

    it('gives the separator the same rhythm as the DropdownMenu group divider', async () => {
      render(composed({ defaultOpen: true }))
      await settle()

      const separator = document.body.querySelector<HTMLElement>(
        '[data-testid="overlay-command__separator"]'
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

describe('Command key names follow the locale', () => {
  const localized = (locale: string) =>
    defineComponent({
      components: { WebkitProvider, Command, CommandInput, CommandList, CommandItem },
      setup: () => ({ open: ref(true), locale, catalogs: LOCALES }),
      template: `
        <WebkitProvider :locale="locale" :catalogs="catalogs">
          <Command v-model:open="open">
            <CommandInput placeholder="Search" />
            <CommandList>
              <CommandItem value="run" shortcut="ctrl+enter">Run</CommandItem>
              <CommandItem value="pause" shortcut="space">Pause</CommandItem>
            </CommandList>
          </Command>
        </WebkitProvider>
      `
    })

  it('prints Esc, Enter and Space from the catalog', async () => {
    const view = render(localized('pt-BR'))
    await settle()
    const keycaps = [...document.body.querySelectorAll('[data-testid="content-kbd"]')].map((node) =>
      node.textContent?.trim()
    )
    expect(keycaps).toContain('Esc')
    expect(keycaps.some((text) => text?.endsWith('Enter'))).toBe(true)
    expect(keycaps).toContain('Espaço')
    view.unmount()
  })
})

describe('keyboard map (spec)', () => {
  const activeText = () =>
    document.body.querySelector('[role="option"][aria-selected="true"]')?.textContent?.trim()
  const input = () => byTestId('overlay-command__input')!.querySelector('input')!

  const withOpener = defineComponent({
    components: { Palette: composed() },
    template: `<div><button type="button" data-testid="opener">Opener</button><Palette /></div>`
  })

  const openPalette = async () => {
    const view = render(withOpener)
    await settle()
    view.getByTestId('opener').focus()
    await userEvent.keyboard('{Control>}k{/Control}')
    await settle()
    await vi.waitFor(() => expect(document.activeElement).toBe(input()))
    return view
  }

  it('Ctrl+K (Cmd+K on macOS) opens the palette and focuses the search field', async () => {
    await openPalette()
    expect(panel()).not.toBeNull()
    expect(activeText()).toBe('Deploy Project')
  })

  it('ArrowDown moves to the next enabled item and wraps, skipping disabled ones', async () => {
    await openPalette()
    await userEvent.keyboard('{ArrowDown}')
    expect(activeText()).toBe('Create Application')
    await userEvent.keyboard('{ArrowDown}')
    expect(activeText()).toBe('Deploy Project')
  })

  it('ArrowUp from the first item wraps to the last enabled item', async () => {
    await openPalette()
    await userEvent.keyboard('{ArrowUp}')
    expect(activeText()).toBe('Create Application')
  })

  it('End and Home jump to the last and first enabled items', async () => {
    await openPalette()
    await userEvent.keyboard('{End}')
    expect(activeText()).toBe('Create Application')
    await userEvent.keyboard('{Home}')
    expect(activeText()).toBe('Deploy Project')
  })

  it('Enter activates the active item, closes, and returns focus to the opener', async () => {
    const { getByTestId } = await openPalette()
    await userEvent.keyboard('{Enter}')
    await settle()
    expect(byTestId('overlay-command')?.getAttribute('data-state')).toBe('closed')
    await vi.waitFor(() => expect(document.activeElement).toBe(getByTestId('opener')))
  })

  it('Escape closes and returns focus to the element focused before opening', async () => {
    const { getByTestId } = await openPalette()
    await userEvent.keyboard('{Escape}')
    await settle()
    expect(byTestId('overlay-command')?.getAttribute('data-state')).toBe('closed')
    await vi.waitFor(() => expect(document.activeElement).toBe(getByTestId('opener')))
  })

  it('Tab stays inside the palette', async () => {
    await openPalette()
    await userEvent.keyboard('{Tab}')
    expect(panel()!.contains(document.activeElement)).toBe(true)
  })
})
