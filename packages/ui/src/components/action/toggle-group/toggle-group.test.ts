import '../../../test/reflow.css'

import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/toggle-group/default.vue'
import Fluid from '../../../../examples/toggle-group/fluid.vue'
import Icons from '../../../../examples/toggle-group/icons.vue'
import WithDisabledOption from '../../../../examples/toggle-group/with-disabled-option.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ToggleGroup from './toggle-group.vue'

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

describe('ToggleGroup', () => {
  it('renders the radiogroup with the default testid and applies aria-label', () => {
    const { getByTestId } = render(ToggleGroup, {
      props: { options: OPTIONS, ariaLabel: 'Choose one' }
    })

    const root = getByTestId('toggle-group')
    expect(root).toBeTruthy()
    expect(root.getAttribute('role')).toBe('radiogroup')
    expect(root.getAttribute('aria-label')).toBe('Choose one')
  })

  it.each([
    ['small', 'small'],
    ['medium', 'medium'],
    ['large', 'large']
  ] as const)('maps size=%s onto data-size on the group root', (size, expected) => {
    const { getByTestId } = render(ToggleGroup, { props: { options: OPTIONS, size } })

    expect(getByTestId('toggle-group').getAttribute('data-size')).toBe(expected)
  })

  it('grows every segment hit area to 44px tall on coarse pointers, never sideways into a neighbour', () => {
    const { getAllByRole } = render(ToggleGroup, {
      props: { options: OPTIONS, ariaLabel: 'Choose one' }
    })

    for (const option of getAllByRole('radio')) {
      const target = option.querySelector('[data-slot="touch-target"]')
      expect(target?.className).toContain('pointer-coarse:block')
      expect(target?.className).toContain('inset-y-[min(0rem,calc(50%-22px))]')
      expect(target?.className).toContain('inset-x-0')
    }
  })

  it('draws an option icon beside its label, and keeps the label as the name when icon-only', async () => {
    const { container, getAllByRole } = render(Icons)
    const [standard, fast, list, grid] = getAllByRole('radio')
    expect(standard!.querySelector('i')).toBeNull()
    expect(fast!.querySelector('i.az-bolt')).toHaveAttribute('aria-hidden', 'true')
    expect(fast).toHaveAccessibleName('Fast')
    expect(fast).not.toHaveAttribute('title')
    expect(list!.querySelector('i.az-list')).toBeTruthy()
    expect(list).toHaveAccessibleName('List')
    expect(list).toHaveAttribute('title', 'List')
    expect(list!.querySelector('.sr-only')).toHaveTextContent('List')
    expect(grid).toHaveAccessibleName('Grid')
    await fireEvent.click(grid!)
    expect(grid).toHaveAttribute('aria-checked', 'true')
    await expectNoA11yViolations(container)
  })

  it('defaults data-size to large', () => {
    const { getByTestId } = render(ToggleGroup, { props: { options: OPTIONS } })

    expect(getByTestId('toggle-group').getAttribute('data-size')).toBe('large')
  })

  it('exposes data-fluid on the group root only when fluid is set', () => {
    const { getByTestId, unmount } = render(ToggleGroup, {
      props: { options: OPTIONS, fluid: true }
    })

    expect(getByTestId('toggle-group').getAttribute('data-fluid')).toBe('true')
    unmount()

    const { getByTestId: getDefault } = render(ToggleGroup, { props: { options: OPTIONS } })

    expect(getDefault('toggle-group').hasAttribute('data-fluid')).toBe(false)
  })

  it('renders one radio button per option with the option testid', () => {
    const { getAllByTestId } = render(ToggleGroup, {
      props: { options: OPTIONS }
    })

    const optionButtons = getAllByTestId('toggle-group__option')
    expect(optionButtons).toHaveLength(3)
    optionButtons.forEach((button) => {
      expect(button.getAttribute('role')).toBe('radio')
      expect(button.getAttribute('type')).toBe('button')
    })
  })

  it('marks the first non-disabled option selected by default (aria-checked + data-state)', () => {
    const { getAllByTestId } = render(ToggleGroup, {
      props: { options: OPTIONS }
    })

    const [first, second] = getAllByTestId('toggle-group__option')
    expect(first.getAttribute('aria-checked')).toBe('true')
    expect(first.getAttribute('data-state')).toBe('active')
    expect(second.getAttribute('aria-checked')).toBe('false')
    expect(second.getAttribute('data-state')).toBe('inactive')
  })

  it('honours defaultValue for the initial selection', () => {
    const { getAllByTestId } = render(ToggleGroup, {
      props: { options: OPTIONS, defaultValue: 'two' }
    })

    const [first, second] = getAllByTestId('toggle-group__option')
    expect(first.getAttribute('aria-checked')).toBe('false')
    expect(second.getAttribute('aria-checked')).toBe('true')
    expect(second.getAttribute('data-state')).toBe('active')
  })

  it('emits update:modelValue with the clicked value', async () => {
    const { getAllByTestId, emitted } = render(ToggleGroup, {
      props: { options: OPTIONS }
    })

    const [, second] = getAllByTestId('toggle-group__option')
    await fireEvent.click(second)

    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['two'])
    expect(emitted()['update:modelValue']).toBeTruthy()
    expect(emitted()['update:modelValue'][0]).toEqual(['two'])
  })

  it('updates aria-checked / data-state to the newly clicked option', async () => {
    const { getAllByTestId } = render(ToggleGroup, {
      props: { options: OPTIONS }
    })

    const [first, , third] = getAllByTestId('toggle-group__option')
    await fireEvent.click(third)

    expect(third.getAttribute('aria-checked')).toBe('true')
    expect(third.getAttribute('data-state')).toBe('active')
    expect(first.getAttribute('aria-checked')).toBe('false')
    expect(first.getAttribute('data-state')).toBe('inactive')
  })

  it('does not emit when the already-selected option is clicked again', async () => {
    const { getAllByTestId, emitted } = render(ToggleGroup, {
      props: { options: OPTIONS }
    })

    const [first] = getAllByTestId('toggle-group__option')
    await fireEvent.click(first)

    expect(emitted()['update:modelValue']).toBeFalsy()
    expect(emitted()['update:modelValue']).toBeFalsy()
  })

  it('selects on Enter and Space keydown', async () => {
    const { getAllByTestId, emitted } = render(ToggleGroup, {
      props: { options: OPTIONS }
    })

    const [, second, third] = getAllByTestId('toggle-group__option')

    await fireEvent.keyDown(second, { key: 'Enter' })
    expect(emitted()['update:modelValue'][0]).toEqual(['two'])

    await fireEvent.keyDown(third, { key: ' ' })
    expect(emitted()['update:modelValue'][1]).toEqual(['three'])
  })

  it('moves the selection with ArrowRight and ArrowLeft', async () => {
    const { getAllByTestId, emitted } = render(ToggleGroup, {
      props: { options: OPTIONS }
    })

    const [first] = getAllByTestId('toggle-group__option')

    // Starts on "one" (index 0). ArrowRight -> "two".
    await fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(emitted()['update:modelValue'][0]).toEqual(['two'])

    // Now selected is "two"; ArrowLeft -> "one".
    await fireEvent.keyDown(first, { key: 'ArrowLeft' })
    expect(emitted()['update:modelValue'][1]).toEqual(['one'])
  })

  it('moves the selection with ArrowDown / ArrowUp and jumps with Home / End, as a radio group does', async () => {
    const { getAllByTestId, emitted } = render(ToggleGroup, {
      props: { options: OPTIONS }
    })

    const [first] = getAllByTestId('toggle-group__option')
    await fireEvent.keyDown(first, { key: 'ArrowDown' })
    await fireEvent.keyDown(first, { key: 'End' })
    await fireEvent.keyDown(first, { key: 'ArrowUp' })
    await fireEvent.keyDown(first, { key: 'Home' })
    expect(emitted()['update:modelValue']).toEqual([['two'], ['three'], ['two'], ['one']])
  })

  it('is one tab stop and moves focus with the selection', async () => {
    const { getAllByTestId } = render(ToggleGroup, {
      props: { options: OPTIONS_WITH_DISABLED }
    })

    const [first, disabledOption, third] = getAllByTestId('toggle-group__option')
    expect(first.getAttribute('tabindex')).toBe('0')
    expect(disabledOption.getAttribute('tabindex')).toBe('-1')
    expect(third.getAttribute('tabindex')).toBe('-1')

    first.focus()
    await fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(third)
    expect(third.getAttribute('tabindex')).toBe('0')
    expect(first.getAttribute('tabindex')).toBe('-1')
  })

  it('wraps ArrowLeft from the first option to the last option', async () => {
    const { getAllByTestId, emitted } = render(ToggleGroup, {
      props: { options: OPTIONS }
    })

    const [first] = getAllByTestId('toggle-group__option')

    // Starts on "one" (index 0). ArrowLeft wraps to "three" (last).
    await fireEvent.keyDown(first, { key: 'ArrowLeft' })
    expect(emitted()['update:modelValue'][0]).toEqual(['three'])
  })

  it('does not emit when a disabled option is clicked', async () => {
    const { getAllByTestId, emitted } = render(ToggleGroup, {
      props: { options: OPTIONS_WITH_DISABLED }
    })

    const [, disabledOption] = getAllByTestId('toggle-group__option')
    expect(disabledOption.hasAttribute('disabled')).toBe(true)

    await fireEvent.click(disabledOption)

    expect(emitted()['update:modelValue']).toBeFalsy()
    expect(emitted()['update:modelValue']).toBeFalsy()
  })

  it('skips disabled options during arrow navigation', async () => {
    const { getAllByTestId, emitted } = render(ToggleGroup, {
      props: { options: OPTIONS_WITH_DISABLED }
    })

    const [first] = getAllByTestId('toggle-group__option')

    // Starts on "one"; ArrowRight must skip the disabled "two" and land on "three".
    await fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(emitted()['update:modelValue'][0]).toEqual(['three'])
  })

  it('draws no lock on a disabled option without locked', () => {
    const { getAllByTestId, queryAllByTestId } = render(ToggleGroup, {
      props: { options: OPTIONS_WITH_DISABLED }
    })

    expect(queryAllByTestId('toggle-group__option-lock')).toHaveLength(0)
    const [, disabledOption] = getAllByTestId('toggle-group__option')
    expect(disabledOption.getAttribute('data-disabled')).toBe('')
  })

  it('reflects a controlled v-model value and reacts to updates', async () => {
    const { getAllByTestId, rerender } = render(ToggleGroup, {
      props: { options: OPTIONS, modelValue: 'two' }
    })

    const [first, second] = getAllByTestId('toggle-group__option')
    expect(second.getAttribute('aria-checked')).toBe('true')
    expect(first.getAttribute('aria-checked')).toBe('false')

    await rerender({ options: OPTIONS, modelValue: 'three' })

    const [, , third] = getAllByTestId('toggle-group__option')
    expect(third.getAttribute('aria-checked')).toBe('true')
  })

  it.each([
    ['default options', OPTIONS],
    ['options with a disabled segment', OPTIONS_WITH_DISABLED]
  ])('renders %s as a radiogroup of radios', (_label, options) => {
    const { getByTestId, getAllByTestId } = render(ToggleGroup, {
      props: { options }
    })

    expect(getByTestId('toggle-group').getAttribute('role')).toBe('radiogroup')
    expect(getAllByTestId('toggle-group__option').length).toBe(options.length)
  })

  it('has no accessibility violations on the default render', async () => {
    const { container } = render(ToggleGroup, {
      props: { options: OPTIONS, ariaLabel: 'Choose one' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations with a disabled segment', async () => {
    const { container } = render(ToggleGroup, {
      props: { options: OPTIONS_WITH_DISABLED, ariaLabel: 'Choose one' }
    })

    await expectNoA11yViolations(container)
  })

  it('renders the composed Default story', () => {
    const { getByTestId } = render(Default)
    expect(getByTestId('toggle-group').getAttribute('role')).toBe('radiogroup')
  })

  it('renders the composed WithDisabledOption story', () => {
    const { getByTestId, queryAllByTestId } = render(WithDisabledOption)
    expect(getByTestId('toggle-group')).toBeTruthy()
    expect(queryAllByTestId('toggle-group__option-lock').length).toBe(0)
  })

  it('is named by a consumer aria-labelledby and forwards id', () => {
    const { getByRole } = render({
      components: { ToggleGroup },
      template:
        '<div><span id="range-label">Time range</span><ToggleGroup id="range" aria-labelledby="range-label" :options="options" /></div>',
      setup: () => ({ options: OPTIONS })
    })
    const group = getByRole('radiogroup', { name: 'Time range' })
    expect(group.id).toBe('range')
    expect(group.hasAttribute('aria-label')).toBe(false)
  })

  it('moves forward with ArrowLeft under dir=rtl', async () => {
    const { getAllByRole, emitted } = render({
      components: { ToggleGroup },
      template:
        '<div dir="rtl"><ToggleGroup :options="options" aria-label="Count" @update:model-value="(v) => $emit(\'picked\', v)" /></div>',
      setup: () => ({ options: OPTIONS }),
      emits: ['picked']
    })
    const radios = getAllByRole('radio')
    await fireEvent.keyDown(radios[0], { key: 'ArrowLeft' })
    expect(emitted('picked')?.[0]).toEqual(['two'])
    await fireEvent.keyDown(radios[1], { key: 'ArrowRight' })
    expect(emitted('picked')?.[1]).toEqual(['one'])
  })

  it('disables every option when the group is disabled', async () => {
    const { getAllByRole, getByRole, emitted } = render(ToggleGroup, {
      props: { options: OPTIONS, ariaLabel: 'Count', disabled: true }
    })
    expect(getByRole('radiogroup').hasAttribute('data-disabled')).toBe(true)
    const radios = getAllByRole('radio')
    radios.forEach((radio) => expect((radio as HTMLButtonElement).disabled).toBe(true))
    await fireEvent.click(radios[1])
    expect(emitted('update:modelValue')).toBeUndefined()
  })

  it('draws the lock only where locked allows it', () => {
    const { queryAllByTestId } = render(ToggleGroup, {
      props: {
        ariaLabel: 'Plan',
        options: [
          { label: 'Free', value: 'free' },
          { label: 'Pro', value: 'pro', locked: true },
          { label: 'Paused', value: 'paused', disabled: true, locked: false },
          { label: 'Legacy', value: 'legacy', disabled: true }
        ]
      }
    })
    const locks = queryAllByTestId('toggle-group__option-lock')
    expect(locks.map((lock) => lock.closest('button')?.textContent?.trim())).toEqual(['Pro'])
    expect(
      queryAllByTestId('toggle-group__option').map((option) => option.hasAttribute('data-locked'))
    ).toEqual([false, true, false, false])
  })

  it('leaves the indicator transition to classes so reduced motion can turn it off', () => {
    const { getByTestId } = render(ToggleGroup, {
      props: { options: OPTIONS, ariaLabel: 'Count' }
    })
    expect(getByTestId('toggle-group__indicator').style.transition).toBe('')
  })

  describe('native form submit', () => {
    it('submits the selected value under its name', async () => {
      const { getByTestId, getAllByTestId } = render({
        components: { ToggleGroup },
        setup: () => ({ options: OPTIONS }),
        template:
          '<form data-testid="form"><ToggleGroup :options="options" name="range" aria-label="Range" /></form>'
      })
      const form = getByTestId('form') as HTMLFormElement
      expect(new FormData(form).get('range')).toBe('one')
      await fireEvent.click(getAllByTestId('toggle-group__option')[2])
      expect(new FormData(form).get('range')).toBe('three')
    })
  })

  describe('layout (styled)', () => {
    const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

    it.each([
      ['Default', Default],
      ['Fluid', Fluid]
    ])('wraps the %s options in a narrow box instead of cutting a label', async (_, example) => {
      const { container } = render({
        components: { example },
        template: '<div style="width: 180px"><example /></div>'
      })
      await frame()
      await frame()
      const labels = [
        ...container.querySelectorAll<HTMLElement>('[role="radio"] > span:not([aria-hidden])')
      ]
      expect(labels.length).toBeGreaterThan(0)
      for (const label of labels) {
        expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth + 1)
        const box = label.getBoundingClientRect()
        const group = label.closest('[role="radiogroup"]')!.getBoundingClientRect()
        expect(box.right).toBeLessThanOrEqual(group.right + 1)
        expect(box.bottom).toBeLessThanOrEqual(group.bottom + 1)
      }
    })

    it('paints no fill on a disabled option, so only the selected one is filled', async () => {
      const { getAllByTestId } = render(WithDisabledOption)
      await frame()
      const disabled = getAllByTestId('toggle-group__option').find((option) =>
        option.hasAttribute('disabled')
      )!
      expect(getComputedStyle(disabled).backgroundColor).toBe('rgba(0, 0, 0, 0)')
    })
  })

  it('dims the selected option of a disabled group like the rest, not in the active colour', () => {
    const { getAllByTestId, container } = render(ToggleGroup, {
      props: {
        options: [
          { label: 'Match all', value: 'and' },
          { label: 'Match any', value: 'or' }
        ],
        modelValue: 'and',
        disabled: true
      }
    })
    const probe = document.createElement('span')
    probe.style.color = 'var(--text-disabled)'
    container.appendChild(probe)
    const dimmed = getComputedStyle(probe).color
    const [active, inactive] = getAllByTestId('toggle-group__option') as HTMLElement[]
    expect(active?.dataset['state']).toBe('active')
    expect(getComputedStyle(active as HTMLElement).color).toBe(dimmed)
    expect(getComputedStyle(inactive as HTMLElement).color).toBe(dimmed)
  })
})
