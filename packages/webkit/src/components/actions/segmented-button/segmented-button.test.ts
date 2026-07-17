import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/actions/segmented-button/SegmentedButton.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import SegmentedButton from './segmented-button.vue'

const { Default, WithDisabledOption } = composeStories(stories)

const OPTIONS = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
  { label: 'Three', value: 'three' }
]

const OPTIONS_WITH_DISABLED = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two', disabled: true },
  { label: 'Three', value: 'three' }
]

describe('SegmentedButton', () => {
  it('renders the radiogroup with the default testid and applies aria-label', () => {
    const { getByTestId } = render(SegmentedButton, {
      props: { options: OPTIONS, ariaLabel: 'Choose one' }
    })

    const root = getByTestId('actions-segmented-button')
    expect(root).toBeTruthy()
    expect(root.getAttribute('role')).toBe('radiogroup')
    expect(root.getAttribute('aria-label')).toBe('Choose one')
  })

  it('renders one radio button per option with the option testid', () => {
    const { getAllByTestId } = render(SegmentedButton, {
      props: { options: OPTIONS }
    })

    const optionButtons = getAllByTestId('actions-segmented-button__option')
    expect(optionButtons).toHaveLength(3)
    optionButtons.forEach((button) => {
      expect(button.getAttribute('role')).toBe('radio')
      expect(button.getAttribute('type')).toBe('button')
    })
  })

  it('marks the first non-disabled option selected by default (aria-checked + data-state)', () => {
    const { getAllByTestId } = render(SegmentedButton, {
      props: { options: OPTIONS }
    })

    const [first, second] = getAllByTestId('actions-segmented-button__option')
    expect(first.getAttribute('aria-checked')).toBe('true')
    expect(first.getAttribute('data-state')).toBe('active')
    expect(second.getAttribute('aria-checked')).toBe('false')
    expect(second.getAttribute('data-state')).toBe('inactive')
  })

  it('honours defaultValue for the initial selection', () => {
    const { getAllByTestId } = render(SegmentedButton, {
      props: { options: OPTIONS, defaultValue: 'two' }
    })

    const [first, second] = getAllByTestId('actions-segmented-button__option')
    expect(first.getAttribute('aria-checked')).toBe('false')
    expect(second.getAttribute('aria-checked')).toBe('true')
    expect(second.getAttribute('data-state')).toBe('active')
  })

  it('emits update:modelValue with the clicked value', async () => {
    const { getAllByTestId, emitted } = render(SegmentedButton, {
      props: { options: OPTIONS }
    })

    const [, second] = getAllByTestId('actions-segmented-button__option')
    await fireEvent.click(second)

    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['two'])
    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['two'])
  })

  it('updates aria-checked / data-state to the newly clicked option', async () => {
    const { getAllByTestId } = render(SegmentedButton, {
      props: { options: OPTIONS }
    })

    const [first, , third] = getAllByTestId('actions-segmented-button__option')
    await fireEvent.click(third)

    expect(third.getAttribute('aria-checked')).toBe('true')
    expect(third.getAttribute('data-state')).toBe('active')
    expect(first.getAttribute('aria-checked')).toBe('false')
    expect(first.getAttribute('data-state')).toBe('inactive')
  })

  it('does not emit when the already-selected option is clicked again', async () => {
    const { getAllByTestId, emitted } = render(SegmentedButton, {
      props: { options: OPTIONS }
    })

    const [first] = getAllByTestId('actions-segmented-button__option')
    await fireEvent.click(first)

    expect(emitted()['update:modelValue']).toBeFalsy()
    expect(emitted()['update:modelValue']).toBeFalsy()
  })

  it('selects on Enter and Space keydown', async () => {
    const { getAllByTestId, emitted } = render(SegmentedButton, {
      props: { options: OPTIONS }
    })

    const [, second, third] = getAllByTestId('actions-segmented-button__option')

    await fireEvent.keyDown(second, { key: 'Enter' })
    expect(emitted()['update:modelValue'][0]).toEqual(['two'])

    await fireEvent.keyDown(third, { key: ' ' })
    expect(emitted()['update:modelValue'][1]).toEqual(['three'])
  })

  it('moves the selection with ArrowRight and ArrowLeft', async () => {
    const { getAllByTestId, emitted } = render(SegmentedButton, {
      props: { options: OPTIONS }
    })

    const [first] = getAllByTestId('actions-segmented-button__option')

    // Starts on "one" (index 0). ArrowRight -> "two".
    await fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(emitted()['update:modelValue'][0]).toEqual(['two'])

    // Now selected is "two"; ArrowLeft -> "one".
    await fireEvent.keyDown(first, { key: 'ArrowLeft' })
    expect(emitted()['update:modelValue'][1]).toEqual(['one'])
  })

  it('wraps ArrowLeft from the first option to the last option', async () => {
    const { getAllByTestId, emitted } = render(SegmentedButton, {
      props: { options: OPTIONS }
    })

    const [first] = getAllByTestId('actions-segmented-button__option')

    // Starts on "one" (index 0). ArrowLeft wraps to "three" (last).
    await fireEvent.keyDown(first, { key: 'ArrowLeft' })
    expect(emitted()['update:modelValue'][0]).toEqual(['three'])
  })

  it('does not emit when a disabled option is clicked', async () => {
    const { getAllByTestId, emitted } = render(SegmentedButton, {
      props: { options: OPTIONS_WITH_DISABLED }
    })

    const [, disabledOption] = getAllByTestId('actions-segmented-button__option')
    expect(disabledOption.hasAttribute('disabled')).toBe(true)

    await fireEvent.click(disabledOption)

    expect(emitted()['update:modelValue']).toBeFalsy()
    expect(emitted()['update:modelValue']).toBeFalsy()
  })

  it('skips disabled options during arrow navigation', async () => {
    const { getAllByTestId, emitted } = render(SegmentedButton, {
      props: { options: OPTIONS_WITH_DISABLED }
    })

    const [first] = getAllByTestId('actions-segmented-button__option')

    // Starts on "one"; ArrowRight must skip the disabled "two" and land on "three".
    await fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(emitted()['update:modelValue'][0]).toEqual(['three'])
  })

  it('exposes the lock affordance only on disabled options', () => {
    const { getAllByTestId, queryAllByTestId } = render(SegmentedButton, {
      props: { options: OPTIONS_WITH_DISABLED }
    })

    const locks = queryAllByTestId('actions-segmented-button__option-lock')
    expect(locks).toHaveLength(1)

    const [, disabledOption] = getAllByTestId('actions-segmented-button__option')
    expect(disabledOption.getAttribute('data-disabled')).toBe('')
    expect(disabledOption.contains(locks[0])).toBe(true)
  })

  it('reflects a controlled v-model value and reacts to updates', async () => {
    const { getAllByTestId, rerender } = render(SegmentedButton, {
      props: { options: OPTIONS, modelValue: 'two' }
    })

    const [first, second] = getAllByTestId('actions-segmented-button__option')
    expect(second.getAttribute('aria-checked')).toBe('true')
    expect(first.getAttribute('aria-checked')).toBe('false')

    await rerender({ options: OPTIONS, modelValue: 'three' })

    const [, , third] = getAllByTestId('actions-segmented-button__option')
    expect(third.getAttribute('aria-checked')).toBe('true')
  })

  it.each([
    ['default options', OPTIONS],
    ['options with a disabled segment', OPTIONS_WITH_DISABLED]
  ])('renders %s as a radiogroup of radios', (_label, options) => {
    const { getByTestId, getAllByTestId } = render(SegmentedButton, {
      props: { options }
    })

    expect(getByTestId('actions-segmented-button').getAttribute('role')).toBe('radiogroup')
    expect(getAllByTestId('actions-segmented-button__option').length).toBe(options.length)
  })

  it('has no accessibility violations on the default render', async () => {
    const { container } = render(SegmentedButton, {
      props: { options: OPTIONS, ariaLabel: 'Choose one' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations with a disabled segment', async () => {
    const { container } = render(SegmentedButton, {
      props: { options: OPTIONS_WITH_DISABLED, ariaLabel: 'Choose one' }
    })

    await expectNoA11yViolations(container)
  })

  it('renders the composed Default story', () => {
    const { getByTestId } = render(Default())
    expect(getByTestId('actions-segmented-button').getAttribute('role')).toBe('radiogroup')
  })

  it('renders the composed WithDisabledOption story', () => {
    const { getByTestId, queryAllByTestId } = render(WithDisabledOption())
    expect(getByTestId('actions-segmented-button')).toBeTruthy()
    expect(queryAllByTestId('actions-segmented-button__option-lock').length).toBe(1)
  })
})
