import { userEvent } from '@storybook/test'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import FieldTime from './field-time.vue'

const getInput = (getByTestId: (id: string) => HTMLElement, testId = 'input-field-time') =>
  getByTestId(`${testId}__input`) as HTMLInputElement

const lastEmitted = (emitted: () => Record<string, unknown[][]>) => {
  const events = emitted()['update:modelValue'] ?? []
  return events[events.length - 1]?.[0]
}

describe('FieldTime — render', () => {
  it('renders the root with the default data-testid and its parts', () => {
    const { getByTestId } = render(FieldTime, { props: { label: 'Start time' } })
    expect(getByTestId('input-field-time')).toBeTruthy()
    expect(getByTestId('input-field-time__label')).toBeTruthy()
    expect(getByTestId('input-field-time__input')).toBeTruthy()
    expect(getByTestId('input-field-time__helper')).toBeTruthy()
  })

  it('honors a consumer data-testid on the root and its parts', () => {
    const { getByTestId } = render(FieldTime, {
      props: { label: 'Start time' },
      attrs: { 'data-testid': 'start-time' }
    })
    expect(getByTestId('start-time')).toBeTruthy()
    expect(getByTestId('start-time__label')).toBeTruthy()
    expect(getByTestId('start-time__input')).toBeTruthy()
    expect(getByTestId('start-time__helper')).toBeTruthy()
  })

  it('omits the label row when no label is provided', () => {
    const { queryByTestId } = render(FieldTime)
    expect(queryByTestId('input-field-time__label')).toBeNull()
  })

  it('emits nothing on mount', () => {
    const { emitted } = render(FieldTime, { props: { modelValue: '9:30' } })
    expect(emitted()['update:modelValue']).toBeUndefined()
  })
})

describe('FieldTime — format', () => {
  it('uses maxlength 5, the HH:MM placeholder and the matching hint for hh:mm', () => {
    const { getByTestId } = render(FieldTime)
    const input = getInput(getByTestId)
    expect(input.maxLength).toBe(5)
    expect(input.placeholder).toBe('HH:MM')
    expect(getByTestId('input-field-time__helper').textContent).toContain('24-hour, HH:MM')
    expect(getByTestId('input-field-time').getAttribute('data-format')).toBe('hh:mm')
  })

  it('uses maxlength 8, the HH:MM:SS placeholder and the matching hint for hh:mm:ss', () => {
    const { getByTestId } = render(FieldTime, { props: { format: 'hh:mm:ss' } })
    const input = getInput(getByTestId)
    expect(input.maxLength).toBe(8)
    expect(input.placeholder).toBe('HH:MM:SS')
    expect(getByTestId('input-field-time__helper').textContent).toContain('24-hour, HH:MM:SS')
    expect(getByTestId('input-field-time').getAttribute('data-format')).toBe('hh:mm:ss')
  })

  it('prefers a consumer placeholder and helper text', () => {
    const { getByTestId } = render(FieldTime, {
      props: { placeholder: 'e.g. 09:30', helperText: 'Time in UTC.' }
    })
    expect(getInput(getByTestId).placeholder).toBe('e.g. 09:30')
    const helper = getByTestId('input-field-time__helper')
    expect(helper.textContent).toContain('Time in UTC.')
    expect(helper.textContent).not.toContain('24-hour')
  })

  it('sets inputmode numeric and type text on the native input', () => {
    const { getByTestId } = render(FieldTime)
    const input = getInput(getByTestId)
    expect(input.getAttribute('inputmode')).toBe('numeric')
    expect(input.getAttribute('type')).toBe('text')
  })
})

