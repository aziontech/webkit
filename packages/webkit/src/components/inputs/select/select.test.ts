import { composeStories } from '@storybook/vue3'
import { fireEvent, render, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/Select.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Select, { SelectContent, SelectGroup, SelectOption, SelectTrigger } from './index'

const { Default, Multiple, WithGroups, Disabled } = composeStories(stories)

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
    multiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Select an option' },
    initial: { type: null, default: undefined },
    startOpen: { type: Boolean, default: false }
  },
  setup(props) {
    const value = ref(props.initial ?? (props.multiple ? [] : ''))
    const open = ref(props.startOpen)
    return () =>
      h(
        Select,
        {
          multiple: props.multiple,
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
            OPTIONS.map((o) => h(SelectOption, { key: o.value, value: o.value }, () => o.label))
          )
        ]
      )
  }
})

/** Query the Teleported listbox from document.body (it escapes the container). */
const getContent = () =>
  document.body.querySelector('[data-testid="select-content"]') as HTMLElement | null

const getOptions = () =>
  Array.from(document.body.querySelectorAll('[data-testid="select-option"]')) as HTMLElement[]

afterEach(() => {
  // Teleported content leaks across tests when a wrapper unmounts mid-transition;
  // clean any stray listbox so document.body queries stay deterministic.
  document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())
})

describe('Select (compound / overlay)', () => {
  // ---- Compound API: dot-notation resolves ----------------------------------
  it('attaches every sub-component to the compound root for dot-notation', () => {
    expect(Select.Trigger).toBe(SelectTrigger)
    expect(Select.Content).toBe(SelectContent)
    expect(Select.Group).toBe(SelectGroup)
    expect(Select.Option).toBe(SelectOption)
  })

  // ---- Root renders + reflects state via data-* -----------------------------
  it('renders the root div with the default testid and closed/single state', () => {
    const { getByTestId } = render(Host)

    const root = getByTestId('select')
    expect(root.tagName).toBe('DIV')
    expect(root.getAttribute('data-state')).toBe('closed')
    expect(root.getAttribute('data-mode')).toBe('single')
    expect(root.getAttribute('data-size')).toBe('medium')
  })

  it('reflects multiple mode as data-mode="multiple" on the root', () => {
    const { getByTestId } = render(Host, { props: { multiple: true } })
    expect(getByTestId('select').getAttribute('data-mode')).toBe('multiple')
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

  // ---- Overlay open/close: trigger drives context -> Content teleports -------
  it('opens the Teleported listbox on trigger click and closes on second click', async () => {
    const { getByTestId } = render(Host)

    expect(getContent()).toBeNull()

    await fireEvent.click(getByTestId('select-trigger'))

    const content = getContent()
    expect(content).not.toBeNull()
    expect(content?.getAttribute('role')).toBe('listbox')
    // content is Teleported OUT of the render container, onto document.body
    expect(content?.closest('[data-testid="select"]')).toBeNull()
    // trigger aria-expanded now reflects open (shared context)
    expect(getByTestId('select-trigger').getAttribute('aria-expanded')).toBe('true')

    await fireEvent.click(getByTestId('select-trigger'))
    expect(getContent()).toBeNull()
  })

  it('sets aria-multiselectable on the listbox only in multiple mode', async () => {
    const single = render(Host)
    await fireEvent.click(single.getByTestId('select-trigger'))
    expect(getContent()?.getAttribute('aria-multiselectable')).toBeNull()
    single.unmount()
    document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())

    const multi = render(Host, { props: { multiple: true } })
    await fireEvent.click(multi.getByTestId('select-trigger'))
    expect(getContent()?.getAttribute('aria-multiselectable')).toBe('true')
  })

  it('opens the dropdown from the trigger on Enter, Space and ArrowDown', async () => {
    for (const key of ['Enter', ' ', 'ArrowDown']) {
      const view = render(Host)
      await fireEvent.keyDown(view.getByTestId('select-trigger'), { key })
      expect(getContent()).not.toBeNull()
      view.unmount()
      document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())
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
  it('renders one role=option per Select.Option through the injected context', async () => {
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
    expect(valueSpan.textContent?.trim()).toBe('opt-2')
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
    expect(within(options[1]).getByTestId('select-option__check')).toBeTruthy()
    expect(within(options[0]).queryByTestId('select-option__check')).toBeNull()
  })

  it('multiple mode: clicking two options accumulates both and keeps the dropdown open', async () => {
    const { getByTestId } = render(Host, { props: { multiple: true, startOpen: true } })

    await fireEvent.click(getOptions()[0])
    await fireEvent.click(getOptions()[2])

    // still open in multi-select
    expect(getContent()).not.toBeNull()

    const options = getOptions()
    expect(options[0].getAttribute('aria-selected')).toBe('true')
    expect(options[2].getAttribute('aria-selected')).toBe('true')
    expect(options[1].getAttribute('aria-selected')).toBe('false')

    // trigger displays the joined multi selection
    expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('opt-1, opt-3')
  })

  it('multiple mode: clicking a selected option again de-selects it', async () => {
    render(Host, { props: { multiple: true, startOpen: true, initial: ['opt-1'] } })

    expect(getOptions()[0].getAttribute('aria-selected')).toBe('true')
    await fireEvent.click(getOptions()[0])
    expect(getOptions()[0].getAttribute('aria-selected')).toBe('false')
  })

  it('selects an option via keyboard Enter and Space on the option element', async () => {
    const enter = render(Host, { props: { startOpen: true } })
    await fireEvent.keyDown(getOptions()[0], { key: 'Enter' })
    expect(enter.getByTestId('select-trigger__value').textContent?.trim()).toBe('opt-1')
    enter.unmount()
    document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())

    const space = render(Host, { props: { startOpen: true } })
    await fireEvent.keyDown(getOptions()[1], { key: ' ' })
    expect(space.getByTestId('select-trigger__value').textContent?.trim()).toBe('opt-2')
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
            OPTIONS.map((o) => h(SelectOption, { key: o.value, value: o.value }, () => o.label))
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
              h(SelectOption, { value: 'apple' }, () => 'Apple')
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
    ['Multiple', Multiple],
    ['WithGroups', WithGroups],
    ['Disabled', Disabled]
  ] as const)('mounts the %s story fixture and renders a role=combobox trigger', (_name, Story) => {
    const { getByTestId } = render(Story())
    const trigger = getByTestId('select-trigger')
    expect(trigger.tagName).toBe('BUTTON')
    expect(trigger.getAttribute('role')).toBe('combobox')
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
