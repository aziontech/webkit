import { composeStories } from '@storybook/vue3'
import { fireEvent, render, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/select/Select.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Select, { SelectContent, SelectGroup, SelectOption, SelectTrigger } from './index'

const { Default, Multiple, WithGroups, WithSearchAndFooter, Disabled, Native } =
  composeStories(stories)

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
    startOpen: { type: Boolean, default: false },
    /** Extra options appended to OPTIONS, to build a list taller than the viewport. */
    extraOptions: { type: Number, default: 0 },
    /** Inline style on a wrapper div, to pin the trigger somewhere in the viewport. */
    wrapperStyle: { type: String, default: '' }
  },
  setup(props) {
    const value = ref(props.initial ?? (props.multiple ? [] : ''))
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
              options.map((o) => h(SelectOption, { key: o.value, value: o.value }, () => o.label))
            )
          ]
        )
      ])
  }
})

/** Query the Teleported listbox from document.body (it escapes the container). */
const getContent = () =>
  document.body.querySelector('[data-testid="select-content"]') as HTMLElement | null

const getListbox = () => document.body.querySelector('[role="listbox"]') as HTMLElement | null

const getOptions = () =>
  Array.from(document.body.querySelectorAll('[data-testid="select-option"]')) as HTMLElement[]

const optionByText = (text: string) =>
  getOptions().find((option) => option.textContent?.trim() === text) as HTMLElement

const removeStrayContent = () =>
  document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())

const settle = async () => {
  for (let i = 0; i < 4; i++) await nextTick()
}

const press = async (target: HTMLElement, key: string) => {
  await fireEvent.keyDown(target, { key })
  await settle()
}

const openWithKey = async (trigger: HTMLElement, key: string) => {
  trigger.focus()
  await press(trigger, key)
}

const waitForTypeaheadReset = () => new Promise((resolve) => setTimeout(resolve, 600))

