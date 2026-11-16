import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, ref } from 'vue'

import Card from '../../../../examples/radio-group/card.vue'
import Default from '../../../../examples/radio-group/default.vue'
import Disabled from '../../../../examples/radio-group/disabled.vue'
import Horizontal from '../../../../examples/radio-group/horizontal.vue'
import InField from '../../../../examples/radio-group/in-field.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { hostable } from '../../../test/hostable'
import Field from '../field/field.vue'
import FieldError from '../field/field-error/field-error.vue'
import FieldTitle from '../field/field-title/field-title.vue'
import RadioGroupRoot, { RadioGroupItem } from './index'

const RadioGroup = hostable(RadioGroupRoot)

const host = (template: string, setup: () => Record<string, unknown> = () => ({})) =>
  render(
    defineComponent({
      components: { RadioGroup, RadioGroupItem, Field, FieldError, FieldTitle },
      setup,
      template
    })
  )

const plans = `
  <RadioGroupItem value="free">Free</RadioGroupItem>
  <RadioGroupItem value="pro">Pro</RadioGroupItem>
  <RadioGroupItem value="enterprise">Enterprise</RadioGroupItem>
`

describe('RadioGroup', () => {
  it('attaches Item to the compound', () => {
    expect(RadioGroup.Item).toBe(RadioGroupItem)
  })

  it('renders a named radiogroup with the default test ids and orientation', () => {
    const view = render(Default)
    const group = view.getByRole('radiogroup', { name: 'Billing cycle' })
    expect(group.getAttribute('data-testid')).toBe('radio-group')
    expect(group.getAttribute('data-orientation')).toBe('vertical')
    expect(view.getAllByTestId('radio-group-item')).toHaveLength(3)
    expect(view.getAllByTestId('radio-group-item__control')).toHaveLength(3)
    expect(view.getByRole('radio', { name: 'Monthly' }).hasAttribute('aria-checked')).toBe(false)
  })

  it('honours a consumer data-testid on the root; the items keep their own test id', () => {
    const view = host(`<RadioGroup data-testid="plan" aria-label="Plan">${plans}</RadioGroup>`)
    expect(view.getByTestId('plan').getAttribute('role')).toBe('radiogroup')
    expect(view.getAllByTestId('radio-group-item')).toHaveLength(3)
  })

  it('forwards aria-labelledby on an item to its radio, not to the label', () => {
    const view = host(`
      <h3 id="plan-heading">Pro plan</h3>
      <RadioGroup aria-label="Plan"><RadioGroupItem value="pro" aria-labelledby="plan-heading" /></RadioGroup>
    `)
    const radio = view.getByRole('radio', { name: 'Pro plan' })
    expect(radio.getAttribute('aria-labelledby')).toBe('plan-heading')
    expect(radio.closest('label')?.hasAttribute('aria-labelledby')).toBe(false)
  })

  it('maps orientation to data-orientation', () => {
    const view = render(Horizontal)
    expect(view.getByRole('radiogroup').getAttribute('data-orientation')).toBe('horizontal')
  })

  it('selects an option by clicking its label and emits update:modelValue', async () => {
    const value = ref<string | undefined>('free')
    const view = host(
      `<RadioGroup v-model="value" aria-label="Plan">${plans}</RadioGroup>`,
      () => ({
        value
      })
    )
    await fireEvent.click(view.getByText('Pro'))
    expect(value.value).toBe('pro')
    expect((view.getByRole('radio', { name: 'Pro' }) as HTMLInputElement).checked).toBe(true)
    expect(view.getAllByTestId('radio-group-item')[1].hasAttribute('data-checked')).toBe(true)
  })

  it('is one tab stop and moves the selection with the arrow keys, skipping a disabled option', async () => {
    const value = ref<string | undefined>('free')
    const view = host(
      `<button type="button">Before</button>
       <RadioGroup v-model="value" aria-label="Plan">
         <RadioGroupItem value="free">Free</RadioGroupItem>
         <RadioGroupItem value="pro" disabled>Pro</RadioGroupItem>
         <RadioGroupItem value="enterprise">Enterprise</RadioGroupItem>
       </RadioGroup>
       <button type="button">After</button>`,
      () => ({ value })
    )
    view.getByRole('button', { name: 'Before' }).focus()
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(view.getByRole('radio', { name: 'Free' }))
    await userEvent.keyboard('{ArrowDown}')
    expect(value.value).toBe('enterprise')
    expect(document.activeElement).toBe(view.getByRole('radio', { name: 'Enterprise' }))
    await userEvent.keyboard('{ArrowUp}')
    expect(value.value).toBe('free')
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(view.getByRole('button', { name: 'After' }))
  })

  it('shares one name across the radios: the given one, or a generated one', () => {
    const named = host(`<RadioGroup name="plan" aria-label="Plan">${plans}</RadioGroup>`)
    const names = named.getAllByRole('radio').map((radio) => radio.getAttribute('name'))
    expect(new Set(names)).toEqual(new Set(['plan']))
    named.unmount()
    const generated = host(`<RadioGroup aria-label="Plan">${plans}</RadioGroup>`)
    const auto = generated.getAllByRole('radio').map((radio) => radio.getAttribute('name'))
    expect(auto[0]).toBeTruthy()
    expect(new Set(auto).size).toBe(1)
  })

  it('does not select while the group or the item is disabled', async () => {
    const view = render(Disabled)
    const group = view.getByRole('radiogroup')
    expect(group.hasAttribute('data-disabled')).toBe(true)
    for (const radio of view.getAllByRole('radio')) {
      expect((radio as HTMLInputElement).disabled).toBe(true)
    }
    await fireEvent.click(view.getByText('Free'))
    expect((view.getByRole('radio', { name: 'Pro' }) as HTMLInputElement).checked).toBe(true)
  })

  it('submits the selected value and blocks an empty submit when required', async () => {
    const view = render(InField)
    const form = view.container.querySelector('form') as HTMLFormElement
    expect(form.checkValidity()).toBe(false)
    expect(view.getByRole('radiogroup').getAttribute('aria-required')).toBe('true')
    await fireEvent.click(view.getByText('EU West'))
    expect(new FormData(form).get('region')).toBe('eu-west')
    expect(form.checkValidity()).toBe(true)
  })

  it('takes its name, description, invalid and required from an enclosing Field', async () => {
    const view = host(
      `<Field required>
         <FieldTitle>Plan</FieldTitle>
         <RadioGroup>${plans}</RadioGroup>
         <FieldError>Pick a plan.</FieldError>
       </Field>`
    )
    await Promise.resolve()
    const group = view.getByRole('radiogroup', { name: 'Plan' })
    expect(group.getAttribute('aria-invalid')).toBe('true')
    expect(group.getAttribute('aria-required')).toBe('true')
    expect(group.getAttribute('aria-describedby')).toBe(view.getByRole('alert').id)
    for (const radio of within(group).getAllByRole('radio')) {
      expect(radio.id).toBe('')
      expect((radio as HTMLInputElement).required).toBe(true)
      expect(radio.getAttribute('aria-invalid')).toBe('true')
    }
  })

  it('throws when an item is rendered outside a group', () => {
    expect(() => render(RadioGroupItem, { props: { value: 'loose' } })).toThrow(
      'RadioGroupItem must be used inside <RadioGroup>.'
    )
  })

  it('has no axe violations in every example', async () => {
    for (const example of [Default, Horizontal, Disabled, InField, Card]) {
      const view = render(example)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })

  describe('variant="card" and options', () => {
    const options = [
      { value: 'free', label: 'Free', description: 'For side projects.', icon: 'ai ai-user' },
      { value: 'pro', label: 'Pro', description: 'For production apps.' },
      { value: 'scale', label: 'Scale', disabled: true }
    ]

    it('renders one item per option with its label, description and icon', () => {
      const view = host(`<RadioGroup :options="options" aria-label="Plan" />`, () => ({ options }))
      const items = view.getAllByTestId('radio-group-item')
      expect(items).toHaveLength(3)
      expect(view.getAllByTestId('radio-group-item__label').map((n) => n.textContent)).toEqual([
        'Free',
        'Pro',
        'Scale'
      ])
      expect(view.getAllByTestId('radio-group-item__icon')).toHaveLength(1)
      expect((view.getByRole('radio', { name: 'Scale' }) as HTMLInputElement).disabled).toBe(true)
    })

    it('describes each radio by its description', () => {
      const view = host(`<RadioGroup :options="options" aria-label="Plan" />`, () => ({ options }))
      const radio = view.getByRole('radio', { name: 'Free' })
      const description = document.getElementById(radio.getAttribute('aria-describedby') ?? '')
      expect(description?.textContent).toBe('For side projects.')
    })

    it('marks the group and every item data-variant="card" and selects by clicking the card', async () => {
      const value = ref<string | undefined>('free')
      const view = host(
        `<RadioGroup v-model="value" variant="card" :options="options" aria-label="Plan" />`,
        () => ({ value, options })
      )
      expect(view.getByRole('radiogroup').getAttribute('data-variant')).toBe('card')
      const items = view.getAllByTestId('radio-group-item')
      expect(items.every((item) => item.getAttribute('data-variant') === 'card')).toBe(true)
      await fireEvent.click(view.getByText('For production apps.'))
      expect(value.value).toBe('pro')
      expect(items[1].hasAttribute('data-checked')).toBe(true)
    })

    it('keeps the card radios one tab stop moved by the arrow keys', async () => {
      const value = ref<string | undefined>('free')
      const view = host(
        `<RadioGroup v-model="value" variant="card" :options="options" aria-label="Plan" />`,
        () => ({ value, options })
      )
      view.getByRole('radio', { name: 'Free' }).focus()
      await userEvent.keyboard('{ArrowDown}')
      expect(value.value).toBe('pro')
      await userEvent.keyboard('{ArrowDown}')
      expect(value.value).toBe('free')
    })

    it('names a radio by an option ariaLabel', () => {
      const view = host(`<RadioGroup :options="named" aria-label="Mark" />`, () => ({
        named: [{ value: 'orange', label: '', ariaLabel: 'Orange mark' }]
      }))
      expect(view.getByRole('radio', { name: 'Orange mark' })).toBeTruthy()
    })

    it('renders the option and tag slots for each data-driven option', () => {
      const view = host(
        `<RadioGroup :options="options" variant="card" aria-label="Plan">
         <template #option="{ option, selected }"><b :data-selected="selected">{{ option.value }}</b></template>
         <template #tag="{ option }"><i data-testid="tag">{{ option.label }} tag</i></template>
       </RadioGroup>`,
        () => ({ options })
      )
      expect(view.getByText('free').tagName).toBe('B')
      expect(view.getAllByTestId('tag').map((n) => n.textContent)).toEqual([
        'Free tag',
        'Pro tag',
        'Scale tag'
      ])
    })

    it('renders composed items with the card look, description and tag', () => {
      const view = host(
        `<RadioGroup variant="card" aria-label="Plan">
         <RadioGroupItem value="a" description="First">A<template #tag><span data-testid="t">Tag</span></template></RadioGroupItem>
       </RadioGroup>`
      )
      expect(view.getByTestId('radio-group-item').getAttribute('data-variant')).toBe('card')
      expect(view.getByTestId('radio-group-item__description').textContent).toBe('First')
      expect(view.getByTestId('t')).toBeTruthy()
    })

    it('submits the card selection under name', async () => {
      const view = render(Card)
      const form = document.createElement('form')
      view.container.parentElement?.appendChild(form)
      form.appendChild(view.container)
      expect(new FormData(form).get('plan')).toBe('pro')
    })
  })
})
