import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/FieldPassword.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FieldPassword from './field-password.vue'

const { Default, Invalid, Disabled, Toggle } = composeStories(stories)

describe('FieldPassword', () => {
  it('renders a <div> root carrying the default data-testid', () => {
    const { getByTestId } = render(FieldPassword, { props: { label: 'Password' } })

    const root = getByTestId('input-field-password')
    expect(root.tagName).toBe('DIV')
  })

  it('renders the label sub-node with the label text and wires its "for" to the input id', () => {
    const { getByTestId } = render(FieldPassword, {
      props: { label: 'Password', inputId: 'pw-1' }
    })

    const label = getByTestId('input-field-password__label')
    expect(label).toHaveTextContent('Password')
    // The label targets the input via `for`, and the input carries that id.
    expect(label).toHaveAttribute('for', 'pw-1')

    const input = getByTestId('input-field-password__input')
    expect(input).toHaveAttribute('id', 'pw-1')
  })

  it('omits the label row when no label prop is given', () => {
    const { queryByTestId } = render(FieldPassword, { props: {} })

    expect(queryByTestId('input-field-password__label')).toBeNull()
  })

  it('renders the underlying input as a password field with the placeholder', () => {
    const { getByTestId } = render(FieldPassword, {
      props: { label: 'Password', placeholder: 'Enter your password' }
    })

    const input = getByTestId('input-field-password__input')
    expect(input.tagName).toBe('INPUT')
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAttribute('placeholder', 'Enter your password')
  })

  it('forwards maxLength to the native input as maxlength', () => {
    const { getByTestId } = render(FieldPassword, {
      props: { label: 'Password', maxLength: 12 }
    })

    expect(getByTestId('input-field-password__input')).toHaveAttribute('maxlength', '12')
  })

  it('renders the helper sub-node with the helperText and points aria-describedby at it', () => {
    const { getByTestId } = render(FieldPassword, {
      props: { label: 'Password', helperText: 'At least 8 characters.' }
    })

    const helper = getByTestId('input-field-password__helper')
    expect(helper).toHaveTextContent('At least 8 characters.')

    // The input is described by the helper element (same id on both sides).
    const input = getByTestId('input-field-password__input')
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(helper).toHaveAttribute('id', describedBy as string)
  })

  it('omits the helper row when there is no helperText and the field is enabled', () => {
    const { queryByTestId, getByTestId } = render(FieldPassword, {
      props: { label: 'Password' }
    })

    expect(queryByTestId('input-field-password__helper')).toBeNull()
    // With no helper rendered, the input is not described by anything.
    expect(getByTestId('input-field-password__input')).not.toHaveAttribute('aria-describedby')
  })

  describe('update:modelValue', () => {
    it('re-emits update:modelValue with the typed value when the user types', async () => {
      const { getByTestId, emitted } = render(FieldPassword, { props: { label: 'Password' } })

      const input = getByTestId('input-field-password__input')
      await fireEvent.update(input, 'hunter2')

      expect(emitted('update:modelValue')).toBeTruthy()
      expect(emitted('update:modelValue')).toHaveLength(1)
      expect(emitted('update:modelValue')[0]).toEqual(['hunter2'])
    })

    it('reflects the modelValue prop as the input value', () => {
      const { getByTestId } = render(FieldPassword, {
        props: { label: 'Password', modelValue: 'seeded' }
      })

      expect(getByTestId('input-field-password__input')).toHaveValue('seeded')
    })

    it('does not emit update:modelValue while disabled (input is disabled)', () => {
      const { getByTestId, emitted } = render(FieldPassword, {
        props: { label: 'Password', disabled: true }
      })

      const input = getByTestId('input-field-password__input') as HTMLInputElement
      expect(input).toBeDisabled()
      expect(emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('disabled', () => {
    it('disables the input, marks the root data-disabled, and shows the locked helper fallback', () => {
      const { getByTestId } = render(FieldPassword, {
        props: { label: 'Password', disabled: true }
      })

      expect(getByTestId('input-field-password')).toHaveAttribute('data-disabled')
      expect(getByTestId('input-field-password__input')).toBeDisabled()
      // No explicit helperText → disabled fallback copy is rendered.
      expect(getByTestId('input-field-password__helper')).toHaveTextContent('This field is locked.')
    })
  })

  describe('required', () => {
    it('sets native required and aria-required on the input and data-required on the root', () => {
      const { getByTestId } = render(FieldPassword, {
        props: { label: 'Password', required: true }
      })

      expect(getByTestId('input-field-password')).toHaveAttribute('data-required')

      const input = getByTestId('input-field-password__input')
      expect(input).toBeRequired()
      expect(input).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('invalid', () => {
    it('sets aria-invalid on the input and data-invalid on the root', () => {
      const { getByTestId } = render(FieldPassword, {
        props: { label: 'Password', invalid: true }
      })

      expect(getByTestId('input-field-password')).toHaveAttribute('data-invalid')
      expect(getByTestId('input-field-password__input')).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('toggleable', () => {
    it('renders the visibility toggle by default and reveals/hides the value on click', async () => {
      const { getByTestId, getByRole } = render(FieldPassword, {
        props: { label: 'Password', modelValue: 'secret' }
      })

      const input = getByTestId('input-field-password__input')
      // Masked by default: the value is rendered as a password field.
      expect(input).toHaveAttribute('type', 'password')

      const toggle = getByRole('button', { name: 'Show password' })
      await fireEvent.click(toggle)

      // After revealing, the input becomes a text field and the control's accessible name flips.
      expect(input).toHaveAttribute('type', 'text')
      const hideToggle = getByRole('button', { name: 'Hide password' })

      await fireEvent.click(hideToggle)
      // Toggling again re-masks the value and restores the original accessible name.
      expect(input).toHaveAttribute('type', 'password')
      expect(getByRole('button', { name: 'Show password' })).toBeInTheDocument()
    })

    it('renders no visibility toggle when toggleable is false', () => {
      const { queryByRole, getByTestId } = render(FieldPassword, {
        props: { label: 'Password', toggleable: false, modelValue: 'secret' }
      })

      expect(queryByRole('button', { name: 'Show password' })).toBeNull()
      // The field stays a plain password input.
      expect(getByTestId('input-field-password__input')).toHaveAttribute('type', 'password')
    })
  })

  it('honours a consumer-supplied data-testid on the root and derived sub-nodes', () => {
    const { getByTestId } = render(FieldPassword, {
      props: { label: 'Password', helperText: 'Hint' },
      attrs: { 'data-testid': 'my-field' }
    })

    expect(getByTestId('my-field').tagName).toBe('DIV')
    expect(getByTestId('my-field__label')).toHaveTextContent('Password')
    expect(getByTestId('my-field__input').tagName).toBe('INPUT')
    expect(getByTestId('my-field__helper')).toHaveTextContent('Hint')
  })

  it('forwards arbitrary attributes onto the root via $attrs', () => {
    const { getByTestId } = render(FieldPassword, {
      props: { label: 'Password' },
      attrs: { id: 'field-id', title: 'a field' }
    })

    const root = getByTestId('input-field-password')
    expect(root).toHaveAttribute('id', 'field-id')
    expect(root).toHaveAttribute('title', 'a field')
  })

  describe('accessibility', () => {
    // Passing inputId is the documented wiring: Label's `for` targets the input's `id`,
    // giving axe a real label association to validate.
    it('has no a11y violations for a labelled field with helper text', async () => {
      const { container } = render(FieldPassword, {
        props: { label: 'Password', helperText: 'At least 8 characters.', inputId: 'pw-a11y' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no a11y violations in the invalid state', async () => {
      const { container } = render(FieldPassword, {
        props: {
          label: 'Password',
          invalid: true,
          helperText: 'Password too short.',
          inputId: 'pw-a11y-invalid'
        }
      })
      await expectNoA11yViolations(container)
    })

    it('has no a11y violations in the disabled state', async () => {
      const { container } = render(FieldPassword, {
        props: { label: 'Password', disabled: true, inputId: 'pw-a11y-disabled' }
      })
      await expectNoA11yViolations(container)
    })
  })

  it('composes the Default story fixture', () => {
    const { getByTestId } = render(Default())

    expect(getByTestId('input-field-password__label')).toHaveTextContent('Password')
    expect(getByTestId('input-field-password__input')).toHaveAttribute('type', 'password')
    expect(getByTestId('input-field-password__helper')).toHaveTextContent('At least 8 characters.')
  })

  it('composes the Invalid story fixture', () => {
    const { getByTestId } = render(Invalid())

    expect(getByTestId('input-field-password')).toHaveAttribute('data-invalid')
    expect(getByTestId('input-field-password__input')).toHaveAttribute('aria-invalid', 'true')
  })

  it('composes the Disabled story fixture', () => {
    const { getByTestId } = render(Disabled())

    expect(getByTestId('input-field-password')).toHaveAttribute('data-disabled')
    expect(getByTestId('input-field-password__input')).toBeDisabled()
  })

  it('composes the Toggle story fixture (one field with toggle, one without)', () => {
    const { getAllByTestId, getAllByRole } = render(Toggle())

    // Two FieldPassword instances render two inputs.
    expect(getAllByTestId('input-field-password__input')).toHaveLength(2)
    // Only the toggleable field contributes a visibility toggle button.
    expect(getAllByRole('button', { name: 'Show password' })).toHaveLength(1)
  })
})
