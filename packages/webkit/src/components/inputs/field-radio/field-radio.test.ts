import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/FieldRadio.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FieldRadio from './field-radio.vue'

const { Default, Disabled } = composeStories(stories)

describe('FieldRadio', () => {
  it('renders the div root with the default testid and wires the label for/input id', () => {
    const { getByTestId } = render(FieldRadio, {
      props: { value: 'a', inputId: 'radio-a', label: 'Option A' }
    })

    const root = getByTestId('input-field-radio')
    expect(root.tagName).toBe('DIV')
    expect(getByTestId('input-field-radio__label').getAttribute('for')).toBe('radio-a')

    const input = getByTestId('input-field-radio__control__input') as HTMLInputElement
    expect(input.tagName).toBe('INPUT')
    expect(input.getAttribute('type')).toBe('radio')
    expect(input.getAttribute('id')).toBe('radio-a')
  })

  it('honors a consumer-supplied data-testid across the root and derived parts', () => {
    const { getByTestId } = render(FieldRadio, {
      props: { value: 'a', label: 'Option A', description: 'desc' },
      attrs: { 'data-testid': 'my-field' }
    })

    expect(getByTestId('my-field').tagName).toBe('DIV')
    expect(getByTestId('my-field__control').tagName).toBe('SPAN')
    expect(getByTestId('my-field__texts')).toBeTruthy()
    expect(getByTestId('my-field__label').textContent).toContain('Option A')
    expect(getByTestId('my-field__description').textContent).toContain('desc')
  })

  it('renders label and description text when provided', () => {
    const { getByTestId } = render(FieldRadio, {
      props: { value: 'a', label: 'Primary', description: 'Secondary' }
    })

    expect(getByTestId('input-field-radio__label').textContent).toContain('Primary')
    expect(getByTestId('input-field-radio__description').textContent).toContain('Secondary')
  })

  it('omits label and description nodes when those props are empty', () => {
    const { queryByTestId } = render(FieldRadio, {
      props: { value: 'a' }
    })

    expect(queryByTestId('input-field-radio__label')).toBeNull()
    expect(queryByTestId('input-field-radio__description')).toBeNull()
  })

  it('forwards value and name to the underlying native radio input', () => {
    const { getByTestId } = render(FieldRadio, {
      props: { value: 'opt-a', name: 'group-1', inputId: 'radio-a' }
    })

    const input = getByTestId('input-field-radio__control__input') as HTMLInputElement
    expect(input.getAttribute('value')).toBe('opt-a')
    expect(input.getAttribute('name')).toBe('group-1')
  })

  it('reflects checked state through the control when modelValue matches value', () => {
    const checked = render(FieldRadio, {
      props: { modelValue: 'a', value: 'a', label: 'A' }
    })
    const checkedInput = checked.getByTestId(
      'input-field-radio__control__input'
    ) as HTMLInputElement
    expect(checkedInput.checked).toBe(true)
    expect(checkedInput.getAttribute('aria-checked')).toBe('true')
    checked.unmount()

    const unchecked = render(FieldRadio, {
      props: { modelValue: 'b', value: 'a', label: 'A' }
    })
    const uncheckedInput = unchecked.getByTestId(
      'input-field-radio__control__input'
    ) as HTMLInputElement
    expect(uncheckedInput.checked).toBe(false)
    expect(uncheckedInput.getAttribute('aria-checked')).toBe('false')
  })

  it('emits update:modelValue with its own value when the input changes', async () => {
    const { getByTestId, emitted } = render(FieldRadio, {
      props: { modelValue: 'b', value: 'a' }
    })

    await fireEvent.change(getByTestId('input-field-radio__control__input'))

    const events = emitted()['update:modelValue']
    expect(events).toBeTruthy()
    expect(events).toHaveLength(1)
    expect(events[0]).toEqual(['a'])
  })

  it('drives v-model: emits the option value from an undefined starting selection', async () => {
    const { getByTestId, emitted } = render(FieldRadio, {
      props: { modelValue: undefined, value: 'option-x' }
    })

    await fireEvent.change(getByTestId('input-field-radio__control__input'))

    const events = emitted()['update:modelValue']
    expect(events[0]).toEqual(['option-x'])
  })

  it('does NOT emit update:modelValue when disabled', async () => {
    const { getByTestId, emitted } = render(FieldRadio, {
      props: { modelValue: 'b', value: 'a', disabled: true }
    })

    const input = getByTestId('input-field-radio__control__input') as HTMLInputElement
    expect(input.disabled).toBe(true)

    await fireEvent.change(input)

    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('sets data-disabled on the root and texts only when disabled is true', () => {
    const enabled = render(FieldRadio, { props: { value: 'a', label: 'A' } })
    expect(enabled.getByTestId('input-field-radio').getAttribute('data-disabled')).toBeNull()
    expect(enabled.getByTestId('input-field-radio__texts').getAttribute('data-disabled')).toBeNull()
    enabled.unmount()

    const disabled = render(FieldRadio, { props: { value: 'a', label: 'A', disabled: true } })
    expect(disabled.getByTestId('input-field-radio').hasAttribute('data-disabled')).toBe(true)
    expect(disabled.getByTestId('input-field-radio__texts').hasAttribute('data-disabled')).toBe(
      true
    )
  })

  it('shows the disabled helper badge only when disabled and helperText are both set', () => {
    const withoutDisabled = render(FieldRadio, {
      props: { value: 'a', label: 'A', helperText: 'Locked' }
    })
    expect(withoutDisabled.queryByTestId('input-field-radio__helper')).toBeNull()
    withoutDisabled.unmount()

    const disabledNoHelper = render(FieldRadio, {
      props: { value: 'a', label: 'A', disabled: true }
    })
    expect(disabledNoHelper.queryByTestId('input-field-radio__helper')).toBeNull()
    disabledNoHelper.unmount()

    const withBoth = render(FieldRadio, {
      props: { value: 'a', label: 'A', disabled: true, helperText: 'Locked' }
    })
    expect(withBoth.getByTestId('input-field-radio__helper')).toBeTruthy()
    expect(withBoth.getByTestId('input-field-radio__helper-text').textContent).toContain('Locked')
    expect(withBoth.getByTestId('input-field-radio__helper-icon').getAttribute('aria-hidden')).toBe(
      'true'
    )
  })

  it('merges a consumer-supplied class onto the root', () => {
    const { getByTestId } = render(FieldRadio, {
      props: { value: 'a' },
      attrs: { class: 'consumer-class' }
    })

    expect(getByTestId('input-field-radio').classList.contains('consumer-class')).toBe(true)
  })

  it('has no a11y violations for an unchecked radio with a label', async () => {
    const { container } = render(FieldRadio, {
      props: { modelValue: 'b', value: 'a', name: 'g', inputId: 'r-a', label: 'Option A' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations for a checked radio with a label', async () => {
    const { container } = render(FieldRadio, {
      props: { modelValue: 'a', value: 'a', name: 'g', inputId: 'r-a', label: 'Option A' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations for a disabled radio with helper text', async () => {
    const { container } = render(FieldRadio, {
      props: {
        modelValue: 'a',
        value: 'a',
        disabled: true,
        name: 'g',
        inputId: 'r-a',
        label: 'Option A',
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
