import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, type PropType, ref } from 'vue'

import CheckableOptions from '../../../../examples/dropdown-menu/checkable-options.vue'
import CustomTriggers from '../../../../examples/dropdown-menu/custom-triggers.vue'
import Default from '../../../../examples/dropdown-menu/default.vue'
import Groups from '../../../../examples/dropdown-menu/groups.vue'
import GroupsWithHeaderAndFooter from '../../../../examples/dropdown-menu/groups-with-header-and-footer.vue'
import OptionAffordances from '../../../../examples/dropdown-menu/option-affordances.vue'
import SubMenus from '../../../../examples/dropdown-menu/sub-menus.vue'
import WithHeaderAndFooter from '../../../../examples/dropdown-menu/with-header-and-footer.vue'
import WithLinks from '../../../../examples/dropdown-menu/with-links.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DropdownMenu, {
  type DropdownMenuAlign,
  DropdownMenuGroup,
  DropdownMenuItem,
  type DropdownMenuItemValue,
  type DropdownMenuSide,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from './index'

const PRIMARY = /mac|iphone|ipad/i.test(navigator.platform) ? { metaKey: true } : { ctrlKey: true }
const PRIMARY_GLYPH = /mac|iphone|ipad/i.test(navigator.platform) ? '⌘' : 'Ctrl'

type SelectHandler = (event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) => void

/**
 * A realistic composed tree mirroring how a consumer wires the compound:
 * <DropdownMenu> with a <DropdownMenuTrigger>, one or two <DropdownMenuGroup>s each holding
 * <DropdownMenuItem>s. The root Teleports its panel to document.body and each
 * group Teleports its options into the panel body (also in body), so all open
 * content is queried through document.body — not the render container.
 */
const Host = defineComponent({
  props: {
    open: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: false },
    side: { type: String as PropType<DropdownMenuSide | 'auto'>, default: 'bottom' },
    align: { type: String as PropType<DropdownMenuAlign>, default: 'start' },
    grouped: { type: Boolean, default: false },
    onSelect: { type: Function as PropType<SelectHandler>, default: undefined },
    'onUpdate:open': { type: Function as PropType<(open: boolean) => void>, default: undefined }
  },
  setup(props) {
    return () =>
      h(
        DropdownMenu,
        {
          open: props.open,
          disabled: props.disabled,
          side: props.side,
          align: props.align,
          onSelect: props.onSelect,
          'onUpdate:open': props['onUpdate:open']
        },
        () =>
          props.grouped
            ? [
                h(DropdownMenuTrigger, null, () => h('button', { type: 'button' }, 'Menu')),
                h(DropdownMenuGroup, { label: 'Account' }, () => [
                  h(DropdownMenuItem, { value: 'profile', label: 'Profile' }),
                  h(DropdownMenuItem, { value: 'settings', label: 'Settings' })
                ]),
                h(DropdownMenuGroup, { label: 'Workspace' }, () => [
                  h(DropdownMenuItem, { value: 'invite', label: 'Invite members' }),
                  h(DropdownMenuItem, { value: 'logs', label: 'Audit log', selected: true }),
                  h(DropdownMenuItem, { value: 'archived', label: 'Archived', disabled: true })
                ])
              ]
            : [
                h(DropdownMenuTrigger, null, () => h('button', { type: 'button' }, 'Menu')),
                h(DropdownMenuGroup, null, () => [
                  h(DropdownMenuItem, { value: 'profile', label: 'Profile' }),
                  h(DropdownMenuItem, { value: 'settings', label: 'Settings' }),
                  h(DropdownMenuItem, { value: 'signout', label: 'Sign out' })
                ])
              ]
      )
  }
})

const control = () =>
  document.body.querySelector('[data-testid="dropdown-menu-trigger"] button') as HTMLElement

/** Query the Teleported panel from document.body (it escapes the container). */
const getPanel = () =>
  document.body.querySelector('[data-testid="dropdown-menu__panel"]') as HTMLElement | null

const openFromTrigger = async (container: Element) => {
  expect(getPanel()).toBeNull()
  await userEvent.click(container.querySelector('[aria-haspopup]') as HTMLElement)
  await waitFor(() => expect(getPanel()).not.toBeNull())
}

const getOptions = () =>
  Array.from(document.body.querySelectorAll('[role^="menuitem"]')) as HTMLElement[]

/** Wait until the panel is open AND the group has Teleported its options in. */
async function waitForOpen(count: number) {
  await waitFor(() => {
    expect(getPanel()).not.toBeNull()
    expect(getOptions()).toHaveLength(count)
  })
}

afterEach(() => {
  // Teleported panels leak across tests if a wrapper unmounts mid-transition;
  // scrub any stray panel so document.body queries stay deterministic.
  document.body
    .querySelectorAll('[data-testid="dropdown-menu__panel"]')
    .forEach((el) => el.remove())
})

