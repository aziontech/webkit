import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/field-radio-block/FieldRadioBlock.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FieldRadioBlock from './field-radio-block.vue'

const { Default, Disabled } = composeStories(stories)

describe('FieldRadioBlock', () => {
  it('renders the label root, the card, the composed control and the default testid', () => {
    const { getByTestId } = render(FieldRadioBlock, {
      props: { value: 'a', label: 'Plan A' }
    })

    const root = getByTestId('input-field-radio-block')
    expect(root.tagName).toBe('LABEL')

    expect(getByTestId('input-field-radio-block__card')).toBeTruthy()
    expect(getByTestId('input-field-radio-block__control')).toBeTruthy()
    expect(getByTestId('input-field-radio-block__texts')).toBeTruthy()
  })

  it('honors a consumer-supplied data-testid and derives the child testids from it', () => {
    const { getByTestId } = render(FieldRadioBlock, {
      props: { value: 'a', label: 'Plan A' },
      attrs: { 'data-testid': 'my-block' }
    })

    expect(getByTestId('my-block').tagName).toBe('LABEL')
    expect(getByTestId('my-block__card')).toBeTruthy()
    expect(getByTestId('my-block__control')).toBeTruthy()
    expect(getByTestId('my-block__texts')).toBeTruthy()
  })

  it('links the label to the native input via the provided inputId (for/id)', () => {
    const { getByTestId } = render(FieldRadioBlock, {
      props: { value: 'a', label: 'Plan A', inputId: 'radio-a' }
    })

    const root = getByTestId('input-field-radio-block')
    expect(root.getAttribute('for')).toBe('radio-a')

    const input = getByTestId('input-field-radio-block__control__input') as HTMLInputElement
    expect(input.getAttribute('id')).toBe('radio-a')
  })

  it('generates a matching for/id pair when no inputId is supplied', () => {
    const { getByTestId } = render(FieldRadioBlock, {
      props: { value: 'a', label: 'Plan A' }
    })

    const root = getByTestId('input-field-radio-block')
    const input = getByTestId('input-field-radio-block__control__input') as HTMLInputElement

    const forAttr = root.getAttribute('for')
    expect(forAttr).toBeTruthy()
    expect(input.getAttribute('id')).toBe(forAttr)
  })

  it('renders the label and description texts from props', () => {
    const { getByTestId } = render(FieldRadioBlock, {
      props: { value: 'a', label: 'Plan A', description: 'Best value' }
    })

    expect(getByTestId('input-field-radio-block__label').textContent?.trim()).toBe('Plan A')
    expect(getByTestId('input-field-radio-block__description').textContent?.trim()).toBe(
      'Best value'
    )
  })

  it('omits the label and description nodes when those props are empty', () => {
    const { queryByTestId } = render(FieldRadioBlock, {
      props: { value: 'a' }
    })

    expect(queryByTestId('input-field-radio-block__label')).toBeNull()
    expect(queryByTestId('input-field-radio-block__description')).toBeNull()
  })

  it('forwards value and name onto the composed native radio input', () => {
    const { getByTestId } = render(FieldRadioBlock, {
      props: { value: 'plan-a', name: 'group-1', label: 'Plan A' }
    })

    const input = getByTestId('input-field-radio-block__control__input') as HTMLInputElement
    expect(input.getAttribute('type')).toBe('radio')
    expect(input.getAttribute('value')).toBe('plan-a')
    expect(input.getAttribute('name')).toBe('group-1')
  })

  it('marks the card as selected and checks the input when modelValue matches value', () => {
    const { getByTestId } = render(FieldRadioBlock, {
      props: { modelValue: 'a', value: 'a', label: 'Plan A' }
    })

    expect(getByTestId('input-field-radio-block__card').hasAttribute('data-selected')).toBe(true)

    const input = getByTestId('input-field-radio-block__control__input') as HTMLInputElement
    expect(input.checked).toBe(true)
    expect(input.getAttribute('aria-checked')).toBe('true')
  })

  it('leaves the card unselected and the input unchecked when modelValue does not match', () => {
    const { getByTestId } = render(FieldRadioBlock, {
      props: { modelValue: 'b', value: 'a', label: 'Plan A' }
    })

    expect(getByTestId('input-field-radio-block__card').getAttribute('data-selected')).toBeNull()

    const input = getByTestId('input-field-radio-block__control__input') as HTMLInputElement
    expect(input.checked).toBe(false)
    expect(input.getAttribute('aria-checked')).toBe('false')
  })

  it('emits update:modelValue with its own value when the native radio changes', async () => {
    const { getByTestId, emitted } = render(FieldRadioBlock, {
      props: { modelValue: 'b', value: 'a', label: 'Plan A' }
    })

    await fireEvent.change(getByTestId('input-field-radio-block__control__input'))

    const events = emitted()['update:modelValue']
    expect(events).toBeTruthy()
    expect(events).toHaveLength(1)
    expect(events[0]).toEqual(['a'])
  })

  it('drives v-model: the emitted value is this instance own option value', async () => {
    const { getByTestId, emitted } = render(FieldRadioBlock, {
      props: { modelValue: undefined, value: 'option-x', label: 'Option X' }
    })

    await fireEvent.change(getByTestId('input-field-radio-block__control__input'))

    const events = emitted()['update:modelValue']
    expect(events[0]).toEqual(['option-x'])
  })

  it('does NOT emit update:modelValue when disabled', async () => {
    const { getByTestId, emitted } = render(FieldRadioBlock, {
      props: { modelValue: 'b', value: 'a', disabled: true, label: 'Plan A' }
    })

    const input = getByTestId('input-field-radio-block__control__input') as HTMLInputElement
    expect(input.disabled).toBe(true)

    await fireEvent.change(input)

    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('reflects data-disabled on the label, card and texts only when disabled', () => {
    const enabled = render(FieldRadioBlock, { props: { value: 'a', label: 'Plan A' } })
    expect(enabled.getByTestId('input-field-radio-block').getAttribute('data-disabled')).toBeNull()
    expect(
      enabled.getByTestId('input-field-radio-block__card').getAttribute('data-disabled')
    ).toBeNull()
    expect(
      enabled.getByTestId('input-field-radio-block__texts').getAttribute('data-disabled')
    ).toBeNull()
    enabled.unmount()

    const disabled = render(FieldRadioBlock, {
      props: { value: 'a', label: 'Plan A', disabled: true }
    })
    expect(disabled.getByTestId('input-field-radio-block').hasAttribute('data-disabled')).toBe(true)
    expect(
      disabled.getByTestId('input-field-radio-block__card').hasAttribute('data-disabled')
    ).toBe(true)
    expect(
      disabled.getByTestId('input-field-radio-block__texts').hasAttribute('data-disabled')
    ).toBe(true)
  })

  it('renders the helper badge only when both disabled and helperText are present', () => {
    const noHelperEnabled = render(FieldRadioBlock, {
      props: { value: 'a', label: 'Plan A', helperText: 'Locked' }
    })
    expect(noHelperEnabled.queryByTestId('input-field-radio-block__helper')).toBeNull()
    noHelperEnabled.unmount()

    const disabledNoText = render(FieldRadioBlock, {
      props: { value: 'a', label: 'Plan A', disabled: true }
    })
    expect(disabledNoText.queryByTestId('input-field-radio-block__helper')).toBeNull()
    disabledNoText.unmount()

    const withHelper = render(FieldRadioBlock, {
      props: { value: 'a', label: 'Plan A', disabled: true, helperText: 'Locked' }
    })
    expect(withHelper.getByTestId('input-field-radio-block__helper')).toBeTruthy()
    expect(withHelper.getByTestId('input-field-radio-block__helper-text').textContent?.trim()).toBe(
      'Locked'
    )
    expect(
      withHelper.getByTestId('input-field-radio-block__helper-icon').getAttribute('aria-hidden')
    ).toBe('true')
  })

  it('merges a consumer-supplied class onto the label root', () => {
    const { getByTestId } = render(FieldRadioBlock, {
      props: { value: 'a', label: 'Plan A' },
      attrs: { class: 'consumer-class' }
    })

    expect(getByTestId('input-field-radio-block').classList.contains('consumer-class')).toBe(true)
  })

  it.each([
    ['unselected', { modelValue: 'b', value: 'a' }],
    ['selected', { modelValue: 'a', value: 'a' }]
  ])('renders the %s state with the expected selected flag', (_label, props) => {
    const { getByTestId } = render(FieldRadioBlock, {
      props: { ...props, name: 'g', inputId: 'radio-a', label: 'Plan A' }
    })

    const selected = getByTestId('input-field-radio-block__card').hasAttribute('data-selected')
    expect(selected).toBe(props.modelValue === props.value)
  })

  it('has no a11y violations when unselected', async () => {
    const { container } = render(FieldRadioBlock, {
      props: { modelValue: 'b', value: 'a', name: 'g', inputId: 'radio-a', label: 'Plan A' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when selected', async () => {
    const { container } = render(FieldRadioBlock, {
      props: { modelValue: 'a', value: 'a', name: 'g', inputId: 'radio-a', label: 'Plan A' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when disabled with a helper badge', async () => {
    const { container } = render(FieldRadioBlock, {
      props: {
        modelValue: 'a',
        value: 'a',
        name: 'g',
        inputId: 'radio-a',
        label: 'Plan A',
        disabled: true,
        helperText: 'Locked'
      }
    })

    await expectNoA11yViolations(container)
  })

  it('renders the Default story fixture cleanly', async () => {
    const { container } = render(Default())

    await expectNoA11yViolations(container)
  })

  it('renders the Disabled story fixture cleanly', async () => {
    const { container } = render(Disabled())

    await expectNoA11yViolations(container)
  })
})
