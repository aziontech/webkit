import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/FieldSwitch.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FieldSwitch from './field-switch.vue'

const { Default, States, Disabled } = composeStories(stories)

describe('FieldSwitch', () => {
  describe('data-testid', () => {
    it('renders the input-field-switch fallback testid on the root and inner control', () => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Notifications' }
      })

      expect(getByTestId('input-field-switch')).toBeTruthy()
      expect(getByTestId('input-field-switch__control')).toBeTruthy()
      expect(getByTestId('input-field-switch__content')).toBeTruthy()
    })

    it('propagates a consumer-supplied data-testid to the derived parts', () => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Notifications' },
        attrs: { 'data-testid': 'my-field' }
      })

      expect(getByTestId('my-field')).toBeTruthy()
      expect(getByTestId('my-field__control')).toBeTruthy()
      expect(getByTestId('my-field__content')).toBeTruthy()
    })
  })

  describe('root semantics', () => {
    it('renders a div as the root element', () => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Notifications' }
      })

      expect(getByTestId('input-field-switch').tagName).toBe('DIV')
    })

    it('associates the inner label with the inner switch via for/id', () => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Notifications' }
      })

      const label = getByTestId('input-field-switch__label')
      const control = getByTestId('input-field-switch__control')
      const forAttr = label.getAttribute('for')

      expect(forAttr).toBeTruthy()
      expect(control.getAttribute('id')).toBe(forAttr)
    })
  })

  describe('label and description', () => {
    it('renders the label text when provided', () => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Enable feature' }
      })

      const label = getByTestId('input-field-switch__label')
      expect(label.textContent?.trim()).toBe('Enable feature')
    })

    it('omits the label span when no label is provided', () => {
      const { queryByTestId } = render(FieldSwitch, {
        props: { label: '', 'aria-label': 'Toggle feature' }
      })

      expect(queryByTestId('input-field-switch__label')).toBeNull()
    })

    it('renders the description text when provided', () => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Enable feature', description: 'Turns the thing on' }
      })

      const description = getByTestId('input-field-switch__description')
      expect(description.textContent?.trim()).toBe('Turns the thing on')
    })

    it('omits the description span when no description is provided', () => {
      const { queryByTestId } = render(FieldSwitch, {
        props: { label: 'Enable feature' }
      })

      expect(queryByTestId('input-field-switch__description')).toBeNull()
    })
  })

  describe('modelValue reflection', () => {
    it('reflects modelValue=true onto the inner switch aria-checked', () => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Enable feature', modelValue: true }
      })

      expect(getByTestId('input-field-switch__control').getAttribute('aria-checked')).toBe('true')
    })

    it('reflects modelValue=false onto the inner switch aria-checked', () => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Enable feature', modelValue: false }
      })

      expect(getByTestId('input-field-switch__control').getAttribute('aria-checked')).toBe('false')
    })
  })

  describe('update:modelValue — click', () => {
    it('emits the negated boolean when toggling from off', async () => {
      const { getByTestId, emitted } = render(FieldSwitch, {
        props: { label: 'Enable feature', modelValue: false }
      })

      await fireEvent.click(getByTestId('input-field-switch__control'))

      expect(emitted()['update:modelValue']).toBeTruthy()
      expect(emitted()['update:modelValue'][0]).toEqual([true])
    })

    it('emits false when toggling from on', async () => {
      const { getByTestId, emitted } = render(FieldSwitch, {
        props: { label: 'Enable feature', modelValue: true }
      })

      await fireEvent.click(getByTestId('input-field-switch__control'))

      expect(emitted()['update:modelValue'][0]).toEqual([false])
    })
  })

  describe('update:modelValue — keyboard', () => {
    it('emits when pressing Space on the inner switch', async () => {
      const { getByTestId, emitted } = render(FieldSwitch, {
        props: { label: 'Enable feature', modelValue: false }
      })

      await fireEvent.keyDown(getByTestId('input-field-switch__control'), { key: ' ' })

      expect(emitted()['update:modelValue']).toBeTruthy()
      expect(emitted()['update:modelValue'][0]).toEqual([true])
    })

    it('emits when pressing Enter on the inner switch', async () => {
      const { getByTestId, emitted } = render(FieldSwitch, {
        props: { label: 'Enable feature', modelValue: true }
      })

      await fireEvent.keyDown(getByTestId('input-field-switch__control'), { key: 'Enter' })

      expect(emitted()['update:modelValue'][0]).toEqual([false])
    })
  })

  describe('disabled', () => {
    it('sets data-disabled on the root when disabled', () => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Enable feature', disabled: true }
      })

      expect(getByTestId('input-field-switch').getAttribute('data-disabled')).toBe('true')
    })

    it('omits data-disabled on the root when enabled', () => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Enable feature', disabled: false }
      })

      expect(getByTestId('input-field-switch').getAttribute('data-disabled')).toBeNull()
    })

    it('renders the inner control as natively disabled with aria-disabled', () => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Enable feature', disabled: true }
      })

      const control = getByTestId('input-field-switch__control') as HTMLButtonElement
      expect(control.disabled).toBe(true)
      expect(control.getAttribute('aria-disabled')).toBe('true')
    })

    it('leaves the inner control enabled without aria-disabled when not disabled', () => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Enable feature', disabled: false }
      })

      const control = getByTestId('input-field-switch__control') as HTMLButtonElement
      expect(control.disabled).toBe(false)
      expect(control.getAttribute('aria-disabled')).toBeNull()
    })
  })

  describe('disabled helper badge', () => {
    it('renders the helper badge only when disabled and helperText are both set', () => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Enable feature', disabled: true, helperText: 'Locked by admin' }
      })

      const helper = getByTestId('input-field-switch__helper')
      expect(helper).toBeTruthy()
      expect(getByTestId('input-field-switch__helper-text').textContent?.trim()).toBe(
        'Locked by admin'
      )
    })

    it('omits the helper badge when helperText is set but not disabled', () => {
      const { queryByTestId } = render(FieldSwitch, {
        props: { label: 'Enable feature', disabled: false, helperText: 'Locked by admin' }
      })

      expect(queryByTestId('input-field-switch__helper')).toBeNull()
    })

    it('omits the helper badge when disabled but no helperText', () => {
      const { queryByTestId } = render(FieldSwitch, {
        props: { label: 'Enable feature', disabled: true, helperText: '' }
      })

      expect(queryByTestId('input-field-switch__helper')).toBeNull()
    })
  })

  describe('a11y', () => {
    it('has no violations with a label in the off state', async () => {
      const { container } = render(FieldSwitch, {
        props: { label: 'Enable feature', description: 'Turns the thing on', modelValue: false }
      })

      await expectNoA11yViolations(container)
    })

    it('has no violations in the disabled state with a helper badge', async () => {
      const { container } = render(FieldSwitch, {
        props: {
          label: 'Enable feature',
          modelValue: true,
          disabled: true,
          helperText: 'Locked by admin'
        }
      })

      await expectNoA11yViolations(container)
    })
  })

  describe('smoke over modelValue states', () => {
    it.each([
      [false, 'false'],
      [true, 'true']
    ] as const)('reflects modelValue=%s as aria-checked=%s', (value, expected) => {
      const { getByTestId } = render(FieldSwitch, {
        props: { label: 'Enable feature', modelValue: value }
      })

      expect(getByTestId('input-field-switch__control').getAttribute('aria-checked')).toBe(expected)
    })
  })

  describe('story fixtures (composeStories)', () => {
    it('renders the Default story', () => {
      const { getByTestId } = render(Default())

      expect(getByTestId('input-field-switch')).toBeTruthy()
      expect(getByTestId('input-field-switch__control').getAttribute('role')).toBe('switch')
    })

    it('renders the States story with two field switches', () => {
      const { getAllByTestId } = render(States())

      expect(getAllByTestId('input-field-switch').length).toBe(2)
    })

    it('renders the Disabled story with a locked helper badge', () => {
      const { getByTestId } = render(Disabled())

      expect(getByTestId('input-field-switch').getAttribute('data-disabled')).toBe('true')
      expect(getByTestId('input-field-switch__helper')).toBeTruthy()
    })
  })
})
