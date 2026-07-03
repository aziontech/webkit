import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/Textarea.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Textarea from './textarea.vue'

const { Default, Disabled, Invalid, Required } = composeStories(stories)

describe('Textarea', () => {
  it('renders a <textarea> root carrying the default data-testid', () => {
    const { getByTestId } = render(Textarea)

    const root = getByTestId('input-textarea')
    expect(root.tagName).toBe('TEXTAREA')
  })

  it('reflects the placeholder prop onto the textarea', () => {
    const { getByTestId } = render(Textarea, { props: { placeholder: 'Write here' } })

    expect(getByTestId('input-textarea')).toHaveAttribute('placeholder', 'Write here')
  })

  it('binds the modelValue prop as the textarea value', () => {
    const { getByTestId } = render(Textarea, { props: { modelValue: 'seeded text' } })

    expect(getByTestId('input-textarea')).toHaveValue('seeded text')
  })

  it('sets data-filled on the textarea only when modelValue is non-empty', () => {
    const { getByTestId, rerender } = render(Textarea, { props: { modelValue: '' } })

    expect(getByTestId('input-textarea')).not.toHaveAttribute('data-filled')

    return rerender({ modelValue: 'now filled' }).then(() => {
      expect(getByTestId('input-textarea')).toHaveAttribute('data-filled')
    })
  })

  it('honours a consumer-supplied data-testid on the textarea', () => {
    const { getByTestId } = render(Textarea, {
      attrs: { 'data-testid': 'my-textarea' }
    })

    expect(getByTestId('my-textarea').tagName).toBe('TEXTAREA')
  })

  it('forwards arbitrary native attributes onto the textarea via $attrs', () => {
    const { getByTestId } = render(Textarea, {
      attrs: { rows: 6, maxlength: 120, name: 'message' }
    })

    const control = getByTestId('input-textarea')
    expect(control).toHaveAttribute('rows', '6')
    expect(control).toHaveAttribute('maxlength', '120')
    expect(control).toHaveAttribute('name', 'message')
  })

  describe('resizable', () => {
    it('defaults data-resize to vertical', () => {
      const { getByTestId } = render(Textarea)

      expect(getByTestId('input-textarea')).toHaveAttribute('data-resize', 'vertical')
    })

    it.each(['vertical', 'horizontal', 'both', 'none'] as const)(
      'maps resizable="%s" onto data-resize',
      (resizable) => {
        const { getByTestId } = render(Textarea, { props: { resizable } })

        expect(getByTestId('input-textarea')).toHaveAttribute('data-resize', resizable)
      }
    )
  })

  describe('v-model / update:modelValue', () => {
    it('emits update:modelValue with the new textarea value on input', async () => {
      const { getByTestId, emitted } = render(Textarea)

      await fireEvent.update(getByTestId('input-textarea'), 'hello world')

      expect(emitted('update:modelValue')).toHaveLength(1)
      expect(emitted('update:modelValue')[0]).toEqual(['hello world'])
    })

    it('emits the latest value on each subsequent input', async () => {
      const { getByTestId, emitted } = render(Textarea)

      const control = getByTestId('input-textarea')
      await fireEvent.update(control, 'first')
      await fireEvent.update(control, 'second')

      const events = emitted('update:modelValue')
      expect(events).toHaveLength(2)
      expect(events[0]).toEqual(['first'])
      expect(events[1]).toEqual(['second'])
    })

    it('blocks user input while disabled by marking the control natively disabled', () => {
      // The component relies on the native `disabled` attribute to stop real user
      // typing (programmatic value dispatch bypasses that guard, so asserting a
      // non-emit here would be a false positive). Grounding the actual mechanism.
      const { getByTestId } = render(Textarea, { props: { disabled: true } })

      expect(getByTestId('input-textarea')).toBeDisabled()
    })
  })

  describe('disabled', () => {
    it('sets data-disabled + native disabled + aria-disabled on the textarea', () => {
      const { getByTestId } = render(Textarea, { props: { disabled: true } })

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-disabled')
      expect(control).toBeDisabled()
      expect(control).toHaveAttribute('aria-disabled', 'true')
    })

    it('does not set data-disabled by default', () => {
      const { getByTestId } = render(Textarea)

      expect(getByTestId('input-textarea')).not.toHaveAttribute('data-disabled')
    })
  })

  describe('readonly', () => {
    it('sets data-readonly + native readonly on the textarea', () => {
      const { getByTestId } = render(Textarea, { props: { readonly: true } })

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-readonly')
      expect(control).toHaveAttribute('readonly')
    })

    it('does not set data-readonly by default', () => {
      const { getByTestId } = render(Textarea)

      expect(getByTestId('input-textarea')).not.toHaveAttribute('data-readonly')
    })
  })

  describe('invalid', () => {
    it('sets data-invalid + aria-invalid on the textarea when invalid', () => {
      const { getByTestId } = render(Textarea, { props: { invalid: true } })

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-invalid')
      expect(control).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not set data-invalid or aria-invalid by default', () => {
      const { getByTestId } = render(Textarea)

      const control = getByTestId('input-textarea')
      expect(control).not.toHaveAttribute('data-invalid')
      expect(control).not.toHaveAttribute('aria-invalid')
    })
  })

  describe('required', () => {
    it('sets data-required + native required + aria-required on the textarea', () => {
      const { getByTestId } = render(Textarea, { props: { required: true } })

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-required')
      expect(control).toBeRequired()
      expect(control).toHaveAttribute('aria-required', 'true')
    })

    it('does not set data-required or aria-required by default', () => {
      const { getByTestId } = render(Textarea)

      const control = getByTestId('input-textarea')
      expect(control).not.toHaveAttribute('data-required')
      expect(control).not.toHaveAttribute('aria-required')
    })
  })

  describe('accessibility', () => {
    it('has no a11y violations for a labelled default textarea', async () => {
      const { container } = render(Textarea, {
        attrs: { 'aria-label': 'Message' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no a11y violations for an invalid labelled textarea (aria-invalid semantics)', async () => {
      const { container } = render(Textarea, {
        props: { invalid: true },
        attrs: { 'aria-label': 'Message' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no a11y violations for a disabled labelled textarea', async () => {
      const { container } = render(Textarea, {
        props: { disabled: true },
        attrs: { 'aria-label': 'Message' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('story fixtures', () => {
    it('composes the Default story with the placeholder from its args', () => {
      const { getByTestId } = render(Default())

      expect(getByTestId('input-textarea')).toHaveAttribute('placeholder', 'Write your message')
    })

    it('composes the Disabled story with a disabled control', () => {
      const { getByTestId } = render(Disabled())

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-disabled')
      expect(control).toBeDisabled()
    })

    it('composes the Invalid story with invalid semantics and a filled value', () => {
      const { getByTestId } = render(Invalid())

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-invalid')
      expect(control).toHaveAttribute('data-filled')
      expect(control).toHaveAttribute('aria-invalid', 'true')
    })

    it('composes the Required story with required semantics', () => {
      const { getByTestId } = render(Required())

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-required')
      expect(control).toHaveAttribute('aria-required', 'true')
    })
  })
})
