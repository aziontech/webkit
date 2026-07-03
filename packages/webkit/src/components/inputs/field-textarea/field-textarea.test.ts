import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/FieldTextarea.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FieldTextarea from './field-textarea.vue'

const { Required, Invalid } = composeStories(stories)

// The root fallback testid is `input-field-textarea`. FieldTextarea passes
// `${root}__control` to the composed <Textarea>, whose root element IS the native
// <textarea> (post inline-flex refactor) — so the editable element carries
// `…__control` directly (no doubled suffix, no wrapping div).
const ROOT = 'input-field-textarea'
const CONTROL = `${ROOT}__control` // the native <textarea> (Textarea's root)
const NATIVE = CONTROL // same element: the native <textarea>

describe('FieldTextarea', () => {
  it('renders the root with the default data-testid and stacks its parts', () => {
    const { getByTestId } = render(FieldTextarea, {
      props: { label: 'Message', helperText: 'Helper' }
    })

    expect(getByTestId(ROOT)).toBeTruthy()
    expect(getByTestId(`${ROOT}__label`)).toBeTruthy()
    expect(getByTestId(`${ROOT}__helper`)).toBeTruthy()
    // The composed Textarea's root IS the editable <textarea>, carrying `…__control`.
    expect((getByTestId(CONTROL) as HTMLElement).tagName).toBe('TEXTAREA')
  })

  it('honors a consumer-provided data-testid on the root and its suffixed parts', () => {
    const { getByTestId } = render(FieldTextarea, {
      props: { label: 'Message', helperText: 'Helper' },
      attrs: { 'data-testid': 'my-field' }
    })

    expect(getByTestId('my-field')).toBeTruthy()
    expect(getByTestId('my-field__label')).toBeTruthy()
    expect(getByTestId('my-field__control')).toBeTruthy()
    expect(getByTestId('my-field__helper')).toBeTruthy()
  })

  it('omits the label row when no label is provided', () => {
    const { queryByTestId } = render(FieldTextarea, { props: { helperText: 'Helper' } })
    expect(queryByTestId(`${ROOT}__label`)).toBeNull()
  })

  it('omits the helper row when there is no helper text', () => {
    const { queryByTestId } = render(FieldTextarea, { props: { label: 'Message' } })
    expect(queryByTestId(`${ROOT}__helper`)).toBeNull()
  })

  it('renders the helper text content when helperText is provided', () => {
    const { getByTestId } = render(FieldTextarea, {
      props: { label: 'Message', helperText: 'Up to 500 characters.' }
    })
    expect(getByTestId(`${ROOT}__helper-text`).textContent).toBe('Up to 500 characters.')
  })

  describe('v-model / update:modelValue', () => {
    it('emits update:modelValue with the typed value when the user types', async () => {
      const { getByTestId, emitted } = render(FieldTextarea, { props: { label: 'Message' } })

      await fireEvent.update(getByTestId(NATIVE), 'hello world')

      const events = emitted('update:modelValue')
      expect(events).toHaveLength(1)
      expect(events[0]).toEqual(['hello world'])
    })

    it('emits the latest value on each subsequent input', async () => {
      const { getByTestId, emitted } = render(FieldTextarea, { props: { label: 'Message' } })
      const control = getByTestId(NATIVE)

      await fireEvent.update(control, 'first')
      await fireEvent.update(control, 'second')

      const events = emitted('update:modelValue')
      expect(events).toHaveLength(2)
      expect(events[0]).toEqual(['first'])
      expect(events[1]).toEqual(['second'])
    })

    it('reflects the modelValue prop on the underlying textarea', () => {
      const { getByTestId } = render(FieldTextarea, {
        props: { label: 'Message', modelValue: 'prefilled body' }
      })
      expect(getByTestId(NATIVE)).toHaveValue('prefilled body')
    })

    it('blocks user input while disabled by marking the native control disabled', () => {
      // Disabled relies on the native `disabled` attribute to stop real typing;
      // a programmatic value dispatch bypasses that guard, so asserting a non-emit
      // would be a false positive. Ground the actual mechanism instead.
      const { getByTestId } = render(FieldTextarea, { props: { label: 'Message', disabled: true } })
      expect(getByTestId(NATIVE)).toBeDisabled()
    })
  })

  describe('label / id / aria wiring', () => {
    it('wires the label to the textarea via matching for/id from inputId', () => {
      const { getByTestId } = render(FieldTextarea, {
        props: { label: 'Message', inputId: 'message-field' }
      })
      // The Label sub-component renders a <label> as its own root, carrying the testid.
      const label = getByTestId(`${ROOT}__label`) as HTMLLabelElement
      const control = getByTestId(NATIVE) as HTMLTextAreaElement

      expect(label.tagName).toBe('LABEL')
      expect(control.id).toBe('message-field')
      expect(label.getAttribute('for')).toBe('message-field')
    })

    it('falls back to name for the textarea id when no inputId is given', () => {
      const { getByTestId } = render(FieldTextarea, {
        props: { label: 'Message', name: 'the-message' }
      })
      expect((getByTestId(NATIVE) as HTMLTextAreaElement).id).toBe('the-message')
    })

    it('points aria-describedby at the helper element when a helper is shown', () => {
      const { getByTestId } = render(FieldTextarea, {
        props: { label: 'Message', helperText: 'We need this.', inputId: 'msg' }
      })
      const control = getByTestId(NATIVE) as HTMLTextAreaElement
      const helper = getByTestId(`${ROOT}__helper`)

      expect(control.getAttribute('aria-describedby')).toBe('msg__helper')
      expect(helper.id).toBe('msg__helper')
    })

    it('drops aria-describedby when no helper is rendered', () => {
      const { getByTestId } = render(FieldTextarea, { props: { label: 'Message' } })
      expect(getByTestId(NATIVE).getAttribute('aria-describedby')).toBeNull()
    })

    it('forwards the name attribute onto the native textarea', () => {
      const { getByTestId } = render(FieldTextarea, {
        props: { label: 'Message', name: 'message' }
      })
      expect(getByTestId(NATIVE)).toHaveAttribute('name', 'message')
    })

    it('reflects the placeholder prop onto the native textarea', () => {
      const { getByTestId } = render(FieldTextarea, {
        props: { label: 'Message', placeholder: 'Write your message' }
      })
      expect(getByTestId(NATIVE)).toHaveAttribute('placeholder', 'Write your message')
    })
  })

  describe('required', () => {
    it('sets native required + aria-required on the textarea and data-required on the root', () => {
      const { getByTestId } = render(FieldTextarea, { props: { label: 'Message', required: true } })
      const control = getByTestId(NATIVE) as HTMLTextAreaElement

      expect(control.required).toBe(true)
      expect(control.getAttribute('aria-required')).toBe('true')
      expect(getByTestId(ROOT).getAttribute('data-required')).toBe('true')
    })

    it('does not set data-required or aria-required by default', () => {
      const { getByTestId } = render(FieldTextarea, { props: { label: 'Message' } })
      expect(getByTestId(ROOT)).not.toHaveAttribute('data-required')
      expect(getByTestId(NATIVE)).not.toHaveAttribute('aria-required')
    })
  })

  describe('invalid', () => {
    it('sets aria-invalid on the textarea and data-invalid on the root', () => {
      const { getByTestId } = render(FieldTextarea, {
        props: { label: 'Message', invalid: true, helperText: 'Not valid.' }
      })
      expect(getByTestId(NATIVE).getAttribute('aria-invalid')).toBe('true')
      expect(getByTestId(ROOT).getAttribute('data-invalid')).toBe('true')
    })

    it('does not set data-invalid or aria-invalid by default', () => {
      const { getByTestId } = render(FieldTextarea, { props: { label: 'Message' } })
      expect(getByTestId(ROOT)).not.toHaveAttribute('data-invalid')
      expect(getByTestId(NATIVE)).not.toHaveAttribute('aria-invalid')
    })
  })

  describe('disabled', () => {
    it('disables the native textarea and marks data-disabled on the root', () => {
      const { getByTestId } = render(FieldTextarea, { props: { label: 'Message', disabled: true } })
      expect(getByTestId(NATIVE)).toBeDisabled()
      expect(getByTestId(ROOT).getAttribute('data-disabled')).toBe('true')
    })

    it('renders the lock icon inside the helper when disabled with helper text', () => {
      const { getByTestId } = render(FieldTextarea, {
        props: { label: 'Message', disabled: true, helperText: 'This field is locked.' }
      })
      expect(getByTestId(`${ROOT}__helper-icon`)).toBeTruthy()
      expect(getByTestId(`${ROOT}__helper`).getAttribute('data-disabled')).toBe('true')
    })

    it('does not set data-disabled by default', () => {
      const { getByTestId } = render(FieldTextarea, { props: { label: 'Message' } })
      expect(getByTestId(ROOT)).not.toHaveAttribute('data-disabled')
    })
  })

  describe('readonly', () => {
    it('marks the native textarea readonly and sets data-readonly on the root', () => {
      const { getByTestId } = render(FieldTextarea, { props: { label: 'Message', readonly: true } })
      expect((getByTestId(NATIVE) as HTMLTextAreaElement).readOnly).toBe(true)
      expect(getByTestId(ROOT)).toHaveAttribute('data-readonly')
    })

    it('does not set data-readonly by default', () => {
      const { getByTestId } = render(FieldTextarea, { props: { label: 'Message' } })
      expect(getByTestId(ROOT)).not.toHaveAttribute('data-readonly')
    })
  })

  describe('accessibility', () => {
    it('has no a11y violations in the default labelled + helper state', async () => {
      const { container } = render(FieldTextarea, {
        props: { label: 'Message', helperText: 'Up to 500 characters.', inputId: 'a11y-default' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no a11y violations in the invalid state', async () => {
      const { container } = render(FieldTextarea, {
        props: {
          label: 'Message',
          invalid: true,
          modelValue: 'some text',
          helperText: 'This value is not valid.',
          inputId: 'a11y-invalid'
        }
      })
      await expectNoA11yViolations(container)
    })

    it('has no a11y violations in the disabled state', async () => {
      const { container } = render(FieldTextarea, {
        props: { label: 'Message', disabled: true, helperText: 'Locked.', inputId: 'a11y-disabled' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('story fixtures', () => {
    it('composes the Required story with required semantics', () => {
      const { getByTestId } = render(Required())
      expect(getByTestId(ROOT).getAttribute('data-required')).toBe('true')
      expect(getByTestId(NATIVE).getAttribute('aria-required')).toBe('true')
    })

    it('composes the Invalid story with invalid semantics and a seeded value', () => {
      const { getByTestId } = render(Invalid())
      expect(getByTestId(ROOT).getAttribute('data-invalid')).toBe('true')
      expect(getByTestId(NATIVE)).toHaveValue('Text filled')
      expect(getByTestId(NATIVE).getAttribute('aria-invalid')).toBe('true')
    })
  })
})
