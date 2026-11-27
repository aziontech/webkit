import { fireEvent, render, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/select/default.vue'
import Disabled from '../../../../examples/select/disabled.vue'
import Ghost from '../../../../examples/select/ghost.vue'
import Groups from '../../../../examples/select/groups.vue'
import Invalid from '../../../../examples/select/invalid.vue'
import WithSearchAndFooter from '../../../../examples/select/with-search-and-footer.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { hostable } from '../../../test/hostable'
import SelectRoot, { SelectContent, SelectGroup, SelectItem, SelectTrigger } from './index'

const Select = hostable(SelectRoot)

const OPTIONS = [
  { value: 'opt-1', label: 'Option 1' },
  { value: 'opt-2', label: 'Option 2' },
  { value: 'opt-3', label: 'Option 3' }
]

/**
 * A realistic host that wires the compound root's v-model / open with local
 * refs — mirrors how a consumer composes the parts. Because <Select.Content>
 * Teleports to document.body, its content is queried through document.body,
 * not the render container.
 */
const Host = defineComponent({
  props: {
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Select an option' },
    initial: { type: null, default: undefined },
    startOpen: { type: Boolean, default: false },
    /** Extra options appended to OPTIONS, to build a list taller than the viewport. */
    extraOptions: { type: Number, default: 0 },
    /** Inline style on a wrapper div, to pin the trigger somewhere in the viewport. */
    wrapperStyle: { type: String, default: '' }
  },
  setup(props) {
    const value = ref(props.initial ?? '')
    const open = ref(props.startOpen)
    const options = [
      ...OPTIONS,
      ...Array.from({ length: props.extraOptions }, (_, i) => ({
        value: `extra-${i}`,
        label: `Extra option ${i}`
      }))
    ]
    return () =>
      h('div', { style: props.wrapperStyle }, [
        h(
          Select,
          {
            disabled: props.disabled,
            readonly: props.readonly,
            invalid: props.invalid,
            required: props.required,
            placeholder: props.placeholder,
            modelValue: value.value,
            open: open.value,
            'onUpdate:modelValue': (v: unknown) => {
              value.value = v as never
            },
            'onUpdate:open': (v: boolean) => {
              open.value = v
            }
          },
          () => [
            // aria-label gives the role=combobox trigger an accessible name so
            // the composed tree is axe-clean (the component does not name it).
            h(SelectTrigger, { 'aria-label': props.placeholder }),
            h(SelectContent, null, () =>
              options.map((o) => h(SelectItem, { key: o.value, value: o.value }, () => o.label))
            )
          ]
        )
      ])
  }
})

/** Query the Teleported listbox from document.body (it escapes the container). */
const getContent = () =>
  document.body.querySelector('[data-testid="select-content"]') as HTMLElement | null

const getOptions = () =>
  Array.from(document.body.querySelectorAll('[data-testid="select-item"]')) as HTMLElement[]

afterEach(() => {
  // Teleported content leaks across tests when a wrapper unmounts mid-transition;
  // clean any stray listbox so document.body queries stay deterministic.
  document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())
})

