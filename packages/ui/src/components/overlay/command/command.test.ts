import { fireEvent, render, screen } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../layout/config-provider/config-provider.vue'
import Command from './command.vue'
import CommandEmpty from './command-empty/command-empty.vue'
import CommandGroup from './command-group/command-group.vue'
import CommandInput from './command-input/command-input.vue'
import CommandItem from './command-item/command-item.vue'
import CommandList from './command-list/command-list.vue'
import { matchCommand } from './command-match'
import CommandPage from './command-page/command-page.vue'
import CommandSeparator from './command-separator/command-separator.vue'

// The panel + backdrop are Teleported to <body> by the wrapped Dialog, so they
// escape the render container. Query them from document.body. A couple of
// frames let the portal mount + items register + the reset-active nextTick run.
const settle = async () => {
  await nextTick()
  await nextTick()
}

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)

const panel = () => byTestId('command__panel')

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
          <CommandGroup label="Actions">
            <CommandItem value="deploy">Deploy Project</CommandItem>
            <CommandItem value="new-app">Create Application</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup label="Navigation">
            <CommandItem value="settings" disabled>Go to Settings</CommandItem>
          </CommandGroup>
          <CommandEmpty>No commands found.</CommandEmpty>
        </CommandList>
      </Command>
    `
  })

/**
 * A palette whose first item carries a `leading` slot and whose second does not — the
 * mixed case that proves an icon-less row renders no leading box at all.
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
          <CommandGroup label="Actions">
            <CommandItem value="deploy">
              <template #leading><i class="az az-cloud-upload" aria-hidden="true" /></template>
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
          <CommandGroup v-if="query" label="Resources">
            <CommandItem value="res:storefront">storefront</CommandItem>
          </CommandGroup>
          <CommandGroup label="Navigation">
            <CommandItem value="nav:storage">Object Storage</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    `
  })

afterEach(async () => {
  await settle()
})

