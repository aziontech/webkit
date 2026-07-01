import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/RadioButton.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import RadioButton from './radio-button.vue'

const { Default, Disabled } = composeStories(stories)

describe('RadioButton', () => {
  it('renders the root span, the native radio input and the default testid', () => {
    const { getByTestId } = render(RadioButton, {
      props: { value: 'a' }
    })

    const root = getByTestId('input-radio-button')
    expect(root.tagName).toBe('SPAN')

    const input = getByTestId('input-radio-button__input')
    expect(input.tagName).toBe('INPUT')
    expect(input.getAttribute('type')).toBe('radio')
  })

  it('honors a consumer-supplied data-testid on the root and the derived input testid', () => {
    const { getByTestId } = render(RadioButton, {
      props: { value: 'a' },
      attrs: { 'data-testid': 'my-radio' }
    })

    expect(getByTestId('my-radio').tagName).toBe('SPAN')
    expect(getByTestId('my-radio__input').tagName).toBe('INPUT')
  })

  it('forwards value, name and inputId to the native input', () => {
    const { getByTestId } = render(RadioButton, {
      props: { value: 'a', name: 'group-1', inputId: 'radio-a' }
    })

    const input = getByTestId('input-radio-button__input') as HTMLInputElement
    expect(input.getAttribute('value')).toBe('a')
    expect(input.getAttribute('name')).toBe('group-1')
    expect(input.getAttribute('id')).toBe('radio-a')
  })

  it('is unchecked and shows no indicator when modelValue does not match value', () => {
    const { getByTestId, queryByTestId } = render(RadioButton, {
      props: { modelValue: 'b', value: 'a' }
    })

    const root = getByTestId('input-radio-button')
    const input = getByTestId('input-radio-button__input') as HTMLInputElement

    expect(root.getAttribute('data-checked')).toBeNull()
    expect(input.checked).toBe(false)
    expect(input.getAttribute('aria-checked')).toBe('false')
    expect(queryByTestId('input-radio-button__indicator')).toBeNull()
  })

  it('is checked and shows the indicator when modelValue matches value', () => {
    const { getByTestId } = render(RadioButton, {
      props: { modelValue: 'a', value: 'a' }
    })

    const root = getByTestId('input-radio-button')
    const input = getByTestId('input-radio-button__input') as HTMLInputElement

    expect(root.hasAttribute('data-checked')).toBe(true)
    expect(input.checked).toBe(true)
    expect(input.getAttribute('aria-checked')).toBe('true')

    const indicator = getByTestId('input-radio-button__indicator')
    expect(indicator.getAttribute('aria-hidden')).toBe('true')
  })

  it('emits update:modelValue with its own value when the input changes', async () => {
    const { getByTestId, emitted } = render(RadioButton, {
      props: { modelValue: 'b', value: 'a' }
    })

    const input = getByTestId('input-radio-button__input')
    await fireEvent.change(input)

    const events = emitted()['update:modelValue']
    expect(events).toBeTruthy()
    expect(events).toHaveLength(1)
    expect(events[0]).toEqual(['a'])
  })

  it('drives v-model: the emitted value is the option value of the radio that changed', async () => {
    const { getByTestId, emitted } = render(RadioButton, {
      props: { modelValue: undefined, value: 'option-x' }
    })

    await fireEvent.change(getByTestId('input-radio-button__input'))

    const events = emitted()['update:modelValue']
    expect(events[0]).toEqual(['option-x'])
  })

  it('does NOT emit update:modelValue when disabled', async () => {
    const { getByTestId, emitted } = render(RadioButton, {
      props: { modelValue: 'b', value: 'a', disabled: true }
    })

    const input = getByTestId('input-radio-button__input') as HTMLInputElement
    expect(input.disabled).toBe(true)

    await fireEvent.change(input)

    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('sets data-disabled and the disabled attribute only when disabled is true', () => {
    const enabled = render(RadioButton, { props: { value: 'a' } })
    expect(enabled.getByTestId('input-radio-button').getAttribute('data-disabled')).toBeNull()
    expect(
      (enabled.getByTestId('input-radio-button__input') as HTMLInputElement).disabled
    ).toBe(false)
    enabled.unmount()

    const disabled = render(RadioButton, { props: { value: 'a', disabled: true } })
    expect(disabled.getByTestId('input-radio-button').hasAttribute('data-disabled')).toBe(true)
    expect(
      (disabled.getByTestId('input-radio-button__input') as HTMLInputElement).disabled
    ).toBe(true)
  })

  it('merges a consumer-supplied class onto the root span', () => {
    const { getByTestId } = render(RadioButton, {
      props: { value: 'a' },
      attrs: { class: 'consumer-class' }
    })

    expect(getByTestId('input-radio-button').classList.contains('consumer-class')).toBe(true)
  })

  it('passes through arbitrary attrs (e.g. aria-label) onto the native input', () => {
    const { getByTestId } = render(RadioButton, {
      props: { value: 'a' },
      attrs: { 'aria-label': 'Option A' }
    })

    expect(getByTestId('input-radio-button__input').getAttribute('aria-label')).toBe('Option A')
  })

  it('has no a11y violations when unchecked (with an accessible name)', async () => {
    const { container } = render(RadioButton, {
      props: { modelValue: 'b', value: 'a', name: 'g', inputId: 'r-a' },
      attrs: { 'aria-label': 'Option A' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when checked (with an accessible name)', async () => {
    const { container } = render(RadioButton, {
      props: { modelValue: 'a', value: 'a', name: 'g', inputId: 'r-a' },
      attrs: { 'aria-label': 'Option A' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when disabled (with an accessible name)', async () => {
    const { container } = render(RadioButton, {
      props: { modelValue: 'a', value: 'a', disabled: true, name: 'g', inputId: 'r-a' },
      attrs: { 'aria-label': 'Option A' }
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
