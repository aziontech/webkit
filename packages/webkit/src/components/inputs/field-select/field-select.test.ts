import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/field-select/FieldSelect.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import FieldSelect from './field-select.vue'

const { Default, Sizes, Required, Invalid, Disabled, Multiple } = composeStories(stories)

const OPTIONS = [
  { value: 'opt-1', label: 'Option 1' },
  { value: 'opt-2', label: 'Option 2' },
  { value: 'opt-3', label: 'Option 3' }
]

afterEach(() => {
  document.body
    .querySelectorAll('[data-testid$="__content"], [data-testid="select-content"]')
    .forEach((el) => el.remove())
})

describe('FieldSelect', () => {
  it('renders the root with the default data-testid and stacks its parts', () => {
    const { getByTestId } = render(FieldSelect, {
      props: { label: 'Region', helperText: 'Helper', options: OPTIONS }
    })

    expect(getByTestId('input-field-select')).toBeTruthy()
    expect(getByTestId('input-field-select__label')).toBeTruthy()
    expect(getByTestId('input-field-select__trigger')).toBeTruthy()
    expect(getByTestId('input-field-select__helper')).toBeTruthy()
  })

  it('honors a consumer-provided data-testid on the root and its suffixed parts', () => {
    const { getByTestId } = render(FieldSelect, {
      props: { label: 'Region', helperText: 'Helper', options: OPTIONS },
      attrs: { 'data-testid': 'my-field' }
    })

    expect(getByTestId('my-field')).toBeTruthy()
    expect(getByTestId('my-field__label')).toBeTruthy()
    expect(getByTestId('my-field__trigger')).toBeTruthy()
    expect(getByTestId('my-field__helper')).toBeTruthy()
  })

  it('omits the label row when no label is provided', () => {
    const { queryByTestId } = render(FieldSelect, {
      props: { helperText: 'Helper', options: OPTIONS }
    })
    expect(queryByTestId('input-field-select__label')).toBeNull()
  })

  it('omits the helper row when there is no helper text and the field is enabled', () => {
    const { queryByTestId } = render(FieldSelect, {
      props: { label: 'Region', options: OPTIONS }
    })
    expect(queryByTestId('input-field-select__helper')).toBeNull()
  })

  it('shows the locked fallback helper when disabled with no explicit helper text', () => {
    const { getByTestId } = render(FieldSelect, {
      props: { label: 'Region', disabled: true, options: OPTIONS }
    })
    const helper = getByTestId('input-field-select__helper')
    expect(helper.textContent).toContain('This field is locked.')
  })

  it('wires the label to the trigger via matching for/id', () => {
    const { getByTestId } = render(FieldSelect, {
      props: { label: 'Region', inputId: 'region-field', options: OPTIONS }
    })
    const label = getByTestId('input-field-select__label')
    const trigger = getByTestId('input-field-select__trigger')

    expect(label.tagName).toBe('LABEL')
    expect(trigger.id).toBe('region-field')
    expect(label.getAttribute('for')).toBe('region-field')
  })

  it('points aria-describedby at the helper element when a helper is shown', () => {
    const { getByTestId } = render(FieldSelect, {
      props: {
        label: 'Region',
        helperText: 'We need this.',
        inputId: 'region-field',
        options: OPTIONS
      }
    })
    const trigger = getByTestId('input-field-select__trigger')
    const helper = getByTestId('input-field-select__helper')

    expect(trigger.getAttribute('aria-describedby')).toBe('region-field-helper')
    expect(helper.id).toBe('region-field-helper')
  })

  it('drops aria-describedby when no helper is rendered', () => {
    const { getByTestId } = render(FieldSelect, {
      props: { label: 'Region', options: OPTIONS }
    })
    const trigger = getByTestId('input-field-select__trigger')
    expect(trigger.getAttribute('aria-describedby')).toBeNull()
  })

  it('sets aria-required when required, and reflects data-required on the root', () => {
    const { getByTestId } = render(FieldSelect, {
      props: { label: 'Region', required: true, options: OPTIONS }
    })
    const root = getByTestId('input-field-select')
    const trigger = getByTestId('input-field-select__trigger')

    expect(trigger.getAttribute('aria-required')).toBe('true')
    expect(root.getAttribute('data-required')).toBe('true')
  })

  it('sets aria-invalid and data-invalid on the invalid state', () => {
    const { getByTestId } = render(FieldSelect, {
      props: { label: 'Region', invalid: true, helperText: 'Pick a region.', options: OPTIONS }
    })
    const root = getByTestId('input-field-select')
    const trigger = getByTestId('input-field-select__trigger')

    expect(trigger.getAttribute('aria-invalid')).toBe('true')
    expect(root.getAttribute('data-invalid')).toBe('true')
  })

  it('disables the trigger and marks data-disabled when disabled', () => {
    const { getByTestId } = render(FieldSelect, {
      props: { label: 'Region', disabled: true, options: OPTIONS }
    })
    const root = getByTestId('input-field-select')
    const trigger = getByTestId('input-field-select__trigger') as HTMLButtonElement

    expect(trigger.disabled).toBe(true)
    expect(root.getAttribute('data-disabled')).toBe('true')
  })

  it('marks data-readonly when readonly', () => {
    const { getByTestId } = render(FieldSelect, {
      props: { label: 'Region', readonly: true, options: OPTIONS }
    })
    const root = getByTestId('input-field-select')
    expect(root.getAttribute('data-readonly')).toBe('true')
  })

  it('renders one option per entry in the options prop when the dropdown opens', async () => {
    const { getByTestId } = render(FieldSelect, {
      props: { label: 'Region', options: OPTIONS }
    })

    await fireEvent.click(getByTestId('input-field-select__trigger'))
    const options = document.body.querySelectorAll('[data-testid="input-field-select__option"]')
    expect(options.length).toBe(OPTIONS.length)
  })

  it('emits update:modelValue with the picked value when an option is clicked', async () => {
    const { getByTestId, emitted } = render(FieldSelect, {
      props: { label: 'Region', options: OPTIONS }
    })

    await fireEvent.click(getByTestId('input-field-select__trigger'))
    const first = document.body.querySelector(
      '[data-testid="input-field-select__option"]'
    ) as HTMLElement
    await fireEvent.click(first)

    const events = emitted()['update:modelValue']
    expect(events).toBeTruthy()
    expect(events[events.length - 1]).toEqual(['opt-1'])
  })

  it.each(['small', 'medium', 'large'] as const)(
    'reflects size="%s" on the root data-size',
    (size) => {
      const { getByTestId } = render(FieldSelect, {
        props: { label: 'Region', size, options: OPTIONS }
      })
      expect(getByTestId('input-field-select').getAttribute('data-size')).toBe(size)
    }
  )

  it('has no a11y violations in the default labelled + helper state', async () => {
    const { container } = render(FieldSelect, {
      props: {
        label: 'Region',
        helperText: 'Choose the closest region.',
        inputId: 'a11y-default',
        options: OPTIONS
      }
    })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the disabled state', async () => {
    const { container } = render(FieldSelect, {
      props: { label: 'Region', disabled: true, inputId: 'a11y-disabled', options: OPTIONS }
    })
    await expectNoA11yViolations(container)
  })

  it('renders the composed Default story fixture', () => {
    const { getByTestId } = render(Default)
    expect(getByTestId('input-field-select')).toBeTruthy()
    expect(getByTestId('input-field-select__trigger')).toBeTruthy()
  })

  it('renders the Sizes story fixture with three field-select roots', () => {
    const { getAllByTestId } = render(Sizes)
    expect(getAllByTestId('input-field-select').length).toBe(3)
  })

  it('renders the Required story fixture with aria-required on the trigger', () => {
    const { getByTestId } = render(Required)
    const trigger = getByTestId('input-field-select__trigger')
    expect(trigger.getAttribute('aria-required')).toBe('true')
  })

  it('renders the Invalid story fixture with aria-invalid on the trigger', () => {
    const { getByTestId } = render(Invalid)
    const trigger = getByTestId('input-field-select__trigger')
    expect(trigger.getAttribute('aria-invalid')).toBe('true')
  })

  it('renders the Disabled story fixture with a disabled trigger', () => {
    const { getByTestId } = render(Disabled)
    const trigger = getByTestId('input-field-select__trigger') as HTMLButtonElement
    expect(trigger.disabled).toBe(true)
  })

  it('renders the Multiple story fixture with multi-select mode on the root select', () => {
    const { getByTestId } = render(Multiple)
    const inner = getByTestId('input-field-select__select')
    expect(inner.getAttribute('data-mode')).toBe('multiple')
  })
})