describe('FieldTime — masking', () => {
  it('inserts the colon as digits are typed', async () => {
    const { getByTestId, emitted } = render(FieldTime)
    const input = getInput(getByTestId)
    await userEvent.type(input, '0930')
    expect(input.value).toBe('09:30')
    expect(lastEmitted(emitted)).toBe('09:30')
  })

  it('pads a one-digit segment followed by a colon', async () => {
    const { getByTestId, emitted } = render(FieldTime)
    const input = getInput(getByTestId)
    await userEvent.type(input, '9:30')
    expect(input.value).toBe('09:30')
    expect(lastEmitted(emitted)).toBe('09:30')
  })

  it('masks seconds for hh:mm:ss', async () => {
    const { getByTestId, emitted } = render(FieldTime, { props: { format: 'hh:mm:ss' } })
    const input = getInput(getByTestId)
    await userEvent.type(input, '140530')
    expect(input.value).toBe('14:05:30')
    expect(lastEmitted(emitted)).toBe('14:05:30')
  })

  it('strips characters that are not digits or colons', async () => {
    const { getByTestId, emitted } = render(FieldTime)
    const input = getInput(getByTestId)
    await fireEvent.update(input, '1a2b3c4')
    expect(input.value).toBe('12:34')
    expect(lastEmitted(emitted)).toBe('12:34')
  })

  it('never leaves a trailing colon', async () => {
    const { getByTestId } = render(FieldTime)
    const input = getInput(getByTestId)
    await fireEvent.update(input, '12:')
    expect(input.value).toBe('12')
  })

  it('re-masks a seeded value for display without rewriting the model', () => {
    const { getByTestId, emitted } = render(FieldTime, { props: { modelValue: '9:30' } })
    expect(getInput(getByTestId).value).toBe('09:30')
    expect(emitted()['update:modelValue']).toBeUndefined()
  })
})

describe('FieldTime — format error', () => {
  it('turns invalid immediately on a complete out-of-range value', async () => {
    const { getByTestId } = render(FieldTime)
    const input = getInput(getByTestId)
    await userEvent.type(input, '2561')
    expect(input.value).toBe('25:61')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(getByTestId('input-field-time').getAttribute('data-invalid')).toBe('true')
    const helper = getByTestId('input-field-time__helper')
    expect(helper.getAttribute('data-kind')).toBe('invalid')
    expect(helper.textContent).toContain('24-hour, HH:MM')
  })

  it('shows a complete in-range value as valid', () => {
    const { getByTestId } = render(FieldTime, { props: { modelValue: '23:59' } })
    expect(getInput(getByTestId).getAttribute('aria-invalid')).toBeNull()
    expect(getByTestId('input-field-time').getAttribute('data-invalid')).toBeNull()
  })

  it('turns invalid on blur when the value is incomplete, and clears once complete', async () => {
    const { getByTestId } = render(FieldTime)
    const input = getInput(getByTestId)
    await userEvent.type(input, '093')
    expect(input.getAttribute('aria-invalid')).toBeNull()
    await userEvent.tab()
    expect(input.getAttribute('aria-invalid')).toBe('true')
    await userEvent.type(input, '0')
    expect(input.value).toBe('09:30')
    expect(input.getAttribute('aria-invalid')).toBeNull()
  })

  it('never reports an empty field as a format error', async () => {
    const { getByTestId } = render(FieldTime)
    const input = getInput(getByTestId)
    await userEvent.click(input)
    await userEvent.tab()
    expect(input.getAttribute('aria-invalid')).toBeNull()
    expect(getByTestId('input-field-time__helper').getAttribute('data-kind')).toBe('helper')
  })

  it('forces the invalid state through the invalid prop', () => {
    const { getByTestId } = render(FieldTime, { props: { invalid: true } })
    expect(getInput(getByTestId).getAttribute('aria-invalid')).toBe('true')
    expect(getByTestId('input-field-time__helper').getAttribute('data-kind')).toBe('invalid')
  })
})

