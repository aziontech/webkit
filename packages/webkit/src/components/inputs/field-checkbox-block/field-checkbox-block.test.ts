import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/field-checkbox-block/FieldCheckboxBlock.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FieldCheckboxBlock from './field-checkbox-block.vue'

const { Default, Disabled } = composeStories(stories)

// The inner Checkbox receives data-testid `${testId}__control`; its native input
// is `${controlTestId}__input`. So the clickable input is `<root>__control__input`.
const ROOT = 'input-field-checkbox-block'
const INPUT = `${ROOT}__control__input`

describe('FieldCheckboxBlock', () => {
  describe('data-testid anatomy', () => {
    it('renders the input-field-checkbox-block fallback on the label, card, row, control, and texts', () => {
      const { getByTestId } = render(FieldCheckboxBlock, {
        props: { modelValue: false, label: 'Enable', description: 'desc' }
      })

      expect(getByTestId(ROOT)).toBeTruthy()
      expect(getByTestId(`${ROOT}__card`)).toBeTruthy()
      expect(getByTestId(`${ROOT}__row`)).toBeTruthy()
      expect(getByTestId(`${ROOT}__control`)).toBeTruthy()
      expect(getByTestId(`${ROOT}__texts`)).toBeTruthy()
    })

    it('honors a consumer-supplied data-testid across the anatomy', () => {
      const { getByTestId } = render(FieldCheckboxBlock, {
        props: { modelValue: false, label: 'Enable' },
        attrs: { 'data-testid': 'my-block' }
      })

      expect(getByTestId('my-block')).toBeTruthy()
      expect(getByTestId('my-block__card')).toBeTruthy()
      expect(getByTestId('my-block__control')).toBeTruthy()
      expect(getByTestId('my-block__texts')).toBeTruthy()
    })
  })

  describe('label / description text', () => {
    it('renders the label and description spans with their text', () => {
      const { getByTestId } = render(FieldCheckboxBlock, {
        props: { modelValue: false, label: 'Primary label', description: 'Secondary text' }
      })

      expect(getByTestId(`${ROOT}__label`).textContent?.trim()).toBe('Primary label')
      expect(getByTestId(`${ROOT}__description`).textContent?.trim()).toBe('Secondary text')
    })

    it('omits the label and description spans when their props are empty', () => {
      const { queryByTestId } = render(FieldCheckboxBlock, {
        props: { modelValue: false }
      })

      expect(queryByTestId(`${ROOT}__label`)).toBeNull()
      expect(queryByTestId(`${ROOT}__description`)).toBeNull()
    })
  })

  describe('checked-state derivation', () => {
    it('checks the native input and sets data-checked on the card when modelValue equals trueValue', () => {
      const { getByTestId } = render(FieldCheckboxBlock, {
        props: { modelValue: true, label: 'On' }
      })

      const input = getByTestId(INPUT) as HTMLInputElement
      expect(input.checked).toBe(true)
      expect(getByTestId(`${ROOT}__card`).getAttribute('data-checked')).toBe('true')
    })

    it('leaves the native input unchecked and drops data-checked when modelValue equals falseValue', () => {
      const { getByTestId } = render(FieldCheckboxBlock, {
        props: { modelValue: false, label: 'Off' }
      })

      const input = getByTestId(INPUT) as HTMLInputElement
      expect(input.checked).toBe(false)
      expect(getByTestId(`${ROOT}__card`).getAttribute('data-checked')).toBeNull()
    })

    it('derives checked from a custom trueValue', () => {
      // modelValue matches the custom trueValue -> checked. trueValue/falseValue
      // are typed boolean but the getter compares by strict equality on any value.
      const props: Record<string, unknown> = {
        modelValue: 'yes',
        trueValue: 'yes',
        falseValue: 'no',
        label: 'Custom'
      }
      const { getByTestId } = render(FieldCheckboxBlock, { props })

      expect((getByTestId(INPUT) as HTMLInputElement).checked).toBe(true)
    })
  })

  describe('data-highlighted derivation', () => {
    it('is highlighted when checked and not disabled', () => {
      const { getByTestId } = render(FieldCheckboxBlock, {
        props: { modelValue: true, label: 'On' }
      })

      expect(getByTestId(`${ROOT}__card`).getAttribute('data-highlighted')).toBe('true')
    })

    it('is not highlighted when unchecked and not disabled', () => {
      const { getByTestId } = render(FieldCheckboxBlock, {
        props: { modelValue: false, label: 'Off' }
      })

      expect(getByTestId(`${ROOT}__card`).getAttribute('data-highlighted')).toBeNull()
    })

    it('is highlighted when unchecked but disabled', () => {
      const { getByTestId } = render(FieldCheckboxBlock, {
        props: { modelValue: false, disabled: true, label: 'Off + disabled' }
      })

      expect(getByTestId(`${ROOT}__card`).getAttribute('data-highlighted')).toBe('true')
    })
  })

  describe('update:modelValue — v-model', () => {
    it('emits trueValue (true) when clicking an unchecked control', async () => {
      const { getByTestId, emitted } = render(FieldCheckboxBlock, {
        props: { modelValue: false, label: 'Toggle' }
      })

      await fireEvent.click(getByTestId(INPUT))

      expect(emitted()['update:modelValue']).toBeTruthy()
      expect(emitted()['update:modelValue'][0]).toEqual([true])
    })

    it('emits falseValue (false) when clicking a checked control', async () => {
      const { getByTestId, emitted } = render(FieldCheckboxBlock, {
        props: { modelValue: true, label: 'Toggle' }
      })

      await fireEvent.click(getByTestId(INPUT))

      expect(emitted()['update:modelValue'][0]).toEqual([false])
    })

    it('emits the custom trueValue when toggling on from a custom falseValue', async () => {
      const props: Record<string, unknown> = {
        modelValue: 'no',
        trueValue: 'yes',
        falseValue: 'no',
        label: 'Custom toggle'
      }
      const { getByTestId, emitted } = render(FieldCheckboxBlock, { props })

      await fireEvent.click(getByTestId(INPUT))

      expect(emitted()['update:modelValue'][0]).toEqual(['yes'])
    })
  })

  describe('disabled suppresses interaction', () => {
    it('sets the native disabled + data-disabled on the label and does not emit on change', async () => {
      const { getByTestId, emitted } = render(FieldCheckboxBlock, {
        props: { modelValue: false, disabled: true, label: 'Locked' }
      })

      const input = getByTestId(INPUT) as HTMLInputElement
      expect(input.disabled).toBe(true)
      expect(getByTestId(ROOT).getAttribute('data-disabled')).toBe('true')

      await fireEvent.change(input)

      expect(emitted()['update:modelValue']).toBeUndefined()
    })
  })

  describe('helper badge', () => {
    it('renders the helper badge only when disabled and helperText is set', () => {
      const { getByTestId } = render(FieldCheckboxBlock, {
        props: {
          modelValue: true,
          disabled: true,
          helperText: 'Managed by policy',
          label: 'Locked'
        }
      })

      expect(getByTestId(`${ROOT}__helper`)).toBeTruthy()
      expect(getByTestId(`${ROOT}__helper-text`).textContent?.trim()).toBe('Managed by policy')
    })

    it('does not render the helper badge when enabled even if helperText is set', () => {
      const { queryByTestId } = render(FieldCheckboxBlock, {
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
      const { queryByTestId } = render(FieldCheckboxBlock, {
        props: { modelValue: true, disabled: true, label: 'Locked' }
      })

      expect(queryByTestId(`${ROOT}__helper`)).toBeNull()
    })
  })

  describe('label association (inputId)', () => {
    it('links the label "for" to the native input id when inputId is supplied', () => {
      const { getByTestId } = render(FieldCheckboxBlock, {
        props: { modelValue: false, inputId: 'agree-terms', label: 'Agree' }
      })

      expect(getByTestId(ROOT).getAttribute('for')).toBe('agree-terms')
      expect((getByTestId(INPUT) as HTMLInputElement).id).toBe('agree-terms')
    })

    it('generates and shares an id between label and input when inputId is omitted', () => {
      const { getByTestId } = render(FieldCheckboxBlock, {
        props: { modelValue: false, label: 'Agree' }
      })

      const forAttr = getByTestId(ROOT).getAttribute('for')
      expect(forAttr).toBeTruthy()
      expect((getByTestId(INPUT) as HTMLInputElement).id).toBe(forAttr)
    })
  })

  describe('a11y', () => {
    it('has no violations when unchecked with a label and description', async () => {
      const { container } = render(FieldCheckboxBlock, {
        props: {
          modelValue: false,
          inputId: 'a11y-off',
          label: 'Enable feature',
          description: 'Turns on the beta feature'
        }
      })

      await expectNoA11yViolations(container)
    })

    it('has no violations in the disabled state with a helper badge', async () => {
      const { container } = render(FieldCheckboxBlock, {
        props: {
          modelValue: true,
          disabled: true,
          inputId: 'a11y-disabled',
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
      ['disabled-unchecked', { modelValue: false, disabled: true }, null, 'true']
    ] as const)(
      'renders data-checked/data-highlighted for %s',
      (_label, props, expectedChecked, expectedHighlighted) => {
        const { getByTestId } = render(FieldCheckboxBlock, {
          props: { ...props, label: 'Smoke' }
        })

        const card = getByTestId(`${ROOT}__card`)
        expect(card.getAttribute('data-checked')).toBe(expectedChecked)
        expect(card.getAttribute('data-highlighted')).toBe(expectedHighlighted)
      }
    )
  })

  describe('story fixtures (composeStories)', () => {
    it('renders the Default story seeded unchecked and toggles it through the story v-model', async () => {
      const { getByTestId } = render(Default())

      const input = getByTestId(INPUT) as HTMLInputElement
      expect(input.checked).toBe(false)

      await fireEvent.click(input)

      // The story Template wires a real v-model ref, so the click round-trips.
      expect(input.checked).toBe(true)
      expect(getByTestId(`${ROOT}__card`).getAttribute('data-checked')).toBe('true')
    })

    it('renders the Disabled story with a disabled input and a helper badge', () => {
      const { getByTestId } = render(Disabled())
      expect((getByTestId(INPUT) as HTMLInputElement).disabled).toBe(true)
      expect(getByTestId(`${ROOT}__helper`)).toBeTruthy()
    })
  })
})