describe('DropdownMenu', () => {
  describe('compound / overlay', () => {
    // ---- Compound API: dot-notation resolves ----------------------------------
    it('attaches every sub-component to the compound root for dot-notation', () => {
      expect(DropdownMenu.Trigger).toBe(DropdownMenuTrigger)
      expect(DropdownMenu.Group).toBe(DropdownMenuGroup)
      expect(DropdownMenu.Item).toBe(DropdownMenuItem)
    })

    it('renders the root header and footer slots outside the scrolling menu', async () => {
      const { container } = render(WithHeaderAndFooter)
      await openFromTrigger(container)
      await waitFor(() =>
        expect(document.body.querySelector('[data-testid="dropdown-menu__header"]')).not.toBeNull()
      )
      const footer = document.body.querySelector('[data-testid="dropdown-menu__footer"]')
      expect(footer).not.toBeNull()
      expect(document.body.querySelector('[data-testid$="__top"]')).toBeNull()
      expect(footer?.closest('[role="menu"]')).toBeNull()
    })

    it('renders the group header and footer slots inline in the section', async () => {
      const { container } = render(GroupsWithHeaderAndFooter)
      await openFromTrigger(container)
      await waitFor(() =>
        expect(
          document.body.querySelectorAll('[data-testid="dropdown-menu-group__header"]')
        ).toHaveLength(2)
      )
      expect(
        document.body.querySelectorAll('[data-testid="dropdown-menu-group__footer"]')
      ).toHaveLength(2)
    })

    // ---- Root renders + reflects state via data-* -----------------------------
    it('renders the root div with the default testid and closed state', () => {
      const { getByTestId } = render(Host)

      const root = getByTestId('dropdown-menu')
      expect(root.tagName).toBe('DIV')
      expect(root.getAttribute('data-state')).toBe('closed')
      expect(root.getAttribute('data-side')).toBe('bottom')
      expect(root.getAttribute('data-align')).toBe('start')
      expect(root.hasAttribute('data-disabled')).toBe(false)
    })

    it('reflects the disabled prop as data-disabled on the root', () => {
      const { getByTestId } = render(Host, { props: { disabled: true } })
      expect(getByTestId('dropdown-menu').getAttribute('data-disabled')).toBe('true')
    })

    it('reflects the side and align props on data-side and data-align', () => {
      const { getByTestId } = render(Host, { props: { side: 'top', align: 'end' } })
      expect(getByTestId('dropdown-menu').getAttribute('data-side')).toBe('top')
      expect(getByTestId('dropdown-menu').getAttribute('data-align')).toBe('end')
    })

    // ---- Trigger anatomy + a11y wiring (context-driven) -----------------------
    it('forwards aria-haspopup/expanded/controls onto the slotted button instead of wrapping it', () => {
      const { getByTestId } = render(Host)

      const trigger = getByTestId('dropdown-menu-trigger')
      expect(trigger.tagName).toBe('SPAN')
      expect(trigger.hasAttribute('role')).toBe(false)
      expect(trigger.hasAttribute('tabindex')).toBe(false)
      expect(trigger.hasAttribute('aria-expanded')).toBe(false)
      const button = control()
      expect(button.getAttribute('aria-haspopup')).toBe('menu')
      expect(button.getAttribute('aria-expanded')).toBe('false')
      expect(button.getAttribute('aria-controls')).toBeTruthy()
      expect(trigger.getAttribute('data-state')).toBe('closed')
    })

    it('becomes the button itself when the slot holds no focusable control', () => {
      render(
        defineComponent({
          setup: () => () =>
            h(DropdownMenu, null, () => [
              h(DropdownMenuTrigger, null, () => h('span', 'Menu')),
              h(DropdownMenuGroup, null, () => [
                h(DropdownMenuItem, { value: 'profile', label: 'Profile' })
              ])
            ])
        })
      )
      const trigger = screen.getByTestId('dropdown-menu-trigger')
      expect(trigger.getAttribute('role')).toBe('button')
      expect(trigger.getAttribute('tabindex')).toBe('0')
      expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
    })

    it('has no axe violations on the closed trigger', async () => {
      const { container } = render(Host)
      await expectNoA11yViolations(container)
    })

    // ---- Overlay open/close: trigger drives context -> panel teleports ---------
    it('opens the Teleported panel on trigger click and closes on a second click', async () => {
      const { getByTestId } = render(Host)

      expect(getPanel()).toBeNull()

      await fireEvent.click(getByTestId('dropdown-menu-trigger'))
      await waitForOpen(3)

      const panel = getPanel() as HTMLElement
      const menu = panel.querySelector('[role="menu"]') as HTMLElement
      expect(menu).not.toBeNull()
      // Panel is Teleported OUT of the render container, onto document.body.
      expect(panel.closest('[data-testid="dropdown-menu"]')).toBeNull()
      // aria-labelledby wires back to the trigger id (shared context).
      const trigger = getByTestId('dropdown-menu-trigger')
      expect(menu.getAttribute('aria-labelledby')).toBe(control().id)
      // Trigger aria-expanded now reflects open via injected isOpen.
      expect(control().getAttribute('aria-expanded')).toBe('true')
      expect(trigger.getAttribute('data-state')).toBe('open')

      await fireEvent.click(trigger)
      await waitFor(() => expect(getPanel()).toBeNull())
      expect(control().getAttribute('aria-expanded')).toBe('false')
    })

    it('renders one role=menuitem per DropdownMenuItem through the injected panel body', async () => {
      const { getByTestId } = render(Host)

      await fireEvent.click(getByTestId('dropdown-menu-trigger'))
      await waitForOpen(3)

      const options = getOptions()
      expect(options.map((o) => o.textContent?.trim())).toEqual(['Profile', 'Settings', 'Sign out'])
      options.forEach((o) => expect(o.getAttribute('role')).toBe('menuitem'))
    })

    it('does NOT open when the root is disabled', async () => {
      const { getByTestId } = render(Host, { props: { disabled: true } })

      await fireEvent.click(getByTestId('dropdown-menu-trigger'))
      // Give any async teleport a chance; it must never appear.
      await Promise.resolve()
      expect(getPanel()).toBeNull()
      expect(control().getAttribute('aria-expanded')).toBe('false')
    })

    // ---- Selection: emits select(event, value) + closes + returns focus -------
    it('emits select with the originating event + option value, then closes the panel', async () => {
      const onSelect = ref<Array<{ event: unknown; value: unknown }>>([])
      const { getByTestId } = render(Host, {
        props: {
          onSelect: (event: unknown, value: unknown) => onSelect.value.push({ event, value })
        }
      })

      await fireEvent.click(getByTestId('dropdown-menu-trigger'))
      await waitForOpen(3)

      await fireEvent.click(getOptions()[1])

      expect(onSelect.value).toHaveLength(1)
      expect(onSelect.value[0].value).toBe('settings')
      // First positional arg carries the originating DOM event (a MouseEvent from the click).
      expect(onSelect.value[0].event).toBeInstanceOf(MouseEvent)

      // Panel closes on select.
      await waitFor(() => expect(getPanel()).toBeNull())
      // Focus returns to the trigger.
      expect(document.activeElement).toBe(control())
    })

    it('does not emit select when a disabled option is clicked', async () => {
      const calls = ref(0)
      const { getByTestId } = render(Host, {
        props: { grouped: true, onSelect: () => (calls.value += 1) }
      })

      await fireEvent.click(getByTestId('dropdown-menu-trigger'))
      await waitForOpen(5)

      const disabled = getOptions().find((o) => o.getAttribute('aria-disabled') === 'true')
      expect(disabled).toBeTruthy()
      await fireEvent.click(disabled as HTMLElement)

      expect(calls.value).toBe(0)
      // Panel stays open (a disabled option is not a selection).
      expect(getPanel()).not.toBeNull()
    })

    // ---- v-model:open round-trip via update:open ------------------------------
    it('emits update:open(true) on open and update:open(false) on select', async () => {
      const events = ref<boolean[]>([])
      const { getByTestId } = render(Host, {
        props: { 'onUpdate:open': (v: boolean) => events.value.push(v) }
      })

      await fireEvent.click(getByTestId('dropdown-menu-trigger'))
      await waitForOpen(3)
      expect(events.value).toEqual([true])

      await fireEvent.click(getOptions()[0])
      await waitFor(() => expect(getPanel()).toBeNull())
      expect(events.value).toEqual([true, false])
    })

    it('controlled open prop drives the panel: true renders it, false removes it', async () => {
      const view = render(Host, { props: { open: true } })
      await waitForOpen(3)
      expect(getPanel()).not.toBeNull()

      await view.rerender({ open: false })
      await waitFor(() => expect(getPanel()).toBeNull())
    })

    // ---- Keyboard: Escape closes + focus returns to trigger -------------------
    it('closes on Escape from inside the panel and returns focus to the trigger', async () => {
      // Uncontrolled: open via the trigger so the root owns and can flip its state.
      const { getByTestId } = render(Host)
      await fireEvent.click(getByTestId('dropdown-menu-trigger'))
      await waitForOpen(3)

      await fireEvent.keyDown(getPanel() as HTMLElement, { key: 'Escape' })

      await waitFor(() => expect(getPanel()).toBeNull())
      expect(document.activeElement).toBe(control())
    })

    it('opens from the trigger on ArrowDown, Enter and Space', async () => {
      for (const key of ['ArrowDown', 'Enter', ' ']) {
        const view = render(Host)
        await fireEvent.keyDown(view.getByTestId('dropdown-menu-trigger'), { key })
        await waitForOpen(3)
        expect(getPanel()).not.toBeNull()
        view.unmount()
        document.body
          .querySelectorAll('[data-testid="dropdown-menu__panel"]')
          .forEach((el) => el.remove())
      }
    })

    it('activates an option via keyboard Enter, emitting select for that option', async () => {
      const onSelect = ref<Array<{ event: unknown; value: unknown }>>([])
      const { getByTestId } = render(Host, {
        props: {
          onSelect: (event: unknown, value: unknown) => onSelect.value.push({ event, value })
        }
      })

      await fireEvent.click(getByTestId('dropdown-menu-trigger'))
      await waitForOpen(3)

      await fireEvent.keyDown(getOptions()[2], { key: 'Enter' })
      expect(onSelect.value).toHaveLength(1)
      expect(onSelect.value[0].value).toBe('signout')
      expect(onSelect.value[0].event).toBeInstanceOf(KeyboardEvent)
    })

    // ---- Outside click closes -------------------------------------------------
    it('closes when a mousedown lands outside the trigger and panel', async () => {
      // Uncontrolled: open via the trigger so onDocumentMousedown can flip state.
      const { getByTestId } = render(Host)
      await fireEvent.click(getByTestId('dropdown-menu-trigger'))
      await waitForOpen(3)
      expect(getPanel()).not.toBeNull()

      await fireEvent.mouseDown(document.body)

      await waitFor(() => expect(getPanel()).toBeNull())
    })

    // ---- Groups: labeled group anatomy + auto divider on 2nd group ------------
    it('renders each group as role=group with an aria-labelledby label', async () => {
      render(Host, { props: { open: true, grouped: true } })
      await waitForOpen(5)

      const groups = Array.from(document.body.querySelectorAll('[role="group"]')) as HTMLElement[]
      expect(groups).toHaveLength(2)

      // Each group is labelled by its rendered label element.
      groups.forEach((g) => {
        const labelledby = g.getAttribute('aria-labelledby')
        expect(labelledby).toBeTruthy()
        expect(document.getElementById(labelledby as string)).toBeTruthy()
      })
      expect(within(groups[0]).getByText('Account')).toBeTruthy()
      expect(within(groups[1]).getByText('Workspace')).toBeTruthy()
    })

    // ---- Option state: selected + disabled reflected via aria/data ------------
    it('reflects selected and disabled option states on aria and data attributes', async () => {
      render(Host, { props: { open: true, grouped: true } })
      await waitForOpen(5)

      const options = getOptions()
      const selected = options.find((o) => o.textContent?.trim() === 'Audit log') as HTMLElement
      const disabled = options.find((o) => o.textContent?.trim() === 'Archived') as HTMLElement

      expect(selected.getAttribute('role')).toBe('menuitemradio')
      expect(selected.getAttribute('aria-checked')).toBe('true')
      expect(selected.hasAttribute('aria-current')).toBe(false)
      expect(selected.hasAttribute('data-selected')).toBe(true)
      expect(selected.querySelector('[data-testid="dropdown-menu-item__check"]')).not.toBeNull()

      expect(disabled.getAttribute('aria-disabled')).toBe('true')
      expect(disabled.hasAttribute('data-disabled')).toBe(true)
      expect(disabled.getAttribute('tabindex')).toBe('-1')
    })

    it('renders a command hint inside an option that declares a command', async () => {
      render(
        defineComponent({
          setup() {
            return () =>
              h(DropdownMenu, { open: true }, () => [
                h(DropdownMenuTrigger, null, () => h('button', { type: 'button' }, 'Menu')),
                h(DropdownMenuGroup, null, () => [
                  h(DropdownMenuItem, { value: 'profile', label: 'Profile', command: '⌘P' })
                ])
              ])
          }
        })
      )

      await waitFor(() => expect(getOptions()).toHaveLength(1))
      const command = document.body.querySelector('[data-testid="dropdown-menu-item__command"]')
      expect(command).not.toBeNull()
      expect(command?.textContent?.replace(/\s+/g, '')).toBe(`${PRIMARY_GLYPH}P`)
      expect(command?.className).toContain('pointer-coarse:hidden')
    })

    // ---- Accessibility: axe on the open menu overlay --------------------------
    it('has no axe violations on the open menu panel with grouped options', async () => {
      render(Host, { props: { open: true, grouped: true } })
      await waitForOpen(5)

      // Scope axe to the component's own overlay markup (role=menu + groups +
      // menuitems). The bare test harness has no page landmark and the minimal
      // trigger fixture wraps a native <button> — both are fixture artifacts, not
      // component defects — so axe runs against the panel subtree the component owns.
      await expectNoA11yViolations(getPanel() as HTMLElement)
    })

    // ---- Enum smoke floor -----------------------------------------------------
    it.each([
      ['bottom', 'start'],
      ['bottom', 'end'],
      ['top', 'start'],
      ['top', 'end'],
      ['end', 'center'],
      ['start', 'center']
    ] as const)('mirrors side=%s align=%s onto the root', (side, align) => {
      const { getByTestId } = render(Host, { props: { side, align } })
      expect(getByTestId('dropdown-menu').getAttribute('data-side')).toBe(side)
      expect(getByTestId('dropdown-menu').getAttribute('data-align')).toBe(align)
    })

    describe('text direction', () => {
      const EdgeHost = (dir: 'ltr' | 'rtl', edge: 'left' | 'right') =>
        defineComponent({
          setup() {
            return () =>
              h('div', { dir, style: `position:fixed;top:200px;${edge}:0` }, [
                h(DropdownMenu, { open: true, side: 'start', align: 'start' }, () => [
                  h(DropdownMenuTrigger, null, () => h('button', { type: 'button' }, 'Menu')),
                  h(DropdownMenuGroup, null, () => [
                    h(DropdownMenuItem, { value: 'profile', label: 'Profile' })
                  ])
                ])
              ])
          }
        })

      it('resolves side=start to the right under rtl, so a trigger on the right edge flips to end', async () => {
        render(EdgeHost('rtl', 'right'))
        await waitFor(() => expect(getPanel()).not.toBeNull())
        await waitFor(() => expect(getPanel()!.getAttribute('data-side')).toBe('end'))
      })

      it('keeps side=start under rtl when the trigger sits on the left edge', async () => {
        render(EdgeHost('rtl', 'left'))
        await waitFor(() => expect(getPanel()?.style.translate ?? '').not.toMatch(/-9999|^$/))
        expect(getPanel()!.getAttribute('data-side')).toBe('start')
        expect(getPanel()!.getAttribute('data-align')).toBe('start')
      })
    })

    // ---- Story smoke: composed stories render through the real compound -------
    it('renders the Default story (closed) with its trigger', () => {
      const { getByRole } = render(Default)
      // Story trigger wraps an IconButton with aria-label "Open menu".
      expect(getByRole('button', { name: 'Open menu' })).toBeTruthy()
    })

    it('renders the Groups story and opens its two labeled groups', async () => {
      render(Groups)
      await fireEvent.click(screen.getByTestId('dropdown-menu-trigger'))
      await waitFor(() => {
        const groups = document.body.querySelectorAll('[role="group"]')
        expect(groups).toHaveLength(2)
      })
      expect(screen.getByText('Account')).toBeTruthy()
      expect(screen.getByText('Workspace')).toBeTruthy()
    })

    it('opens the OptionAffordances example from its trigger with a command hint option', async () => {
      const { container } = render(OptionAffordances)
      await openFromTrigger(container)
      await waitFor(() =>
        expect(document.body.querySelectorAll('[role^="menuitem"]').length).toBeGreaterThan(0)
      )
      const command = document.body.querySelector('[data-testid="dropdown-menu-item__command"]')
      expect(command?.textContent?.replace(/\s+/g, '')).toBe(`${PRIMARY_GLYPH}P`)
      expect(command?.className).toContain('pointer-coarse:hidden')
    })
  })

  describe('with links example', () => {
    it('opens link options in a new tab with a description line', async () => {
      const { container } = render(WithLinks)
      await openFromTrigger(container)
      await waitForOpen(2)
      const [external, internal] = getOptions() as [HTMLElement, HTMLElement]
      expect(external).toHaveAttribute('target', '_blank')
      expect(external).toHaveAccessibleDescription('docs.example.com · Mar 2, 2026')
      expect(internal).not.toHaveAttribute('target')
      await expectNoA11yViolations(getPanel()!)
    })
  })

  describe('keyboard map (spec)', () => {
    const Sandwich = defineComponent({
      setup() {
        return () =>
          h('div', [h(Host), h('button', { type: 'button', 'data-testid': 'after' }, 'After')])
      }
    })

    const focused = () => (document.activeElement as HTMLElement | null)?.textContent?.trim()

    const openWith = async (key: string) => {
      render(Sandwich)
      await nextTick()
      control().focus()
      await userEvent.keyboard(key)
      await waitFor(() => expect(getPanel()).not.toBeNull())
      await nextTick()
    }

    it.each(['{Enter}', ' ', '{ArrowDown}'])(
      '%s on the trigger opens and focuses the first option',
      async (key) => {
        await openWith(key)
        await waitFor(() => expect(focused()).toBe('Profile'))
      }
    )

    it('ArrowUp on the trigger opens and focuses the last option', async () => {
      await openWith('{ArrowUp}')
      await waitFor(() => expect(focused()).toBe('Sign out'))
    })

    it('ArrowDown and ArrowUp move between options and wrap', async () => {
      await openWith('{Enter}')
      await waitFor(() => expect(focused()).toBe('Profile'))
      await userEvent.keyboard('{ArrowDown}')
      expect(focused()).toBe('Settings')
      await userEvent.keyboard('{ArrowUp}{ArrowUp}')
      expect(focused()).toBe('Sign out')
      await userEvent.keyboard('{ArrowDown}')
      expect(focused()).toBe('Profile')
    })

    it('End and Home jump to the last and first options', async () => {
      await openWith('{Enter}')
      await waitFor(() => expect(focused()).toBe('Profile'))
      await userEvent.keyboard('{End}')
      expect(focused()).toBe('Sign out')
      await userEvent.keyboard('{Home}')
      expect(focused()).toBe('Profile')
    })

    it.each(['{Enter}', ' '])(
      '%s on an option selects it, closes and returns focus to the trigger',
      async (key) => {
        await openWith('{Enter}')
        await waitFor(() => expect(focused()).toBe('Profile'))
        await userEvent.keyboard(key)
        await waitFor(() => expect(getPanel()).toBeNull())
        expect(document.activeElement).toBe(control())
      }
    )

    it('Escape closes and returns focus to the trigger', async () => {
      await openWith('{Enter}')
      await waitFor(() => expect(focused()).toBe('Profile'))
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(getPanel()).toBeNull())
      expect(document.activeElement).toBe(control())
    })

    it('Tab closes and moves focus on to the next control after the trigger', async () => {
      await openWith('{Enter}')
      await waitFor(() => expect(focused()).toBe('Profile'))
      await userEvent.keyboard('{Tab}')
      await waitFor(() => expect(getPanel()).toBeNull())
      expect((document.activeElement as HTMLElement).dataset['testid']).toBe('after')
    })

    it('Tab keeps focus on the trigger, never the body, when nothing tabbable follows it', async () => {
      render(Host)
      await nextTick()
      control().focus()
      await userEvent.keyboard('{Enter}')
      await waitFor(() => expect(focused()).toBe('Profile'))
      await userEvent.keyboard('{Tab}')
      await waitFor(() => expect(getPanel()).toBeNull())
      expect(document.activeElement).toBe(control())
    })

    it('Shift+Tab closes and returns focus to the trigger', async () => {
      await openWith('{Enter}')
      await waitFor(() => expect(focused()).toBe('Profile'))
      await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
      await waitFor(() => expect(getPanel()).toBeNull())
      expect(document.activeElement).toBe(control())
    })
  })

  describe('audit fixes', () => {
    it('opens from defaultOpen while v-model:open is unbound', async () => {
      render(
        defineComponent({
          setup: () => () =>
            h(DropdownMenu, { defaultOpen: true }, () => [
              h(DropdownMenuTrigger, null, () => h('button', { type: 'button' }, 'Menu')),
              h(DropdownMenuGroup, null, () => [
                h(DropdownMenuItem, { value: 'profile', label: 'Profile' })
              ])
            ])
        })
      )
      await waitForOpen(1)
      expect(control().getAttribute('aria-expanded')).toBe('true')
    })

    const menu = (children: () => unknown[], props: Record<string, unknown> = { open: true }) =>
      defineComponent({
        setup() {
          return () =>
            h(DropdownMenu, props, () => [
              h(DropdownMenuTrigger, null, () => h('button', { type: 'button' }, 'Menu')),
              ...children()
            ])
        }
      })

    it('exposes DropdownMenu.Item and the DropdownMenuItem export as the row', () => {
      expect(DropdownMenu.Item).toBe(DropdownMenuItem)
      expect(DropdownMenuItem.name).toBe('DropdownMenuItem')
      expect('Option' in DropdownMenu).toBe(false)
    })

    it('renders items placed directly in the root inside the panel, not next to the trigger', async () => {
      const { container } = render(
        menu(() => [
          h(DropdownMenuItem, { value: 'edit', label: 'Edit' }),
          h(DropdownMenuItem, { value: 'delete', label: 'Delete' })
        ])
      )
      await waitForOpen(2)
      const panel = getPanel() as HTMLElement
      getOptions().forEach((option) => expect(panel.contains(option)).toBe(true))
      expect(container.querySelector('[role^="menuitem"]')).toBeNull()
    })

    it('keeps every item out of the tab order (roving focus by arrows)', async () => {
      render(Host, { props: { open: true } })
      await waitForOpen(3)
      getOptions().forEach((option) => expect(option.getAttribute('tabindex')).toBe('-1'))
    })

    it('renders the leading and trailing slots; the removed left and right slots render nothing', async () => {
      render(
        menu(() => [
          h(DropdownMenuGroup, null, () => [
            h(
              DropdownMenuItem,
              { value: 'a', label: 'A' },
              { leading: () => h('i', 'L'), trailing: () => h('i', 'T') }
            ),
            h(
              DropdownMenuItem,
              { value: 'b', label: 'B', 'data-testid': 'old' },
              { left: () => h('i', 'l'), right: () => h('i', 'r') }
            )
          ])
        ])
      )
      await waitForOpen(2)
      const leading = document.body.querySelector('[data-testid="dropdown-menu-item__leading"]')
      expect(leading?.textContent).toBe('L')
      expect(
        document.body.querySelector('[data-testid="dropdown-menu-item__trailing"]')?.textContent
      ).toBe('T')
      expect(document.body.querySelector('[data-testid="old__leading"]')).toBeNull()
      expect(document.body.querySelector('[data-testid="old__trailing"]')).toBeNull()
    })

    it('jumps to the first item that starts with a typed letter', async () => {
      render(
        menu(
          () => [
            h(DropdownMenuGroup, null, () => [
              h(DropdownMenuItem, { value: 'a', label: 'Archive' }),
              h(DropdownMenuItem, { value: 'd', label: 'Duplicate' }),
              h(DropdownMenuItem, { value: 'x', label: 'Delete' })
            ])
          ],
          {}
        )
      )
      await userEvent.click(control())
      await waitForOpen(3)
      await waitFor(() => expect(document.activeElement?.textContent?.trim()).toBe('Archive'))
      await userEvent.keyboard('d')
      expect(document.activeElement?.textContent?.trim()).toBe('Duplicate')
      await userEvent.keyboard('d')
      expect(document.activeElement?.textContent?.trim()).toBe('Delete')
    })

    it('renders an item with href as a link that still emits select', async () => {
      const onSelect = vi.fn()
      render(
        menu(
          () => [
            h(DropdownMenuGroup, null, () => [
              h(DropdownMenuItem, {
                value: '/docs',
                label: 'Docs',
                href: 'https://example.com/docs'
              })
            ])
          ],
          { open: true, onSelect }
        )
      )
      await waitForOpen(1)
      const link = getOptions()[0] as HTMLElement
      expect(link.tagName).toBe('A')
      expect(link.getAttribute('href')).toBe('https://example.com/docs')
      await fireEvent.click(link)
      expect(onSelect).toHaveBeenCalledWith(expect.any(MouseEvent), '/docs')
    })

    it('opens a target=_blank link in a new tab with the external glyph and new-tab hint', async () => {
      render(
        menu(
          () => [
            h(DropdownMenuGroup, null, () => [
              h(DropdownMenuItem, {
                value: 'docs',
                label: 'Docs',
                href: 'https://example.com/docs',
                target: '_blank'
              }),
              h(DropdownMenuItem, { value: 'home', label: 'Home', href: '/home' }),
              h(DropdownMenuItem, { value: 'plain', label: 'Plain', target: '_blank' })
            ])
          ],
          { open: true }
        )
      )
      await waitForOpen(3)
      const [external, internal, plain] = getOptions() as [HTMLElement, HTMLElement, HTMLElement]
      expect(external).toHaveAttribute('target', '_blank')
      expect(external).toHaveAttribute('rel', 'noopener noreferrer')
      expect(external).toHaveAccessibleName('Docs (opens in a new tab)')
      expect(
        external.querySelector('[data-testid="dropdown-menu-item__external"]')
      ).toHaveAttribute('aria-hidden', 'true')
      expect(internal).not.toHaveAttribute('target')
      expect(internal.querySelector('[data-testid="dropdown-menu-item__external"]')).toBeNull()
      expect(plain.tagName).toBe('DIV')
      expect(plain).not.toHaveAttribute('target')
      expect(plain).toHaveAccessibleName('Plain')
    })

    it('draws a description as a second line that describes the item', async () => {
      render(
        menu(
          () => [
            h(DropdownMenuGroup, null, () => [
              h(DropdownMenuItem, {
                value: 'purge',
                label: 'Real-Time Purge',
                description: 'Azion · Mar 2, 2026',
                href: 'https://example.com/purge',
                target: '_blank'
              }),
              h(DropdownMenuItem, { value: 'plain', label: 'Plain' })
            ])
          ],
          { open: true }
        )
      )
      await waitForOpen(2)
      const [described, plain] = getOptions() as [HTMLElement, HTMLElement]
      expect(described).toHaveAttribute('data-description')
      expect(described).toHaveAccessibleName('Real-Time Purge (opens in a new tab)')
      expect(described).toHaveAccessibleDescription('Azion · Mar 2, 2026')
      expect(
        described.querySelector('[data-testid="dropdown-menu-item__description"]')
      ).toHaveTextContent('Azion · Mar 2, 2026')
      expect(plain).not.toHaveAttribute('data-description')
      expect(plain).not.toHaveAttribute('aria-describedby')
      await expectNoA11yViolations(getPanel()!)
    })

    it('treats the first rendered group as first when an earlier group is removed', async () => {
      const showFirst = ref(true)
      render(
        defineComponent({
          setup() {
            return () =>
              h(DropdownMenu, { open: true }, () => [
                h(DropdownMenuTrigger, null, () => h('button', { type: 'button' }, 'Menu')),
                showFirst.value
                  ? h(DropdownMenuGroup, { label: 'One' }, () => [
                      h(DropdownMenuItem, { value: 'a', label: 'A' })
                    ])
                  : null,
                h(DropdownMenuGroup, { label: 'Two' }, () => [
                  h(DropdownMenuItem, { value: 'b', label: 'B' })
                ])
              ])
          }
        })
      )
      await waitForOpen(2)
      showFirst.value = false
      await waitForOpen(1)
      const group = document.body.querySelector('[role="group"]') as HTMLElement
      expect(group.matches(':first-child')).toBe(true)
    })

    it('attaches no document listener while closed and one shared window listener for shortcuts', async () => {
      const docAdd = vi.spyOn(document, 'addEventListener')
      const winAdd = vi.spyOn(window, 'addEventListener')
      const onSelect = vi.fn()
      render(
        defineComponent({
          setup() {
            return () =>
              h(
                'div',
                null,
                Array.from({ length: 20 }, (_, i) =>
                  h(DropdownMenu, { key: i, onSelect }, () => [
                    h(DropdownMenuTrigger, null, () => h('button', { type: 'button' }, `Row ${i}`)),
                    h(DropdownMenuItem, { value: `copy-${i}`, label: 'Copy', command: 'mod+K' })
                  ])
                )
              )
          }
        })
      )
      await nextTick()
      const mousedowns = docAdd.mock.calls.filter(([type]) => type === 'mousedown').length
      const keydowns = winAdd.mock.calls.filter(([type]) => type === 'keydown').length
      docAdd.mockRestore()
      winAdd.mockRestore()
      expect(mousedowns).toBe(0)
      expect(keydowns).toBeLessThanOrEqual(1)

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ...PRIMARY }))
      expect(onSelect).toHaveBeenCalledTimes(1)
    })

    it('a shared shortcut fires the open menu, else the focused one, else the first', async () => {
      const onSelect = vi.fn()
      render(
        defineComponent({
          setup() {
            return () =>
              h(
                'div',
                null,
                Array.from({ length: 20 }, (_, i) =>
                  h(
                    DropdownMenu,
                    { key: i, onSelect: (_event: Event, value: unknown) => onSelect(value) },
                    () => [
                      h(DropdownMenuTrigger, null, () =>
                        h('button', { type: 'button' }, `Row ${i}`)
                      ),
                      h(DropdownMenuItem, { value: `copy-${i}`, label: 'Copy', command: 'mod+K' })
                    ]
                  )
                )
              )
          }
        })
      )
      await nextTick()
      const press = () =>
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ...PRIMARY }))
      const row = (i: number) =>
        Array.from(document.querySelectorAll('button')).find((b) => b.textContent === `Row ${i}`)!

      row(3).focus()
      press()
      expect(onSelect).toHaveBeenLastCalledWith('copy-3')

      await fireEvent.click(row(7))
      await nextTick()
      press()
      expect(onSelect).toHaveBeenLastCalledWith('copy-7')

      ;(document.activeElement as HTMLElement | null)?.blur()
      document.body.focus()
      press()
      expect(onSelect).toHaveBeenLastCalledWith('copy-0')
    })
  })

  const SubHost = defineComponent({
    props: {
      onSelect: { type: Function as PropType<SelectHandler>, default: undefined }
    },
    setup(props) {
      return () =>
        h(DropdownMenu, { onSelect: props.onSelect }, () => [
          h(DropdownMenuTrigger, null, () => h('button', { type: 'button' }, 'Menu')),
          h(DropdownMenuGroup, null, () => [
            h(DropdownMenuItem, { value: 'edit', label: 'Edit' }),
            h(DropdownMenuSub, null, () => [
              h(DropdownMenuSubTrigger, { label: 'Move to' }),
              h(DropdownMenuSubContent, null, () => [
                h(DropdownMenuGroup, null, () => [
                  h(DropdownMenuItem, { value: 'production', label: 'production' }),
                  h(DropdownMenuItem, { value: 'staging', label: 'staging' })
                ])
              ])
            ]),
            h(DropdownMenuSub, null, () => [
              h(DropdownMenuSubTrigger, { label: 'Share', disabled: true }),
              h(DropdownMenuSubContent, null, () => [
                h(DropdownMenuGroup, null, () => [
                  h(DropdownMenuItem, { value: 'copy', label: 'Copy link' })
                ])
              ])
            ]),
            h(DropdownMenuItem, { value: 'delete', label: 'Delete' })
          ])
        ])
    }
  })

  const subTrigger = (name: string) =>
    Array.from(
      document.body.querySelectorAll<HTMLElement>('[data-testid="dropdown-menu-sub-trigger"]')
    ).find((el) => el.textContent?.includes(name)) as HTMLElement

  const subPanels = () =>
    Array.from(
      document.body.querySelectorAll<HTMLElement>('[data-testid="dropdown-menu-sub-content"]')
    )

  async function openSubHost(onSelect?: (...args: unknown[]) => void) {
    render(SubHost, { props: { onSelect } })
    await userEvent.click(control())
    await waitFor(() => expect(subTrigger('Move to')).toBeTruthy())
  }

  describe('sub-menus', () => {
    it('renders the sub-trigger as a menuitem that announces a closed sub-menu', async () => {
      await openSubHost()
      const row = subTrigger('Move to')
      expect(row.getAttribute('role')).toBe('menuitem')
      expect(row.getAttribute('aria-haspopup')).toBe('menu')
      expect(row.getAttribute('aria-expanded')).toBe('false')
      expect(subPanels()).toHaveLength(0)
    })

    it('ArrowRight opens the sub-menu, focuses its first item, and ArrowLeft returns', async () => {
      await openSubHost()
      subTrigger('Move to').focus()
      await userEvent.keyboard('{ArrowRight}')
      await waitFor(() => expect(subPanels()).toHaveLength(1))
      const panel = subPanels()[0]
      const menu = panel.querySelector('[role="menu"]') as HTMLElement
      expect(menu.getAttribute('aria-labelledby')).toBe(subTrigger('Move to').id)
      expect(subTrigger('Move to').getAttribute('aria-controls')).toBe(menu.id)
      expect(subTrigger('Move to').getAttribute('aria-expanded')).toBe('true')
      await waitFor(() => expect(document.activeElement?.textContent).toContain('production'))
      await userEvent.keyboard('{ArrowDown}')
      expect(document.activeElement?.textContent).toContain('staging')
      await userEvent.keyboard('{ArrowLeft}')
      await waitFor(() => expect(subPanels()).toHaveLength(0))
      expect(document.activeElement).toBe(subTrigger('Move to'))
      expect(getPanel()).not.toBeNull()
    })

    it('Escape inside a sub-menu closes only the sub-menu', async () => {
      await openSubHost()
      subTrigger('Move to').focus()
      await userEvent.keyboard('{Enter}')
      await waitFor(() => expect(document.activeElement?.textContent).toContain('production'))
      await userEvent.keyboard('{Escape}')
      await waitFor(() => expect(subPanels()).toHaveLength(0))
      expect(getPanel()).not.toBeNull()
      expect(document.activeElement).toBe(subTrigger('Move to'))
    })

    it('hover opens the sub-menu and a click inside it does not dismiss the menu', async () => {
      await openSubHost()
      await userEvent.hover(subTrigger('Move to'))
      await waitFor(() => expect(subPanels()).toHaveLength(1))
      await fireEvent.mouseDown(subPanels()[0])
      await nextTick()
      expect(getPanel()).not.toBeNull()
    })

    it('selecting an item inside the sub-menu emits select and closes the whole menu', async () => {
      const calls: unknown[][] = []
      await openSubHost((...args: unknown[]) => calls.push(args))
      await userEvent.click(subTrigger('Move to'))
      await waitFor(() => expect(subPanels()).toHaveLength(1))
      const staging = within(subPanels()[0]).getByText('staging')
      await userEvent.click(staging)
      expect(calls).toHaveLength(1)
      expect(calls[0][0]).toBeInstanceOf(MouseEvent)
      expect(calls[0][1]).toBe('staging')
      await waitFor(() => expect(getPanel()).toBeNull())
      expect(subPanels()).toHaveLength(0)
    })

    it('a disabled sub-trigger does not open its sub-menu', async () => {
      await openSubHost()
      const row = subTrigger('Share')
      expect(row.getAttribute('aria-disabled')).toBe('true')
      await fireEvent.click(row)
      await fireEvent.keyDown(row, { key: 'ArrowRight' })
      await nextTick()
      expect(subPanels()).toHaveLength(0)
    })

    it('the SubMenus example renders two levels with no a11y violations', async () => {
      const { container } = render(SubMenus)
      await openFromTrigger(container)
      await waitFor(() => expect(subPanels()).toHaveLength(1))
      expect(subTrigger('Move to').dataset['state']).toBe('open')
      await userEvent.hover(subTrigger('Other workspaces'))
      await waitFor(() => expect(subPanels()).toHaveLength(2))
      await expectNoA11yViolations(getPanel() as HTMLElement)
      for (const panel of subPanels()) await expectNoA11yViolations(panel)
    })
  })

  describe('severity', () => {
    it('marks a danger option and paints its label with the danger text token', async () => {
      const { container } = render(SubMenus)
      await openFromTrigger(container)
      const remove = await waitFor(() =>
        within(getPanel() as HTMLElement).getByRole('menuitem', { name: 'Delete' })
      )
      expect(remove.dataset['severity']).toBe('danger')
      expect(remove.classList).toContain('data-[severity=danger]:text-(--text-danger)')
      const neutral = within(getPanel() as HTMLElement)
        .getAllByRole('menuitem')
        .find((item) => item !== remove && !item.hasAttribute('aria-haspopup'))
      expect(neutral?.dataset['severity']).toBe('neutral')
      await expectNoA11yViolations(getPanel() as HTMLElement)
    })
  })

  describe('checkable options', () => {
    it('maps type to menuitemcheckbox / menuitemradio with aria-checked', async () => {
      const { container } = render(CheckableOptions)
      await openFromTrigger(container)
      const boxes = Array.from(document.body.querySelectorAll('[role="menuitemcheckbox"]'))
      const radios = Array.from(document.body.querySelectorAll('[role="menuitemradio"]'))
      expect(boxes).toHaveLength(3)
      expect(radios).toHaveLength(2)
      expect(boxes.map((el) => el.getAttribute('aria-checked'))).toEqual(['true', 'true', 'false'])
      expect(radios.map((el) => el.getAttribute('aria-checked'))).toEqual(['true', 'false'])
      expect(boxes[0].hasAttribute('aria-current')).toBe(false)
      await expectNoA11yViolations(getPanel() as HTMLElement)
    })

    it('activating a checkable option keeps the panel open and the consumer toggles it', async () => {
      const { container } = render(CheckableOptions)
      await openFromTrigger(container)
      const updated = within(getPanel() as HTMLElement)
        .getByText('Last updated')
        .closest('[role="menuitemcheckbox"]') as HTMLElement
      await userEvent.click(updated)
      await waitFor(() => expect(updated.getAttribute('aria-checked')).toBe('true'))
      expect(getPanel()).not.toBeNull()
      const compact = within(getPanel() as HTMLElement)
        .getByText('Compact')
        .closest('[role="menuitemradio"]') as HTMLElement
      compact.focus()
      await userEvent.keyboard('{Enter}')
      await waitFor(() => expect(compact.getAttribute('aria-checked')).toBe('true'))
      expect(getPanel()).not.toBeNull()
    })

    it('arrow keys move across checkable items like any other item', async () => {
      const { container } = render(CheckableOptions)
      await openFromTrigger(container)
      const first = document.body.querySelector('[role="menuitemcheckbox"]') as HTMLElement
      first.focus()
      await userEvent.keyboard('{End}')
      expect(document.activeElement?.textContent).toContain('Compact')
    })
  })

  describe('a trigger that is not a control', () => {
    it('names the avatar trigger by its aria-label and gives it a touch target', () => {
      render(CustomTriggers)
      const trigger = screen.getByRole('button', { name: 'Account menu' })
      expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
      expect(trigger.querySelector('[data-slot="touch-target"]')).not.toBeNull()
    })
  })
})
