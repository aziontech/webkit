import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/FieldSwitchBlock.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FieldSwitchBlock from './field-switch-block.vue'

const { Default, Disabled } = composeStories(stories)

// The inner Switch receives data-testid `${testId}__control`; the Switch renders a
// <button role="switch"> as its root, so the toggleable control is `<root>__control`.
const ROOT = 'input-field-switch-block'
const CONTROL = `${ROOT}__control`

describe('FieldSwitchBlock', () => {
  describe('data-testid anatomy', () => {
    it('renders the input-field-switch-block fallback on the label, card, row, control, and texts', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: false, label: 'Enable', description: 'desc' }
      })

      expect(getByTestId(ROOT)).toBeTruthy()
      expect(getByTestId(`${ROOT}__card`)).toBeTruthy()
      expect(getByTestId(`${ROOT}__row`)).toBeTruthy()
      expect(getByTestId(CONTROL)).toBeTruthy()
      expect(getByTestId(`${ROOT}__texts`)).toBeTruthy()
    })

    it('honors a consumer-supplied data-testid across the anatomy', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: false, label: 'Enable' },
        attrs: { 'data-testid': 'my-block' }
      })

      expect(getByTestId('my-block')).toBeTruthy()
      expect(getByTestId('my-block__card')).toBeTruthy()
      expect(getByTestId('my-block__row')).toBeTruthy()
      expect(getByTestId('my-block__control')).toBeTruthy()
      expect(getByTestId('my-block__texts')).toBeTruthy()
    })
  })

  describe('label / description text', () => {
    it('renders the label and description spans with their text', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: false, label: 'Primary label', description: 'Secondary text' }
      })

      expect(getByTestId(`${ROOT}__label`).textContent?.trim()).toBe('Primary label')
      expect(getByTestId(`${ROOT}__description`).textContent?.trim()).toBe('Secondary text')
    })

    it('omits the label and description spans when their props are empty', () => {
      const { queryByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: false }
      })

      expect(queryByTestId(`${ROOT}__label`)).toBeNull()
      expect(queryByTestId(`${ROOT}__description`)).toBeNull()
    })
  })

  describe('control a11y semantics (Switch)', () => {
    it('exposes role="switch" with aria-checked=false when modelValue is false', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: false, label: 'Off' }
      })

      const control = getByTestId(CONTROL)
      expect(control.getAttribute('role')).toBe('switch')
      expect(control.getAttribute('aria-checked')).toBe('false')
    })

    it('sets aria-checked=true when modelValue is true', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: true, label: 'On' }
      })

      expect(getByTestId(CONTROL).getAttribute('aria-checked')).toBe('true')
    })
  })

  describe('checked-state derivation', () => {
    it('sets data-checked on the card when modelValue is true', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: true, label: 'On' }
      })

      expect(getByTestId(`${ROOT}__card`).getAttribute('data-checked')).toBe('true')
    })

    it('drops data-checked on the card when modelValue is false', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: false, label: 'Off' }
      })

      expect(getByTestId(`${ROOT}__card`).getAttribute('data-checked')).toBeNull()
    })
  })

  describe('data-highlighted derivation', () => {
    it('is highlighted when checked and not disabled', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: true, label: 'On' }
      })

      expect(getByTestId(`${ROOT}__card`).getAttribute('data-highlighted')).toBe('true')
    })

    it('is not highlighted when unchecked and not disabled', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: false, label: 'Off' }
      })

      expect(getByTestId(`${ROOT}__card`).getAttribute('data-highlighted')).toBeNull()
    })

    it('is highlighted when unchecked but disabled', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: false, disabled: true, label: 'Off + disabled' }
      })

      expect(getByTestId(`${ROOT}__card`).getAttribute('data-highlighted')).toBe('true')
    })

    it('is not highlighted when checked and disabled', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: true, disabled: true, label: 'On + disabled' }
      })

      expect(getByTestId(`${ROOT}__card`).getAttribute('data-highlighted')).toBeNull()
    })
  })

  describe('update:modelValue — v-model', () => {
    it('emits true when clicking the control while unchecked', async () => {
      const { getByTestId, emitted } = render(FieldSwitchBlock, {
        props: { modelValue: false, label: 'Toggle' }
      })

      await fireEvent.click(getByTestId(CONTROL))

      expect(emitted()['update:modelValue']).toBeTruthy()
      expect(emitted()['update:modelValue'][0]).toEqual([true])
    })

    it('emits false when clicking the control while checked', async () => {
      const { getByTestId, emitted } = render(FieldSwitchBlock, {
        props: { modelValue: true, label: 'Toggle' }
      })

      await fireEvent.click(getByTestId(CONTROL))

      expect(emitted()['update:modelValue'][0]).toEqual([false])
    })

    it('toggles via the Space key on the control', async () => {
      const { getByTestId, emitted } = render(FieldSwitchBlock, {
        props: { modelValue: false, label: 'Keyboard' }
      })

      await fireEvent.keyDown(getByTestId(CONTROL), { key: ' ' })

      expect(emitted()['update:modelValue']).toBeTruthy()
      expect(emitted()['update:modelValue'][0]).toEqual([true])
    })

    it('toggles via the Enter key on the control', async () => {
      const { getByTestId, emitted } = render(FieldSwitchBlock, {
        props: { modelValue: true, label: 'Keyboard' }
      })

      await fireEvent.keyDown(getByTestId(CONTROL), { key: 'Enter' })

      expect(emitted()['update:modelValue'][0]).toEqual([false])
    })
  })

  describe('disabled state', () => {
    it('sets data-disabled on the label and card when disabled', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: false, disabled: true, label: 'Locked' }
      })

      expect(getByTestId(ROOT).getAttribute('data-disabled')).toBe('true')
      expect(getByTestId(`${ROOT}__card`).getAttribute('data-disabled')).toBe('true')
      expect(getByTestId(`${ROOT}__row`).getAttribute('data-disabled')).toBe('true')
      expect(getByTestId(`${ROOT}__texts`).getAttribute('data-disabled')).toBe('true')
    })

    it('drops data-disabled when not disabled', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: false, disabled: false, label: 'Enabled' }
      })

      expect(getByTestId(ROOT).getAttribute('data-disabled')).toBeNull()
      expect(getByTestId(`${ROOT}__card`).getAttribute('data-disabled')).toBeNull()
    })
  })

  describe('helper badge', () => {
    it('renders the helper badge only when disabled and helperText is set', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: {
          modelValue: true,
          disabled: true,
          helperText: 'Managed by policy',
          label: 'Locked'
        }
      })

      expect(getByTestId(`${ROOT}__helper`)).toBeTruthy()
      expect(getByTestId(`${ROOT}__helper-icon`)).toBeTruthy()
      expect(getByTestId(`${ROOT}__helper-text`).textContent?.trim()).toBe('Managed by policy')
    })

    it('does not render the helper badge when enabled even if helperText is set', () => {
      const { queryByTestId } = render(FieldSwitchBlock, {
        props: {
          modelValue: true,
          disabled: false,
          helperText: 'Managed by policy',
          label: 'On'
        }
      })

      expect(queryByTestId(`${ROOT}__helper`)).toBeNull()
    })

    it('does not render the helper badge when disabled but helperText is empty', () => {
      const { queryByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: true, disabled: true, label: 'Locked' }
      })

      expect(queryByTestId(`${ROOT}__helper`)).toBeNull()
    })
  })

  describe('label association (generated id)', () => {
    it('shares the generated id between the label "for" and the control id', () => {
      const { getByTestId } = render(FieldSwitchBlock, {
        props: { modelValue: false, label: 'Enable feature' }
      })

      const forAttr = getByTestId(ROOT).getAttribute('for')
      expect(forAttr).toBeTruthy()
      expect(getByTestId(CONTROL).id).toBe(forAttr)
    })
  })

  describe('a11y', () => {
    it('has no violations when unchecked with a label and description', async () => {
      const { container } = render(FieldSwitchBlock, {
        props: {
          modelValue: false,
          label: 'Enable feature',
          description: 'Turns on the beta feature'
        }
      })

      await expectNoA11yViolations(container)
    })

    it('has no violations in the disabled state with a helper badge', async () => {
      const { container } = render(FieldSwitchBlock, {
        props: {
          modelValue: true,
          disabled: true,
          label: 'Enable feature',
          helperText: 'Managed by policy'
        }
      })

      await expectNoA11yViolations(container)
    })
  })

  describe('smoke over boolean state props', () => {
    it.each([
      ['unchecked', { modelValue: false, disabled: false }, null, null],
      ['checked', { modelValue: true, disabled: false }, 'true', 'true'],
      ['disabled-unchecked', { modelValue: false, disabled: true }, null, 'true'],
      ['disabled-checked', { modelValue: true, disabled: true }, 'true', null]
    ] as const)(
      'renders data-checked/data-highlighted for %s',
      (_label, props, expectedChecked, expectedHighlighted) => {
        const { getByTestId } = render(FieldSwitchBlock, {
          props: { ...props, label: 'Smoke' }
        })

        const card = getByTestId(`${ROOT}__card`)
        expect(card.getAttribute('data-checked')).toBe(expectedChecked)
        expect(card.getAttribute('data-highlighted')).toBe(expectedHighlighted)
      }
    )
  })

  describe('story fixtures (composeStories)', () => {
    it('renders the Default story with two blocks', () => {
      const { getAllByTestId } = render(Default())
      expect(getAllByTestId(ROOT).length).toBe(2)
    })

    it('renders the Disabled story with a disabled block and a helper badge', () => {
      const { getByTestId } = render(Disabled())
      expect(getByTestId(ROOT).getAttribute('data-disabled')).toBe('true')
      expect(getByTestId(`${ROOT}__helper`)).toBeTruthy()
    })
  })
})
