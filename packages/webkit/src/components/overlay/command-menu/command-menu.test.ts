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
const composed = (props: Record<string, unknown> = {}) =>
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
      return { props, open, onSelect }
    },
    template: `
      <CommandMenu v-bind="props" v-model:open="open" @select="onSelect">
        <CommandMenuInput placeholder="Search commands…" />
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

  describe('accessibility (axe on the open, Teleported palette)', () => {
    it('has no WCAG violations while open', async () => {
      render(composed({ defaultOpen: true }))
      await settle()

      expect(panel()).not.toBeNull()
      await expectNoA11yViolations(document.body)
    })
  })
})
