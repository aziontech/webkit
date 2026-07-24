import { composeStories } from '@storybook/vue3'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/navigation/dropdown/Dropdown.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Dropdown, { DropdownGroup, DropdownOption, DropdownTrigger } from './index'

const { Default, Groups, OptionAffordances } = composeStories(stories)

/**
 * A realistic composed tree mirroring how a consumer wires the compound:
 * <Dropdown> with a <DropdownTrigger>, one or two <DropdownGroup>s each holding
 * <DropdownOption>s. The root Teleports its panel to document.body and each
 * group Teleports its options into the panel body (also in body), so all open
 * content is queried through document.body — not the render container.
 */
const Host = defineComponent({
  props: {
    open: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: false },
    placement: { type: String, default: 'bottom-start' },
    grouped: { type: Boolean, default: false },
    onSelect: { type: Function, default: undefined },
    'onUpdate:open': { type: Function, default: undefined }
  },
  setup(props) {
    return () =>
      h(
        Dropdown,
        {
          open: props.open,
          disabled: props.disabled,
          placement: props.placement,
          onSelect: props.onSelect,
          'onUpdate:open': props['onUpdate:open']
        },
        () =>
          props.grouped
            ? [
                h(DropdownTrigger, null, () => h('button', { type: 'button' }, 'Menu')),
                h(DropdownGroup, { label: 'Account' }, () => [
                  h(DropdownOption, { value: 'profile', label: 'Profile' }),
                  h(DropdownOption, { value: 'settings', label: 'Settings' })
                ]),
                h(DropdownGroup, { label: 'Workspace' }, () => [
                  h(DropdownOption, { value: 'invite', label: 'Invite members' }),
                  h(DropdownOption, { value: 'logs', label: 'Audit log', selected: true }),
                  h(DropdownOption, { value: 'archived', label: 'Archived', disabled: true })
                ])
              ]
            : [
                h(DropdownTrigger, null, () => h('button', { type: 'button' }, 'Menu')),
                h(DropdownGroup, null, () => [
                  h(DropdownOption, { value: 'profile', label: 'Profile' }),
                  h(DropdownOption, { value: 'settings', label: 'Settings' }),
                  h(DropdownOption, { value: 'signout', label: 'Sign out' })
                ])
              ]
      )
  }
})

/** Query the Teleported panel from document.body (it escapes the container). */
const getPanel = () =>
  document.body.querySelector('[data-testid="navigation-dropdown__panel"]') as HTMLElement | null

const getOptions = () =>
  Array.from(document.body.querySelectorAll('[role="menuitem"]')) as HTMLElement[]

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
    .querySelectorAll('[data-testid="navigation-dropdown__panel"]')
    .forEach((el) => el.remove())
})

