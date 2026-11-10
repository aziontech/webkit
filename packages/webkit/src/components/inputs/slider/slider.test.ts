import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import Slider from './slider.vue'

const LABEL = { ariaLabel: 'Alert threshold' }

function inputOf(getByTestId: (id: string) => HTMLElement, testId = 'input-slider') {
  return getByTestId(`${testId}__input`) as HTMLInputElement
}

async function press(input: HTMLInputElement, key: string) {
  input.focus()
  await userEvent.keyboard(`{${key}}`)
}

describe('Slider', () => {
  describe('render + data-testid', () => {
    it('renders the input-slider fallback on the root and __input on the native range', () => {
      const { getByTestId } = render(Slider, { props: LABEL })

      expect(getByTestId('input-slider').tagName).toBe('DIV')
      const input = inputOf(getByTestId)
      expect(input.tagName).toBe('INPUT')
      expect(input.type).toBe('range')
    })

    it('lets a consumer data-testid win on the root and derive the input testid', () => {
      const { getByTestId, queryByTestId } = render(Slider, {
        props: LABEL,
        attrs: { 'data-testid': 'limit-slider' }
      })

      expect(getByTestId('limit-slider')).toBeTruthy()
      expect(getByTestId('limit-slider__input')).toBeTruthy()
      expect(queryByTestId('input-slider')).toBeNull()
    })

    it('forwards min, max, step and the model value to the native input', () => {
      const { getByTestId } = render(Slider, {
        props: { ...LABEL, min: 10, max: 60, step: 5, modelValue: 25 }
      })

      const input = inputOf(getByTestId)
      expect(input.min).toBe('10')
      expect(input.max).toBe('60')
      expect(input.step).toBe('5')
      expect(input.valueAsNumber).toBe(25)
    })

    it('routes class to the root and every other attribute to the native input', () => {
      const { getByTestId } = render(Slider, {
        props: LABEL,
        attrs: { class: 'consumer-class', id: 'threshold', 'aria-describedby': 'threshold-help' }
      })

      const root = getByTestId('input-slider')
      const input = inputOf(getByTestId)
      expect(root.classList.contains('consumer-class')).toBe(true)
      expect(input.classList.contains('consumer-class')).toBe(false)
      expect(input.id).toBe('threshold')
      expect(input.getAttribute('aria-describedby')).toBe('threshold-help')
      expect(root.getAttribute('id')).toBeNull()
    })
  })

  describe('v-model via keyboard', () => {
    it.each([
      ['ArrowRight', 41],
      ['ArrowUp', 41],
      ['ArrowLeft', 39],
      ['ArrowDown', 39],
      ['Home', 0],
      ['End', 100]
    ])('emits update:modelValue on %s', async (key, expected) => {
      const { getByTestId, emitted } = render(Slider, { props: { ...LABEL, modelValue: 40 } })

      await press(inputOf(getByTestId), key)

      const updates = emitted()['update:modelValue'] as number[][]
      expect(updates.at(-1)).toEqual([expected])
    })

    it('moves by a larger increment on PageUp and PageDown', async () => {
      const { getByTestId, emitted } = render(Slider, { props: { ...LABEL, modelValue: 50 } })
      const input = inputOf(getByTestId)

      await press(input, 'PageUp')
      const up = (emitted()['update:modelValue'] as number[][]).at(-1)?.[0] ?? 0
      expect(up).toBeGreaterThan(51)

      await press(input, 'PageDown')
      await press(input, 'PageDown')
      const down = (emitted()['update:modelValue'] as number[][]).at(-1)?.[0] ?? 100
      expect(down).toBeLessThan(49)
    })

    it('round-trips the value through a parent v-model binding', async () => {
      const Host = defineComponent({
        setup() {
          const value = ref(40)
          return () =>
            h('div', [
              h(Slider, {
                ...LABEL,
                step: 10,
                modelValue: value.value,
                'onUpdate:modelValue': (next: number) => {
                  value.value = next
                }
              }),
              h('output', { 'data-testid': 'bound' }, String(value.value))
            ])
        }
      })
      const { getByTestId, findByText } = render(Host)
      const input = inputOf(getByTestId)

      await press(input, 'ArrowRight')
      expect(await findByText('50')).toBeTruthy()
      expect(input.valueAsNumber).toBe(50)

      await press(input, 'Home')
      expect(getByTestId('bound').textContent).toBe('0')
      expect(input.valueAsNumber).toBe(0)
    })
  })

  describe('change', () => {
    it('fires once per keyboard step with the committed value', async () => {
      const { getByTestId, emitted } = render(Slider, { props: { ...LABEL, modelValue: 40 } })
      const input = inputOf(getByTestId)

      await press(input, 'ArrowRight')
      expect(emitted()['change']).toEqual([[41]])

      await press(input, 'End')
      expect(emitted()['change']).toEqual([[41], [100]])
    })
  })

  describe('readonly', () => {
    it('stays focusable, sets aria-readonly and data-readonly', async () => {
      const { getByTestId } = render(Slider, { props: { ...LABEL, readonly: true } })
      const input = inputOf(getByTestId)

      await userEvent.tab()
      expect(document.activeElement).toBe(input)
      expect(input.getAttribute('aria-readonly')).toBe('true')
      expect(getByTestId('input-slider').hasAttribute('data-readonly')).toBe(true)
    })

    it.each(['ArrowRight', 'ArrowLeft', 'PageUp', 'PageDown', 'Home', 'End'])(
      'keeps the value and emits nothing on %s',
      async (key) => {
        const { getByTestId, emitted } = render(Slider, {
          props: { ...LABEL, readonly: true, modelValue: 40 }
        })
        const input = inputOf(getByTestId)

        await press(input, key)

        expect(input.valueAsNumber).toBe(40)
        expect(emitted()['update:modelValue']).toBeUndefined()
        expect(emitted()['change']).toBeUndefined()
      }
    )

    it('writes the model back when a native input slips through', async () => {
      const { getByTestId, emitted } = render(Slider, {
        props: { ...LABEL, readonly: true, modelValue: 40 }
      })
      const input = inputOf(getByTestId)

      input.value = '70'
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))

      expect(input.valueAsNumber).toBe(40)
      expect(emitted()['update:modelValue']).toBeUndefined()
      expect(emitted()['change']).toBeUndefined()
    })
  })

  describe('disabled', () => {
    it('disables the native input, mirrors data-disabled and skips it in the tab order', async () => {
      const { getByTestId } = render(Slider, { props: { ...LABEL, disabled: true } })
      const input = inputOf(getByTestId)

      expect(input.disabled).toBe(true)
      expect(getByTestId('input-slider').hasAttribute('data-disabled')).toBe(true)

      await userEvent.tab()
      expect(document.activeElement).not.toBe(input)
    })

    it('emits nothing on keyboard interaction', async () => {
      const { getByTestId, emitted } = render(Slider, {
        props: { ...LABEL, disabled: true, modelValue: 40 }
      })

      await press(inputOf(getByTestId), 'ArrowRight')

      expect(emitted()['update:modelValue']).toBeUndefined()
      expect(emitted()['change']).toBeUndefined()
    })
  })

  describe('ARIA', () => {
    it('sets aria-invalid and data-invalid when invalid', () => {
      const { getByTestId } = render(Slider, { props: { ...LABEL, invalid: true } })

      expect(inputOf(getByTestId).getAttribute('aria-invalid')).toBe('true')
      expect(getByTestId('input-slider').hasAttribute('data-invalid')).toBe(true)
    })

    it('omits aria-invalid, aria-readonly and the state data attributes by default', () => {
      const { getByTestId } = render(Slider, { props: LABEL })
      const root = getByTestId('input-slider')
      const input = inputOf(getByTestId)

      expect(input.hasAttribute('aria-invalid')).toBe(false)
      expect(input.hasAttribute('aria-readonly')).toBe(false)
      expect(root.hasAttribute('data-invalid')).toBe(false)
      expect(root.hasAttribute('data-readonly')).toBe(false)
      expect(root.hasAttribute('data-disabled')).toBe(false)
    })

    it('exposes role slider named by ariaLabel', () => {
      const { getByRole } = render(Slider, { props: LABEL })

      expect(getByRole('slider', { name: 'Alert threshold' })).toBeTruthy()
    })

    it('omits aria-label when ariaLabel is empty so an associated label names it', () => {
      const { getByTestId } = render(Slider, { attrs: { 'aria-labelledby': 'external' } })

      expect(inputOf(getByTestId).hasAttribute('aria-label')).toBe(false)
    })

    it('announces the value with the unit through aria-valuetext', async () => {
      const { getByTestId } = render(Slider, { props: { ...LABEL, modelValue: 40, unit: '%' } })
      const input = inputOf(getByTestId)

      expect(input.getAttribute('aria-valuetext')).toBe('40%')

      await press(input, 'ArrowRight')
      expect(input.getAttribute('aria-valuetext')).toBe('41%')
    })

    it('omits aria-valuetext when no unit is set', () => {
      const { getByTestId } = render(Slider, { props: { ...LABEL, modelValue: 40 } })

      expect(inputOf(getByTestId).hasAttribute('aria-valuetext')).toBe(false)
    })
  })

  describe('ticks and reference values', () => {
    it('renders no marks by default', () => {
      const { queryAllByTestId } = render(Slider, { props: LABEL })

      expect(queryAllByTestId('input-slider__tick')).toHaveLength(0)
      expect(queryAllByTestId('input-slider__reference')).toHaveLength(0)
    })

    it('renders one tick per step when the range has at most 21 positions', () => {
      const { queryAllByTestId } = render(Slider, { props: { ...LABEL, step: 10, ticks: true } })

      expect(queryAllByTestId('input-slider__tick')).toHaveLength(11)
    })

    it('renders no step ticks above 21 positions', () => {
      const { queryAllByTestId } = render(Slider, { props: { ...LABEL, step: 1, ticks: true } })

      expect(queryAllByTestId('input-slider__tick')).toHaveLength(0)
    })

    it('labels in-range reference values with the unit, each with its own tick', () => {
      const { queryAllByTestId } = render(Slider, {
        props: { ...LABEL, referenceValues: [100, 0, 50, 150, -10], unit: '%' }
      })

      const labels = queryAllByTestId('input-slider__reference')
      expect(labels.map((label) => label.textContent?.trim())).toEqual(['0%', '50%', '100%'])
      expect(queryAllByTestId('input-slider__tick')).toHaveLength(3)
    })

    it('merges reference ticks with step ticks without duplicates', () => {
      const { queryAllByTestId } = render(Slider, {
        props: { ...LABEL, step: 25, ticks: true, referenceValues: [0, 50, 60] }
      })

      expect(queryAllByTestId('input-slider__tick')).toHaveLength(6)
      expect(queryAllByTestId('input-slider__reference')).toHaveLength(3)
    })

    it('hides the marks row from assistive tech', () => {
      const { queryAllByTestId } = render(Slider, {
        props: { ...LABEL, step: 10, ticks: true, referenceValues: [0, 100] }
      })

      const tick = queryAllByTestId('input-slider__tick')[0]
      expect(tick?.closest('[aria-hidden="true"]')).not.toBeNull()
    })
  })

  describe('a11y', () => {
    it('has no violations in the default render', async () => {
      const { container } = render(Slider, { props: LABEL })
      await expectNoA11yViolations(container)
    })

    it('has no violations with ticks, reference values and a unit', async () => {
      const { container } = render(Slider, {
        props: { ...LABEL, step: 10, ticks: true, referenceValues: [0, 50, 100], unit: '%' }
      })
      await expectNoA11yViolations(container)
    })

    it.each([{ readonly: true }, { disabled: true }, { invalid: true }])(
      'has no violations with %o',
      async (state) => {
        const { container } = render(Slider, { props: { ...LABEL, ...state } })
        await expectNoA11yViolations(container)
      }
    )
  })
})
