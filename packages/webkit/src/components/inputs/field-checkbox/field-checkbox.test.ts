import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/FieldCheckbox.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FieldCheckbox from './field-checkbox.vue'

const { Default, Disabled } = composeStories(stories)

const ROOT = 'input-field-checkbox'
const CONTROL = `${ROOT}__control`
const INPUT = `${CONTROL}__input`

describe('FieldCheckbox', () => {
  it('renders the label root, the composed checkbox control and the native checkbox input', () => {
    const { getByTestId } = render(FieldCheckbox, {
      props: { label: 'Accept' }
    })

    const root = getByTestId(ROOT)
    expect(root.tagName).toBe('LABEL')

    const control = getByTestId(CONTROL)
    expect(control.tagName).toBe('SPAN')

    const input = getByTestId(INPUT) as HTMLInputElement
    expect(input.tagName).toBe('INPUT')
    expect(input.getAttribute('type')).toBe('checkbox')
  })

  it('honors a consumer-supplied data-testid on the root and the derived control/input testids', () => {
    const { getByTestId } = render(FieldCheckbox, {
      props: { label: 'Accept' },
      attrs: { 'data-testid': 'my-field' }
    })

    expect(getByTestId('my-field').tagName).toBe('LABEL')
    expect(getByTestId('my-field__control').tagName).toBe('SPAN')
    expect(getByTestId('my-field__control__input').tagName).toBe('INPUT')
  })

  it('associates the label root with the native input via a generated id when inputId is omitted', () => {
    const { getByTestId } = render(FieldCheckbox, {
      props: { label: 'Accept' }
    })

    const forAttr = getByTestId(ROOT).getAttribute('for')
    const inputId = getByTestId(INPUT).getAttribute('id')

    expect(forAttr).toBeTruthy()
    expect(inputId).toBeTruthy()
    expect(forAttr).toBe(inputId)
  })

  it('uses the supplied inputId for both the label "for" and the native input id', () => {
    const { getByTestId } = render(FieldCheckbox, {
      props: { label: 'Accept', inputId: 'fc-1' }
    })

    expect(getByTestId(ROOT).getAttribute('for')).toBe('fc-1')
    expect(getByTestId(INPUT).getAttribute('id')).toBe('fc-1')
  })

  it('forwards the name prop to the native input', () => {
    const { getByTestId } = render(FieldCheckbox, {
      props: { label: 'Accept', name: 'terms' }
    })

    expect(getByTestId(INPUT).getAttribute('name')).toBe('terms')
  })

  it('renders the label and description text from props', () => {
    const { getByTestId } = render(FieldCheckbox, {
      props: { label: 'Enable notifications', description: 'You can turn this off later' }
    })

    expect(getByTestId(`${ROOT}__label`).textContent?.trim()).toBe('Enable notifications')
    expect(getByTestId(`${ROOT}__description`).textContent?.trim()).toBe(
      'You can turn this off later'
    )
  })

  it('omits the label and description spans when the props are empty', () => {
    const { queryByTestId } = render(FieldCheckbox, {
      props: {}
    })

    expect(queryByTestId(`${ROOT}__label`)).toBeNull()
    expect(queryByTestId(`${ROOT}__description`)).toBeNull()
  })

  it('is unchecked when modelValue does not equal trueValue', () => {
    const { getByTestId } = render(FieldCheckbox, {
      props: { modelValue: false, label: 'Accept' }
    })

    expect((getByTestId(INPUT) as HTMLInputElement).checked).toBe(false)
    expect(getByTestId(CONTROL).getAttribute('data-checked')).toBeNull()
  })

  it('is checked when modelValue equals trueValue', () => {
    const { getByTestId } = render(FieldCheckbox, {
      props: { modelValue: true, label: 'Accept' }
    })

    expect((getByTestId(INPUT) as HTMLInputElement).checked).toBe(true)
    expect(getByTestId(CONTROL).hasAttribute('data-checked')).toBe(true)
  })

  it('emits update:modelValue with true when toggled on from an unchecked state', async () => {
    const { getByTestId, emitted } = render(FieldCheckbox, {
      props: { modelValue: false, label: 'Accept' }
    })

    await fireEvent.change(getByTestId(INPUT))

    const events = emitted()['update:modelValue']
    expect(events).toBeTruthy()
    expect(events).toHaveLength(1)
    expect(events[0]).toEqual([true])
  })

  it('emits update:modelValue with false when toggled off from a checked state', async () => {
    const { getByTestId, emitted } = render(FieldCheckbox, {
      props: { modelValue: true, label: 'Accept' }
    })

    await fireEvent.change(getByTestId(INPUT))

    const events = emitted()['update:modelValue']
    expect(events).toBeTruthy()
    expect(events).toHaveLength(1)
    expect(events[0]).toEqual([false])
  })

  it('emits the custom trueValue/falseValue payloads instead of raw booleans', async () => {
    const onModel = render(FieldCheckbox, {
      props: { modelValue: 'no', trueValue: 'yes', falseValue: 'no', label: 'Accept' }
    })

    await fireEvent.change(onModel.getByTestId(INPUT))

    expect(onModel.emitted()['update:modelValue'][0]).toEqual(['yes'])
    onModel.unmount()

    const offModel = render(FieldCheckbox, {
      props: { modelValue: 'yes', trueValue: 'yes', falseValue: 'no', label: 'Accept' }
    })

    await fireEvent.change(offModel.getByTestId(INPUT))

    expect(offModel.emitted()['update:modelValue'][0]).toEqual(['no'])
  })

  it('reflects the checked state against a custom trueValue', () => {
    const { getByTestId } = render(FieldCheckbox, {
      props: { modelValue: 'yes', trueValue: 'yes', falseValue: 'no', label: 'Accept' }
    })

    expect((getByTestId(INPUT) as HTMLInputElement).checked).toBe(true)
  })

  it('does NOT emit update:modelValue when disabled and sets data-disabled on the root', async () => {
    const { getByTestId, emitted } = render(FieldCheckbox, {
      props: { modelValue: false, disabled: true, label: 'Accept' }
    })

    expect(getByTestId(ROOT).hasAttribute('data-disabled')).toBe(true)

    const input = getByTestId(INPUT) as HTMLInputElement
    expect(input.disabled).toBe(true)

    await fireEvent.change(input)

    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('does not set data-disabled on the root when enabled', () => {
    const { getByTestId } = render(FieldCheckbox, {
      props: { label: 'Accept' }
    })

    expect(getByTestId(ROOT).getAttribute('data-disabled')).toBeNull()
    expect((getByTestId(INPUT) as HTMLInputElement).disabled).toBe(false)
  })

  it('shows the helper badge only when disabled AND helperText is provided', () => {
    const enabled = render(FieldCheckbox, {
      props: { label: 'Accept', helperText: 'Locked', disabled: false }
    })
    expect(enabled.queryByTestId(`${ROOT}__helper`)).toBeNull()
    enabled.unmount()

    const disabledNoText = render(FieldCheckbox, {
      props: { label: 'Accept', disabled: true }
    })
    expect(disabledNoText.queryByTestId(`${ROOT}__helper`)).toBeNull()
    disabledNoText.unmount()

    const disabledWithText = render(FieldCheckbox, {
      props: { label: 'Accept', helperText: 'Locked', disabled: true }
    })
    const helper = disabledWithText.getByTestId(`${ROOT}__helper`)
    expect(helper).toBeTruthy()
    expect(disabledWithText.getByTestId(`${ROOT}__helper-text`).textContent?.trim()).toBe('Locked')
    expect(
      disabledWithText.getByTestId(`${ROOT}__helper-icon`).getAttribute('aria-hidden')
    ).toBe('true')
  })

  it('merges a consumer-supplied class onto the label root', () => {
    const { getByTestId } = render(FieldCheckbox, {
      props: { label: 'Accept' },
      attrs: { class: 'consumer-class' }
    })

    expect(getByTestId(ROOT).classList.contains('consumer-class')).toBe(true)
  })

  it('has no a11y violations when unchecked', async () => {
    const { container } = render(FieldCheckbox, {
      props: { modelValue: false, label: 'Accept terms', inputId: 'fc-a' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when checked', async () => {
    const { container } = render(FieldCheckbox, {
      props: { modelValue: true, label: 'Accept terms', inputId: 'fc-b' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when disabled with a helper badge', async () => {
    const { container } = render(FieldCheckbox, {
      props: { modelValue: true, disabled: true, helperText: 'Locked', label: 'Accept terms', inputId: 'fc-c' }
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
