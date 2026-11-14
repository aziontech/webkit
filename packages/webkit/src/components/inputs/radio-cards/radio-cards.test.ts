import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import Default from '../../../../examples/radio-cards/default.vue'
import Disabled from '../../../../examples/radio-cards/disabled.vue'
import WithTag from '../../../../examples/radio-cards/with-tag.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Field from '../field/field.vue'
import RadioCards from './radio-cards.vue'

const items = [
  { value: 'a', label: 'Alpha', icon: 'pi pi-check', description: 'First option' },
  { value: 'b', label: 'Beta', icon: 'pi pi-times', description: 'Second option' },
  { value: 'c', label: 'Gamma' }
]

describe('RadioCards', () => {
  it('renders a radiogroup root with the default testid and one radio per item', () => {
    const { getByTestId, getAllByTestId } = render(RadioCards, {
      props: { items }
    })

    const root = getByTestId('input-radio-cards')
    expect(root.tagName).toBe('DIV')
    expect(root.getAttribute('role')).toBe('radiogroup')

    const options = getAllByTestId('input-radio-cards__option')
    expect(options).toHaveLength(items.length)
    options.forEach((option) => expect(option.getAttribute('role')).toBe('radio'))
  })

  it('honors a consumer-supplied data-testid on the root and derives the option testid from it', () => {
    const { getByTestId, getAllByTestId } = render(RadioCards, {
      props: { items },
      attrs: { 'data-testid': 'my-grid' }
    })

    expect(getByTestId('my-grid').getAttribute('role')).toBe('radiogroup')
    expect(getAllByTestId('my-grid__option')).toHaveLength(items.length)
  })

  it('renders label, icon and description content for each option', () => {
    const { getAllByTestId, getByText, queryAllByTestId } = render(RadioCards, {
      props: { items }
    })

    expect(getByText('Alpha')).toBeTruthy()
    expect(getByText('Gamma')).toBeTruthy()

    // 'a' and 'b' have icons; 'c' does not
    expect(getAllByTestId('input-radio-cards__icon')).toHaveLength(2)
    // 'a' and 'b' have descriptions; 'c' does not
    expect(queryAllByTestId('input-radio-cards__description')).toHaveLength(2)
    expect(getByText('First option')).toBeTruthy()
  })

  it('marks the option matching modelValue as selected via data-selected and aria-checked', () => {
    const { getAllByTestId } = render(RadioCards, {
      props: { items, modelValue: 'b' }
    })

    const options = getAllByTestId('input-radio-cards__option')

    expect(options[0].getAttribute('data-selected')).toBeNull()
    expect(options[0].getAttribute('aria-checked')).toBe('false')

    expect(options[1].hasAttribute('data-selected')).toBe(true)
    expect(options[1].getAttribute('aria-checked')).toBe('true')

    expect(options[2].getAttribute('data-selected')).toBeNull()
    expect(options[2].getAttribute('aria-checked')).toBe('false')
  })

  it('describes each radio by its description, which aria-label would otherwise hide', () => {
    const { getAllByRole, getAllByTestId } = render(RadioCards, { props: { items } })
    const radios = getAllByRole('radio')
    const descriptions = getAllByTestId('input-radio-cards__description')
    expect(radios[0].getAttribute('aria-describedby')).toBe(descriptions[0].id)
    expect(radios[1].getAttribute('aria-describedby')).toBe(descriptions[1].id)
    expect(radios[2].hasAttribute('aria-describedby')).toBe(false)
  })

  it('uses ariaLabel when provided, falling back to label otherwise', () => {
    const { getAllByTestId, getByRole } = render(RadioCards, {
      props: {
        items: [
          { value: 'a', label: 'Alpha', ariaLabel: 'Alpha option' },
          { value: 'b', label: 'Beta' }
        ]
      }
    })

    const options = getAllByTestId('input-radio-cards__option')
    expect(options[0].getAttribute('aria-label')).toBe('Alpha option')
    expect(options[1].hasAttribute('aria-label')).toBe(false)
    expect(getByRole('radio', { name: 'Beta' })).toBe(options[1])
  })

  it('names a slotted option by its own content', () => {
    const { getByRole } = render(RadioCards, {
      props: { items: [{ value: 'a', label: 'Alpha' }] },
      slots: { default: '<strong>Custom alpha text</strong>' }
    })
    expect(getByRole('radio', { name: 'Custom alpha text' })).toBeTruthy()
  })

  it('selects without a bound v-model', async () => {
    const { getAllByRole, emitted } = render(RadioCards, { props: { items } })
    await fireEvent.click(getAllByRole('radio')[1])
    expect(getAllByRole('radio')[1].getAttribute('aria-checked')).toBe('true')
    expect(emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('skips a disabled item and does not select it', async () => {
    const { getAllByRole, emitted } = render(RadioCards, {
      props: {
        items: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta', disabled: true },
          { value: 'c', label: 'Gamma' }
        ]
      }
    })
    const radios = getAllByRole('radio')
    expect(radios[1].getAttribute('aria-disabled')).toBe('true')
    expect(radios[1].getAttribute('tabindex')).toBe('-1')
    await fireEvent.click(radios[1])
    expect(emitted('update:modelValue')).toBeUndefined()
    await fireEvent.keyDown(radios[0], { key: 'ArrowRight' })
    expect(emitted('update:modelValue')?.[0]).toEqual(['c'])
  })

  it('takes the enclosing Field state', () => {
    const { getByRole } = render({
      components: { Field, RadioCards },
      template:
        '<Field invalid required disabled><RadioCards :items="items" aria-label="Plan" /></Field>',
      setup: () => ({ items })
    })
    const group = getByRole('radiogroup', { name: 'Plan' })
    expect(group.getAttribute('aria-invalid')).toBe('true')
    expect(group.getAttribute('aria-required')).toBe('true')
    expect(group.hasAttribute('data-disabled')).toBe(true)
  })

  it('emits update:modelValue with the option value on click', async () => {
    const { getAllByTestId, emitted } = render(RadioCards, {
      props: { items, modelValue: 'a' }
    })

    await fireEvent.click(getAllByTestId('input-radio-cards__option')[2])

    const events = emitted()['update:modelValue']
    expect(events).toBeTruthy()
    expect(events).toHaveLength(1)
    expect(events[0]).toEqual(['c'])
  })

  it('drives v-model: the emitted value is the value of the clicked option', async () => {
    const { getAllByTestId, emitted } = render(RadioCards, {
      props: { items, modelValue: undefined }
    })

    await fireEvent.click(getAllByTestId('input-radio-cards__option')[1])

    expect(emitted()['update:modelValue'][0]).toEqual(['b'])
  })

  it('selects the current option with Enter and with Space', async () => {
    const { getAllByTestId, emitted } = render(RadioCards, {
      props: { items, modelValue: 'a' }
    })

    const options = getAllByTestId('input-radio-cards__option')

    await fireEvent.keyDown(options[1], { key: 'Enter' })
    await fireEvent.keyDown(options[2], { key: ' ' })

    const events = emitted()['update:modelValue']
    expect(events).toHaveLength(2)
    expect(events[0]).toEqual(['b'])
    expect(events[1]).toEqual(['c'])
  })

  it('ArrowRight moves to and selects the next option', async () => {
    const { getAllByTestId, emitted } = render(RadioCards, {
      props: { items, modelValue: 'a' }
    })

    await fireEvent.keyDown(getAllByTestId('input-radio-cards__option')[0], {
      key: 'ArrowRight'
    })

    expect(emitted()['update:modelValue'][0]).toEqual(['b'])
  })

  it('ArrowRight wraps from the last option to the first', async () => {
    const { getAllByTestId, emitted } = render(RadioCards, {
      props: { items, modelValue: 'c' }
    })

    await fireEvent.keyDown(getAllByTestId('input-radio-cards__option')[2], {
      key: 'ArrowRight'
    })

    expect(emitted()['update:modelValue'][0]).toEqual(['a'])
  })

  it('ArrowLeft wraps from the first option to the last', async () => {
    const { getAllByTestId, emitted } = render(RadioCards, {
      props: { items, modelValue: 'a' }
    })

    await fireEvent.keyDown(getAllByTestId('input-radio-cards__option')[0], {
      key: 'ArrowLeft'
    })

    expect(emitted()['update:modelValue'][0]).toEqual(['c'])
  })

  it('Home selects the first option and End selects the last', async () => {
    const { getAllByTestId, emitted } = render(RadioCards, {
      props: { items, modelValue: 'b' }
    })

    const options = getAllByTestId('input-radio-cards__option')

    await fireEvent.keyDown(options[1], { key: 'End' })
    await fireEvent.keyDown(options[2], { key: 'Home' })

    const events = emitted()['update:modelValue']
    expect(events[0]).toEqual(['c'])
    expect(events[1]).toEqual(['a'])
  })

  it('does not select on an unhandled key such as Tab', async () => {
    const { getAllByTestId, emitted } = render(RadioCards, {
      props: { items, modelValue: 'a' }
    })

    await fireEvent.keyDown(getAllByTestId('input-radio-cards__option')[0], { key: 'Tab' })

    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('sets data-disabled and aria-disabled on the root only when disabled is true', () => {
    const enabled = render(RadioCards, { props: { items } })
    const enabledRoot = enabled.getByTestId('input-radio-cards')
    expect(enabledRoot.getAttribute('data-disabled')).toBeNull()
    expect(enabledRoot.getAttribute('aria-disabled')).toBeNull()
    enabled.unmount()

    const disabled = render(RadioCards, { props: { items, disabled: true } })
    const disabledRoot = disabled.getByTestId('input-radio-cards')
    expect(disabledRoot.hasAttribute('data-disabled')).toBe(true)
    expect(disabledRoot.getAttribute('aria-disabled')).toBe('true')
  })

  it('propagates data-disabled onto each option when disabled', () => {
    const { getAllByTestId } = render(RadioCards, {
      props: { items, disabled: true }
    })

    getAllByTestId('input-radio-cards__option').forEach((option) => {
      expect(option.hasAttribute('data-disabled')).toBe(true)
      expect(option.getAttribute('tabindex')).toBe('-1')
    })
  })

  it('does NOT emit update:modelValue on click when disabled', async () => {
    const { getAllByTestId, emitted } = render(RadioCards, {
      props: { items, modelValue: 'a', disabled: true }
    })

    await fireEvent.click(getAllByTestId('input-radio-cards__option')[1])

    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('does NOT emit update:modelValue on keyboard interaction when disabled', async () => {
    const { getAllByTestId, emitted } = render(RadioCards, {
      props: { items, modelValue: 'a', disabled: true }
    })

    const options = getAllByTestId('input-radio-cards__option')
    await fireEvent.keyDown(options[0], { key: 'ArrowRight' })
    await fireEvent.keyDown(options[0], { key: 'Enter' })

    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('gives the selected option tabindex 0 and the rest tabindex -1', () => {
    const { getAllByTestId } = render(RadioCards, {
      props: { items, modelValue: 'b' }
    })

    const options = getAllByTestId('input-radio-cards__option')
    expect(options[0].getAttribute('tabindex')).toBe('-1')
    expect(options[1].getAttribute('tabindex')).toBe('0')
    expect(options[2].getAttribute('tabindex')).toBe('-1')
  })

  it('renders default-slot content in place of the built-in card body', () => {
    const { getByText, queryByTestId } = render(RadioCards, {
      props: { items, modelValue: 'a' },
      slots: {
        default: '<span data-testid="custom-body">{{ params.item.label }} custom</span>'
      }
    })

    expect(getByText('Alpha custom')).toBeTruthy()
    // built-in content is replaced by the slot
    expect(queryByTestId('input-radio-cards__content')).toBeNull()
  })

  it('renders tag-slot content alongside the built-in card body', () => {
    const { getByText, getByTestId } = render(RadioCards, {
      props: { items: [{ value: 'a', label: 'Alpha' }], modelValue: 'a' },
      slots: {
        tag: '<span data-testid="custom-tag">Badge</span>'
      }
    })

    expect(getByTestId('input-radio-cards__content')).toBeTruthy()
    expect(getByText('Badge')).toBeTruthy()
  })

  it('merges a consumer-supplied class onto the root', () => {
    const { getByTestId } = render(RadioCards, {
      props: { items },
      attrs: { class: 'consumer-class' }
    })

    expect(getByTestId('input-radio-cards').classList.contains('consumer-class')).toBe(true)
  })

  it('has no a11y violations in the default (enabled) state', async () => {
    const { container } = render(RadioCards, {
      props: { items, modelValue: 'a' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the disabled state', async () => {
    const { container } = render(RadioCards, {
      props: { items, modelValue: 'a', disabled: true }
    })

    await expectNoA11yViolations(container)
  })

  it('renders the Default story fixture cleanly', async () => {
    const { container } = render(Default)

    await expectNoA11yViolations(container)
  })

  it('renders the Disabled story fixture cleanly', async () => {
    const { container } = render(Disabled)

    await expectNoA11yViolations(container)
  })

  it('renders the WithTag story fixture cleanly', async () => {
    const { container } = render(WithTag)

    await expectNoA11yViolations(container)
  })
})

describe('RadioCards on devices', () => {
  it('caps each option at the width of the group so long copy wraps', () => {
    const view = render(RadioCards, {
      props: { items: [{ label: 'Edge', value: 'edge', description: 'Runs on the edge' }] }
    })

    expect(view.getAllByRole('radio')[0]?.className).toContain('max-w-full')
  })
})

describe('RadioCards — native form submit', () => {
  it('submits the selected value under its name and blocks an empty submit in a required Field', async () => {
    const { getByTestId, getAllByRole } = render({
      components: { Field, RadioCards },
      setup: () => ({ items, value: ref<string | undefined>(undefined) }),
      template:
        '<form data-testid="form"><Field required><RadioCards v-model="value" :items="items" name="tier" aria-label="Tier" /></Field></form>'
    })
    const form = getByTestId('form') as HTMLFormElement
    expect(form.checkValidity()).toBe(false)
    await fireEvent.click(getAllByRole('radio')[1])
    expect(new FormData(form).get('tier')).toBe(items[1].value)
    expect(form.checkValidity()).toBe(true)
  })
})
