import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/input-text/InputText.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import InputText from './input-text.vue'

const { Default, Filled, Invalid, Disabled, Sizes } = composeStories(stories)

describe('InputText', () => {
  describe('rendering & attributes', () => {
    it('renders an <input> with the default testid and reflects modelValue', () => {
      const { getByTestId } = render(InputText, {
        props: { modelValue: 'hello' }
      })
      const input = getByTestId('input-text') as HTMLInputElement
      expect(input.tagName).toBe('INPUT')
      expect(input.value).toBe('hello')
    })

    it('defaults type to text and applies the given placeholder', () => {
      const { getByTestId } = render(InputText, {
        props: { placeholder: 'Type here' }
      })
      const input = getByTestId('input-text') as HTMLInputElement
      expect(input.getAttribute('type')).toBe('text')
      expect(input.getAttribute('placeholder')).toBe('Type here')
    })

    it('passes type and maxlength through to the native input', () => {
      const { getByTestId } = render(InputText, {
        props: { type: 'email', maxLength: 10 }
      })
      const input = getByTestId('input-text') as HTMLInputElement
      expect(input.getAttribute('type')).toBe('email')
      expect(input.getAttribute('maxlength')).toBe('10')
    })

    it('honors a consumer-provided data-testid over the fallback', () => {
      const { getByTestId } = render(InputText, {
        attrs: { 'data-testid': 'email-field' }
      })
      expect(getByTestId('email-field').tagName).toBe('INPUT')
    })

    it('mirrors size onto the root as data-size', () => {
      const { getByTestId } = render(InputText, { props: { size: 'large' } })
      const root = getByTestId('input-text').closest('[data-size]')
      expect(root?.getAttribute('data-size')).toBe('large')
    })
  })

  describe('v-model (update:modelValue)', () => {
    it('emits update:modelValue with the new value on input', async () => {
      const { getByTestId, emitted } = render(InputText, {
        props: { modelValue: '' }
      })
      const input = getByTestId('input-text') as HTMLInputElement
      await fireEvent.update(input, 'azion')
      const events = emitted()['update:modelValue'] as string[][]
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBe('azion')
    })

    it('emits the latest value on successive inputs', async () => {
      const { getByTestId, emitted } = render(InputText, {
        props: { modelValue: '' }
      })
      const input = getByTestId('input-text') as HTMLInputElement
      await fireEvent.update(input, 'a')
      await fireEvent.update(input, 'ab')
      const events = emitted()['update:modelValue'] as string[][]
      expect(events).toHaveLength(2)
      expect(events[1][0]).toBe('ab')
    })
  })

  describe('disabled', () => {
    it('sets the native disabled attribute and data-disabled on the root', () => {
      const { getByTestId } = render(InputText, { props: { disabled: true } })
      const input = getByTestId('input-text') as HTMLInputElement
      expect(input.disabled).toBe(true)
      expect(input.closest('[data-disabled]')).not.toBeNull()
    })
  })

  describe('readonly', () => {
    it('sets the native readonly attribute', () => {
      const { getByTestId } = render(InputText, { props: { readonly: true } })
      const input = getByTestId('input-text') as HTMLInputElement
      expect(input.readOnly).toBe(true)
    })
  })

  describe('required', () => {
    it('sets native required, aria-required, and data-required on the root', () => {
      const { getByTestId } = render(InputText, { props: { required: true } })
      const input = getByTestId('input-text') as HTMLInputElement
      expect(input.required).toBe(true)
      expect(input.getAttribute('aria-required')).toBe('true')
      expect(input.closest('[data-required]')).not.toBeNull()
    })

    it('omits aria-required when not required', () => {
      const { getByTestId } = render(InputText)
      const input = getByTestId('input-text') as HTMLInputElement
      expect(input.getAttribute('aria-required')).toBeNull()
    })
  })

  describe('invalid', () => {
    it('sets aria-invalid on the input and data-invalid on the root', () => {
      const { getByTestId } = render(InputText, { props: { invalid: true } })
      const input = getByTestId('input-text') as HTMLInputElement
      expect(input.getAttribute('aria-invalid')).toBe('true')
      expect(input.closest('[data-invalid]')).not.toBeNull()
    })

    it('omits aria-invalid when valid', () => {
      const { getByTestId } = render(InputText)
      const input = getByTestId('input-text') as HTMLInputElement
      expect(input.getAttribute('aria-invalid')).toBeNull()
    })
  })

  describe('icon slots', () => {
    it('renders iconLeft slot content and flags data-has-icon-left on the root', () => {
      const { getByTestId, getByText } = render(InputText, {
        slots: { iconLeft: '<i data-testid="left-icon">L</i>' }
      })
      expect(getByText('L')).toBeTruthy()
      const root = getByTestId('input-text').closest('[data-has-icon-left]')
      expect(root).not.toBeNull()
    })

    it('renders iconRight slot content and flags data-has-icon-right on the root', () => {
      const { getByTestId, getByText } = render(InputText, {
        slots: { iconRight: '<i>R</i>' }
      })
      expect(getByText('R')).toBeTruthy()
      const root = getByTestId('input-text').closest('[data-has-icon-right]')
      expect(root).not.toBeNull()
    })
  })

  describe('size smoke (floor)', () => {
    it.each(['small', 'medium', 'large'] as const)('renders size=%s', (size) => {
      const { getByTestId } = render(InputText, { props: { size } })
      const root = getByTestId('input-text').closest('[data-size]')
      expect(root?.getAttribute('data-size')).toBe(size)
    })
  })

  describe('clickable area', () => {
    // The bordered box is the wrapper: its padding, gaps and icon areas are outside the
    // input's hit box, so a press there targets the chrome and must be delegated.
    const pressOn = (element: Element) =>
      element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))

    it('focuses the input when the press lands on the wrapper chrome (padding band)', () => {
      const { getByTestId } = render(InputText, { props: { size: 'large' } })
      const input = getByTestId('input-text') as HTMLInputElement
      const wrapper = input.closest('[data-size]') as HTMLElement
      const notPrevented = pressOn(wrapper)
      expect(document.activeElement).toBe(input)
      expect(notPrevented).toBe(false)
    })

    it('focuses the input when the press lands on a decorative icon', () => {
      const { getByTestId, getByText } = render(InputText, {
        props: { size: 'large' },
        slots: { iconLeft: '<i>L</i>' }
      })
      const input = getByTestId('input-text') as HTMLInputElement
      pressOn(getByText('L'))
      expect(document.activeElement).toBe(input)
    })

    it('leaves a press on the input itself untouched so the native caret still lands', () => {
      const { getByTestId } = render(InputText, { props: { modelValue: 'azion' } })
      const input = getByTestId('input-text') as HTMLInputElement
      expect(pressOn(input)).toBe(true)
    })

    it('does not focus from the wrapper chrome when disabled', () => {
      const { getByTestId } = render(InputText, { props: { size: 'large', disabled: true } })
      const input = getByTestId('input-text') as HTMLInputElement
      const wrapper = input.closest('[data-size]') as HTMLElement
      expect(pressOn(wrapper)).toBe(true)
      expect(document.activeElement).not.toBe(input)
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('Default has no violations', async () => {
      const { container } = render(InputText, {
        props: { placeholder: 'Search' }
      })
      await expectNoA11yViolations(container)
    })

    it('Invalid + required has no violations', async () => {
      const { container } = render(InputText, {
        props: { invalid: true, required: true, modelValue: 'bad', placeholder: 'Email' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('composeStories (the story fixtures run in-test)', () => {
    it('Default story mounts an empty input', () => {
      const { getByTestId } = render(Default)
      expect((getByTestId('input-text') as HTMLInputElement).value).toBe('')
    })

    it('Filled story mounts with a value', () => {
      const { getByTestId } = render(Filled)
      expect((getByTestId('input-text') as HTMLInputElement).value).toBe('Example value')
    })

    it('Invalid story sets aria-invalid', () => {
      const { getByTestId } = render(Invalid)
      expect(getByTestId('input-text').getAttribute('aria-invalid')).toBe('true')
    })

    it('Disabled story is disabled', () => {
      const { getByTestId } = render(Disabled)
      expect((getByTestId('input-text') as HTMLInputElement).disabled).toBe(true)
    })

    it('Sizes story renders three fields', () => {
      const { getAllByTestId } = render(Sizes)
      expect(getAllByTestId('input-text')).toHaveLength(3)
    })
  })
})
