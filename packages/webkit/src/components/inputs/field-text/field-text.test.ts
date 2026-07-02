import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/FieldText.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FieldText from './field-text.vue'

const { Default, Sizes, Invalid, Disabled, Icons } = composeStories(stories)

describe('FieldText', () => {
  it('renders the root with the default data-testid and stacks its parts', () => {
    const { getByTestId } = render(FieldText, {
      props: { label: 'Email', helperText: 'Helper' }
    })

    const root = getByTestId('input-field-text')
    expect(root).toBeTruthy()
    // The three composed parts each carry the suffixed testid from the root fallback.
    expect(getByTestId('input-field-text__label')).toBeTruthy()
    expect(getByTestId('input-field-text__input')).toBeTruthy()
    expect(getByTestId('input-field-text__helper')).toBeTruthy()
  })

  it('honors a consumer-provided data-testid on the root and its suffixed parts', () => {
    const { getByTestId } = render(FieldText, {
      props: { label: 'Email', helperText: 'Helper' },
      attrs: { 'data-testid': 'my-field' }
    })

    expect(getByTestId('my-field')).toBeTruthy()
    expect(getByTestId('my-field__label')).toBeTruthy()
    expect(getByTestId('my-field__input')).toBeTruthy()
    expect(getByTestId('my-field__helper')).toBeTruthy()
  })

  it('omits the label row when no label is provided', () => {
    const { queryByTestId } = render(FieldText, { props: { helperText: 'Helper' } })
    expect(queryByTestId('input-field-text__label')).toBeNull()
  })

  it('omits the helper row when there is no helper text and the field is enabled', () => {
    const { queryByTestId } = render(FieldText, { props: { label: 'Email' } })
    expect(queryByTestId('input-field-text__helper')).toBeNull()
  })

  it('shows the locked fallback helper when disabled with no explicit helper text', () => {
    const { getByTestId } = render(FieldText, { props: { label: 'Email', disabled: true } })
    const helper = getByTestId('input-field-text__helper')
    expect(helper.textContent).toContain('This field is locked.')
  })

  it('emits update:modelValue with the typed value when the user types', async () => {
    const { getByTestId, emitted } = render(FieldText, { props: { label: 'Email' } })
    const input = getByTestId('input-field-text__input') as HTMLInputElement

    await fireEvent.update(input, 'hello@example.com')

    const events = emitted()['update:modelValue']
    expect(events).toBeTruthy()
    expect(events[events.length - 1]).toEqual(['hello@example.com'])
  })

  it('reflects the modelValue prop on the underlying input', () => {
    const { getByTestId } = render(FieldText, {
      props: { label: 'Email', modelValue: 'prefilled@example.com' }
    })
    const input = getByTestId('input-field-text__input') as HTMLInputElement
    expect(input.value).toBe('prefilled@example.com')
  })

  it('wires the label to the input via matching for/id', () => {
    const { getByTestId } = render(FieldText, {
      props: { label: 'Email', inputId: 'email-field' }
    })
    const label = getByTestId('input-field-text__label')
    const input = getByTestId('input-field-text__input') as HTMLInputElement

    expect(label.tagName).toBe('LABEL')
    expect(input.id).toBe('email-field')
    expect(label.getAttribute('for')).toBe('email-field')
  })

  it('points aria-describedby at the helper element when a helper is shown', () => {
    const { getByTestId } = render(FieldText, {
      props: { label: 'Email', helperText: 'We need this.', inputId: 'email-field' }
    })
    const input = getByTestId('input-field-text__input') as HTMLInputElement
    const helper = getByTestId('input-field-text__helper')

    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBe('email-field-helper')
    expect(helper.id).toBe('email-field-helper')
  })

  it('drops aria-describedby when no helper is rendered', () => {
    const { getByTestId } = render(FieldText, { props: { label: 'Email' } })
    const input = getByTestId('input-field-text__input') as HTMLInputElement
    expect(input.getAttribute('aria-describedby')).toBeNull()
  })

  it('sets native required and aria-required when required, and reflects data-required on the root', () => {
    const { getByTestId } = render(FieldText, { props: { label: 'Email', required: true } })
    const root = getByTestId('input-field-text')
    const input = getByTestId('input-field-text__input') as HTMLInputElement

    expect(input.required).toBe(true)
    expect(input.getAttribute('aria-required')).toBe('true')
    expect(root.getAttribute('data-required')).toBe('true')
  })

  it('sets aria-invalid and data-invalid on the invalid state', () => {
    const { getByTestId } = render(FieldText, {
      props: { label: 'Email', invalid: true, helperText: 'Enter a valid email.' }
    })
    const root = getByTestId('input-field-text')
    const input = getByTestId('input-field-text__input') as HTMLInputElement

    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(root.getAttribute('data-invalid')).toBe('true')
  })

  it('disables the native input and marks data-disabled when disabled', () => {
    const { getByTestId } = render(FieldText, { props: { label: 'Email', disabled: true } })
    const root = getByTestId('input-field-text')
    const input = getByTestId('input-field-text__input') as HTMLInputElement

    expect(input.disabled).toBe(true)
    expect(root.getAttribute('data-disabled')).toBe('true')
  })

  it('marks the native input readonly when readonly', () => {
    const { getByTestId } = render(FieldText, { props: { label: 'Email', readonly: true } })
    const input = getByTestId('input-field-text__input') as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })

  it('renders the iconLeft and iconRight slot content', () => {
    const { getByTestId } = render(FieldText, {
      props: { label: 'Email' },
      slots: {
        iconLeft: '<i data-testid="left-icon" class="pi pi-globe" />',
        iconRight: '<i data-testid="right-icon" class="pi pi-times" />'
      }
    })
    expect(getByTestId('left-icon')).toBeTruthy()
    expect(getByTestId('right-icon')).toBeTruthy()
  })

  it.each(['small', 'medium', 'large'] as const)(
    'reflects size="%s" on the root data-size',
    (size) => {
      const { getByTestId } = render(FieldText, { props: { label: 'Email', size } })
      expect(getByTestId('input-field-text').getAttribute('data-size')).toBe(size)
    }
  )

  it('has no a11y violations in the default labelled + helper state', async () => {
    const { container } = render(FieldText, {
      props: { label: 'Email', helperText: 'We need this to contact you.', inputId: 'a11y-default' }
    })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the invalid state', async () => {
    const { container } = render(FieldText, {
      props: {
        label: 'Email',
        invalid: true,
        modelValue: 'not-an-email',
        helperText: 'Enter a valid email address.',
        inputId: 'a11y-invalid'
      }
    })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the disabled state', async () => {
    const { container } = render(FieldText, {
      props: { label: 'Email', disabled: true, inputId: 'a11y-disabled' }
    })
    await expectNoA11yViolations(container)
  })

  it('renders the composed Default story fixture', () => {
    const { getByTestId } = render(Default)
    expect(getByTestId('input-field-text')).toBeTruthy()
    expect(getByTestId('input-field-text__input')).toBeTruthy()
  })

  it('renders the Sizes story fixture', () => {
    const { getAllByTestId } = render(Sizes)
    expect(getAllByTestId('input-field-text').length).toBe(3)
  })

  it('renders the Invalid story fixture with aria-invalid', () => {
    const { getByTestId } = render(Invalid)
    const input = getByTestId('input-field-text__input') as HTMLInputElement
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })

  it('renders the Disabled story fixture with a disabled input', () => {
    const { getByTestId } = render(Disabled)
    const input = getByTestId('input-field-text__input') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it('renders the Icons story fixture', () => {
    const { getAllByTestId } = render(Icons)
    expect(getAllByTestId('input-field-text').length).toBe(3)
  })
})
