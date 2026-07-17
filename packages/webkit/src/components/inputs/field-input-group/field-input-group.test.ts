import { userEvent } from '@storybook/test'
import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/field-input-group/FieldInputGroup.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FieldInputGroup from './field-input-group.vue'

const { Default, WithSlots, Invalid, Disabled, Icons } = composeStories(stories)

describe('FieldInputGroup', () => {
  describe('data-testid', () => {
    it('renders the root fallback testid and the composed parts', () => {
      const { getByTestId } = render(FieldInputGroup, {
        props: { label: 'Website', helperText: 'Helper' }
      })

      expect(getByTestId('input-field-input-group')).toBeTruthy()
      expect(getByTestId('input-field-input-group__label')).toBeTruthy()
      expect(getByTestId('input-field-input-group__group')).toBeTruthy()
      expect(getByTestId('input-field-input-group__helper')).toBeTruthy()
    })

    it('honors a consumer-provided data-testid on the root and its suffixed parts', () => {
      const { getByTestId } = render(FieldInputGroup, {
        props: { label: 'Website', helperText: 'Helper' },
        attrs: { 'data-testid': 'my-field' }
      })

      expect(getByTestId('my-field')).toBeTruthy()
      expect(getByTestId('my-field__label')).toBeTruthy()
      expect(getByTestId('my-field__group')).toBeTruthy()
      expect(getByTestId('my-field__helper')).toBeTruthy()
    })
  })

  describe('label & helper rows', () => {
    it('omits the label row when no label is provided', () => {
      const { queryByTestId } = render(FieldInputGroup, { props: { helperText: 'Helper' } })
      expect(queryByTestId('input-field-input-group__label')).toBeNull()
    })

    it('omits the helper row when there is no helper text and the field is enabled', () => {
      const { queryByTestId } = render(FieldInputGroup, { props: { label: 'Website' } })
      expect(queryByTestId('input-field-input-group__helper')).toBeNull()
    })

    it('shows the locked fallback helper with the lock icon when disabled with no helper text', () => {
      const { getByTestId } = render(FieldInputGroup, {
        props: { label: 'Website', disabled: true }
      })

      const helper = getByTestId('input-field-input-group__helper')
      expect(helper.textContent).toContain('This field is locked.')
      expect(helper.getAttribute('data-kind')).toBe('disabled')
      expect(getByTestId('input-field-input-group__helper__icon')).toBeTruthy()
    })

    it.each([
      [{ invalid: true }, 'invalid'],
      [{ required: true }, 'required'],
      [{ disabled: true, invalid: true }, 'disabled'],
      [{ invalid: true, required: true }, 'invalid'],
      [{}, 'helper']
    ] as const)('computes helper kind by precedence: %o -> %s', (state, kind) => {
      const { getByTestId } = render(FieldInputGroup, {
        props: { label: 'Website', helperText: 'Message', ...state }
      })

      expect(getByTestId('input-field-input-group__helper').getAttribute('data-kind')).toBe(kind)
    })
  })

  describe('internal input & v-model', () => {
    it('forwards placeholder and name to the internal input', () => {
      const { getByRole } = render(FieldInputGroup, {
        props: { label: 'Website', placeholder: 'mysite', name: 'website' }
      })

      const input = getByRole('textbox') as HTMLInputElement
      expect(input.getAttribute('placeholder')).toBe('mysite')
      expect(input.getAttribute('name')).toBe('website')
    })

    it('reflects the modelValue prop on the internal input', () => {
      const { getByRole } = render(FieldInputGroup, {
        props: { label: 'Website', modelValue: 'mysite' }
      })

      expect((getByRole('textbox') as HTMLInputElement).value).toBe('mysite')
    })

    it('emits update:modelValue with the typed value on input', async () => {
      const { getByRole, emitted } = render(FieldInputGroup, { props: { label: 'Website' } })

      await fireEvent.update(getByRole('textbox'), 'my-domain')

      const events = emitted()['update:modelValue'] as string[][]
      expect(events).toHaveLength(1)
      expect(events[0]).toEqual(['my-domain'])
    })

    it('emits the latest value on successive inputs', async () => {
      const { getByRole, emitted } = render(FieldInputGroup, { props: { label: 'Website' } })
      const input = getByRole('textbox')

      await fireEvent.update(input, 'a')
      await fireEvent.update(input, 'ab')

      const events = emitted()['update:modelValue'] as string[][]
      expect(events).toHaveLength(2)
      expect(events[1]).toEqual(['ab'])
    })
  })

  describe('suppression (disabled / readonly)', () => {
    it('does not emit update:modelValue when disabled and the user tries to type', async () => {
      const { getByRole, emitted } = render(FieldInputGroup, {
        props: { label: 'Website', disabled: true }
      })
      const input = getByRole('textbox') as HTMLInputElement

      expect(input.disabled).toBe(true)
      await userEvent.type(input, 'abc')

      expect(emitted()['update:modelValue']).toBeUndefined()
      expect(input.value).toBe('')
    })

    it('does not emit update:modelValue when readonly and the user tries to type', async () => {
      const { getByRole, emitted } = render(FieldInputGroup, {
        props: { label: 'Website', modelValue: 'locked', readonly: true }
      })
      const input = getByRole('textbox') as HTMLInputElement

      expect(input.readOnly).toBe(true)
      await userEvent.type(input, 'abc')

      expect(emitted()['update:modelValue']).toBeUndefined()
      expect(input.value).toBe('locked')
    })
  })

  describe('label / aria wiring', () => {
    it('wires the label to the input via matching for/id when inputId is given', () => {
      const { getByTestId, getByRole } = render(FieldInputGroup, {
        props: { label: 'Website', inputId: 'site-field' }
      })

      const label = getByTestId('input-field-input-group__label')
      expect(label.tagName).toBe('LABEL')
      expect(label.getAttribute('for')).toBe('site-field')
      expect(getByRole('textbox').id).toBe('site-field')
    })

    it('auto-generates a matching for/id pair when inputId is empty', () => {
      const { getByTestId, getByRole } = render(FieldInputGroup, {
        props: { label: 'Website' }
      })

      const forAttr = getByTestId('input-field-input-group__label').getAttribute('for')
      expect(forAttr).toBeTruthy()
      expect(getByRole('textbox').id).toBe(forAttr)
    })

    it('points aria-describedby at the helper element when a helper is shown', () => {
      const { getByTestId, getByRole } = render(FieldInputGroup, {
        props: { label: 'Website', helperText: 'We need this.', inputId: 'site-field' }
      })

      expect(getByRole('textbox').getAttribute('aria-describedby')).toBe('site-field-helper')
      expect(getByTestId('input-field-input-group__helper').id).toBe('site-field-helper')
    })

    it('drops aria-describedby when no helper is rendered', () => {
      const { getByRole } = render(FieldInputGroup, { props: { label: 'Website' } })
      expect(getByRole('textbox').getAttribute('aria-describedby')).toBeNull()
    })

    it('keeps aria-describedby pointing at the fallback helper when disabled', () => {
      const { getByRole } = render(FieldInputGroup, {
        props: { label: 'Website', disabled: true, inputId: 'site-field' }
      })

      expect(getByRole('textbox').getAttribute('aria-describedby')).toBe('site-field-helper')
    })
  })

  describe('required', () => {
    it('marks input, root, group and label for the required state', () => {
      const { getByTestId, getByRole } = render(FieldInputGroup, {
        props: { label: 'Website', required: true }
      })

      const input = getByRole('textbox') as HTMLInputElement
      expect(input.required).toBe(true)
      expect(input.getAttribute('aria-required')).toBe('true')
      expect(getByTestId('input-field-input-group').getAttribute('data-required')).toBe('true')
      expect(getByTestId('input-field-input-group__group').getAttribute('data-required')).toBe(
        'true'
      )
      expect(getByTestId('input-field-input-group__label__required').textContent).toContain(
        '(Required)'
      )
    })
  })

  describe('invalid', () => {
    it('marks input, root and group for the invalid state', () => {
      const { getByTestId, getByRole } = render(FieldInputGroup, {
        props: { label: 'Website', invalid: true, helperText: 'Enter a valid domain.' }
      })

      expect(getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
      expect(getByTestId('input-field-input-group').getAttribute('data-invalid')).toBe('true')
      const group = getByTestId('input-field-input-group__group')
      expect(group.getAttribute('data-invalid')).toBe('true')
      expect(group.getAttribute('aria-invalid')).toBe('true')
    })
  })

  describe('disabled', () => {
    it('disables the native input and marks root and group', () => {
      const { getByTestId, getByRole } = render(FieldInputGroup, {
        props: { label: 'Website', disabled: true }
      })

      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
      expect(getByTestId('input-field-input-group').getAttribute('data-disabled')).toBe('true')
      const group = getByTestId('input-field-input-group__group')
      expect(group.getAttribute('data-disabled')).toBe('true')
      expect(group.getAttribute('aria-disabled')).toBe('true')
    })
  })

  describe('side slots', () => {
    it('renders the left and right slot content inside addons', () => {
      const { getByTestId } = render(FieldInputGroup, {
        props: { label: 'Website' },
        slots: { left: 'https://', right: '.com' }
      })

      expect(getByTestId('input-field-input-group__addon-left').textContent).toBe('https://')
      expect(getByTestId('input-field-input-group__addon-right').textContent).toBe('.com')
    })

    it('omits the addons when the slots are not provided', () => {
      const { queryByTestId } = render(FieldInputGroup, { props: { label: 'Website' } })

      expect(queryByTestId('input-field-input-group__addon-left')).toBeNull()
      expect(queryByTestId('input-field-input-group__addon-right')).toBeNull()
    })
  })

  describe('a11y (axe)', () => {
    it('has no violations in the default labelled + helper state', async () => {
      const { container } = render(FieldInputGroup, {
        props: {
          label: 'Website',
          helperText: 'Enter the domain without the scheme.',
          inputId: 'a11y-default'
        },
        slots: { left: 'https://', right: '.com' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no violations in the invalid state', async () => {
      const { container } = render(FieldInputGroup, {
        props: {
          label: 'Website',
          invalid: true,
          modelValue: 'not a domain',
          helperText: 'Enter a valid domain.',
          inputId: 'a11y-invalid'
        }
      })
      await expectNoA11yViolations(container)
    })

    it('has no violations in the disabled state', async () => {
      const { container } = render(FieldInputGroup, {
        props: { label: 'Website', disabled: true, inputId: 'a11y-disabled' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('story fixtures (composeStories)', () => {
    it('renders the Default story with label, group and helper', () => {
      const { getByTestId } = render(Default)

      expect(getByTestId('input-field-input-group')).toBeTruthy()
      expect(getByTestId('input-field-input-group__label').textContent).toContain('Website')
      expect(getByTestId('input-field-input-group__group')).toBeTruthy()
    })

    it('renders the WithSlots story with both addons filled', () => {
      const { getByTestId } = render(WithSlots)

      expect(getByTestId('input-field-input-group__addon-left').textContent).toBe('https://')
      expect(getByTestId('input-field-input-group__addon-right').textContent).toBe('.com')
    })

    it('renders the Invalid story with aria-invalid on the input', () => {
      const { getByRole } = render(Invalid)
      expect(getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
    })

    it('renders the Disabled story with the locked fallback helper', () => {
      const { getByRole, getByTestId } = render(Disabled)

      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
      expect(getByTestId('input-field-input-group__helper').textContent).toContain(
        'This field is locked.'
      )
    })

    it('renders the Icons story with icons inside both addons', () => {
      const { getByTestId } = render(Icons)

      expect(getByTestId('input-field-input-group__addon-left').querySelector('i')).not.toBeNull()
      expect(getByTestId('input-field-input-group__addon-right').querySelector('i')).not.toBeNull()
    })
  })
})
