import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/box-grid-selection/BoxGridSelection.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import BoxGridSelection from './box-grid-selection.vue'

const { Default, Disabled, WithTag } = composeStories(stories)

const items = [
  { value: 'a', label: 'Alpha', icon: 'pi pi-check', description: 'First option' },
  { value: 'b', label: 'Beta', icon: 'pi pi-times', description: 'Second option' },
  { value: 'c', label: 'Gamma' }
]

describe('BoxGridSelection', () => {
  it('renders a radiogroup root with the default testid and one radio per item', () => {
    const { getByTestId, getAllByTestId } = render(BoxGridSelection, {
      props: { items }
    })

    const root = getByTestId('input-box-grid-selection')
    expect(root.tagName).toBe('DIV')
    expect(root.getAttribute('role')).toBe('radiogroup')

    const options = getAllByTestId('input-box-grid-selection__option')
    expect(options).toHaveLength(items.length)
    options.forEach((option) => expect(option.getAttribute('role')).toBe('radio'))
  })

  it('honors a consumer-supplied data-testid on the root and derives the option testid from it', () => {
    const { getByTestId, getAllByTestId } = render(BoxGridSelection, {
      props: { items },
      attrs: { 'data-testid': 'my-grid' }
    })

    expect(getByTestId('my-grid').getAttribute('role')).toBe('radiogroup')
    expect(getAllByTestId('my-grid__option')).toHaveLength(items.length)
  })

  it('renders label, icon and description content for each option', () => {
    const { getAllByTestId, getByText, queryAllByTestId } = render(BoxGridSelection, {
      props: { items }
    })

    expect(getByText('Alpha')).toBeTruthy()
    expect(getByText('Gamma')).toBeTruthy()

    // 'a' and 'b' have icons; 'c' does not
    expect(getAllByTestId('input-box-grid-selection__icon')).toHaveLength(2)
    // 'a' and 'b' have descriptions; 'c' does not
    expect(queryAllByTestId('input-box-grid-selection__description')).toHaveLength(2)
    expect(getByText('First option')).toBeTruthy()
  })

  it('marks the option matching modelValue as selected via data-selected and aria-checked', () => {
    const { getAllByTestId } = render(BoxGridSelection, {
      props: { items, modelValue: 'b' }
    })

    const options = getAllByTestId('input-box-grid-selection__option')

    expect(options[0].getAttribute('data-selected')).toBeNull()
    expect(options[0].getAttribute('aria-checked')).toBe('false')

    expect(options[1].hasAttribute('data-selected')).toBe(true)
    expect(options[1].getAttribute('aria-checked')).toBe('true')

    expect(options[2].getAttribute('data-selected')).toBeNull()
    expect(options[2].getAttribute('aria-checked')).toBe('false')
  })

  it('uses ariaLabel when provided, falling back to label otherwise', () => {
    const { getAllByTestId } = render(BoxGridSelection, {
      props: {
        items: [
          { value: 'a', label: 'Alpha', ariaLabel: 'Alpha option' },
          { value: 'b', label: 'Beta' }
        ]
      }
    })

    const options = getAllByTestId('input-box-grid-selection__option')
    expect(options[0].getAttribute('aria-label')).toBe('Alpha option')
    expect(options[1].getAttribute('aria-label')).toBe('Beta')
  })

  it('emits update:modelValue with the option value on click', async () => {
    const { getAllByTestId, emitted } = render(BoxGridSelection, {
      props: { items, modelValue: 'a' }
    })

    await fireEvent.click(getAllByTestId('input-box-grid-selection__option')[2])

    const events = emitted()['update:modelValue']
    expect(events).toBeTruthy()
    expect(events).toHaveLength(1)
    expect(events[0]).toEqual(['c'])
  })

  it('drives v-model: the emitted value is the value of the clicked option', async () => {
    const { getAllByTestId, emitted } = render(BoxGridSelection, {
      props: { items, modelValue: undefined }
    })

    await fireEvent.click(getAllByTestId('input-box-grid-selection__option')[1])

    expect(emitted()['update:modelValue'][0]).toEqual(['b'])
  })

  it('selects the current option with Enter and with Space', async () => {
    const { getAllByTestId, emitted } = render(BoxGridSelection, {
      props: { items, modelValue: 'a' }
    })

    const options = getAllByTestId('input-box-grid-selection__option')

    await fireEvent.keyDown(options[1], { key: 'Enter' })
    await fireEvent.keyDown(options[2], { key: ' ' })

    const events = emitted()['update:modelValue']
    expect(events).toHaveLength(2)
    expect(events[0]).toEqual(['b'])
    expect(events[1]).toEqual(['c'])
  })

  it('ArrowRight moves to and selects the next option', async () => {
    const { getAllByTestId, emitted } = render(BoxGridSelection, {
      props: { items, modelValue: 'a' }
    })

    await fireEvent.keyDown(getAllByTestId('input-box-grid-selection__option')[0], {
      key: 'ArrowRight'
    })

    expect(emitted()['update:modelValue'][0]).toEqual(['b'])
  })

  it('ArrowRight wraps from the last option to the first', async () => {
    const { getAllByTestId, emitted } = render(BoxGridSelection, {
      props: { items, modelValue: 'c' }
    })

    await fireEvent.keyDown(getAllByTestId('input-box-grid-selection__option')[2], {
      key: 'ArrowRight'
    })

    expect(emitted()['update:modelValue'][0]).toEqual(['a'])
  })

  it('ArrowLeft wraps from the first option to the last', async () => {
    const { getAllByTestId, emitted } = render(BoxGridSelection, {
      props: { items, modelValue: 'a' }
    })

    await fireEvent.keyDown(getAllByTestId('input-box-grid-selection__option')[0], {
      key: 'ArrowLeft'
    })

    expect(emitted()['update:modelValue'][0]).toEqual(['c'])
  })

  it('Home selects the first option and End selects the last', async () => {
    const { getAllByTestId, emitted } = render(BoxGridSelection, {
      props: { items, modelValue: 'b' }
    })

    const options = getAllByTestId('input-box-grid-selection__option')

    await fireEvent.keyDown(options[1], { key: 'End' })
    await fireEvent.keyDown(options[2], { key: 'Home' })

    const events = emitted()['update:modelValue']
    expect(events[0]).toEqual(['c'])
    expect(events[1]).toEqual(['a'])
  })

  it('does not select on an unhandled key such as Tab', async () => {
    const { getAllByTestId, emitted } = render(BoxGridSelection, {
      props: { items, modelValue: 'a' }
    })

    await fireEvent.keyDown(getAllByTestId('input-box-grid-selection__option')[0], { key: 'Tab' })

    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('sets data-disabled and aria-disabled on the root only when disabled is true', () => {
    const enabled = render(BoxGridSelection, { props: { items } })
    const enabledRoot = enabled.getByTestId('input-box-grid-selection')
    expect(enabledRoot.getAttribute('data-disabled')).toBeNull()
    expect(enabledRoot.getAttribute('aria-disabled')).toBeNull()
    enabled.unmount()

    const disabled = render(BoxGridSelection, { props: { items, disabled: true } })
    const disabledRoot = disabled.getByTestId('input-box-grid-selection')
    expect(disabledRoot.hasAttribute('data-disabled')).toBe(true)
    expect(disabledRoot.getAttribute('aria-disabled')).toBe('true')
  })

  it('propagates data-disabled onto each option when disabled', () => {
    const { getAllByTestId } = render(BoxGridSelection, {
      props: { items, disabled: true }
    })

    getAllByTestId('input-box-grid-selection__option').forEach((option) => {
      expect(option.hasAttribute('data-disabled')).toBe(true)
      expect(option.getAttribute('tabindex')).toBe('-1')
    })
  })

  it('does NOT emit update:modelValue on click when disabled', async () => {
    const { getAllByTestId, emitted } = render(BoxGridSelection, {
      props: { items, modelValue: 'a', disabled: true }
    })

    await fireEvent.click(getAllByTestId('input-box-grid-selection__option')[1])

    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('does NOT emit update:modelValue on keyboard interaction when disabled', async () => {
    const { getAllByTestId, emitted } = render(BoxGridSelection, {
      props: { items, modelValue: 'a', disabled: true }
    })

    const options = getAllByTestId('input-box-grid-selection__option')
    await fireEvent.keyDown(options[0], { key: 'ArrowRight' })
    await fireEvent.keyDown(options[0], { key: 'Enter' })

    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('gives the selected option tabindex 0 and the rest tabindex -1', () => {
    const { getAllByTestId } = render(BoxGridSelection, {
      props: { items, modelValue: 'b' }
    })

    const options = getAllByTestId('input-box-grid-selection__option')
    expect(options[0].getAttribute('tabindex')).toBe('-1')
    expect(options[1].getAttribute('tabindex')).toBe('0')
    expect(options[2].getAttribute('tabindex')).toBe('-1')
  })

  it('renders default-slot content in place of the built-in card body', () => {
    const { getByText, queryByTestId } = render(BoxGridSelection, {
      props: { items, modelValue: 'a' },
      slots: {
        default: '<span data-testid="custom-body">{{ params.item.label }} custom</span>'
      }
    })

    expect(getByText('Alpha custom')).toBeTruthy()
    // built-in content is replaced by the slot
    expect(queryByTestId('input-box-grid-selection__content')).toBeNull()
  })

  it('renders tag-slot content alongside the built-in card body', () => {
    const { getByText, getByTestId } = render(BoxGridSelection, {
      props: { items: [{ value: 'a', label: 'Alpha' }], modelValue: 'a' },
      slots: {
        tag: '<span data-testid="custom-tag">Badge</span>'
      }
    })

    expect(getByTestId('input-box-grid-selection__content')).toBeTruthy()
    expect(getByText('Badge')).toBeTruthy()
  })

  it('merges a consumer-supplied class onto the root', () => {
    const { getByTestId } = render(BoxGridSelection, {
      props: { items },
      attrs: { class: 'consumer-class' }
    })

    expect(getByTestId('input-box-grid-selection').classList.contains('consumer-class')).toBe(true)
  })

  it('has no a11y violations in the default (enabled) state', async () => {
    const { container } = render(BoxGridSelection, {
      props: { items, modelValue: 'a' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the disabled state', async () => {
    const { container } = render(BoxGridSelection, {
      props: { items, modelValue: 'a', disabled: true }
    })

    await expectNoA11yViolations(container)
  })

  it('renders the Default story fixture cleanly', async () => {
    const { container } = render(Default())

    await expectNoA11yViolations(container)
  })

  it('renders the Disabled story fixture cleanly', async () => {
    const { container } = render(Disabled())

    await expectNoA11yViolations(container)
  })

  it('renders the WithTag story fixture cleanly', async () => {
    const { container } = render(WithTag())

    await expectNoA11yViolations(container)
  })
})
