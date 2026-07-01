import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/Textarea.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Textarea from './textarea.vue'

const { Default, Disabled, Invalid, Required } = composeStories(stories)

describe('Textarea', () => {
  it('renders a <div> root carrying the default data-testid, with a <textarea> control inside', () => {
    const { getByTestId } = render(Textarea)

    const root = getByTestId('input-textarea')
    expect(root.tagName).toBe('DIV')

    const control = getByTestId('input-textarea__control')
    expect(control.tagName).toBe('TEXTAREA')
  })

  it('reflects the placeholder prop onto the textarea control', () => {
    const { getByTestId } = render(Textarea, { props: { placeholder: 'Write here' } })

    expect(getByTestId('input-textarea__control')).toHaveAttribute('placeholder', 'Write here')
  })

  it('binds the modelValue prop as the textarea value', () => {
    const { getByTestId } = render(Textarea, { props: { modelValue: 'seeded text' } })

    expect(getByTestId('input-textarea__control')).toHaveValue('seeded text')
  })

  it('sets data-filled on the root only when modelValue is non-empty', () => {
    const { getByTestId, rerender } = render(Textarea, { props: { modelValue: '' } })

    expect(getByTestId('input-textarea')).not.toHaveAttribute('data-filled')

    return rerender({ modelValue: 'now filled' }).then(() => {
      expect(getByTestId('input-textarea')).toHaveAttribute('data-filled')
    })
  })

  it('honours a consumer-supplied data-testid on the root and derives the control testid from it', () => {
    const { getByTestId } = render(Textarea, {
      attrs: { 'data-testid': 'my-textarea' }
    })

    expect(getByTestId('my-textarea').tagName).toBe('DIV')
    expect(getByTestId('my-textarea__control').tagName).toBe('TEXTAREA')
  })

  it('forwards arbitrary native attributes onto the textarea control via $attrs', () => {
    const { getByTestId } = render(Textarea, {
      attrs: { rows: 6, maxlength: 120, name: 'message' }
    })

    const control = getByTestId('input-textarea__control')
    expect(control).toHaveAttribute('rows', '6')
    expect(control).toHaveAttribute('maxlength', '120')
    expect(control).toHaveAttribute('name', 'message')
  })

  describe('v-model / update:modelValue', () => {
    it('emits update:modelValue with the new textarea value on input', async () => {
      const { getByTestId, emitted } = render(Textarea)

      await fireEvent.update(getByTestId('input-textarea__control'), 'hello world')

      expect(emitted('update:modelValue')).toHaveLength(1)
      expect(emitted('update:modelValue')[0]).toEqual(['hello world'])
    })

    it('emits the latest value on each subsequent input', async () => {
      const { getByTestId, emitted } = render(Textarea)

      const control = getByTestId('input-textarea__control')
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

      expect(getByTestId('input-textarea__control')).toBeDisabled()
    })
  })

  describe('disabled', () => {
    it('sets data-disabled on the root and the native disabled + aria-disabled on the control', () => {
      const { getByTestId } = render(Textarea, { props: { disabled: true } })

      expect(getByTestId('input-textarea')).toHaveAttribute('data-disabled')

      const control = getByTestId('input-textarea__control')
      expect(control).toBeDisabled()
      expect(control).toHaveAttribute('aria-disabled', 'true')
    })

    it('renders the lock icon and suppresses the iconRight slot when disabled', () => {
      const { getByTestId, container } = render(Textarea, {
        props: { disabled: true },
        slots: { iconRight: '<span data-testid="right-icon">R</span>' }
      })

      // data-has-icon-right is present (disabled forces it), but the slot content is suppressed
      expect(getByTestId('input-textarea')).toHaveAttribute('data-has-icon-right')
      expect(container.querySelector('[data-testid="right-icon"]')).toBeNull()
      expect(container.querySelector('.pi-lock')).not.toBeNull()
    })

    it('does not set data-disabled by default', () => {
      const { getByTestId } = render(Textarea)

      expect(getByTestId('input-textarea')).not.toHaveAttribute('data-disabled')
    })
  })

  describe('readonly', () => {
    it('sets data-readonly on the root and the native readonly on the control', () => {
      const { getByTestId } = render(Textarea, { props: { readonly: true } })

      expect(getByTestId('input-textarea')).toHaveAttribute('data-readonly')
      expect(getByTestId('input-textarea__control')).toHaveAttribute('readonly')
    })

    it('does not set data-readonly by default', () => {
      const { getByTestId } = render(Textarea)

      expect(getByTestId('input-textarea')).not.toHaveAttribute('data-readonly')
    })
  })

  describe('invalid', () => {
    it('sets data-invalid on the root and aria-invalid on the control when invalid', () => {
      const { getByTestId } = render(Textarea, { props: { invalid: true } })

      expect(getByTestId('input-textarea')).toHaveAttribute('data-invalid')
      expect(getByTestId('input-textarea__control')).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not set data-invalid or aria-invalid by default', () => {
      const { getByTestId } = render(Textarea)

      expect(getByTestId('input-textarea')).not.toHaveAttribute('data-invalid')
      expect(getByTestId('input-textarea__control')).not.toHaveAttribute('aria-invalid')
    })
  })

  describe('required', () => {
    it('sets data-required on the root and the native required + aria-required on the control', () => {
      const { getByTestId } = render(Textarea, { props: { required: true } })

      expect(getByTestId('input-textarea')).toHaveAttribute('data-required')

      const control = getByTestId('input-textarea__control')
      expect(control).toBeRequired()
      expect(control).toHaveAttribute('aria-required', 'true')
    })

    it('does not set data-required or aria-required by default', () => {
      const { getByTestId } = render(Textarea)

      expect(getByTestId('input-textarea')).not.toHaveAttribute('data-required')
      expect(getByTestId('input-textarea__control')).not.toHaveAttribute('aria-required')
    })
  })

  describe('icon slots', () => {
    it('sets data-has-icon-left and renders the iconLeft slot content', () => {
      const { getByTestId, container } = render(Textarea, {
        slots: { iconLeft: '<span data-testid="left-icon">L</span>' }
      })

      expect(getByTestId('input-textarea')).toHaveAttribute('data-has-icon-left')
      expect(container.querySelector('[data-testid="left-icon"]')).not.toBeNull()
    })

    it('sets data-has-icon-right and renders the iconRight slot content when enabled', () => {
      const { getByTestId, container } = render(Textarea, {
        slots: { iconRight: '<span data-testid="right-icon">R</span>' }
      })

      expect(getByTestId('input-textarea')).toHaveAttribute('data-has-icon-right')
      expect(container.querySelector('[data-testid="right-icon"]')).not.toBeNull()
    })

    it('sets neither icon data-attribute when no icon slot is provided', () => {
      const { getByTestId } = render(Textarea)

      expect(getByTestId('input-textarea')).not.toHaveAttribute('data-has-icon-left')
      expect(getByTestId('input-textarea')).not.toHaveAttribute('data-has-icon-right')
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

      expect(getByTestId('input-textarea__control')).toHaveAttribute(
        'placeholder',
        'Write your message'
      )
    })

    it('composes the Disabled story with a disabled control', () => {
      const { getByTestId } = render(Disabled())

      expect(getByTestId('input-textarea')).toHaveAttribute('data-disabled')
      expect(getByTestId('input-textarea__control')).toBeDisabled()
    })

    it('composes the Invalid story with invalid semantics and a filled value', () => {
      const { getByTestId } = render(Invalid())

      expect(getByTestId('input-textarea')).toHaveAttribute('data-invalid')
      expect(getByTestId('input-textarea')).toHaveAttribute('data-filled')
      expect(getByTestId('input-textarea__control')).toHaveAttribute('aria-invalid', 'true')
    })

    it('composes the Required story with required semantics', () => {
      const { getByTestId } = render(Required())

      expect(getByTestId('input-textarea')).toHaveAttribute('data-required')
      expect(getByTestId('input-textarea__control')).toHaveAttribute('aria-required', 'true')
    })
  })
})
