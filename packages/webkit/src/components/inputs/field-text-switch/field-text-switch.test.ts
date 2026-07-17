import { userEvent } from '@storybook/test'
import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/field-text-switch/FieldTextSwitch.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FieldTextSwitch from './field-text-switch.vue'

const { Default, SwitchOff, Invalid, Disabled } = composeStories(stories)

describe('FieldTextSwitch', () => {
  describe('data-testid', () => {
    it('renders the root fallback testid and the composed parts', () => {
      const { getByTestId } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', helperText: 'Helper' }
      })

      expect(getByTestId('input-field-text-switch')).toBeTruthy()
      expect(getByTestId('input-field-text-switch__label')).toBeTruthy()
      expect(getByTestId('input-field-text-switch__group')).toBeTruthy()
      expect(getByTestId('input-field-text-switch__switch-slot')).toBeTruthy()
      expect(getByTestId('input-field-text-switch__switch')).toBeTruthy()
      expect(getByTestId('input-field-text-switch__helper')).toBeTruthy()
    })

    it('honors a consumer-provided data-testid on the root and its suffixed parts', () => {
      const { getByTestId } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', helperText: 'Helper' },
        attrs: { 'data-testid': 'my-field' }
      })

      expect(getByTestId('my-field')).toBeTruthy()
      expect(getByTestId('my-field__label')).toBeTruthy()
      expect(getByTestId('my-field__group')).toBeTruthy()
      expect(getByTestId('my-field__switch')).toBeTruthy()
      expect(getByTestId('my-field__helper')).toBeTruthy()
    })
  })

  describe('switch anatomy', () => {
    it('renders the trailing switch as a role=switch button reflecting enabled=false', () => {
      const { getByTestId } = render(FieldTextSwitch, { props: { label: 'Custom domain' } })

      const control = getByTestId('input-field-text-switch__switch')
      expect(control.tagName).toBe('BUTTON')
      expect(control.getAttribute('role')).toBe('switch')
      expect(control.getAttribute('aria-checked')).toBe('false')
    })

    it('reflects enabled=true as aria-checked=true on the switch', () => {
      const { getByTestId } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true }
      })

      expect(getByTestId('input-field-text-switch__switch').getAttribute('aria-checked')).toBe(
        'true'
      )
    })

    it('labels the switch after the field label', () => {
      const { getByTestId } = render(FieldTextSwitch, { props: { label: 'Custom domain' } })
      expect(getByTestId('input-field-text-switch__switch').getAttribute('aria-label')).toBe(
        'Toggle Custom domain'
      )
    })

    it('falls back to a generic switch label when the field has no label', () => {
      const { getByTestId } = render(FieldTextSwitch, {})
      expect(getByTestId('input-field-text-switch__switch').getAttribute('aria-label')).toBe(
        'Toggle field'
      )
    })
  })

  describe('data-enabled reflection', () => {
    it('mirrors enabled=true as data-enabled on the root', () => {
      const { getByTestId } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true }
      })
      expect(getByTestId('input-field-text-switch').getAttribute('data-enabled')).toBe('true')
    })

    it('omits data-enabled when the switch is off', () => {
      const { getByTestId } = render(FieldTextSwitch, { props: { label: 'Custom domain' } })
      expect(getByTestId('input-field-text-switch').getAttribute('data-enabled')).toBeNull()
    })
  })

  describe('input inertness (enabled x disabled)', () => {
    it('renders the input natively disabled while the switch is off (default)', () => {
      const { getByRole } = render(FieldTextSwitch, { props: { label: 'Custom domain' } })
      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
    })

    it('renders the input editable when enabled=true and not disabled', () => {
      const { getByRole } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true }
      })
      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(false)
    })

    it('keeps the input disabled when disabled=true even with the switch on', () => {
      const { getByRole } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true, disabled: true }
      })
      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
    })
  })

  describe('update:modelValue', () => {
    it('emits the typed value while the switch is on', async () => {
      const { getByRole, emitted } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true }
      })

      await fireEvent.update(getByRole('textbox'), 'mysite.com')

      const events = emitted()['update:modelValue'] as string[][]
      expect(events).toHaveLength(1)
      expect(events[0]).toEqual(['mysite.com'])
    })

    it('reflects the modelValue prop on the internal input', () => {
      const { getByRole } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true, modelValue: 'mysite.com' }
      })
      expect((getByRole('textbox') as HTMLInputElement).value).toBe('mysite.com')
    })

    it('does not emit while the switch is off and the user tries to type', async () => {
      const { getByRole, emitted } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: false }
      })
      const input = getByRole('textbox') as HTMLInputElement

      await userEvent.type(input, 'abc')

      expect(emitted()['update:modelValue']).toBeUndefined()
      expect(input.value).toBe('')
    })

    it('does not emit while readonly and the user tries to type', async () => {
      const { getByRole, emitted } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true, readonly: true, modelValue: 'locked' }
      })
      const input = getByRole('textbox') as HTMLInputElement

      expect(input.readOnly).toBe(true)
      await userEvent.type(input, 'abc')

      expect(emitted()['update:modelValue']).toBeUndefined()
      expect(input.value).toBe('locked')
    })
  })

  describe('update:enabled', () => {
    it('emits true when the switch is clicked while off', async () => {
      const { getByTestId, emitted } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: false }
      })

      await fireEvent.click(getByTestId('input-field-text-switch__switch'))

      expect(emitted()['update:enabled']).toEqual([[true]])
    })

    it('emits false when the switch is clicked while on', async () => {
      const { getByTestId, emitted } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true }
      })

      await fireEvent.click(getByTestId('input-field-text-switch__switch'))

      expect(emitted()['update:enabled']).toEqual([[false]])
    })

    it('emits on Space and Enter keydown on the switch', async () => {
      const { getByTestId, emitted } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: false }
      })
      const control = getByTestId('input-field-text-switch__switch')

      await fireEvent.keyDown(control, { key: ' ' })
      await fireEvent.keyDown(control, { key: 'Enter' })

      expect(emitted()['update:enabled']).toEqual([[true], [true]])
    })

    it('does not emit when the whole field is disabled', async () => {
      const { getByTestId, emitted } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true, disabled: true }
      })

      const control = getByTestId('input-field-text-switch__switch') as HTMLButtonElement
      expect(control.disabled).toBe(true)

      await userEvent.click(control)

      expect(emitted()['update:enabled']).toBeUndefined()
    })
  })

  describe('label / helper / aria wiring', () => {
    it('wires the label to the input via matching for/id when inputId is given', () => {
      const { getByTestId, getByRole } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true, inputId: 'domain-field' }
      })

      const label = getByTestId('input-field-text-switch__label')
      expect(label.tagName).toBe('LABEL')
      expect(label.getAttribute('for')).toBe('domain-field')
      expect(getByRole('textbox').id).toBe('domain-field')
    })

    it('omits the label row when no label is provided', () => {
      const { queryByTestId } = render(FieldTextSwitch, {})
      expect(queryByTestId('input-field-text-switch__label')).toBeNull()
    })

    it('points aria-describedby at the helper element when a helper is shown', () => {
      const { getByTestId, getByRole } = render(FieldTextSwitch, {
        props: {
          label: 'Custom domain',
          enabled: true,
          helperText: 'Only used while enabled.',
          inputId: 'domain-field'
        }
      })

      expect(getByRole('textbox').getAttribute('aria-describedby')).toBe('domain-field-helper')
      expect(getByTestId('input-field-text-switch__helper').id).toBe('domain-field-helper')
    })

    it('drops aria-describedby when no helper is rendered', () => {
      const { getByRole } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true }
      })
      expect(getByRole('textbox').getAttribute('aria-describedby')).toBeNull()
    })

    it('shows the locked fallback helper when disabled with no helper text', () => {
      const { getByTestId } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', disabled: true }
      })

      const helper = getByTestId('input-field-text-switch__helper')
      expect(helper.textContent).toContain('This field is locked.')
      expect(helper.getAttribute('data-kind')).toBe('disabled')
    })

    it('switches the helper to kind=invalid on the invalid state', () => {
      const { getByTestId } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', invalid: true, helperText: 'Enter a valid domain.' }
      })

      expect(getByTestId('input-field-text-switch__helper').getAttribute('data-kind')).toBe(
        'invalid'
      )
    })
  })

  describe('required / invalid / disabled reflection', () => {
    it('marks input, root, group and label for the required state', () => {
      const { getByTestId, getByRole } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true, required: true }
      })

      const input = getByRole('textbox') as HTMLInputElement
      expect(input.required).toBe(true)
      expect(input.getAttribute('aria-required')).toBe('true')
      expect(getByTestId('input-field-text-switch').getAttribute('data-required')).toBe('true')
      expect(getByTestId('input-field-text-switch__group').getAttribute('data-required')).toBe(
        'true'
      )
      expect(getByTestId('input-field-text-switch__label__required').textContent).toContain(
        '(Required)'
      )
    })

    it('marks input, root and group for the invalid state', () => {
      const { getByTestId, getByRole } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true, invalid: true }
      })

      expect(getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
      expect(getByTestId('input-field-text-switch').getAttribute('data-invalid')).toBe('true')
      expect(getByTestId('input-field-text-switch__group').getAttribute('data-invalid')).toBe(
        'true'
      )
    })

    it('marks root and group and locks both controls when disabled', () => {
      const { getByTestId, getByRole } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true, disabled: true }
      })

      expect(getByTestId('input-field-text-switch').getAttribute('data-disabled')).toBe('true')
      const group = getByTestId('input-field-text-switch__group')
      expect(group.getAttribute('data-disabled')).toBe('true')
      expect(group.getAttribute('aria-disabled')).toBe('true')
      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
      expect((getByTestId('input-field-text-switch__switch') as HTMLButtonElement).disabled).toBe(
        true
      )
    })
  })

  describe('a11y (axe)', () => {
    it('has no violations in the default (switch off) state', async () => {
      const { container } = render(FieldTextSwitch, {
        props: {
          label: 'Custom domain',
          helperText: 'Toggle the switch to enable this field.',
          inputId: 'a11y-off'
        }
      })
      await expectNoA11yViolations(container)
    })

    it('has no violations with the switch on', async () => {
      const { container } = render(FieldTextSwitch, {
        props: {
          label: 'Custom domain',
          enabled: true,
          modelValue: 'mysite.com',
          helperText: 'Only used while the feature is enabled.',
          inputId: 'a11y-on'
        }
      })
      await expectNoA11yViolations(container)
    })

    it('has no violations in the disabled state', async () => {
      const { container } = render(FieldTextSwitch, {
        props: { label: 'Custom domain', enabled: true, disabled: true, inputId: 'a11y-disabled' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('story fixtures (composeStories)', () => {
    it('renders the Default story with the switch on and the input editable', () => {
      const { getByTestId, getByRole } = render(Default)

      expect(getByTestId('input-field-text-switch')).toBeTruthy()
      expect(getByTestId('input-field-text-switch__switch').getAttribute('aria-checked')).toBe(
        'true'
      )
      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(false)
    })

    it('toggles the Default story switch off through the story v-model', async () => {
      const { getByTestId, getByRole } = render(Default)

      await fireEvent.click(getByTestId('input-field-text-switch__switch'))

      expect(getByTestId('input-field-text-switch__switch').getAttribute('aria-checked')).toBe(
        'false'
      )
      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
    })

    it('renders the SwitchOff story with an inert input that unlocks on toggle', async () => {
      const { getByTestId, getByRole } = render(SwitchOff)

      expect(getByTestId('input-field-text-switch__switch').getAttribute('aria-checked')).toBe(
        'false'
      )
      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true)

      await fireEvent.click(getByTestId('input-field-text-switch__switch'))

      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(false)
    })

    it('renders the Invalid story with aria-invalid on the input', () => {
      const { getByRole } = render(Invalid)
      expect(getByRole('textbox').getAttribute('aria-invalid')).toBe('true')
    })

    it('renders the Disabled story fully locked with the fallback helper', () => {
      const { getByTestId, getByRole } = render(Disabled)

      expect(getByTestId('input-field-text-switch').getAttribute('data-disabled')).toBe('true')
      expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
      expect((getByTestId('input-field-text-switch__switch') as HTMLButtonElement).disabled).toBe(
        true
      )
      expect(getByTestId('input-field-text-switch__helper').textContent).toContain(
        'This field is locked.'
      )
    })
  })
})
