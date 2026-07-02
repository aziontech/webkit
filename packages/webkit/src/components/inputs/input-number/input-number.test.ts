import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/InputNumber.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import InputNumber from './input-number.vue'

const { Default, Sizes, Disabled, Invalid } = composeStories(stories)

describe('InputNumber', () => {
  it('renders the input with the default data-testid and type=number', () => {
    const { getByTestId } = render(InputNumber)
    const input = getByTestId('input-number')
    expect(input).toBeTruthy()
    expect(input.tagName).toBe('INPUT')
    expect(input.getAttribute('type')).toBe('number')
  })

  it('honours a consumer-provided data-testid', () => {
    const { getByTestId } = render(InputNumber, {
      attrs: { 'data-testid': 'quantity-field' }
    })
    expect(getByTestId('quantity-field')).toBeTruthy()
  })

  it('reflects modelValue onto the input value', () => {
    const { getByTestId } = render(InputNumber, { props: { modelValue: 7 } })
    expect((getByTestId('input-number') as HTMLInputElement).value).toBe('7')
  })

  it('renders the placeholder', () => {
    const { getByTestId } = render(InputNumber, { props: { placeholder: 'Quantity' } })
    expect(getByTestId('input-number').getAttribute('placeholder')).toBe('Quantity')
  })

  describe('v-model / typing', () => {
    it('emits update:modelValue with the numeric value on input', async () => {
      const { getByTestId, emitted } = render(InputNumber, { props: { modelValue: 0 } })
      const input = getByTestId('input-number') as HTMLInputElement

      await fireEvent.update(input, '5')

      const events = emitted()['update:modelValue']
      expect(events).toBeTruthy()
      expect(events[events.length - 1]).toEqual([5])
    })

    it('emits change with the numeric value on the change event', async () => {
      const { getByTestId, emitted } = render(InputNumber, { props: { modelValue: 0 } })
      const input = getByTestId('input-number') as HTMLInputElement

      input.value = '8'
      await fireEvent.change(input)

      const events = emitted()['change']
      expect(events).toBeTruthy()
      expect(events[events.length - 1]).toEqual([8])
    })

    it('clamps a typed value above max down to max', async () => {
      const { getByTestId, emitted } = render(InputNumber, {
        props: { modelValue: 0, max: 10 }
      })
      const input = getByTestId('input-number') as HTMLInputElement

      await fireEvent.update(input, '50')

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([10])
    })

    it('clamps a typed value below min up to min', async () => {
      const { getByTestId, emitted } = render(InputNumber, {
        props: { modelValue: 5, min: 2 }
      })
      const input = getByTestId('input-number') as HTMLInputElement

      await fireEvent.update(input, '-4')

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([2])
    })

    it('falls back to min when the input is cleared (empty -> NaN)', async () => {
      const { getByTestId, emitted } = render(InputNumber, {
        props: { modelValue: 5, min: 3 }
      })
      const input = getByTestId('input-number') as HTMLInputElement

      await fireEvent.update(input, '')

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([3])
    })

    it('falls back to 0 when the input is cleared and no min is set', async () => {
      const { getByTestId, emitted } = render(InputNumber, { props: { modelValue: 5 } })
      const input = getByTestId('input-number') as HTMLInputElement

      await fireEvent.update(input, '')

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([0])
    })
  })

  describe('spinner buttons', () => {
    it('renders Increment and Decrement buttons by default (showButtons)', () => {
      const { getByLabelText } = render(InputNumber)
      expect(getByLabelText('Increment')).toBeTruthy()
      expect(getByLabelText('Decrement')).toBeTruthy()
    })

    it('does not render spinner buttons when showButtons is false', () => {
      const { queryByLabelText } = render(InputNumber, { props: { showButtons: false } })
      expect(queryByLabelText('Increment')).toBeNull()
      expect(queryByLabelText('Decrement')).toBeNull()
    })

    it('increments by step and emits update:modelValue', async () => {
      const { getByLabelText, emitted } = render(InputNumber, {
        props: { modelValue: 4, step: 3 }
      })

      await fireEvent.click(getByLabelText('Increment'))

      const events = emitted()['update:modelValue']
      expect(events).toBeTruthy()
      expect(events[events.length - 1]).toEqual([7])
    })

    it('decrements by step and emits update:modelValue', async () => {
      const { getByLabelText, emitted } = render(InputNumber, {
        props: { modelValue: 10, step: 4 }
      })

      await fireEvent.click(getByLabelText('Decrement'))

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([6])
    })

    it('increment respects max', async () => {
      const { getByLabelText, emitted } = render(InputNumber, {
        props: { modelValue: 9, step: 5, max: 10 }
      })

      await fireEvent.click(getByLabelText('Increment'))

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([10])
    })

    it('decrement respects min', async () => {
      const { getByLabelText, emitted } = render(InputNumber, {
        props: { modelValue: 1, step: 5, min: 0 }
      })

      await fireEvent.click(getByLabelText('Decrement'))

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([0])
    })
  })

  describe('disabled', () => {
    it('sets the disabled attribute on the input and spinner buttons', () => {
      const { getByTestId, getByLabelText } = render(InputNumber, { props: { disabled: true } })
      expect((getByTestId('input-number') as HTMLInputElement).disabled).toBe(true)
      expect((getByLabelText('Increment') as HTMLButtonElement).disabled).toBe(true)
      expect((getByLabelText('Decrement') as HTMLButtonElement).disabled).toBe(true)
    })

    it('does not emit update:modelValue when incrementing while disabled', async () => {
      const { getByLabelText, emitted } = render(InputNumber, {
        props: { modelValue: 1, disabled: true }
      })

      await fireEvent.click(getByLabelText('Increment'))

      expect(emitted()['update:modelValue']).toBeUndefined()
    })

    it('does not emit update:modelValue when decrementing while disabled', async () => {
      const { getByLabelText, emitted } = render(InputNumber, {
        props: { modelValue: 1, disabled: true }
      })

      await fireEvent.click(getByLabelText('Decrement'))

      expect(emitted()['update:modelValue']).toBeUndefined()
    })
  })

  describe('readonly', () => {
    it('sets the readonly attribute on the input and disables spinner buttons', () => {
      const { getByTestId, getByLabelText } = render(InputNumber, { props: { readonly: true } })
      expect((getByTestId('input-number') as HTMLInputElement).readOnly).toBe(true)
      expect((getByLabelText('Increment') as HTMLButtonElement).disabled).toBe(true)
      expect((getByLabelText('Decrement') as HTMLButtonElement).disabled).toBe(true)
    })

    it('does not emit update:modelValue when incrementing while readonly', async () => {
      const { getByLabelText, emitted } = render(InputNumber, {
        props: { modelValue: 1, readonly: true }
      })

      await fireEvent.click(getByLabelText('Increment'))

      expect(emitted()['update:modelValue']).toBeUndefined()
    })
  })

  describe('a11y attributes', () => {
    it('sets aria-invalid when invalid', () => {
      const { getByTestId } = render(InputNumber, { props: { invalid: true } })
      expect(getByTestId('input-number').getAttribute('aria-invalid')).toBe('true')
    })

    it('sets aria-required when required', () => {
      const { getByTestId } = render(InputNumber, { props: { required: true } })
      expect(getByTestId('input-number').getAttribute('aria-required')).toBe('true')
    })

    it('applies min / max / step to the native input', () => {
      const { getByTestId } = render(InputNumber, { props: { min: 2, max: 20, step: 5 } })
      const input = getByTestId('input-number')
      expect(input.getAttribute('min')).toBe('2')
      expect(input.getAttribute('max')).toBe('20')
      expect(input.getAttribute('step')).toBe('5')
    })
  })

  describe('slots', () => {
    it('renders the prefix slot content', () => {
      const { getByText } = render(InputNumber, {
        slots: { prefix: '<span>$</span>' }
      })
      expect(getByText('$')).toBeTruthy()
    })

    it('renders the suffix slot content', () => {
      const { getByText } = render(InputNumber, {
        slots: { suffix: '<span>kg</span>' }
      })
      expect(getByText('kg')).toBeTruthy()
    })
  })

  describe('size variants (smoke floor)', () => {
    it.each(['small', 'medium', 'large'] as const)(
      'renders with size=%s and reflects it on the root data-size',
      (size) => {
        const { getByTestId } = render(InputNumber, { props: { size } })
        const input = getByTestId('input-number')
        const root = input.closest('[data-size]')
        expect(root?.getAttribute('data-size')).toBe(size)
      }
    )
  })

  describe('accessibility', () => {
    it('has no axe violations in the default render', async () => {
      const { container } = render(InputNumber, {
        props: { placeholder: 'Quantity', modelValue: 1 }
      })
      await expectNoA11yViolations(container)
    })

    it('has no axe violations in the disabled render', async () => {
      const { container } = render(InputNumber, {
        props: { disabled: true, modelValue: 42 },
        attrs: { 'aria-label': 'Quantity' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no axe violations in the invalid + required render', async () => {
      const { container } = render(InputNumber, {
        props: { invalid: true, required: true, modelValue: 99 },
        attrs: { 'aria-label': 'Quantity' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('composed stories', () => {
    it('renders the Default story', () => {
      const { getByTestId } = render(Default)
      expect(getByTestId('input-number')).toBeTruthy()
    })

    it('renders the Sizes story', () => {
      const { getAllByTestId } = render(Sizes)
      expect(getAllByTestId('input-number').length).toBe(3)
    })

    it('renders the Disabled story with a disabled input', () => {
      const { getByTestId } = render(Disabled)
      expect((getByTestId('input-number') as HTMLInputElement).disabled).toBe(true)
    })

    it('renders the Invalid story with aria-invalid', () => {
      const { getByTestId } = render(Invalid)
      expect(getByTestId('input-number').getAttribute('aria-invalid')).toBe('true')
    })
  })
})