describe('Command', () => {
  describe('overlay: wraps Dialog, composition and provide/inject', () => {
    describe('closed state', () => {
      it('renders no Teleported panel while closed', async () => {
        const { getByTestId } = render(composed())
        await settle()

        expect(getByTestId('command').getAttribute('data-state')).toBe('closed')
        expect(panel()).toBeNull()
      })
    })

    describe('opening via v-model:open', () => {
      it('mounts the role=dialog panel Teleported to document.body when open', async () => {
        const { getByTestId } = render(composed({ defaultOpen: true }))
        await settle()

        expect(getByTestId('command').getAttribute('data-state')).toBe('open')

        const dialog = panel()
        expect(dialog).not.toBeNull()
        expect(dialog!.getAttribute('role')).toBe('dialog')

        // The input is a combobox wired to the list's id.
        const input = byTestId('command-input')!.querySelector('input')!
        expect(input.getAttribute('role')).toBe('combobox')
        expect(input.getAttribute('aria-expanded')).toBe('true')
        expect(input.getAttribute('aria-controls')).toBe(byTestId('command-list')!.id)
      })

      it('anchors the panel near the top of the viewport instead of the centre', async () => {
        render(composed({ defaultOpen: true }))
        await settle()

        const classes = panel()!.classList
        expect(classes.contains('md:items-start')).toBe(true)
        expect(classes.contains('md:pt-[15dvh]')).toBe(true)
        expect(classes.contains('md:items-center')).toBe(false)
      })

      it('opens as a top sheet below md, so the keyboard never covers the search field', async () => {
        render(composed({ defaultOpen: true }))
        await settle()

        const classes = panel()!.classList
        expect(classes.contains('max-md:items-start')).toBe(true)
        expect(classes.contains('max-md:items-end')).toBe(false)
      })

      it('names the palette with a title the phone header shows, not a hidden one', async () => {
        render(composed({ defaultOpen: true }))
        await settle()

        const title = byTestId('command__title')!
        expect(panel()!.getAttribute('aria-labelledby')).toBe(title.id)
        expect(title.textContent?.trim()).toBe('Command menu')
        expect(title.classList.contains('sr-only')).toBe(false)
      })

      it('names each group with its label prop', async () => {
        render(composed({ defaultOpen: true }))
        await settle()

        const groups = Array.from(document.body.querySelectorAll('[role="group"]'))
        const names = groups.map((group) => {
          const id = group.getAttribute('aria-labelledby')
          return id ? document.getElementById(id)?.textContent?.trim() : null
        })
        expect(names).toEqual(['Actions', 'Navigation'])
      })
    })

    describe('search field accessible name', () => {
      it('names the field with its placeholder text when no ariaLabel is given', async () => {
        render(composed({ defaultOpen: true }))
        await settle()

        const input = byTestId('command-input')!.querySelector('input')!
        expect(screen.getByLabelText('Search commands…')).toBe(input)
        expect(input.getAttribute('aria-label')).toBe('Search commands…')
      })

      it('an explicit ariaLabel wins over the placeholder', async () => {
        render(composed({ defaultOpen: true }, { ariaLabel: 'Search actions' }))
        await settle()

        const input = byTestId('command-input')!.querySelector('input')!
        expect(screen.getByLabelText('Search actions')).toBe(input)
        expect(input.getAttribute('placeholder')).toBe('Search commands…')
      })
    })

    describe('data-testid derivation', () => {
      it('uses the overlay-command fallback on the root', async () => {
        const { getByTestId } = render(composed())
        await settle()
        expect(getByTestId('command')).toBeTruthy()
      })

      it('a consumer-supplied data-testid wins', async () => {
        render(composed({ defaultOpen: true, 'data-testid': 'palette' }))
        await settle()
        expect(byTestId('palette__panel')).not.toBeNull()
        expect(byTestId('command__panel')).toBeNull()
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

        const input = byTestId('command-input')!.querySelector('input')!
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
        expect(byTestId('command-list')).not.toHaveAttribute('role')

        await fireEvent.update(input, '')
        await settle()
        expect(byTestId('command-list')).toHaveAttribute('role', 'listbox')
      })
    })

    describe('roving navigation + activation', () => {
      it('ArrowDown + Enter activates the active item, emits select(event, value), and closes', async () => {
        const onSelect = vi.fn()
        render(composed({ defaultOpen: true, onSelect }))
        await settle()

        // Narrow to a single enabled item so the active target is deterministic.
        const input = byTestId('command-input')!.querySelector('input')!
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
        expect(byTestId('command')?.getAttribute('data-state')).toBe('closed')
      })

      it('emits update:open(false) once when activation closes the palette', async () => {
        const onOpen = vi.fn()
        render(composed({ defaultOpen: true, 'onUpdate:open': onOpen }))
        await settle()

        const input = byTestId('command-input')!.querySelector('input')!
        await fireEvent.update(input, 'new-app')
        await settle()
        await fireEvent.keyDown(input, { key: 'ArrowDown' })
        await fireEvent.keyDown(input, { key: 'Enter' })
        await settle()

        expect(onOpen).toHaveBeenCalledTimes(1)
        expect(onOpen).toHaveBeenCalledWith(false)
      })
    })

    describe('a group rendered on the query roves where it renders', () => {
      // The consumer's `@update:model-value` on the Input reaches the field alongside the
      // context's own handler (Vue merges both), which is how a consumer learns the query
      // without the root exposing it.
      it('highlights the first row of the conditional group on the first keystroke', async () => {
        render(conditionalResults())
        await settle()

        const input = byTestId('command-input')!.querySelector('input')!
        await fireEvent.update(input, 'sto')
        await settle()

        // Both rows match "sto" — the conditional one renders first, so it is the one the
        // highlight (and therefore Enter) lands on, even though it registered last.
        const rows = Array.from(
          document.body.querySelectorAll<HTMLElement>('[data-testid="command-item"]')
        )
        expect(rows.map((row) => row.textContent?.trim())).toEqual(['storefront', 'Object Storage'])
        expect(rows[0].getAttribute('data-active')).toBe('true')
        expect(rows[1].getAttribute('data-active')).toBeNull()
      })

      it('ArrowDown walks the rows in DOM order, not registration order', async () => {
        render(conditionalResults())
        await settle()

        const input = byTestId('command-input')!.querySelector('input')!
        await fireEvent.update(input, 'sto')
        await settle()

        await fireEvent.keyDown(input, { key: 'ArrowDown' })
        await settle()

        const rows = Array.from(
          document.body.querySelectorAll<HTMLElement>('[data-testid="command-item"]')
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
    describe('the leading box belongs to the item that has a leading slot', () => {
      it('renders the box only on the item that carries a leading slot', async () => {
        render(mixedPrefixes())
        await settle()

        const items = Array.from(
          document.body.querySelectorAll<HTMLElement>('[data-testid="command-item"]')
        )
        expect(items).toHaveLength(2)

        const iconed = items[0].querySelector('[data-testid="command-item__leading"]')
        expect(iconed).not.toBeNull()
        expect(items[0].querySelector('i.az-cloud-upload')).not.toBeNull()

        // The icon-less row puts no empty box in the DOM, so it carries no indent.
        expect(items[1].querySelector('[data-testid="command-item__leading"]')).toBeNull()
        expect(items[1].querySelector('i')).toBeNull()
      })

      it('renders no box at all when no item carries a leading slot', async () => {
        render(composed({ defaultOpen: true }))
        await settle()

        const items = Array.from(
          document.body.querySelectorAll<HTMLElement>('[data-testid="command-item"]')
        )
        expect(items.length).toBeGreaterThan(0)
        for (const item of items) {
          expect(item.querySelector('[data-testid="command-item__leading"]')).toBeNull()
        }
      })
    })

    describe('active option is announced and kept in view', () => {
      it('points aria-activedescendant at the active item id as ArrowDown moves', async () => {
        render(composed({ defaultOpen: true }))
        await settle()
        const input = byTestId('command-input')!.querySelector('input')!
        const items = Array.from(
          document.body.querySelectorAll<HTMLElement>('[data-testid="command-item"]')
        )
        expect(items[0]!.id).not.toBe('')

        await fireEvent.keyDown(input, { key: 'Home' })
        await settle()
        expect(input.getAttribute('aria-activedescendant')).toBe(items[0]!.id)

        await fireEvent.keyDown(input, { key: 'ArrowDown' })
        await settle()
        expect(input.getAttribute('aria-activedescendant')).toBe(items[1]!.id)
        expect(document.getElementById(input.getAttribute('aria-activedescendant')!)).toBe(items[1])
      })

      it('scrolls the active row into view in a scrolling list', async () => {
        render(
          defineComponent({
            components: { Command, CommandInput, CommandList, CommandItem },
            setup: () => ({
              open: ref(true),
              rows: Array.from({ length: 40 }, (_, i) => `row-${i}`)
            }),
            template: `
            <Command v-model:open="open">
              <CommandInput placeholder="Search" />
              <CommandList style="max-height: 120px; overflow-y: auto">
                <CommandItem v-for="row in rows" :key="row" :value="row">{{ row }}</CommandItem>
              </CommandList>
            </Command>
          `
          })
        )
        await settle()
        const input = byTestId('command-input')!.querySelector('input')!
        await fireEvent.keyDown(input, { key: 'End' })
        await settle()
        await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
        const last = document.getElementById(input.getAttribute('aria-activedescendant')!)!
        const list = byTestId('command-list')!
        expect(last.textContent).toContain('row-39')
        expect(list.scrollTop).toBeGreaterThan(0)
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

  describe('key names follow the locale', () => {
    const localized = (locale: string) =>
      defineComponent({
        components: { ConfigProvider, Command, CommandInput, CommandList, CommandItem },
        setup: () => ({ open: ref(true), locale, catalogs: LOCALES }),
        template: `
        <ConfigProvider :locale="locale" :catalogs="catalogs">
          <Command v-model:open="open">
            <CommandInput placeholder="Search" />
            <CommandList>
              <CommandItem value="run" shortcut="ctrl+enter">Run</CommandItem>
              <CommandItem value="pause" shortcut="space">Pause</CommandItem>
            </CommandList>
          </Command>
        </ConfigProvider>
      `
      })

    it('prints Esc, Enter and Space from the catalog', async () => {
      const view = render(localized('pt-BR'))
      await settle()
      const keycaps = [...document.body.querySelectorAll('[data-testid="kbd"]')].map((node) =>
        node.textContent?.trim()
      )
      expect(keycaps).toContain('Esc')
      expect(keycaps.some((text) => text?.endsWith('Enter'))).toBe(true)
      expect(keycaps).toContain('Espaço')
      view.unmount()
    })

    it('names the listbox from the catalog and hides every keycap on a touch screen', async () => {
      const view = render(localized('en-US'))
      await settle()
      expect(byTestId('command-list')).toHaveAttribute('role', 'listbox')
      expect(byTestId('command-list')).toHaveAttribute('aria-label', 'Command menu')
      const keycaps = [...document.body.querySelectorAll('[data-testid="kbd"]')]
      expect(keycaps.length).toBeGreaterThan(1)
      for (const keycap of keycaps) expect(keycap.classList).toContain('pointer-coarse:hidden!')
      view.unmount()
    })
  })

  describe('keyboard map (spec)', () => {
    const activeText = () =>
      document.body.querySelector('[role="option"][aria-selected="true"]')?.textContent?.trim()
    const input = () => byTestId('command-input')!.querySelector('input')!

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
      expect(byTestId('command')?.getAttribute('data-state')).toBe('closed')
      await vi.waitFor(() => expect(document.activeElement).toBe(getByTestId('opener')))
    })

    it('Escape closes and returns focus to the element focused before opening', async () => {
      const { getByTestId } = await openPalette()
      await userEvent.keyboard('{Escape}')
      await settle()
      expect(byTestId('command')?.getAttribute('data-state')).toBe('closed')
      await vi.waitFor(() => expect(document.activeElement).toBe(getByTestId('opener')))
    })

    it('the close button closes and returns focus to the opener', async () => {
      const { getByTestId } = await openPalette()
      await userEvent.click(byTestId('command__close')!)
      await settle()
      expect(byTestId('command')?.getAttribute('data-state')).toBe('closed')
      await vi.waitFor(() => expect(document.activeElement).toBe(getByTestId('opener')))
    })

    it('Tab stays inside the palette', async () => {
      await openPalette()
      await userEvent.keyboard('{Tab}')
      expect(panel()!.contains(document.activeElement)).toBe(true)
    })
  })

  describe('at scale', () => {
    it('moving the active item re-renders only the items whose state changed', async () => {
      let itemUpdates = 0
      const Many = defineComponent({
        components: { Command, CommandInput, CommandList, CommandGroup, CommandItem },
        setup() {
          const values = Array.from({ length: 60 }, (_, i) => `page-${i}`)
          return { values }
        },
        template: `
        <Command default-open shortcut="">
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandGroup label="Pages">
              <CommandItem v-for="value in values" :key="value" :value="value">{{ value }}</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      `
      })
      render(Many, {
        global: {
          mixins: [
            {
              updated(this: { $options: { name?: string } }) {
                if (this.$options.name === 'CommandItem') itemUpdates += 1
              }
            }
          ]
        }
      })
      await settle()
      const input = document.body.querySelector<HTMLInputElement>('input')!
      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await settle()
      itemUpdates = 0
      await fireEvent.keyDown(input, { key: 'ArrowDown' })
      await settle()
      expect(document.body.querySelector('[data-active]')).toHaveTextContent('page-1')
      expect(itemUpdates).toBeLessThanOrEqual(2)
    })

    it('keeps DOM order when a group mounts after the palette opened', async () => {
      const late = ref(false)
      const onSelect = vi.fn()
      const Late = defineComponent({
        components: { Command, CommandInput, CommandList, CommandGroup, CommandItem },
        setup: () => ({ late, onSelect }),
        template: `
        <Command default-open shortcut="" @select="onSelect">
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandGroup v-if="late" label="First"><CommandItem value="early">Early</CommandItem></CommandGroup>
            <CommandGroup label="Second"><CommandItem value="later">Later</CommandItem></CommandGroup>
          </CommandList>
        </Command>
      `
      })
      render(Late)
      await settle()
      late.value = true
      await settle()
      const input = document.body.querySelector<HTMLInputElement>('input')!
      await fireEvent.keyDown(input, { key: 'Home' })
      await fireEvent.keyDown(input, { key: 'Enter' })
      expect(onSelect).toHaveBeenCalledWith(expect.anything(), 'early')
    })
  })

  describe('ranked search', () => {
    const input = () => byTestId('command-input')!.querySelector('input')!
    const activeText = () =>
      document.body.querySelector('[role="option"][aria-selected="true"]')?.textContent?.trim()

    const ranked = (onSelect?: (...args: unknown[]) => void) =>
      defineComponent({
        components: {
          Command,
          CommandInput,
          CommandList,
          CommandGroup,
          CommandItem,
          CommandSeparator
        },
        setup: () => ({ open: ref(true), onSelect }),
        template: `
        <Command v-model:open="open" shortcut="" @select="onSelect">
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandGroup label="Navigation">
              <CommandItem value="usage">Go to Usage</CommandItem>
              <CommandItem value="prefs" :keywords="['team']">Go to Preferences</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup label="Settings">
              <CommandItem value="domains">Settings Domains</CommandItem>
              <CommandItem value="deploy">Deploy Project</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      `
      })

    it('ranks prefix over word over substring over abbreviation, and rejects scattered letters', () => {
      const prefix = matchCommand('set', 'Settings Domains').score
      const word = matchCommand('set', 'Go to Settings').score
      const inner = matchCommand('set', 'Reset').score
      const abbreviation = matchCommand('dpl', 'Deploy Project').score
      expect(prefix).toBeGreaterThan(word)
      expect(word).toBeGreaterThan(inner)
      expect(inner).toBeGreaterThan(abbreviation)
      expect(abbreviation).toBeGreaterThan(0)
      expect(matchCommand('xyz', 'Deploy Project').score).toBe(0)
      expect(matchCommand('osj', 'Go to Settings Project').score).toBe(0)
      expect(matchCommand('team', 'Invite', ['team']).score).toBeGreaterThan(0)
    })

    it('ranks an exact keyword over a keyword prefix over a keyword substring', () => {
      const exact = matchCommand('modal', 'Dialog', ['modal']).score
      const prefix = matchCommand('modal', 'Sheet', ['modal sheet']).score
      const inner = matchCommand('modal', 'Command', ['A search-first modal launcher']).score
      expect(exact).toBeGreaterThan(prefix)
      expect(prefix).toBeGreaterThan(inner)
      expect(inner).toBeGreaterThan(0)
      expect(matchCommand('set', 'Settings Domains').score).toBeGreaterThan(exact)
      expect(matchCommand('set', 'Reset').score).toBeGreaterThan(exact)
      expect(exact).toBeGreaterThan(matchCommand('dpl', 'Deploy Project').score)
    })

    it('shows at most three keyword-only matches per group while a label matches, so a later group title match is not buried', async () => {
      const Hints = defineComponent({
        components: { Command, CommandInput, CommandList, CommandGroup, CommandItem },
        setup: () => ({ open: ref(true) }),
        template: `
        <Command v-model:open="open" shortcut="">
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandGroup label="Components">
              <CommandItem value="table">Table</CommandItem>
              <CommandItem value="canvas" :keywords="['tables']">Canvas</CommandItem>
              <CommandItem value="frame" :keywords="['tables']">Frame</CommandItem>
              <CommandItem value="card" :keywords="['tables']">Card</CommandItem>
              <CommandItem value="chart" :keywords="['tables']">Chart</CommandItem>
              <CommandItem value="grid" :keywords="['tables']">Grid</CommandItem>
            </CommandGroup>
            <CommandGroup label="Blocks">
              <CommandItem value="view-table">View Table</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      `
      })
      render(Hints)
      await settle()
      const shown = () =>
        [...document.body.querySelectorAll<HTMLElement>('[role="option"]')]
          .filter((node) => node.style.display !== 'none')
          .map((node) => node.textContent?.trim())

      await fireEvent.update(input(), 'table')
      await settle()
      expect(shown()).toEqual(['Table', 'Canvas', 'Frame', 'Card', 'View Table'])

      await fireEvent.update(input(), 'tables')
      await settle()
      expect(shown()).toEqual(['Canvas', 'Frame', 'Card', 'Chart', 'Grid'])
    })

    it('keyboard order follows the rank: the best group and item lead', async () => {
      const onSelect = vi.fn()
      render(ranked(onSelect))
      await settle()
      input().focus()
      await fireEvent.update(input(), 'set')
      await settle()

      const groups = document.body.querySelectorAll('[role="group"]')
      expect(byTestId('command-list')).toHaveAttribute('data-ranked')
      expect(groups[1]).toHaveAttribute('data-leading')
      expect((groups[0] as HTMLElement).style.display).toBe('none')
      const rows = [...groups[1].querySelectorAll<HTMLElement>('[role="option"]')].filter(
        (row) => row.style.display !== 'none'
      )
      expect(rows.map((row) => row.textContent?.trim())).toEqual(['Settings Domains'])
      expect(byTestId('command-separator')!.style.display).toBe('none')
      expect(activeText()).toBe('Settings Domains')

      await userEvent.keyboard('{Enter}')
      expect(onSelect).toHaveBeenCalledWith(expect.any(KeyboardEvent), 'domains')
    })

    it('moves ranked groups and rows in the DOM so reading order is the ranked order, and restores it', async () => {
      const Ranked = defineComponent({
        components: { Command, CommandInput, CommandList, CommandGroup, CommandItem },
        setup: () => ({ open: ref(true) }),
        template: `
        <Command v-model:open="open" shortcut="">
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandGroup label="Lamps">
              <CommandItem value="notable">Notable lamp</CommandItem>
              <CommandItem value="table-lamp">Table lamp</CommandItem>
            </CommandGroup>
            <CommandGroup label="Tables">
              <CommandItem value="table">Table</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      `
      })
      render(Ranked)
      await settle()
      const shown = () =>
        [...document.body.querySelectorAll<HTMLElement>('[role="group"], [role="option"]')]
          .filter((node) => node.style.display !== 'none')
          .map((node) =>
            node.getAttribute('role') === 'group'
              ? `# ${node.querySelector('[data-testid="command-group__label"]')?.textContent?.trim()}`
              : node.textContent?.trim()
          )
      const original = shown()
      expect(original).toEqual(['# Lamps', 'Notable lamp', 'Table lamp', '# Tables', 'Table'])

      await fireEvent.update(input(), 'table')
      await settle()
      expect(shown()).toEqual(['# Tables', 'Table', '# Lamps', 'Table lamp', 'Notable lamp'])
      expect(activeText()).toBe('Table')
      await userEvent.keyboard('{ArrowDown}')
      expect(activeText()).toBe('Table lamp')

      await fireEvent.update(input(), '')
      await settle()
      expect(shown()).toEqual(original)
    })

    it('matches keywords that are not in the label', async () => {
      render(ranked())
      await settle()
      await fireEvent.update(input(), 'team')
      await settle()
      const prefs = screen.getByText('Go to Preferences').closest('[role="option"]') as HTMLElement
      const usage = screen.getByText('Go to Usage').closest('[role="option"]') as HTMLElement
      expect(prefs.style.display).not.toBe('none')
      expect(usage.style.display).toBe('none')
    })

    it('emphasizes the matched characters of a plain label and keeps its accessible name', async () => {
      render(ranked())
      await settle()
      await fireEvent.update(input(), 'dpl')
      await settle()
      const row = [...document.body.querySelectorAll('[role="option"]')].find(
        (node) => node.textContent?.trim() === 'Deploy Project'
      ) as HTMLElement
      const marks = [...row.querySelectorAll('mark')].map((node) => node.textContent)
      expect(marks.join('')).toBe('dpl'.replace('d', 'D'))
      await fireEvent.update(input(), '')
      await settle()
      expect(row.querySelector('mark')).toBeNull()
    })

    it('stays fast with 1k items in 10 groups', async () => {
      const groups = Array.from({ length: 10 }, (_, g) => ({
        id: `g${g}`,
        heading: `Group ${g}`,
        items: Array.from({ length: 100 }, (_, i) => ({
          value: `g${g}-i${i}`,
          label: `Resource ${g * 100 + i} production`
        }))
      }))
      const Big = defineComponent({
        components: { Command, CommandInput, CommandList, CommandGroup, CommandItem },
        setup: () => ({ open: ref(true), groups }),
        template: `
        <Command v-model:open="open" shortcut="">
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandGroup v-for="group in groups" :key="group.id" :label="group.heading">
              <CommandItem v-for="item in group.items" :key="item.value" :value="item.value">{{ item.label }}</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      `
      })
      render(Big)
      await settle()
      const t0 = performance.now()
      await fireEvent.update(input(), 'rs 99')
      await settle()
      const elapsed = performance.now() - t0
      const visible = [...document.body.querySelectorAll('[role="option"]')].filter(
        (node) => (node as HTMLElement).style.display !== 'none'
      )
      expect(visible.length).toBeGreaterThan(0)
      expect(visible.length).toBeLessThan(1000)
      expect(elapsed).toBeLessThan(1000)
    })
  })

  describe('nested pages', () => {
    const input = () => byTestId('command-input')!.querySelector('input')!
    const visibleTexts = () =>
      [...document.body.querySelectorAll('[role="option"]')]
        .filter((node) => (node as HTMLElement).style.display !== 'none')
        .map((node) => node.textContent?.trim())

    const paged = (onSelect?: (...args: unknown[]) => void, initialPage = '') =>
      defineComponent({
        components: { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandPage },
        setup: () => ({ open: ref(true), page: ref(initialPage), onSelect }),
        template: `
        <div>
          <span data-testid="page-value">{{ page }}</span>
          <Command v-model:open="open" v-model:page-key="page" shortcut="" @select="onSelect">
            <CommandInput placeholder="Search" />
            <CommandList>
              <CommandGroup label="Projects">
                <CommandItem value="switch" page="projects">Switch Project</CommandItem>
                <CommandItem value="new">Create Project</CommandItem>
              </CommandGroup>
              <CommandPage name="projects" title="Switch project">
                <CommandItem value="acme-store">acme-store</CommandItem>
                <CommandItem value="docs-site">docs-site</CommandItem>
              </CommandPage>
            </CommandList>
          </Command>
        </div>
      `
      })

    it('an item with page opens the page without selecting, and shows a named back control', async () => {
      const onSelect = vi.fn()
      const view = render(paged(onSelect))
      await settle()
      expect(visibleTexts()).toEqual(['Switch Project', 'Create Project'])
      expect(byTestId('command-item__page')).not.toBeNull()

      input().focus()
      await userEvent.keyboard('{ArrowDown}{Enter}')
      await settle()
      expect(onSelect).not.toHaveBeenCalled()
      expect(view.getByTestId('page-value').textContent).toBe('projects')
      expect(visibleTexts()).toEqual(['acme-store', 'docs-site'])
      const back = byTestId('command-input__previous')!
      expect(back).toHaveAccessibleName('Back from Switch project')
      expect(byTestId('command-input')).toHaveAttribute('data-page', 'projects')

      await userEvent.keyboard('{Enter}')
      expect(onSelect).toHaveBeenCalledWith(expect.any(KeyboardEvent), 'acme-store')
    })

    it('Backspace in an empty field and the back control return to the previous page', async () => {
      const view = render(paged())
      await settle()
      input().focus()
      await userEvent.keyboard('{ArrowDown}{Enter}')
      await settle()
      await userEvent.keyboard('{Backspace}')
      await settle()
      expect(view.getByTestId('page-value').textContent).toBe('')
      expect(visibleTexts()).toEqual(['Switch Project', 'Create Project'])

      await userEvent.keyboard('{Enter}')
      await settle()
      expect(view.getByTestId('page-value').textContent).toBe('projects')
      await userEvent.click(byTestId('command-input__previous')!)
      await settle()
      expect(view.getByTestId('page-value').textContent).toBe('')
    })

    it('Escape on a nested page goes back instead of closing', async () => {
      render(paged(undefined, 'projects'))
      await settle()
      input().focus()
      await userEvent.keyboard('{Escape}')
      await settle()
      expect(panel()).not.toBeNull()
      expect(visibleTexts()).toEqual(['Switch Project', 'Create Project'])
    })

    it('has no WCAG violations on a nested page', async () => {
      render(paged(undefined, 'projects'))
      await settle()
      await expectNoA11yViolations(panel()!)
    })
  })

  describe('Command examples', () => {
    const sources = import.meta.glob<string>('../../../../examples/command/*.vue', {
      eager: true,
      query: '?raw',
      import: 'default'
    })

    it.each(Object.entries(sources))('%s shows an Empty part when nothing matches', (_, source) => {
      expect(source).toContain('<CommandList>')
      expect(source).toMatch(/<CommandEmpty\b/)
    })
  })
})