describe('FieldTime — states', () => {
  it('sets native required, aria-required, data-required and the required helper kind', () => {
    const { getByTestId } = render(FieldTime, { props: { label: 'Start time', required: true } })
    const input = getInput(getByTestId)
    expect(input.required).toBe(true)
    expect(input.getAttribute('aria-required')).toBe('true')
    expect(getByTestId('input-field-time').getAttribute('data-required')).toBe('true')
    expect(getByTestId('input-field-time__helper').getAttribute('data-kind')).toBe('required')
  })

  it('ranks invalid above required in the helper kind', () => {
    const { getByTestId } = render(FieldTime, { props: { required: true, invalid: true } })
    expect(getByTestId('input-field-time__helper').getAttribute('data-kind')).toBe('invalid')
  })

  it('ranks disabled above invalid and required in the helper kind', () => {
    const { getByTestId } = render(FieldTime, {
      props: { disabled: true, required: true, modelValue: '25:70' }
    })
    const input = getInput(getByTestId)
    expect(input.disabled).toBe(true)
    expect(getByTestId('input-field-time').getAttribute('data-disabled')).toBe('true')
    expect(getByTestId('input-field-time__helper').getAttribute('data-kind')).toBe('disabled')
  })

  it('marks the input readonly and keeps it from editing', async () => {
    const { getByTestId, emitted } = render(FieldTime, {
      props: { readonly: true, modelValue: '09:30' }
    })
    const input = getInput(getByTestId)
    expect(input.readOnly).toBe(true)
    expect(getByTestId('input-field-time').getAttribute('data-readonly')).toBe('true')
    await userEvent.type(input, '1')
    expect(input.value).toBe('09:30')
    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('does not apply the blur rule while readonly', async () => {
    const { getByTestId } = render(FieldTime, { props: { readonly: true, modelValue: '09:3' } })
    const input = getInput(getByTestId)
    await userEvent.click(input)
    await userEvent.tab()
    expect(input.getAttribute('aria-invalid')).toBeNull()
  })

  it.each(['small', 'medium', 'large'] as const)('reflects size="%s" on data-size', (size) => {
    const { getByTestId } = render(FieldTime, { props: { size } })
    expect(getByTestId('input-field-time').getAttribute('data-size')).toBe(size)
  })
})

describe('FieldTime — accessibility wiring', () => {
  it('wires the label to the input via for and id', () => {
    const { getByTestId } = render(FieldTime, {
      props: { label: 'Start time', inputId: 'start-time' }
    })
    const label = getByTestId('input-field-time__label')
    expect(label.tagName).toBe('LABEL')
    expect(label.getAttribute('for')).toBe('start-time')
    expect(getInput(getByTestId).id).toBe('start-time')
  })

  it('generates an id when inputId is empty and keeps the label association', () => {
    const { getByTestId } = render(FieldTime, { props: { label: 'Start time' } })
    const input = getInput(getByTestId)
    expect(input.id).not.toBe('')
    expect(getByTestId('input-field-time__label').getAttribute('for')).toBe(input.id)
  })

  it('always points aria-describedby at the helper row', () => {
    const { getByTestId } = render(FieldTime, { props: { inputId: 'start-time' } })
    expect(getInput(getByTestId).getAttribute('aria-describedby')).toBe('start-time-helper')
    expect(getByTestId('input-field-time__helper').id).toBe('start-time-helper')
  })

  it('forwards name to the native input', () => {
    const { getByTestId } = render(FieldTime, { props: { name: 'startTime' } })
    expect(getInput(getByTestId).name).toBe('startTime')
  })
})

describe('FieldTime — v-model', () => {
  it('round-trips a bound value', async () => {
    const time = ref('08:00')
    const { getByTestId } = render({
      components: { FieldTime },
      setup: () => ({ time }),
      template: '<FieldTime v-model="time" label="Start time" />'
    })
    const input = getInput(getByTestId)
    expect(input.value).toBe('08:00')
    await userEvent.clear(input)
    await userEvent.type(input, '1745')
    expect(time.value).toBe('17:45')
    time.value = '06:15'
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(input.value).toBe('06:15')
  })
})

describe('FieldTime — a11y', () => {
  it('has no a11y violations in the default state', async () => {
    const { container } = render(FieldTime, {
      props: { label: 'Start time', inputId: 'a11y-default' }
    })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the invalid state', async () => {
    const { container } = render(FieldTime, {
      props: { label: 'Start time', modelValue: '25:70', inputId: 'a11y-invalid' }
    })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the disabled state', async () => {
    const { container } = render(FieldTime, {
      props: { label: 'Start time', disabled: true, modelValue: '09:30', inputId: 'a11y-disabled' }
    })
    await expectNoA11yViolations(container)
  })
})