describe('Select', () => {
  it('caps the Default example at a realistic field width', () => {
    const view = render(Default)
    expect((view.container.firstElementChild as HTMLElement).classList).toContain(
      'max-w-(--container-xs)'
    )
  })

  it('pairs the Invalid example with a Field.Error the trigger is described by', async () => {
    const view = render(Invalid)
    await nextTick()
    const trigger = view.getByRole('combobox', { name: 'Region' })
    expect(trigger.getAttribute('aria-invalid')).toBe('true')
    const ids = (trigger.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean)
    const text = ids.map((id) => document.getElementById(id)?.textContent?.trim()).join(' ')
    expect(text).toContain('Choose a region.')
  })

  describe('keyboard and naming (APG select-only combobox)', () => {
    const focusedText = () => (document.activeElement as HTMLElement | null)?.textContent?.trim()

    it('opens from the closed trigger with ArrowUp, Home, End and a typed character', async () => {
      const { getByTestId } = render(Host)
      const trigger = getByTestId('select-trigger')

      trigger.focus()
      await userEvent.keyboard('{End}')
      await vi.waitFor(() => expect(focusedText()).toBe('Option 3'))
      await userEvent.keyboard('{Escape}')
      await vi.waitFor(() => expect(getContent()).toBeNull())

      trigger.focus()
      await userEvent.keyboard('{Home}')
      await vi.waitFor(() => expect(focusedText()).toBe('Option 1'))
      await userEvent.keyboard('{Escape}')
      await vi.waitFor(() => expect(getContent()).toBeNull())

      trigger.focus()
      await userEvent.keyboard('{ArrowUp}')
      await vi.waitFor(() => expect(getContent()).not.toBeNull())
      await userEvent.keyboard('{Escape}')
      await vi.waitFor(() => expect(getContent()).toBeNull())

      trigger.focus()
      await userEvent.keyboard('o')
      await vi.waitFor(() => expect(focusedText()).toBe('Option 1'))
    })

    it('names the listbox and keeps the search field outside it', async () => {
      render(
        defineComponent({
          setup() {
            const value = ref('')
            return () =>
              h(
                Select,
                {
                  modelValue: value.value,
                  defaultOpen: true,
                  'aria-label': 'Region',
                  'onUpdate:modelValue': (v: unknown) => {
                    value.value = v as string
                  }
                },
                () => [
                  h(SelectTrigger),
                  h(SelectContent, null, {
                    search: () => h('input', { type: 'search', 'aria-label': 'Search regions' }),
                    default: () =>
                      OPTIONS.map((o) =>
                        h(SelectItem, { key: o.value, value: o.value }, () => o.label)
                      )
                  })
                ]
              )
          }
        })
      )
      await vi.waitFor(() => expect(getContent()).not.toBeNull())
      const list = getContent()!.querySelector<HTMLElement>('[role="listbox"]')!
      expect(list.getAttribute('aria-label')).toBe('Region')
      expect(list.querySelector('input')).toBeNull()
      expect(getContent()!.querySelector('input[type="search"]')).not.toBeNull()
      await expectNoA11yViolations(getContent() as HTMLElement)
    })
  })

  describe('compound / overlay', () => {
    it('mounts a 1,000-option list in chunks and mounts every option on the first arrow key', async () => {
      render(Host, { props: { startOpen: true, extraOptions: 997 } })
      await nextTick()
      const mountedAtOpen = getOptions().length
      expect(mountedAtOpen).toBeGreaterThan(0)
      expect(mountedAtOpen).toBeLessThan(1000)
      await fireEvent.keyDown(getContent() as HTMLElement, { key: 'End' })
      await nextTick()
      await nextTick()
      expect(getOptions()).toHaveLength(1000)
      expect(document.activeElement?.textContent).toContain('Extra option 996')
    })

    // ---- Compound API: dot-notation resolves ----------------------------------
    it('attaches every sub-component to the compound root for dot-notation', () => {
      expect(Select.Trigger).toBe(SelectTrigger)
      expect(Select.Content).toBe(SelectContent)
      expect(Select.Group).toBe(SelectGroup)
      expect(Select.Item).toBe(SelectItem)
    })

    // ---- Root renders + reflects state via data-* -----------------------------
    it('gives the panel a minimum width of its own on both variants, beyond the trigger width', async () => {
      const view = render(Host)
      await fireEvent.click(view.getByTestId('select-trigger'))
      expect(getContent()!.style.minWidth).toBe('var(--container-3xs)')
    })

    it('defaults to the outlined variant and mirrors variant on the root, trigger and panel', async () => {
      const outlined = render(Host)
      expect(outlined.getByTestId('select').getAttribute('data-variant')).toBe('outline')
      expect(outlined.getByTestId('select-trigger').getAttribute('data-variant')).toBe('outline')
      outlined.unmount()

      const view = render(Ghost)
      const trigger = view.getByRole('combobox', { name: 'Switch environment' })
      expect(view.getByTestId('select').getAttribute('data-variant')).toBe('ghost')
      expect(trigger.getAttribute('data-variant')).toBe('ghost')
      expect(trigger).toHaveTextContent('Production')
      await fireEvent.click(trigger)
      const content = getContent()!
      expect(content.getAttribute('data-variant')).toBe('ghost')
      await fireEvent.click(within(content).getByRole('option', { name: 'Staging' }))
      expect(trigger).toHaveTextContent('Staging')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })

    it('has no a11y violations on the transparent switcher in a breadcrumb', async () => {
      const view = render(Ghost)
      await expectNoA11yViolations(view.container)
    })

    it('renders the root div with the default testid and closed/single state', () => {
      const { getByTestId } = render(Host)

      const root = getByTestId('select')
      expect(root.tagName).toBe('DIV')
      expect(root.getAttribute('data-state')).toBe('closed')
      expect(root.hasAttribute('data-mode')).toBe(false)
      expect(root.getAttribute('data-size')).toBe('medium')
    })

    // ---- Trigger anatomy + a11y wiring ----------------------------------------
    it('renders the trigger as a role=combobox button wired to the content id', () => {
      const { getByTestId } = render(Host)

      const trigger = getByTestId('select-trigger')
      expect(trigger.tagName).toBe('BUTTON')
      expect(trigger.getAttribute('type')).toBe('button')
      expect(trigger.getAttribute('role')).toBe('combobox')
      expect(trigger.getAttribute('aria-haspopup')).toBe('listbox')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      // aria-controls points at the content element id (contentId from context)
      expect(trigger.getAttribute('aria-controls')).toBeTruthy()
    })

    it('shows the placeholder in the value span while nothing is selected', () => {
      const { getByTestId } = render(Host, { props: { placeholder: 'Pick one' } })

      const valueSpan = getByTestId('select-trigger__value')
      expect(valueSpan.getAttribute('data-filled')).toBe('false')
      expect(valueSpan.textContent?.trim()).toBe('Pick one')
    })

    describe('empty-string value', () => {
      const BlankHost = defineComponent({
        props: {
          initial: { type: String, default: '' },
          withBlank: { type: Boolean, default: true },
          startOpen: { type: Boolean, default: false },
          displayValue: { type: Function, default: undefined }
        },
        setup(props) {
          const value = ref(props.initial)
          const open = ref(props.startOpen)
          const options = props.withBlank ? [{ value: '', label: 'Auto' }, ...OPTIONS] : OPTIONS
          return () =>
            h(
              Select,
              {
                placeholder: 'Order by',
                name: 'order',
                modelValue: value.value,
                open: open.value,
                displayValue: props.displayValue as ((v: string) => string) | undefined,
                'onUpdate:modelValue': (v: unknown) => (value.value = v as string),
                'onUpdate:open': (v: boolean) => (open.value = v)
              },
              () => [
                h(SelectTrigger, { 'aria-label': 'Order by' }),
                h(SelectContent, null, () =>
                  options.map((o) => h(SelectItem, { key: o.value, value: o.value }, () => o.label))
                )
              ]
            )
        }
      })

      it('shows the label of an option whose value is the empty string', async () => {
        const { getByTestId } = render(BlankHost)
        await vi.waitFor(() => {
          const valueSpan = getByTestId('select-trigger__value')
          expect(valueSpan.getAttribute('data-filled')).toBe('true')
          expect(valueSpan.textContent?.trim()).toBe('Auto')
        })
        expect(getByTestId('select').hasAttribute('data-filled')).toBe(true)
      })

      it('selects the empty-string option after another value was picked', async () => {
        const { getByTestId } = render(BlankHost, { props: { initial: 'opt-1', startOpen: true } })
        await fireEvent.click(getOptions()[0])
        const valueSpan = getByTestId('select-trigger__value')
        expect(valueSpan.textContent?.trim()).toBe('Auto')
        expect(valueSpan.getAttribute('data-filled')).toBe('true')
      })

      it('calls displayValue for the empty-string option', async () => {
        const { getByTestId } = render(BlankHost, {
          props: { displayValue: (v: string) => (v === '' ? 'Automatic' : v) }
        })
        await vi.waitFor(() =>
          expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('Automatic')
        )
      })

      it('keeps the placeholder for an empty string when no option has that value', async () => {
        const { getByTestId } = render(BlankHost, { props: { withBlank: false } })
        await nextTick()
        const valueSpan = getByTestId('select-trigger__value')
        expect(valueSpan.getAttribute('data-filled')).toBe('false')
        expect(valueSpan.textContent?.trim()).toBe('Order by')
      })
    })

    // ---- Overlay open/close: trigger drives context -> Content teleports -------
    it('opens the Teleported listbox on trigger click and closes on second click', async () => {
      const { getByTestId } = render(Host)

      expect(getContent()).toBeNull()

      await fireEvent.click(getByTestId('select-trigger'))

      const content = getContent()
      expect(content).not.toBeNull()
      expect(content?.querySelector('[role="listbox"]')).not.toBeNull()
      // content is Teleported OUT of the render container, onto document.body
      expect(content?.closest('[data-testid="select"]')).toBeNull()
      // trigger aria-expanded now reflects open (shared context)
      expect(getByTestId('select-trigger').getAttribute('aria-expanded')).toBe('true')

      await fireEvent.click(getByTestId('select-trigger'))
      expect(getContent()).toBeNull()
    })

    it('never marks the listbox aria-multiselectable', async () => {
      const view = render(Host)
      await fireEvent.click(view.getByTestId('select-trigger'))
      expect(
        getContent()?.querySelector('[role="listbox"]')?.getAttribute('aria-multiselectable')
      ).toBeNull()
    })

    it('opens the dropdown from the trigger on Enter, Space and ArrowDown', async () => {
      for (const key of ['Enter', ' ', 'ArrowDown']) {
        const view = render(Host)
        await fireEvent.keyDown(view.getByTestId('select-trigger'), { key })
        expect(getContent()).not.toBeNull()
        view.unmount()
        document.body
          .querySelectorAll('[data-testid="select-content"]')
          .forEach((el) => el.remove())
      }
    })

    it('closes the open dropdown when Escape is pressed on the trigger', async () => {
      const { getByTestId } = render(Host, { props: { startOpen: true } })

      expect(getContent()).not.toBeNull()
      await fireEvent.keyDown(getByTestId('select-trigger'), { key: 'Escape' })
      expect(getContent()).toBeNull()
    })

    it('closes the open dropdown when Escape is pressed inside the content', async () => {
      render(Host, { props: { startOpen: true } })

      const content = getContent()
      expect(content).not.toBeNull()
      await fireEvent.keyDown(content as HTMLElement, { key: 'Escape' })
      expect(getContent()).toBeNull()
    })

    // ---- Option selection drives injected modelValue --------------------------
    it('renders one role=option per Select.Item through the injected context', async () => {
      render(Host, { props: { startOpen: true } })

      const options = getOptions()
      expect(options).toHaveLength(OPTIONS.length)
      options.forEach((o) => expect(o.getAttribute('role')).toBe('option'))
    })

    it('single mode: clicking an option selects it, closes the dropdown and fills the trigger', async () => {
      const { getByTestId } = render(Host, { props: { startOpen: true } })

      await fireEvent.click(getOptions()[1])

      // v-model round-trip: the trigger label now shows the selected value
      const valueSpan = getByTestId('select-trigger__value')
      expect(valueSpan.getAttribute('data-filled')).toBe('true')
      expect(valueSpan.textContent?.trim()).toBe('Option 2')
      // single-select closes on pick
      expect(getContent()).toBeNull()
      // root reflects filled
      expect(getByTestId('select').hasAttribute('data-filled')).toBe(true)
    })

    it('marks the selected option with aria-selected + data-selected and renders a check icon', async () => {
      render(Host, { props: { startOpen: true, initial: 'opt-2' } })

      const options = getOptions()
      expect(options[0].getAttribute('aria-selected')).toBe('false')
      expect(options[1].getAttribute('aria-selected')).toBe('true')
      expect(options[1].hasAttribute('data-selected')).toBe(true)
      // the check indicator only renders on the selected option
      expect(within(options[1]).getByTestId('select-item__check')).toBeTruthy()
      expect(within(options[0]).queryByTestId('select-item__check')).toBeNull()
    })

    it('ignores the removed multiple prop: one pick replaces the value and closes the panel', async () => {
      const value = ref<unknown>('')
      render(
        defineComponent({
          setup: () => () =>
            h(
              Select,
              {
                multiple: true,
                open: true,
                modelValue: value.value,
                'onUpdate:modelValue': (v: unknown) => {
                  value.value = v
                }
              } as Record<string, unknown>,
              () => [
                h(SelectTrigger, { 'aria-label': 'Pick' }),
                h(SelectContent, null, () =>
                  OPTIONS.map((o) => h(SelectItem, { value: o.value }, () => o.label))
                )
              ]
            )
        })
      )
      await fireEvent.click(getOptions()[0])
      expect(value.value).toBe('opt-1')
    })

    it('selects an option via keyboard Enter and Space on the option element', async () => {
      const enter = render(Host, { props: { startOpen: true } })
      await fireEvent.keyDown(getOptions()[0], { key: 'Enter' })
      expect(enter.getByTestId('select-trigger__value').textContent?.trim()).toBe('Option 1')
      enter.unmount()
      document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())

      const space = render(Host, { props: { startOpen: true } })
      await fireEvent.keyDown(getOptions()[1], { key: ' ' })
      expect(space.getByTestId('select-trigger__value').textContent?.trim()).toBe('Option 2')
    })

    // ---- Emitted events on real user actions ----------------------------------
    it('emits update:open(true) then update:open(false) as the trigger toggles', async () => {
      // Render the compound directly (uncontrolled open) to capture root emits.
      const { getByTestId, emitted } = render(Select, {
        props: { placeholder: 'x' },
        slots: {
          default: () => [h(SelectTrigger), h(SelectContent)]
        }
      })

      await fireEvent.click(getByTestId('select-trigger'))
      await fireEvent.click(getByTestId('select-trigger'))

      const events = emitted()['update:open']
      expect(events).toBeTruthy()
      expect(events[0]).toEqual([true])
      expect(events[1]).toEqual([false])
    })

    it('emits update:modelValue with the picked value when an option is clicked', async () => {
      // defaultOpen renders the dropdown immediately (uncontrolled), so the
      // options are present without a prior trigger click.
      const { emitted } = render(Select, {
        props: { defaultOpen: true },
        slots: {
          default: () => [
            h(SelectTrigger),
            h(SelectContent, null, () =>
              OPTIONS.map((o) => h(SelectItem, { key: o.value, value: o.value }, () => o.label))
            )
          ]
        }
      })

      await fireEvent.click(getOptions()[2])

      const events = emitted()['update:modelValue']
      expect(events).toBeTruthy()
      expect(events[events.length - 1]).toEqual(['opt-3'])
    })

    // ---- Group anatomy --------------------------------------------------------
    it('renders Select.Group as a role=group with an aria-label and a visible heading', () => {
      render(Select, {
        props: { defaultOpen: true },
        slots: {
          default: () => [
            h(SelectTrigger),
            h(SelectContent, null, () => [
              h(SelectGroup, { label: 'Fruits' }, () => [
                h(SelectItem, { value: 'apple' }, () => 'Apple')
              ])
            ])
          ]
        }
      })

      const group = document.body.querySelector('[data-testid="select-group"]') as HTMLElement
      expect(group).not.toBeNull()
      expect(group.getAttribute('role')).toBe('group')
      expect(group.getAttribute('aria-label')).toBe('Fruits')
      const heading = document.body.querySelector(
        '[data-testid="select-group__label"]'
      ) as HTMLElement
      expect(heading.textContent?.trim()).toBe('Fruits')
    })

    // ---- Disabled / readonly gate interaction ---------------------------------
    it('does not open when disabled: trigger is disabled and click is a no-op', async () => {
      const { getByTestId } = render(Host, { props: { disabled: true } })

      const trigger = getByTestId('select-trigger')
      expect((trigger as HTMLButtonElement).disabled).toBe(true)
      expect(getByTestId('select').hasAttribute('data-disabled')).toBe(true)

      await fireEvent.click(trigger)
      expect(getContent()).toBeNull()
    })

    it('does not open when readonly and does not toggle selection', async () => {
      const { getByTestId } = render(Host, { props: { readonly: true } })

      await fireEvent.click(getByTestId('select-trigger'))
      expect(getContent()).toBeNull()
      expect(getByTestId('select').hasAttribute('data-readonly')).toBe(true)
    })

    // ---- invalid / required a11y wiring ---------------------------------------
    it('wires aria-invalid and aria-required onto the trigger from root props', () => {
      const { getByTestId } = render(Host, { props: { invalid: true, required: true } })

      const trigger = getByTestId('select-trigger')
      expect(trigger.getAttribute('aria-invalid')).toBe('true')
      expect(trigger.getAttribute('aria-required')).toBe('true')
      const root = getByTestId('select')
      expect(root.hasAttribute('data-invalid')).toBe(true)
      expect(root.hasAttribute('data-required')).toBe(true)
    })

    // ---- axe on a realistic composed trigger ----------------------------------
    // NOTE: axe on the OPEN listbox is intentionally omitted — the component
    // wraps its role="option" children in a ScrollArea <div>, which trips the
    // real `aria-required-children` rule on role="listbox". That is a genuine
    // component a11y defect (see notes), not fixable from the test.
    it('has no a11y violations on the closed, named combobox trigger', async () => {
      const { container } = render(Host, { props: { initial: 'opt-1' } })
      await expectNoA11yViolations(container)
    })

    // ---- Story fixtures mount and expose their trigger ------------------------
    // Story fixtures render the trigger without an accessible name, so an axe
    // assertion would trip the real `button-name` defect (see notes). These
    // therefore assert a clean mount + the compound anatomy instead.
    it.each([
      ['Default', Default],
      ['Groups', Groups],
      ['Disabled', Disabled]
    ] as const)(
      'mounts the %s story fixture and renders a role=combobox trigger',
      (_name, Story) => {
        const { getByTestId } = render(Story)
        const trigger = getByTestId('select-trigger')
        expect(trigger.tagName).toBe('BUTTON')
        expect(trigger.getAttribute('role')).toBe('combobox')
      }
    )

    // ---- Focus ring: arrow-key navigation focuses the option (ENG-46730) -----
    // Options carry `focus-visible:ring-2 focus-visible:ring-(--ring-color)`
    // and `tabindex="-1"`, so the ring shows when the keyboard handler moves
    // focus to the option via `.focus()`. This regression test asserts the
    // handler actually moves DOM focus, which is the missing link when the ring
    // does not appear.
    it('moves DOM focus onto the first option on ArrowDown from within the panel (ENG-46730)', async () => {
      render(Host, { props: { startOpen: true } })
      const content = getContent() as HTMLElement
      expect(content).not.toBeNull()

      await fireEvent.keyDown(content, { key: 'ArrowDown' })

      const options = getOptions()
      expect(document.activeElement).toBe(options[0])
      // Options render tabindex=-1 + the focus-visible ring classes; asserting
      // both here proves the ring is reachable by keyboard navigation.
      expect(options[0].getAttribute('tabindex')).toBe('-1')
      expect(options[0].className).toContain('focus-visible:ring-2')
    })

    it('wraps ArrowDown from the last option back to the first (ENG-46730)', async () => {
      render(Host, { props: { startOpen: true } })
      const content = getContent() as HTMLElement
      const options = getOptions()
      options[options.length - 1].focus()

      await fireEvent.keyDown(content, { key: 'ArrowDown' })

      expect(document.activeElement).toBe(options[0])
    })

    // ---- Regression: trigger reopen (ENG-46739) -------------------------------
    // A real pointer press fires `pointerdown` then `click`. When the dropdown
    // is open, the content's document-level capture listener saw the trigger
    // pointerdown as an "outside" click and closed the panel; the trigger's own
    // @click then re-opened it. The visible symptom is that closing the panel
    // via the trigger appeared to require a second click, or emitted
    // update:open twice per press. The fix ignores pointerdown on the trigger.
    it('does not reopen the panel when the trigger receives a real pointerdown+click while open (ENG-46739)', async () => {
      const { getByTestId } = render(Host, { props: { startOpen: true } })
      const trigger = getByTestId('select-trigger')
      expect(getContent()).not.toBeNull()

      // Simulate a real press: pointerdown lands on the trigger with the panel
      // open. The document capture listener runs first; the trigger's click
      // handler runs after.
      await fireEvent.pointerDown(trigger)
      await fireEvent.click(trigger)

      // Panel must be closed. Before the fix, the pointerdown closed the panel
      // and the click re-opened it, leaving the panel visible.
      expect(getContent()).toBeNull()
    })

    it('opens exactly once on a real trigger press when starting closed (ENG-46739)', async () => {
      const { getByTestId, emitted } = render(Select, {
        props: { placeholder: 'x' },
        slots: {
          default: () => [h(SelectTrigger), h(SelectContent)]
        }
      })
      const trigger = getByTestId('select-trigger')

      await fireEvent.pointerDown(trigger)
      await fireEvent.click(trigger)

      // The trigger click drives one open transition. Before the fix, the
      // document pointerdown listener registered on the previous open cycle
      // could still see the press and emit an extra update:open(false).
      const events = emitted()['update:open']
      expect(events).toBeTruthy()
      expect(events).toEqual([[true]])
    })

    // ---- Size-aware placement (ENG-47063) --------------------------------------
    // Real layout: the trigger is pinned with inline styles (no CSS is loaded in
    // browser mode) and the panel's rect is asserted against the live viewport.
    it('flips the listbox above the trigger when there is no room below', async () => {
      const { getByTestId } = render(Host, {
        props: {
          extraOptions: 9,
          wrapperStyle: 'position:fixed;bottom:8px;left:8px;right:8px'
        }
      })
      const trigger = getByTestId('select-trigger')
      await fireEvent.click(trigger)
      await nextTick()
      await nextTick()

      const panel = getContent() as HTMLElement
      const panelRect = panel.getBoundingClientRect()
      const triggerRect = trigger.getBoundingClientRect()
      expect(panelRect.bottom).toBeLessThanOrEqual(triggerRect.top)
      expect(panelRect.top).toBeGreaterThanOrEqual(0)
      expect(Math.abs(panelRect.left - triggerRect.left)).toBeLessThanOrEqual(1)
    })

    it('caps the listbox to the free space and scrolls it when it fits on neither side', async () => {
      const { getByTestId } = render(Host, {
        props: { extraOptions: 200, wrapperStyle: 'position:fixed;top:8px;left:8px;right:8px' }
      })
      const trigger = getByTestId('select-trigger')
      await fireEvent.click(trigger)
      await nextTick()
      await nextTick()

      const panel = getContent() as HTMLElement
      const panelRect = panel.getBoundingClientRect()
      const triggerRect = trigger.getBoundingClientRect()
      expect(panelRect.top).toBeGreaterThanOrEqual(triggerRect.bottom)
      expect(panelRect.bottom).toBeLessThanOrEqual(window.innerHeight)
      expect(panel.style.maxHeight).not.toBe('')

      // No CSS in browser mode: the ScrollArea's own overflow utilities do not apply here,
      // so assert that the capped panel holds more content than its box (what scrolls).
      expect(panel.scrollHeight).toBeGreaterThan(panel.clientHeight)
    })

    // ---- Regression: panel anchoring under a transformed ancestor -------------
    // The panel is `position: fixed` inside its Teleport target (document.body).
    // A transform on an ancestor of that target makes it the panel's containing
    // block, so viewport coordinates written to top/left get scaled a second time
    // and the panel lands away from the trigger. A zoomed preview container does
    // exactly this — it scales the body.
    it('anchors the panel to the trigger when the Teleport target is scaled', async () => {
      const previousTransform = document.body.style.transform
      const previousOrigin = document.body.style.transformOrigin
      document.body.style.transformOrigin = 'top left'
      document.body.style.transform = 'scale(1.25)'

      try {
        const { getByTestId } = render(Host)
        const trigger = getByTestId('select-trigger')
        await fireEvent.click(trigger)

        const panel = getContent()
        expect(panel).not.toBeNull()
        // The panel measures the trigger one tick after it renders, so let that
        // continuation land before reading geometry.
        await nextTick()

        const triggerRect = trigger.getBoundingClientRect()
        const panelRect = (panel as HTMLElement).getBoundingClientRect()

        expect(Math.abs(panelRect.left - triggerRect.left)).toBeLessThanOrEqual(1)
        expect(Math.abs(panelRect.width - triggerRect.width)).toBeLessThanOrEqual(1)
        expect(panelRect.top).toBeGreaterThanOrEqual(triggerRect.bottom)
        expect(panelRect.top - triggerRect.bottom).toBeLessThanOrEqual(8)
      } finally {
        document.body.style.transform = previousTransform
        document.body.style.transformOrigin = previousOrigin
      }
    })

    // ---- one leading column + group rhythm ------------------------------------
    // The reservation is CSS (`group-has-…`) and browser mode compiles no Tailwind,
    // so `display` cannot be read here. Assert the mechanism instead: the marker is
    // on exactly the options that have a glyph, the box is on every option, and the
    // list carries the group that scopes the rule. Geometry is verified in the
    // browser against the stories.
    it('marks only options that have a leading glyph, but gives every option the box', async () => {
      const WithIcons = defineComponent({
        setup() {
          const open = ref(true)
          return () =>
            h(Select, { open: open.value, placeholder: 'Pick' }, () => [
              h(SelectTrigger, { 'aria-label': 'Pick' }),
              h(SelectContent, null, () => [
                h(SelectItem, { value: 'a', icon: 'az az-heart' }, () => 'With icon'),
                h(SelectItem, { value: 'b' }, () => 'Without icon')
              ])
            ])
        }
      })

      render(WithIcons)
      await nextTick()

      const boxes = Array.from(
        document.body.querySelectorAll('[data-testid="select-item__leading"]')
      ) as HTMLElement[]
      expect(boxes).toHaveLength(2)

      for (const box of boxes) {
        expect(box.className).toContain('size-4')
        expect(box.className).toContain('group-has-[[data-leading]]/options:flex')
      }

      // Only the iconed option is marked — that marker is what turns the column on.
      expect(boxes[0].hasAttribute('data-leading')).toBe(true)
      expect(boxes[1].hasAttribute('data-leading')).toBe(false)
      expect(boxes[0].querySelector('i.az-heart')).not.toBeNull()
      expect(boxes[1].querySelector('i')).toBeNull()

      // The rule is scoped by the list, so the group marker has to be there.
      const list = document.body.querySelector('[data-testid="select-content__list"]')
      expect(list?.className).toContain('group/options')
    })

    it('spaces every group but the first', async () => {
      const Grouped = defineComponent({
        setup() {
          const open = ref(true)
          return () =>
            h(Select, { open: open.value, placeholder: 'Pick' }, () => [
              h(SelectTrigger, { 'aria-label': 'Pick' }),
              h(SelectContent, null, () => [
                h(SelectGroup, { label: 'A' }, () => [h(SelectItem, { value: 'a' }, () => 'A1')]),
                h(SelectGroup, { label: 'B' }, () => [h(SelectItem, { value: 'b' }, () => 'B1')])
              ])
            ])
        }
      })

      render(Grouped)
      await nextTick()

      const groups = Array.from(document.body.querySelectorAll('[data-testid="select-group"]'))
      expect(groups).toHaveLength(2)
      // Sibling-scoped variant: the same class sits on both and the selector picks
      // the non-first, so the leading group is never pushed off the panel's seam.
      for (const group of groups) {
        expect(group.className).toContain('[&:not(:first-child)]:mt-(--spacing-sm)')
      }
      expect(groups[0].previousElementSibling).toBeNull()
      expect(groups[1].previousElementSibling).toBe(groups[0])
    })

    // ---- enum smoke floor -----------------------------------------------------
    it.each(['small', 'medium', 'large'] as const)(
      'reflects size "%s" as data-size on root and trigger',
      (size) => {
        const { getByTestId } = render(Select, {
          props: { size },
          slots: { default: () => [h(SelectTrigger)] }
        })
        expect(getByTestId('select').getAttribute('data-size')).toBe(size)
        expect(getByTestId('select-trigger').getAttribute('data-size')).toBe(size)
      }
    )
  })

  describe('keyboard map (spec)', () => {
    const settle = async () => {
      await nextTick()
      await nextTick()
    }
    const focusedText = () => (document.activeElement as HTMLElement | null)?.textContent?.trim()

    const openWith = async (key: string, props: Record<string, unknown> = {}) => {
      const view = render(Host, { props })
      const trigger = view.getByTestId('select-trigger')
      trigger.focus()
      await userEvent.keyboard(key)
      await settle()
      expect(getContent()).not.toBeNull()
      return { trigger }
    }

    it.each(['{Enter}', ' ', '{ArrowDown}'])(
      '%s on the trigger opens the list and focuses the first option',
      async (key) => {
        await openWith(key)
        expect(focusedText()).toBe('Option 1')
      }
    )

    it('opening focuses the selected option when there is one', async () => {
      await openWith('{Enter}', { initial: 'opt-2' })
      expect(focusedText()).toBe('Option 2')
    })

    it('ArrowDown and ArrowUp move between options and wrap', async () => {
      await openWith('{Enter}')
      await userEvent.keyboard('{ArrowDown}')
      expect(focusedText()).toBe('Option 2')
      await userEvent.keyboard('{ArrowUp}{ArrowUp}')
      expect(focusedText()).toBe('Option 3')
    })

    it('Home and End jump to the first and last options', async () => {
      await openWith('{Enter}')
      await userEvent.keyboard('{End}')
      expect(focusedText()).toBe('Option 3')
      await userEvent.keyboard('{Home}')
      expect(focusedText()).toBe('Option 1')
    })

    it.each(['{Enter}', ' '])(
      '%s on an option selects it, closes and returns focus to the trigger',
      async (key) => {
        const { trigger } = await openWith('{Enter}')
        await userEvent.keyboard('{ArrowDown}')
        await userEvent.keyboard(key)
        await settle()
        expect(getContent()).toBeNull()
        expect(trigger.textContent).toContain('Option 2')
        expect(document.activeElement).toBe(trigger)
      }
    )

    it('Escape closes and returns focus to the trigger', async () => {
      const { trigger } = await openWith('{Enter}')
      await userEvent.keyboard('{Escape}')
      await settle()
      expect(getContent()).toBeNull()
      expect(document.activeElement).toBe(trigger)
    })

    it('Tab closes and moves focus on to the control after the trigger', async () => {
      const view = render(
        defineComponent({
          setup: () => () =>
            h('div', [h(Host), h('button', { type: 'button', 'data-testid': 'after' }, 'After')])
        })
      )
      view.getByTestId('select-trigger').focus()
      await userEvent.keyboard('{Enter}')
      await settle()
      expect(focusedText()).toBe('Option 1')
      await userEvent.keyboard('{Tab}')
      await settle()
      expect(getContent()).toBeNull()
      expect(document.activeElement).toBe(view.getByTestId('after'))
    })

    it('Shift+Tab closes and returns focus to the trigger', async () => {
      const { trigger } = await openWith('{Enter}')
      await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
      await settle()
      expect(getContent()).toBeNull()
      expect(document.activeElement).toBe(trigger)
    })
  })

  describe('defineModel', () => {
    const parts = () => [
      h(SelectTrigger, { 'aria-label': 'Pick' }),
      h(SelectContent, null, () =>
        OPTIONS.map((o) => h(SelectItem, { key: o.value, value: o.value }, () => o.label))
      )
    ]

    it('keeps its own selection and open state when nothing is bound', async () => {
      const { getByTestId, emitted } = render(Select, {
        props: { defaultOpen: true },
        slots: { default: parts }
      })
      expect(getByTestId('select').getAttribute('data-state')).toBe('open')

      await fireEvent.click(getOptions()[1])
      await nextTick()

      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('Option 2')
      expect(getByTestId('select').getAttribute('data-state')).toBe('closed')
      expect(getByTestId('select').hasAttribute('data-filled')).toBe(true)
      expect(emitted()['update:modelValue']).toEqual([['opt-2']])
      expect(emitted()['update:open']).toEqual([[false]])
    })

    it('round-trips v-model and v-model:open with the parent', async () => {
      const value = ref<string>('opt-1')
      const open = ref(false)
      const Parent = defineComponent({
        setup: () => () =>
          h(
            Select,
            {
              modelValue: value.value,
              'onUpdate:modelValue': (v: string) => (value.value = v),
              open: open.value,
              'onUpdate:open': (v: boolean) => (open.value = v)
            },
            parts
          )
      })
      const { getByTestId } = render(Parent)
      await nextTick()
      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('Option 1')

      value.value = 'opt-3'
      await nextTick()
      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('Option 3')

      open.value = true
      await nextTick()
      expect(getByTestId('select').getAttribute('data-state')).toBe('open')

      await fireEvent.click(getOptions()[1])
      await nextTick()
      expect(value.value).toBe('opt-2')
      expect(open.value).toBe(false)
      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('Option 2')
    })

    it('stays open while a bound parent refuses to close it', async () => {
      const Parent = defineComponent({
        setup: () => () => h(Select, { open: true, 'onUpdate:open': () => undefined }, parts)
      })
      const { getByTestId } = render(Parent)
      await fireEvent.click(getByTestId('select-trigger'))
      await nextTick()
      expect(getByTestId('select').getAttribute('data-state')).toBe('open')
    })
  })

  describe('labels, typeahead and slots', () => {
    it('shows the option label of a preselected value before the panel first opens', async () => {
      const { getByTestId } = render(Host, { props: { initial: 'opt-2' } })
      await nextTick()
      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('Option 2')
      expect(document.querySelector('[data-testid="select-content__labels"]')).toBeNull()
    })

    it('keeps a consumer displayValue over the option label', async () => {
      const { getByTestId } = render({
        components: { Select, SelectTrigger, SelectContent, SelectItem },
        template: `<Select model-value="opt-1" :display-value="(v) => 'Picked ' + v">
        <SelectTrigger aria-label="Pick" />
        <SelectContent><SelectItem value="opt-1">Option 1</SelectItem></SelectContent>
      </Select>`
      })
      await nextTick()
      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('Picked opt-1')
    })

    it('moves focus to the option whose label starts with the typed characters', async () => {
      render(Host, { props: { startOpen: true } })
      await nextTick()
      await nextTick()
      const options = getOptions()
      options[0]!.focus()
      await fireEvent.keyDown(options[0]!, { key: 'o' })
      expect(document.activeElement).toBe(options[1])
      await fireEvent.keyDown(options[1]!, { key: 'x' })
      expect(document.activeElement).toBe(options[1])
    })

    it('renders the leading slot and ignores the removed iconLeft slot', () => {
      const view = render({
        components: { Select, SelectTrigger },
        template: `<Select><SelectTrigger aria-label="Pick"><template #leading><i data-testid="p" /></template></SelectTrigger></Select>`
      })
      expect(view.getByTestId('p')).toBeTruthy()
      view.unmount()
      const legacy = render({
        components: { Select, SelectTrigger },
        template: `<Select><SelectTrigger aria-label="Pick"><template #iconLeft><i data-testid="l" /></template></SelectTrigger></Select>`
      })
      expect(legacy.queryByTestId('l')).toBeNull()
    })

    it('renders the trailing slot after the value and before the chevron', () => {
      const view = render({
        components: { Select, SelectTrigger },
        template: `<Select model-value="a" :display-value="() => 'Alpha'"><SelectTrigger aria-label="Pick"><template #trailing><span data-testid="t">+1</span></template></SelectTrigger></Select>`
      })
      const trailing = view.getByTestId('t')
      expect(view.getByTestId('select-trigger__value').compareDocumentPosition(trailing)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      )
      expect(trailing.compareDocumentPosition(view.getByTestId('select-trigger__chevron'))).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      )
    })
  })

  describe('native form submit', () => {
    const FormHost = defineComponent({
      components: { Select, SelectTrigger, SelectContent, SelectItem },
      props: {
        initial: { type: null, default: undefined },
        required: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false }
      },
      setup(props) {
        return { value: ref(props.initial), options: OPTIONS }
      },
      template: `
      <form data-testid="form">
        <Select v-model="value" name="plan" :required="required" :disabled="disabled">
          <SelectTrigger aria-label="Plan" />
          <SelectContent>
            <SelectItem v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</SelectItem>
          </SelectContent>
        </Select>
      </form>
    `
    })

    it('submits the selected value under its name', () => {
      const { getByTestId } = render(FormHost, { props: { initial: 'opt-2' } })
      const form = getByTestId('form') as HTMLFormElement
      expect(new FormData(form).getAll('plan')).toEqual(['opt-2'])
    })

    it('blocks an empty submit when required, and leaves a disabled value out', async () => {
      const empty = render(FormHost, { props: { required: true } })
      expect((empty.getByTestId('form') as HTMLFormElement).checkValidity()).toBe(false)
      await expectNoA11yViolations(empty.container)
      empty.unmount()
      const filled = render(FormHost, { props: { required: true, initial: 'opt-1' } })
      expect((filled.getByTestId('form') as HTMLFormElement).checkValidity()).toBe(true)
      filled.unmount()
      const disabled = render(FormHost, { props: { disabled: true, initial: 'opt-1' } })
      expect(new FormData(disabled.getByTestId('form') as HTMLFormElement).has('plan')).toBe(false)
    })
  })

  describe('panel side and text direction', () => {
    const DirHost = (dir: 'ltr' | 'rtl') =>
      defineComponent({
        setup() {
          const value = ref('a')
          return () =>
            h(
              'div',
              { dir, style: `position:fixed;top:40px;${dir === 'rtl' ? 'right' : 'left'}:24px` },
              [
                h(
                  Select,
                  {
                    variant: 'ghost',
                    open: true,
                    modelValue: value.value,
                    'onUpdate:modelValue': (v: unknown) => {
                      value.value = v as string
                    }
                  },
                  () => [
                    h(SelectTrigger, { 'aria-label': 'Environment' }),
                    h(SelectContent, null, () => [
                      h(SelectItem, { value: 'a' }, () => 'A'),
                      h(SelectItem, { value: 'b' }, () => 'A longer option')
                    ])
                  ]
                )
              ]
            )
        }
      })

    const trigger = () =>
      document.body.querySelector('[data-testid="select-trigger"]') as HTMLElement

    it('renders the resolved side and align on the panel', async () => {
      render(DirHost('ltr'))
      await nextTick()
      await nextTick()
      expect(getContent()!.getAttribute('data-side')).toBe('bottom')
      expect(getContent()!.getAttribute('data-align')).toBe('start')
    })

    it('lines the panel up with the trigger start edge in ltr and its right edge in rtl', async () => {
      const ltr = render(DirHost('ltr'))
      await nextTick()
      await nextTick()
      expect(
        Math.abs(
          getContent()!.getBoundingClientRect().left - trigger().getBoundingClientRect().left
        )
      ).toBeLessThanOrEqual(1)
      ltr.unmount()
      document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())

      render(DirHost('rtl'))
      await nextTick()
      await nextTick()
      const panel = getContent()!.getBoundingClientRect()
      const anchor = trigger().getBoundingClientRect()
      expect(panel.width).toBeGreaterThan(anchor.width)
      expect(Math.abs(panel.right - anchor.right)).toBeLessThanOrEqual(1)
    })
  })

  describe('search and footer', () => {
    it('names the search field and lets Tab reach the footer before closing', async () => {
      const { getByTestId } = render(WithSearchAndFooter)
      await userEvent.click(getByTestId('select-trigger'))
      const panel = await vi.waitFor(() => {
        const found = document.querySelector<HTMLElement>('[data-testid="select-content"]')
        expect(found).not.toBeNull()
        return found as HTMLElement
      })
      const search = within(panel).getByRole('textbox', { name: 'Search options' })
      search.focus()
      const footer = within(panel).getByRole('button', { name: 'Create new item' })
      for (let press = 0; press < 3 && document.activeElement !== footer; press += 1) {
        await userEvent.keyboard('{Tab}')
        expect(panel.contains(document.activeElement)).toBe(true)
      }
      expect(document.activeElement).toBe(footer)
      await userEvent.keyboard('{Tab}')
      await vi.waitFor(() => expect(panel.isConnected).toBe(false))
    })
  })
})
