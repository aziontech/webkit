import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/checkbox/Checkbox.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Checkbox from './checkbox.vue'

const { Default, Indeterminate, Disabled } = composeStories(stories)

describe('Checkbox', () => {
  describe('data-testid', () => {
    it('renders the input-checkbox fallback testid on the root, input, and icon', () => {
      const { getByTestId } = render(Checkbox, {
        props: { binary: true, modelValue: true }
      })

      expect(getByTestId('input-checkbox')).toBeTruthy()
      expect(getByTestId('input-checkbox__input')).toBeTruthy()
      // Icon svg only renders when checked / indeterminate.
      expect(getByTestId('input-checkbox__icon')).toBeTruthy()
    })

    it('honors a consumer-supplied data-testid on all three parts', () => {
      const { getByTestId } = render(Checkbox, {
        props: { binary: true, modelValue: true },
        attrs: { 'data-testid': 'my-box' }
      })

      expect(getByTestId('my-box')).toBeTruthy()
      expect(getByTestId('my-box__input')).toBeTruthy()
      expect(getByTestId('my-box__icon')).toBeTruthy()
    })
  })

  describe('binary mode — update:modelValue', () => {
    it('emits the negated boolean when toggling from false', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { binary: true, modelValue: false }
      })

      await fireEvent.click(getByTestId('input-checkbox__input'))

      expect(emitted()['update:modelValue']).toBeTruthy()
      expect(emitted()['update:modelValue'][0]).toEqual([true])
    })

    it('emits false when toggling from true', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { binary: true, modelValue: true }
      })

      await fireEvent.click(getByTestId('input-checkbox__input'))

      expect(emitted()['update:modelValue'][0]).toEqual([false])
    })
  })

  describe('array mode — update:modelValue', () => {
    it('adds its value to the array when not present', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { value: 'b', modelValue: ['a'] }
      })

      await fireEvent.click(getByTestId('input-checkbox__input'))

      expect(emitted()['update:modelValue'][0]).toEqual([['a', 'b']])
    })

    it('removes its value from the array when already present', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { value: 'a', modelValue: ['a', 'b'] }
      })

      await fireEvent.click(getByTestId('input-checkbox__input'))

      expect(emitted()['update:modelValue'][0]).toEqual([['b']])
    })
  })

  describe('checked state derivation', () => {
    it('is checked in binary mode when modelValue is truthy', () => {
      const { getByTestId } = render(Checkbox, {
        props: { binary: true, modelValue: true }
      })

      const input = getByTestId('input-checkbox__input') as HTMLInputElement
      expect(input.checked).toBe(true)
      expect(input.getAttribute('aria-checked')).toBe('true')
      expect(getByTestId('input-checkbox').getAttribute('data-state')).toBe('checked')
      expect(getByTestId('input-checkbox').getAttribute('data-checked')).toBe('true')
    })

    it('is unchecked in binary mode when modelValue is falsy', () => {
      const { getByTestId } = render(Checkbox, {
        props: { binary: true, modelValue: false }
      })

      const input = getByTestId('input-checkbox__input') as HTMLInputElement
      expect(input.checked).toBe(false)
      expect(input.getAttribute('aria-checked')).toBe('false')
      expect(getByTestId('input-checkbox').getAttribute('data-state')).toBe('unchecked')
      expect(getByTestId('input-checkbox').getAttribute('data-checked')).toBeNull()
    })

    it('is checked in scalar mode when modelValue equals value', () => {
      const { getByTestId } = render(Checkbox, {
        props: { value: 'x', modelValue: 'x' }
      })

      const input = getByTestId('input-checkbox__input') as HTMLInputElement
      expect(input.checked).toBe(true)
      expect(getByTestId('input-checkbox').getAttribute('data-state')).toBe('checked')
    })

    it('is checked in array mode when the array includes value', () => {
      const { getByTestId } = render(Checkbox, {
        props: { value: 'a', modelValue: ['a', 'b'] }
      })

      expect((getByTestId('input-checkbox__input') as HTMLInputElement).checked).toBe(true)
      expect(getByTestId('input-checkbox').getAttribute('data-state')).toBe('checked')
    })
  })

  describe('indeterminate', () => {
    it('sets aria-checked="mixed", data-state and data-indeterminate, and renders the bar icon', () => {
      const { getByTestId } = render(Checkbox, {
        props: { binary: true, modelValue: false, indeterminate: true }
      })

      const root = getByTestId('input-checkbox')
      const input = getByTestId('input-checkbox__input') as HTMLInputElement

      expect(input.getAttribute('aria-checked')).toBe('mixed')
      expect(root.getAttribute('data-state')).toBe('indeterminate')
      expect(root.getAttribute('data-indeterminate')).toBe('true')
      // The indeterminate (bar) glyph renders, not the checkmark.
      expect(getByTestId('input-checkbox__icon')).toBeTruthy()
    })

    it('reflects the native input.indeterminate DOM property when indeterminate turns on after mount', async () => {
      const { getByTestId, rerender } = render(Checkbox, {
        props: { binary: true, modelValue: false, indeterminate: false }
      })

      const input = getByTestId('input-checkbox__input') as HTMLInputElement
      expect(input.indeterminate).toBe(false)

      await rerender({ binary: true, modelValue: false, indeterminate: true })

      expect(input.indeterminate).toBe(true)
    })

    it('does not change modelValue itself — toggling still emits the binary negation', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { binary: true, modelValue: false, indeterminate: true }
      })

      await fireEvent.click(getByTestId('input-checkbox__input'))

      // indeterminate is a visual only; handleChange runs the binary branch on modelValue=false.
      expect(emitted()['update:modelValue'][0]).toEqual([true])
    })
  })

  describe('disabled suppresses interaction', () => {
    it('sets the native disabled + data-disabled and does not emit on click', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { binary: true, modelValue: false, disabled: true }
      })

      const input = getByTestId('input-checkbox__input') as HTMLInputElement
      expect(input.disabled).toBe(true)
      expect(getByTestId('input-checkbox').getAttribute('data-disabled')).toBe('true')

      await fireEvent.change(input)

      expect(emitted()['update:modelValue']).toBeUndefined()
    })
  })

  describe('readonly suppresses interaction', () => {
    it('sets data-readonly and does not emit on change', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { binary: true, modelValue: false, readonly: true }
      })

      expect(getByTestId('input-checkbox').getAttribute('data-readonly')).toBe('true')

      await fireEvent.change(getByTestId('input-checkbox__input'))

      expect(emitted()['update:modelValue']).toBeUndefined()
    })
  })

  describe('forwarded input attributes', () => {
    it('forwards inputId, name, and tabindex to the inner input', () => {
      const { getByTestId } = render(Checkbox, {
        props: {
          binary: true,
          modelValue: false,
          inputId: 'agree',
          name: 'terms',
          tabindex: -1
        }
      })

      const input = getByTestId('input-checkbox__input') as HTMLInputElement
      expect(input.id).toBe('agree')
      expect(input.getAttribute('name')).toBe('terms')
      expect(input.getAttribute('tabindex')).toBe('-1')
    })
  })

  describe('a11y', () => {
    it('has no violations when checked with an accessible name', async () => {
      const { container } = render(Checkbox, {
        props: { binary: true, modelValue: true, inputId: 'a11y-checked' },
        attrs: { 'aria-label': 'Accept terms' }
      })

      await expectNoA11yViolations(container)
    })

    it('has no violations when unchecked with an accessible name', async () => {
      const { container } = render(Checkbox, {
        props: { binary: true, modelValue: false, inputId: 'a11y-unchecked' },
        attrs: { 'aria-label': 'Accept terms' }
      })

      await expectNoA11yViolations(container)
    })
  })

  describe('smoke over boolean state props', () => {
    it.each([
      ['checked', { binary: true, modelValue: true }, 'checked'],
      ['unchecked', { binary: true, modelValue: false }, 'unchecked'],
      ['indeterminate', { binary: true, modelValue: false, indeterminate: true }, 'indeterminate']
    ] as const)('renders data-state=%s', (_label, props, expectedState) => {
      const { getByTestId } = render(Checkbox, { props })
      expect(getByTestId('input-checkbox').getAttribute('data-state')).toBe(expectedState)
    })
  })

  describe('story fixtures (composeStories)', () => {
    it('renders the Default story', () => {
      const { getByTestId } = render(Default())
      expect(getByTestId('input-checkbox')).toBeTruthy()
    })

    it('renders the Indeterminate story with a mixed input', () => {
      const { getByTestId } = render(Indeterminate())
      expect(getByTestId('input-checkbox__input').getAttribute('aria-checked')).toBe('mixed')
    })

    it('renders the Disabled story with disabled inputs', () => {
      const { getAllByTestId } = render(Disabled())
      const inputs = getAllByTestId('input-checkbox__input') as HTMLInputElement[]
      expect(inputs.length).toBeGreaterThan(0)
      inputs.forEach((input) => expect(input.disabled).toBe(true))
    })
  })
})
