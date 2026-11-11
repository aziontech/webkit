import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/number-input/default.vue'
import Disabled from '../../../../examples/number-input/disabled.vue'
import Invalid from '../../../../examples/number-input/invalid.vue'
import Sizes from '../../../../examples/number-input/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import NumberInput from './number-input.vue'

describe('NumberInput', () => {
  it('renders the input with the default data-testid and type=number', () => {
    const { getByTestId } = render(NumberInput)
    const input = getByTestId('number-input')
    expect(input).toBeTruthy()
    expect(input.tagName).toBe('INPUT')
    expect(input.getAttribute('type')).toBe('number')
  })

  it('honours a consumer-provided data-testid', () => {
    const { getByTestId } = render(NumberInput, {
      attrs: { 'data-testid': 'quantity-field' }
    })
    expect(getByTestId('quantity-field')).toBeTruthy()
  })

  it('reflects modelValue onto the input value', () => {
    const { getByTestId } = render(NumberInput, { props: { modelValue: 7 } })
    expect((getByTestId('number-input') as HTMLInputElement).value).toBe('7')
  })

  it('renders the placeholder', () => {
    const { getByTestId } = render(NumberInput, { props: { placeholder: 'Quantity' } })
    expect(getByTestId('number-input').getAttribute('placeholder')).toBe('Quantity')
  })

  describe('v-model / typing', () => {
    it('emits update:modelValue with the numeric value on input', async () => {
      const { getByTestId, emitted } = render(NumberInput, { props: { modelValue: 0 } })
      const input = getByTestId('number-input') as HTMLInputElement

      await fireEvent.update(input, '5')

      const events = emitted()['update:modelValue']
      expect(events).toBeTruthy()
      expect(events[events.length - 1]).toEqual([5])
    })

    it('emits change with the numeric value on the change event', async () => {
      const { getByTestId, emitted } = render(NumberInput, { props: { modelValue: 0 } })
      const input = getByTestId('number-input') as HTMLInputElement

      input.value = '8'
      await fireEvent.change(input)

      const events = emitted()['change']
      expect(events).toBeTruthy()
      expect(events[events.length - 1]).toEqual([8])
    })

    it('clamps a typed value above max down to max', async () => {
      const { getByTestId, emitted } = render(NumberInput, {
        props: { modelValue: 0, max: 10 }
      })
      const input = getByTestId('number-input') as HTMLInputElement

      await fireEvent.update(input, '50')

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([10])
    })

    it('clamps a typed value below min up to min', async () => {
      const { getByTestId, emitted } = render(NumberInput, {
        props: { modelValue: 5, min: 2 }
      })
      const input = getByTestId('number-input') as HTMLInputElement

      await fireEvent.update(input, '-4')

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([2])
    })

    it('falls back to min when the input is cleared (empty -> NaN)', async () => {
      const { getByTestId, emitted } = render(NumberInput, {
        props: { modelValue: 5, min: 3 }
      })
      const input = getByTestId('number-input') as HTMLInputElement

      await fireEvent.update(input, '')

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([3])
    })

    it('falls back to 0 when the input is cleared and no min is set', async () => {
      const { getByTestId, emitted } = render(NumberInput, { props: { modelValue: 5 } })
      const input = getByTestId('number-input') as HTMLInputElement

      await fireEvent.update(input, '')

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([0])
    })
  })

  describe('spinner buttons', () => {
    it('renders Increment and Decrement buttons by default (showButtons)', () => {
      const { getByLabelText } = render(NumberInput)
      expect(getByLabelText('Increment')).toBeTruthy()
      expect(getByLabelText('Decrement')).toBeTruthy()
    })

    it('does not render spinner buttons when showButtons is false', () => {
      const { queryByLabelText } = render(NumberInput, { props: { showButtons: false } })
      expect(queryByLabelText('Increment')).toBeNull()
      expect(queryByLabelText('Decrement')).toBeNull()
    })

    it('increments by step and emits update:modelValue', async () => {
      const { getByLabelText, emitted } = render(NumberInput, {
        props: { modelValue: 4, step: 3 }
      })

      await fireEvent.click(getByLabelText('Increment'))

      const events = emitted()['update:modelValue']
      expect(events).toBeTruthy()
      expect(events[events.length - 1]).toEqual([7])
    })

    it('decrements by step and emits update:modelValue', async () => {
      const { getByLabelText, emitted } = render(NumberInput, {
        props: { modelValue: 10, step: 4 }
      })

      await fireEvent.click(getByLabelText('Decrement'))

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([6])
    })

    it('increment respects max', async () => {
      const { getByLabelText, emitted } = render(NumberInput, {
        props: { modelValue: 9, step: 5, max: 10 }
      })

      await fireEvent.click(getByLabelText('Increment'))

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([10])
    })

    it('decrement respects min', async () => {
      const { getByLabelText, emitted } = render(NumberInput, {
        props: { modelValue: 1, step: 5, min: 0 }
      })

      await fireEvent.click(getByLabelText('Decrement'))

      const events = emitted()['update:modelValue']
      expect(events[events.length - 1]).toEqual([0])
    })
  })

  describe('disabled', () => {
    it('sets the disabled attribute on the input and spinner buttons', () => {
      const { getByTestId, getByLabelText } = render(NumberInput, { props: { disabled: true } })
      expect((getByTestId('number-input') as HTMLInputElement).disabled).toBe(true)
      expect((getByLabelText('Increment') as HTMLButtonElement).disabled).toBe(true)
      expect((getByLabelText('Decrement') as HTMLButtonElement).disabled).toBe(true)
    })

    it('does not emit update:modelValue when incrementing while disabled', async () => {
      const { getByLabelText, emitted } = render(NumberInput, {
        props: { modelValue: 1, disabled: true }
      })

      await fireEvent.click(getByLabelText('Increment'))

      expect(emitted()['update:modelValue']).toBeUndefined()
    })

    it('does not emit update:modelValue when decrementing while disabled', async () => {
      const { getByLabelText, emitted } = render(NumberInput, {
        props: { modelValue: 1, disabled: true }
      })

      await fireEvent.click(getByLabelText('Decrement'))

      expect(emitted()['update:modelValue']).toBeUndefined()
    })
  })

  describe('readonly', () => {
    it('sets the readonly attribute on the input and disables spinner buttons', () => {
      const { getByTestId, getByLabelText } = render(NumberInput, { props: { readonly: true } })
      expect((getByTestId('number-input') as HTMLInputElement).readOnly).toBe(true)
      expect((getByLabelText('Increment') as HTMLButtonElement).disabled).toBe(true)
      expect((getByLabelText('Decrement') as HTMLButtonElement).disabled).toBe(true)
    })

    it('does not emit update:modelValue when incrementing while readonly', async () => {
      const { getByLabelText, emitted } = render(NumberInput, {
        props: { modelValue: 1, readonly: true }
      })

      await fireEvent.click(getByLabelText('Increment'))

      expect(emitted()['update:modelValue']).toBeUndefined()
    })
  })

  describe('a11y attributes', () => {
    it('sets aria-invalid when invalid', () => {
      const { getByTestId } = render(NumberInput, { props: { invalid: true } })
      expect(getByTestId('number-input').getAttribute('aria-invalid')).toBe('true')
    })

    it('sets aria-required when required', () => {
      const { getByTestId } = render(NumberInput, { props: { required: true } })
      expect(getByTestId('number-input').getAttribute('aria-required')).toBe('true')
    })

    it('applies min / max / step to the native input', () => {
      const { getByTestId } = render(NumberInput, { props: { min: 2, max: 20, step: 5 } })
      const input = getByTestId('number-input')
      expect(input.getAttribute('min')).toBe('2')
      expect(input.getAttribute('max')).toBe('20')
      expect(input.getAttribute('step')).toBe('5')
    })
  })

  describe('slots', () => {
    it('renders the prefix slot content', () => {
      const { getByText } = render(NumberInput, {
        slots: { prefix: '<span>$</span>' }
      })
      expect(getByText('$')).toBeTruthy()
    })

    it('renders the suffix slot content', () => {
      const { getByText } = render(NumberInput, {
        slots: { suffix: '<span>kg</span>' }
      })
      expect(getByText('kg')).toBeTruthy()
    })
  })

  describe('size variants (smoke floor)', () => {
    it.each(['small', 'medium', 'large'] as const)(
      'renders with size=%s and reflects it on the root data-size',
      (size) => {
        const { getByTestId } = render(NumberInput, { props: { size } })
        const input = getByTestId('number-input')
        const root = input.closest('[data-size]')
        expect(root?.getAttribute('data-size')).toBe(size)
      }
    )
  })

  describe('accessibility', () => {
    // Field-only component: the label belongs to the wrapping form-field layer, so
    // the fixture supplies the accessible name a placeholder alone cannot hold.
    it('has no axe violations in the default render', async () => {
      const { container } = render(NumberInput, {
        props: { placeholder: 'Quantity', modelValue: 1 },
        attrs: { 'aria-label': 'Quantity' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no axe violations in the disabled render', async () => {
      const { container } = render(NumberInput, {
        props: { disabled: true, modelValue: 42 },
        attrs: { 'aria-label': 'Quantity' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no axe violations in the invalid + required render', async () => {
      const { container } = render(NumberInput, {
        props: { invalid: true, required: true, modelValue: 99 },
        attrs: { 'aria-label': 'Quantity' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('composed stories', () => {
    it('renders the Default story', () => {
      const { getByTestId } = render(Default)
      expect(getByTestId('number-input')).toBeTruthy()
    })

    it('renders the Sizes story', () => {
      const { getAllByTestId } = render(Sizes)
      expect(getAllByTestId('number-input').length).toBe(3)
    })

    it('renders the Disabled story with a disabled input', () => {
      const { getByTestId } = render(Disabled)
      expect((getByTestId('number-input') as HTMLInputElement).disabled).toBe(true)
    })

    it('renders the Invalid story with aria-invalid', () => {
      const { getByTestId } = render(Invalid)
      expect(getByTestId('number-input').getAttribute('aria-invalid')).toBe('true')
    })
  })
})

describe('NumberInput — direction of the typed value', () => {
  it('uses dir="auto" so a value in another script keeps its own direction', () => {
    const { getByTestId } = render(NumberInput)
    expect(getByTestId('number-input').getAttribute('dir')).toBe('auto')
  })

  it('lets a dir attribute override the default', () => {
    const { getByTestId } = render(NumberInput, { attrs: { dir: 'ltr' } })
    expect(getByTestId('number-input').getAttribute('dir')).toBe('ltr')
  })
})