describe('Dropdown (compound / overlay)', () => {
  // ---- Compound API: dot-notation resolves ----------------------------------
  it('attaches every sub-component to the compound root for dot-notation', () => {
    expect(Dropdown.Trigger).toBe(DropdownTrigger)
    expect(Dropdown.Group).toBe(DropdownGroup)
    expect(Dropdown.Option).toBe(DropdownOption)
  })

  // ---- Root renders + reflects state via data-* -----------------------------
  it('renders the root div with the default testid and closed state', () => {
    const { getByTestId } = render(Host)

    const root = getByTestId('navigation-dropdown')
    expect(root.tagName).toBe('DIV')
    expect(root.getAttribute('data-state')).toBe('closed')
    expect(root.getAttribute('data-placement')).toBe('bottom-start')
    expect(root.hasAttribute('data-disabled')).toBe(false)
  })

  it('reflects the disabled prop as data-disabled on the root', () => {
    const { getByTestId } = render(Host, { props: { disabled: true } })
    expect(getByTestId('navigation-dropdown').getAttribute('data-disabled')).toBe('true')
  })

  it('reflects the placement prop on data-placement', () => {
    const { getByTestId } = render(Host, { props: { placement: 'top-end' } })
    expect(getByTestId('navigation-dropdown').getAttribute('data-placement')).toBe('top-end')
  })

  // ---- Trigger anatomy + a11y wiring (context-driven) -----------------------
  it('renders the trigger as a role=button wired to aria-haspopup/expanded/controls', () => {
    const { getByTestId } = render(Host)

    const trigger = getByTestId('navigation-dropdown__trigger')
    expect(trigger.tagName).toBe('SPAN')
    expect(trigger.getAttribute('role')).toBe('button')
    expect(trigger.getAttribute('tabindex')).toBe('0')
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    // aria-controls points at the panel id supplied by the injected context.
    expect(trigger.getAttribute('aria-controls')).toBeTruthy()
    expect(trigger.getAttribute('data-state')).toBe('closed')
  })

  // ---- Overlay open/close: trigger drives context -> panel teleports ---------
  it('opens the Teleported panel on trigger click and closes on a second click', async () => {
    const { getByTestId } = render(Host)

    expect(getPanel()).toBeNull()

    await fireEvent.click(getByTestId('navigation-dropdown__trigger'))
    await waitForOpen(3)

    const panel = getPanel() as HTMLElement
    expect(panel.getAttribute('role')).toBe('menu')
    // Panel is Teleported OUT of the render container, onto document.body.
    expect(panel.closest('[data-testid="navigation-dropdown"]')).toBeNull()
    // aria-labelledby wires back to the trigger id (shared context).
    const trigger = getByTestId('navigation-dropdown__trigger')
    expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id)
    // Trigger aria-expanded now reflects open via injected isOpen.
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('data-state')).toBe('open')

    await fireEvent.click(trigger)
    await waitFor(() => expect(getPanel()).toBeNull())
    expect(getByTestId('navigation-dropdown__trigger').getAttribute('aria-expanded')).toBe('false')
  })

  it('renders one role=menuitem per DropdownOption through the injected panel body', async () => {
    const { getByTestId } = render(Host)

    await fireEvent.click(getByTestId('navigation-dropdown__trigger'))
    await waitForOpen(3)

    const options = getOptions()
    expect(options.map((o) => o.textContent?.trim())).toEqual(['Profile', 'Settings', 'Sign out'])
    options.forEach((o) => expect(o.getAttribute('role')).toBe('menuitem'))
  })

  it('does NOT open when the root is disabled', async () => {
    const { getByTestId } = render(Host, { props: { disabled: true } })

    await fireEvent.click(getByTestId('navigation-dropdown__trigger'))
    // Give any async teleport a chance; it must never appear.
    await Promise.resolve()
    expect(getPanel()).toBeNull()
    expect(getByTestId('navigation-dropdown__trigger').getAttribute('aria-expanded')).toBe('false')
  })

  // ---- Selection: emits select(event, value) + closes + returns focus -------
  it('emits select with the originating event + option value, then closes the panel', async () => {
    const onSelect = ref<Array<{ event: unknown; value: unknown }>>([])
    const { getByTestId } = render(Host, {
      props: {
        onSelect: (event: unknown, value: unknown) => onSelect.value.push({ event, value })
      }
    })

    await fireEvent.click(getByTestId('navigation-dropdown__trigger'))
    await waitForOpen(3)

    await fireEvent.click(getOptions()[1])

    expect(onSelect.value).toHaveLength(1)
    expect(onSelect.value[0].value).toBe('settings')
    // First positional arg carries the originating DOM event (a MouseEvent from the click).
    expect(onSelect.value[0].event).toBeInstanceOf(MouseEvent)

    // Panel closes on select.
    await waitFor(() => expect(getPanel()).toBeNull())
    // Focus returns to the trigger.
    expect(document.activeElement).toBe(getByTestId('navigation-dropdown__trigger'))
  })

  it('does not emit select when a disabled option is clicked', async () => {
    const calls = ref(0)
    const { getByTestId } = render(Host, {
      props: { grouped: true, onSelect: () => (calls.value += 1) }
    })

    await fireEvent.click(getByTestId('navigation-dropdown__trigger'))
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

    await fireEvent.click(getByTestId('navigation-dropdown__trigger'))
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
    await fireEvent.click(getByTestId('navigation-dropdown__trigger'))
    await waitForOpen(3)

    await fireEvent.keyDown(getPanel() as HTMLElement, { key: 'Escape' })

    await waitFor(() => expect(getPanel()).toBeNull())
    expect(document.activeElement).toBe(getByTestId('navigation-dropdown__trigger'))
  })

  it('opens from the trigger on ArrowDown, Enter and Space', async () => {
    for (const key of ['ArrowDown', 'Enter', ' ']) {
      const view = render(Host)
      await fireEvent.keyDown(view.getByTestId('navigation-dropdown__trigger'), { key })
      await waitForOpen(3)
      expect(getPanel()).not.toBeNull()
      view.unmount()
      document.body
        .querySelectorAll('[data-testid="navigation-dropdown__panel"]')
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

    await fireEvent.click(getByTestId('navigation-dropdown__trigger'))
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
    await fireEvent.click(getByTestId('navigation-dropdown__trigger'))
    await waitForOpen(3)
    expect(getPanel()).not.toBeNull()

    await fireEvent.mouseDown(document.body)

    await waitFor(() => expect(getPanel()).toBeNull())
  })

  // ---- Groups: labeled group anatomy + auto divider on 2nd group ------------
  it('renders each group as role=group with an aria-labelledby label; only the first is data-first', async () => {
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

    // registerGroup() returns 0-based index -> only the first group is data-first.
    expect(groups[0].hasAttribute('data-first')).toBe(true)
    expect(groups[1].hasAttribute('data-first')).toBe(false)
  })

  // ---- Option state: selected + disabled reflected via aria/data ------------
  it('reflects selected and disabled option states on aria and data attributes', async () => {
    render(Host, { props: { open: true, grouped: true } })
    await waitForOpen(5)

    const options = getOptions()
    const selected = options.find((o) => o.textContent?.trim() === 'Audit log') as HTMLElement
    const disabled = options.find((o) => o.textContent?.trim() === 'Archived') as HTMLElement

    expect(selected.getAttribute('aria-current')).toBe('true')
    expect(selected.hasAttribute('data-selected')).toBe(true)

    expect(disabled.getAttribute('aria-disabled')).toBe('true')
    expect(disabled.hasAttribute('data-disabled')).toBe(true)
    expect(disabled.getAttribute('tabindex')).toBe('-1')
  })

  it('renders a command hint inside an option that declares a command', async () => {
    render(
      defineComponent({
        setup() {
          return () =>
            h(Dropdown, { open: true }, () => [
              h(DropdownTrigger, null, () => h('button', { type: 'button' }, 'Menu')),
              h(DropdownGroup, null, () => [
                h(DropdownOption, { value: 'profile', label: 'Profile', command: '⌘P' })
              ])
            ])
        }
      })
    )

    await waitFor(() => expect(getOptions()).toHaveLength(1))
    const command = document.body.querySelector(
      '[data-testid="navigation-dropdown__option__command"]'
    )
    expect(command).not.toBeNull()
    expect(command?.textContent?.trim()).toBe('⌘P')
  })

  // ---- ENG-46740: panel body clips overflowing content ---------------------
  it('clips horizontal overflow on the panel body so content respects the panel rounded borders', async () => {
    const { getByTestId } = render(Host)
    await fireEvent.click(getByTestId('navigation-dropdown__trigger'))
    await waitForOpen(3)

    const body = document.body.querySelector(
      '[data-testid="navigation-dropdown__body"]'
    ) as HTMLElement
    expect(body).not.toBeNull()

    // Body must declare horizontal clipping and vertical auto-scroll on the
    // rendered class attribute (ENG-46740). Tests do not run Tailwind, so we
    // assert the utility classnames that carry the behavior.
    const cls = body.className
    expect(cls).toContain('overflow-x-hidden')
    expect(cls).toContain('overflow-y-auto')
  })

  // ---- ENG-46741: divider between groups is a flush hairline ---------------
  it('separates consecutive groups with a flush hairline (no vertical padding around the divider)', async () => {
    render(Host, { props: { open: true, grouped: true } })
    await waitForOpen(5)

    const groups = Array.from(document.body.querySelectorAll('[role="group"]')) as HTMLElement[]
    expect(groups).toHaveLength(2)

    const secondCls = groups[1].className
    const firstCls = groups[0].className

    // The divider is a hairline top border applied only to non-first groups.
    expect(secondCls).toContain('[&:not([data-first])]:border-t')
    expect(secondCls).toContain('[&:not([data-first])]:border-[var(--border-default)]')

    // No margin-top and no padding-top around the divider — must be flush.
    expect(secondCls).not.toMatch(/(?:^|[\s:])mt-\[/)
    expect(secondCls).not.toMatch(/(?:^|[\s:])pt-\[/)
    expect(secondCls).not.toMatch(/\[&:not\(\[data-first\]\)\]:mt-/)
    expect(secondCls).not.toMatch(/\[&:not\(\[data-first\]\)\]:pt-/)

    // Both groups share the same base class; first group has data-first so the
    // non-first variant never applies to it (no border, no spacing).
    expect(firstCls).toBe(secondCls)
    expect(groups[0].hasAttribute('data-first')).toBe(true)
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
  it.each(['bottom-start', 'bottom-end', 'top-start', 'top-end'] as const)(
    'mirrors placement=%s onto the root data-placement',
    (placement) => {
      const { getByTestId } = render(Host, { props: { placement } })
      expect(getByTestId('navigation-dropdown').getAttribute('data-placement')).toBe(placement)
    }
  )

  // ---- Story smoke: composed stories render through the real compound -------
  it('renders the Default story (closed) with its trigger', () => {
    const { getByRole } = render(Default)
    // Story trigger wraps an IconButton with aria-label "Open menu".
    expect(getByRole('button', { name: 'Open menu' })).toBeTruthy()
  })

  it('renders the Groups story and opens its two labeled groups', async () => {
    render(Groups)
    await fireEvent.click(screen.getByTestId('navigation-dropdown__trigger'))
    await waitFor(() => {
      const groups = document.body.querySelectorAll('[role="group"]')
      expect(groups).toHaveLength(2)
    })
    expect(screen.getByText('Account')).toBeTruthy()
    expect(screen.getByText('Workspace')).toBeTruthy()
  })

  it('renders the OptionAffordances story open with a command hint option', async () => {
    render(OptionAffordances)
    await waitFor(() =>
      expect(document.body.querySelectorAll('[role="menuitem"]').length).toBeGreaterThan(0)
    )
    const command = document.body.querySelector(
      '[data-testid="navigation-dropdown__option__command"]'
    )
    expect(command?.textContent?.trim()).toBe('⌘P')
  })
})