const Fruits = defineComponent({
  props: {
    ariaLabel: { type: String, default: '' },
    inputId: { type: String, default: '' },
    label: { type: String, default: '' },
    disabledValue: { type: String, default: '' },
    startOpen: { type: Boolean, default: false }
  },
  setup(props) {
    const value = ref('')
    const open = ref(props.startOpen)
    const fruits = ['Apple', 'Banana', 'Blueberry', 'Cherry']
    return () =>
      h('div', [
        props.label ? h('label', { for: props.inputId }, props.label) : null,
        h(
          Select,
          {
            modelValue: value.value,
            open: open.value,
            ariaLabel: props.ariaLabel,
            inputId: props.inputId,
            'onUpdate:modelValue': (v: unknown) => {
              value.value = v as string
            },
            'onUpdate:open': (v: boolean) => {
              open.value = v
            }
          },
          () => [
            h(SelectTrigger),
            h(SelectContent, null, () =>
              fruits.map((fruit) =>
                h(
                  SelectOption,
                  {
                    key: fruit,
                    value: fruit.toLowerCase(),
                    disabled: fruit.toLowerCase() === props.disabledValue
                  },
                  () => fruit
                )
              )
            )
          ]
        )
      ])
  }
})

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
    expect(content?.querySelector('[role="listbox"]')).toBe(getListbox())
    expect(getByTestId('select-trigger').getAttribute('aria-controls')).toBe(getListbox()?.id)
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
    expect(getListbox()?.getAttribute('aria-multiselectable')).toBeNull()
    single.unmount()
    document.body.querySelectorAll('[data-testid="select-content"]').forEach((el) => el.remove())

    const multi = render(Host, { props: { multiple: true } })
    await fireEvent.click(multi.getByTestId('select-trigger'))
    expect(getListbox()?.getAttribute('aria-multiselectable')).toBe('true')
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

  describe('keyboard: single mode follows the select-only combobox pattern', () => {
    it('keeps focus on the trigger and points aria-activedescendant at the selected option', async () => {
      const { getByTestId } = render(Host, { props: { initial: 'opt-2' } })
      const trigger = getByTestId('select-trigger')

      await openWithKey(trigger, 'ArrowDown')

      const options = getOptions()
      expect(document.activeElement).toBe(trigger)
      expect(trigger.getAttribute('aria-activedescendant')).toBe(options[1].id)
      expect(options[1].hasAttribute('data-highlighted')).toBe(true)
      expect(options.every((option) => !option.hasAttribute('tabindex'))).toBe(true)
    })

    it('opens on ArrowUp on the first option when nothing is selected', async () => {
      const { getByTestId } = render(Host)
      const trigger = getByTestId('select-trigger')

      await openWithKey(trigger, 'ArrowUp')

      expect(getContent()).not.toBeNull()
      expect(trigger.getAttribute('aria-activedescendant')).toBe(getOptions()[0].id)
    })

    it('opens on Home and End on the first and the last option', async () => {
      const home = render(Host, { props: { initial: 'opt-2' } })
      await openWithKey(home.getByTestId('select-trigger'), 'Home')
      expect(home.getByTestId('select-trigger').getAttribute('aria-activedescendant')).toBe(
        getOptions()[0].id
      )
      home.unmount()
      removeStrayContent()

      const end = render(Host)
      await openWithKey(end.getByTestId('select-trigger'), 'End')
      const options = getOptions()
      expect(end.getByTestId('select-trigger').getAttribute('aria-activedescendant')).toBe(
        options[options.length - 1].id
      )
    })

    it('moves the active option with the arrows and wraps at both ends', async () => {
      const { getByTestId } = render(Host)
      const trigger = getByTestId('select-trigger')
      await openWithKey(trigger, 'ArrowDown')
      const options = getOptions()

      await press(trigger, 'ArrowUp')
      expect(trigger.getAttribute('aria-activedescendant')).toBe(options[2].id)
      await press(trigger, 'ArrowDown')
      expect(trigger.getAttribute('aria-activedescendant')).toBe(options[0].id)
      await press(trigger, 'ArrowDown')
      expect(trigger.getAttribute('aria-activedescendant')).toBe(options[1].id)
      expect(document.activeElement).toBe(trigger)
    })

    it('skips disabled options', async () => {
      const { getByTestId } = render(Fruits, { props: { disabledValue: 'banana' } })
      const trigger = getByTestId('select-trigger')
      await openWithKey(trigger, 'ArrowDown')

      await press(trigger, 'ArrowDown')

      expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByText('Blueberry').id)
    })

    it('selects the active option on Enter, closes and keeps focus on the trigger', async () => {
      const { getByTestId } = render(Host)
      const trigger = getByTestId('select-trigger')
      await openWithKey(trigger, 'ArrowDown')

      await press(trigger, 'ArrowDown')
      await press(trigger, 'Enter')

      expect(getContent()).toBeNull()
      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('opt-2')
      expect(document.activeElement).toBe(trigger)
      expect(trigger.hasAttribute('aria-activedescendant')).toBe(false)
    })

    it('closes on Escape without changing the value and keeps focus on the trigger', async () => {
      const { getByTestId } = render(Host, { props: { initial: 'opt-1' } })
      const trigger = getByTestId('select-trigger')
      await openWithKey(trigger, 'ArrowDown')

      await press(trigger, 'ArrowDown')
      await press(trigger, 'Escape')

      expect(getContent()).toBeNull()
      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('opt-1')
      expect(document.activeElement).toBe(trigger)
    })

    it('closes on Tab without selecting', async () => {
      const { getByTestId } = render(Host)
      const trigger = getByTestId('select-trigger')
      await openWithKey(trigger, 'ArrowDown')

      await press(trigger, 'ArrowDown')
      await press(trigger, 'Tab')

      expect(getContent()).toBeNull()
      expect(getByTestId('select-trigger__value').getAttribute('data-filled')).toBe('false')
    })

    it('typeahead opens the panel on the first match and cycles on a repeated character', async () => {
      const { getByTestId } = render(Fruits)
      const trigger = getByTestId('select-trigger')
      trigger.focus()

      await press(trigger, 'b')
      expect(getContent()).not.toBeNull()
      expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByText('Banana').id)

      await press(trigger, 'b')
      expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByText('Blueberry').id)

      await waitForTypeaheadReset()
      await press(trigger, 'c')
      expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByText('Cherry').id)

      await waitForTypeaheadReset()
      await press(trigger, 'b')
      await press(trigger, 'l')
      expect(trigger.getAttribute('aria-activedescendant')).toBe(optionByText('Blueberry').id)
    })

    it('returns focus to the trigger after picking an option with the pointer', async () => {
      const { getByTestId } = render(Host, { props: { startOpen: true } })
      const trigger = getByTestId('select-trigger')
      ;(document.activeElement as HTMLElement | null)?.blur()

      await fireEvent.click(getOptions()[2])

      expect(getContent()).toBeNull()
      expect(document.activeElement).toBe(trigger)
    })

    it('keeps focus on the trigger when an option is pressed', async () => {
      render(Host, { props: { startOpen: true } })

      const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
      getOptions()[0].dispatchEvent(mousedown)

      expect(mousedown.defaultPrevented).toBe(true)
    })
  })

  describe('keyboard: multiple mode follows the listbox pattern', () => {
    it('renders the trigger as a button that opens a listbox, not as a combobox', () => {
      const { getByTestId } = render(Host, { props: { multiple: true, required: true } })
      const trigger = getByTestId('select-trigger')

      expect(trigger.tagName).toBe('BUTTON')
      expect(trigger.hasAttribute('role')).toBe(false)
      expect(trigger.getAttribute('aria-haspopup')).toBe('listbox')
      expect(trigger.hasAttribute('aria-required')).toBe(false)
    })

    it('moves focus into the listbox and toggles the active option with Space and Enter', async () => {
      const { getByTestId } = render(Host, { props: { multiple: true } })
      const trigger = getByTestId('select-trigger')
      await openWithKey(trigger, 'Enter')

      const listbox = getListbox() as HTMLElement
      const options = getOptions()
      expect(document.activeElement).toBe(listbox)
      expect(listbox.getAttribute('aria-activedescendant')).toBe(options[0].id)

      await press(listbox, ' ')
      await press(listbox, 'ArrowDown')
      await press(listbox, 'ArrowDown')
      await press(listbox, 'Enter')

      expect(getContent()).not.toBeNull()
      expect(getOptions()[0].getAttribute('aria-selected')).toBe('true')
      expect(getOptions()[2].getAttribute('aria-selected')).toBe('true')
      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('opt-1, opt-3')
    })

    it('closes on Escape from the listbox and returns focus to the trigger', async () => {
      const { getByTestId } = render(Host, { props: { multiple: true } })
      const trigger = getByTestId('select-trigger')
      await openWithKey(trigger, 'ArrowDown')

      await press(getListbox() as HTMLElement, 'Escape')

      expect(getContent()).toBeNull()
      expect(document.activeElement).toBe(trigger)
    })

    it('marks the listbox required in multiple mode', async () => {
      const { getByTestId } = render(Host, { props: { multiple: true, required: true } })
      await fireEvent.click(getByTestId('select-trigger'))

      expect(getListbox()?.getAttribute('aria-required')).toBe('true')
    })
  })

  describe('accessible name', () => {
    it('names the trigger and the listbox from the ariaLabel prop', async () => {
      const { getByTestId } = render(Fruits, { props: { ariaLabel: 'Fruit' } })
      const trigger = getByTestId('select-trigger')

      expect(trigger.getAttribute('aria-label')).toBe('Fruit')
      await fireEvent.click(trigger)
      await settle()
      expect(getListbox()?.getAttribute('aria-label')).toBe('Fruit')
    })

    it('lets a label point at inputId and names the listbox from that label', async () => {
      const { getByTestId } = render(Fruits, { props: { inputId: 'fruit-field', label: 'Fruit' } })
      const trigger = getByTestId('select-trigger') as HTMLButtonElement

      expect(trigger.id).toBe('fruit-field')
      expect(trigger.hasAttribute('aria-label')).toBe(false)
      expect(trigger.labels?.[0]?.textContent?.trim()).toBe('Fruit')
      await fireEvent.click(trigger)
      await settle()
      expect(getListbox()?.getAttribute('aria-label')).toBe('Fruit')
    })

    it('gives every trigger a generated id when inputId is not set', () => {
      render({ setup: () => () => h('div', [h(Host), h(Host)]) })

      const ids = Array.from(document.querySelectorAll('[data-testid="select-trigger"]')).map(
        (trigger) => trigger.id
      )
      expect(ids.every(Boolean)).toBe(true)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('resolves the name and the active option when mounted already open', async () => {
      render(Fruits, { props: { ariaLabel: 'Fruit', startOpen: true } })
      await settle()

      expect(getListbox()?.getAttribute('aria-label')).toBe('Fruit')
      expect(
        document
          .querySelector('[data-testid="select-trigger"]')
          ?.getAttribute('aria-activedescendant')
      ).toBe(optionByText('Apple').id)
    })
  })

  describe('axe', () => {
    it('has no a11y violations on the closed, named combobox trigger', async () => {
      const { container } = render(Host, { props: { initial: 'opt-1' } })
      await expectNoA11yViolations(container)
    })

    it.each([
      ['single', false],
      ['multiple', true]
    ] as const)('has no a11y violations with the %s panel open', async (_mode, multiple) => {
      const { container, getByTestId } = render(Host, {
        props: { multiple, initial: multiple ? ['opt-2'] : 'opt-2' }
      })
      await openWithKey(getByTestId('select-trigger'), 'ArrowDown')

      expect(getContent()).not.toBeNull()
      await expectNoA11yViolations(container)
      await expectNoA11yViolations(getContent() as HTMLElement)
    })

    it.each([
      ['Default', Default],
      ['Multiple', Multiple],
      ['WithGroups', WithGroups],
      ['WithSearchAndFooter', WithSearchAndFooter]
    ] as const)('the %s story is axe-clean closed and open', async (_name, Story) => {
      const { container, getByTestId } = render(Story())
      await expectNoA11yViolations(container)

      await fireEvent.click(getByTestId('select-trigger'))
      await settle()
      expect(getContent()).not.toBeNull()
      await expectNoA11yViolations(container)
      await expectNoA11yViolations(getContent() as HTMLElement)
    })

    it('the Disabled story is axe-clean', async () => {
      const { container } = render(Disabled())
      await expectNoA11yViolations(container)
    })
  })

  describe('form participation', () => {
    it('submits the custom selection under name through hidden inputs', async () => {
      const { container } = render({
        setup: () => () =>
          h('form', [
            h(
              Select,
              {
                name: 'fruit',
                multiple: true,
                modelValue: ['apple', 'cherry'],
                ariaLabel: 'Fruit'
              },
              () => [
                h(SelectTrigger),
                h(SelectContent, null, () => [
                  h(SelectOption, { value: 'apple' }, () => 'Apple'),
                  h(SelectOption, { value: 'cherry' }, () => 'Cherry')
                ])
              ]
            )
          ])
      })

      const form = container.querySelector('form') as HTMLFormElement
      expect(new FormData(form).getAll('fruit')).toEqual(['apple', 'cherry'])
    })
  })

  describe('native mode', () => {
    it('renders a select with option and optgroup instead of the custom trigger and panel', () => {
      const { getByTestId, queryByTestId } = render(Native())
      const select = getByTestId('select__native') as HTMLSelectElement

      expect(select.tagName).toBe('SELECT')
      expect(select.id).toBe('native-fruit')
      expect(select.labels?.[0]?.textContent?.trim()).toBe('Fruit')
      expect(Array.from(select.querySelectorAll('optgroup')).map((g) => g.label)).toEqual([
        'Citrus',
        'Berries'
      ])
      expect(select.querySelectorAll('option:not([value=""])')).toHaveLength(4)
      expect(queryByTestId('select-trigger')).toBeNull()
      expect(getListbox()).toBeNull()
    })

    it('submits the picked value with its form and validates required natively', async () => {
      const { getByTestId } = render(Native())
      const select = getByTestId('select__native') as HTMLSelectElement
      const form = select.form as HTMLFormElement

      expect(select.required).toBe(true)
      expect(select.checkValidity()).toBe(false)

      select.value = 'orange'
      await fireEvent.change(select)

      expect(select.checkValidity()).toBe(true)
      expect(new FormData(form).get('fruit')).toBe('orange')
    })

    it('emits the original typed value and reflects modelValue back on the select', async () => {
      const { getByTestId, emitted, rerender } = render(Select, {
        props: { native: true, modelValue: 1, ariaLabel: 'Count' },
        slots: {
          default: () => [
            h(SelectTrigger),
            h(SelectContent, null, () => [
              h(SelectOption, { value: 1 }, () => 'One'),
              h(SelectOption, { value: 2 }, () => 'Two')
            ])
          ]
        }
      })
      const select = getByTestId('select__native') as HTMLSelectElement
      expect(select.value).toBe('1')

      select.value = '2'
      await fireEvent.change(select)
      expect(emitted()['update:modelValue']).toEqual([[2]])

      await rerender({ modelValue: 2 })
      expect(select.value).toBe('2')
    })

    it('submits every selected value in multiple mode and keeps disabled native', async () => {
      const { getByTestId, container } = render({
        setup: () => () =>
          h('form', [
            h(
              Select,
              {
                native: true,
                multiple: true,
                disabled: true,
                name: 'tags',
                modelValue: ['a', 'c'],
                ariaLabel: 'Tags'
              },
              () => [
                h(SelectTrigger),
                h(SelectContent, null, () =>
                  ['a', 'b', 'c'].map((v) =>
                    h(SelectOption, { key: v, value: v }, () => v.toUpperCase())
                  )
                )
              ]
            )
          ])
      })
      const select = getByTestId('select__native') as HTMLSelectElement

      expect(select.multiple).toBe(true)
      expect(select.disabled).toBe(true)
      select.disabled = false
      expect(
        new FormData(container.querySelector('form') as HTMLFormElement).getAll('tags')
      ).toEqual(['a', 'c'])
    })

    it('reverts a change and emits nothing when readonly', async () => {
      const { getByTestId, emitted } = render(Select, {
        props: { native: true, readonly: true, modelValue: 'a', ariaLabel: 'Letter' },
        slots: {
          default: () => [
            h(SelectContent, null, () => [
              h(SelectOption, { value: 'a' }, () => 'A'),
              h(SelectOption, { value: 'b' }, () => 'B')
            ])
          ]
        }
      })
      const select = getByTestId('select__native') as HTMLSelectElement

      select.value = 'b'
      await fireEvent.change(select)
      await nextTick()

      expect(emitted()['update:modelValue']).toBeUndefined()
      expect(select.value).toBe('a')
      expect(select.getAttribute('aria-readonly')).toBe('true')
    })

    it('the Native story is axe-clean', async () => {
      const { container } = render(Native())
      await expectNoA11yViolations(container)
    })
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
  // and the panel lands away from the trigger. Storybook's zoom control does
  // exactly this — it scales the preview body.
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
              h(SelectOption, { value: 'a', icon: 'pi pi-heart' }, () => 'With icon'),
              h(SelectOption, { value: 'b' }, () => 'Without icon')
            ])
          ])
      }
    })

    render(WithIcons)
    await nextTick()

    const boxes = Array.from(
      document.body.querySelectorAll('[data-testid="select-option__leading"]')
    ) as HTMLElement[]
    expect(boxes).toHaveLength(2)

    for (const box of boxes) {
      expect(box.className).toContain('size-4')
      expect(box.className).toContain('group-has-[[data-leading]]/options:flex')
    }

    // Only the iconed option is marked — that marker is what turns the column on.
    expect(boxes[0].hasAttribute('data-leading')).toBe(true)
    expect(boxes[1].hasAttribute('data-leading')).toBe(false)
    expect(boxes[0].querySelector('i.pi-heart')).not.toBeNull()
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
              h(SelectGroup, { label: 'A' }, () => [h(SelectOption, { value: 'a' }, () => 'A1')]),
              h(SelectGroup, { label: 'B' }, () => [h(SelectOption, { value: 'b' }, () => 'B1')])
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
