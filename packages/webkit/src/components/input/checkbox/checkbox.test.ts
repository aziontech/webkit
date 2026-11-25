import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/checkbox/default.vue'
import Disabled from '../../../../examples/checkbox/disabled.vue'
import Indeterminate from '../../../../examples/checkbox/indeterminate.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Checkbox from './checkbox.vue'

describe('Checkbox', () => {
  describe('data-testid', () => {
    it('renders the input-checkbox fallback testid on the root, input, and icon', () => {
      const { getByTestId } = render(Checkbox, {
        props: { modelValue: true }
      })

      expect(getByTestId('checkbox')).toBeTruthy()
      expect(getByTestId('checkbox__input')).toBeTruthy()
      // Icon svg only renders when checked / indeterminate.
      expect(getByTestId('checkbox__icon')).toBeTruthy()
    })

    it('honors a consumer-supplied data-testid on all three parts', () => {
      const { getByTestId } = render(Checkbox, {
        props: { modelValue: true },
        attrs: { 'data-testid': 'my-box' }
      })

      expect(getByTestId('my-box')).toBeTruthy()
      expect(getByTestId('my-box__input')).toBeTruthy()
      expect(getByTestId('my-box__icon')).toBeTruthy()
    })
  })

  describe('invalid', () => {
    it('marks the input aria-invalid and the root data-invalid from its own prop', async () => {
      const view = render(Checkbox, { props: { invalid: true }, attrs: { 'aria-label': 'Accept' } })
      expect(view.getByTestId('checkbox__input').getAttribute('aria-invalid')).toBe('true')
      expect(view.getByTestId('checkbox').hasAttribute('data-invalid')).toBe(true)
      await view.rerender({ invalid: false })
      expect(view.getByTestId('checkbox__input').hasAttribute('aria-invalid')).toBe(false)
      expect(view.getByTestId('checkbox').hasAttribute('data-invalid')).toBe(false)
    })
  })

  describe('binary mode — update:modelValue', () => {
    it('emits the negated boolean when toggling from false', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { modelValue: false }
      })

      await fireEvent.click(getByTestId('checkbox__input'))

      expect(emitted()['update:modelValue']).toBeTruthy()
      expect(emitted()['update:modelValue'][0]).toEqual([true])
    })

    it('emits false when toggling from true', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { modelValue: true }
      })

      await fireEvent.click(getByTestId('checkbox__input'))

      expect(emitted()['update:modelValue'][0]).toEqual([false])
    })
  })

  describe('array mode — update:modelValue', () => {
    it('adds its value to the array when not present', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { value: 'b', modelValue: ['a'] }
      })

      await fireEvent.click(getByTestId('checkbox__input'))

      expect(emitted()['update:modelValue'][0]).toEqual([['a', 'b']])
    })

    it('removes its value from the array when already present', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { value: 'a', modelValue: ['a', 'b'] }
      })

      await fireEvent.click(getByTestId('checkbox__input'))

      expect(emitted()['update:modelValue'][0]).toEqual([['b']])
    })
  })

  describe('v-model', () => {
    it('toggles its own checked state when unbound (uncontrolled)', async () => {
      const { getByTestId, emitted } = render(Checkbox, { props: {} })
      const root = getByTestId('checkbox')

      expect(root.getAttribute('data-state')).toBe('unchecked')
      await fireEvent.click(getByTestId('checkbox__input'))
      expect(root.getAttribute('data-state')).toBe('checked')
      await fireEvent.click(getByTestId('checkbox__input'))
      expect(root.getAttribute('data-state')).toBe('unchecked')
      expect(emitted()['update:modelValue']).toEqual([[true], [false]])
    })

    it('round-trips a bound array with the parent (controlled)', async () => {
      const tags = ref<string[]>(['edge'])
      const Host = defineComponent({
        setup: () => () =>
          h(Checkbox, {
            value: 'cache',
            modelValue: tags.value,
            'onUpdate:modelValue': (next: unknown) => {
              tags.value = next as string[]
            }
          })
      })
      const { getByTestId } = render(Host)
      const root = getByTestId('checkbox')

      expect(root.getAttribute('data-state')).toBe('unchecked')
      await fireEvent.click(getByTestId('checkbox__input'))
      expect(tags.value).toEqual(['edge', 'cache'])
      expect(root.getAttribute('data-state')).toBe('checked')

      tags.value = ['edge']
      await nextTick()
      expect(root.getAttribute('data-state')).toBe('unchecked')
    })

    it('stays on the parent value when a controlled parent refuses the change', async () => {
      const Host = defineComponent({
        setup: () => () => h(Checkbox, { modelValue: false, 'onUpdate:modelValue': () => {} })
      })
      const { getByTestId } = render(Host)

      await fireEvent.click(getByTestId('checkbox__input'))
      expect(getByTestId('checkbox').getAttribute('data-state')).toBe('unchecked')
      await nextTick()
      expect((getByTestId('checkbox__input') as HTMLInputElement).checked).toBe(false)
    })

    it('toggles a boolean model with no value and no binary flag', async () => {
      const { getByRole, emitted } = render(Checkbox, {
        props: { modelValue: false },
        attrs: { 'aria-label': 'Subscribe' }
      })
      await fireEvent.click(getByRole('checkbox'))
      expect(emitted('update:modelValue')?.[0]).toEqual([true])
    })

    it('checks and unchecks a scalar model paired with value', async () => {
      const model = ref<string | null>('pro')
      const Host = defineComponent({
        setup: () => () =>
          h(Checkbox, {
            value: 'pro',
            modelValue: model.value,
            'aria-label': 'Pro',
            'onUpdate:modelValue': (next: unknown) => (model.value = next as string | null)
          })
      })
      const { getByRole } = render(Host)
      const input = getByRole('checkbox') as HTMLInputElement

      await fireEvent.click(input)
      expect(model.value).toBeNull()
      await nextTick()
      expect(input.checked).toBe(false)

      await fireEvent.click(input)
      expect(model.value).toBe('pro')
      await nextTick()
      expect(input.checked).toBe(true)
    })
  })

  describe('checked state derivation', () => {
    it('is checked in binary mode when modelValue is truthy', () => {
      const { getByTestId } = render(Checkbox, {
        props: { modelValue: true }
      })

      const input = getByTestId('checkbox__input') as HTMLInputElement
      expect(input.checked).toBe(true)
      expect(input.hasAttribute('aria-checked')).toBe(false)
      expect(getByTestId('checkbox').getAttribute('data-state')).toBe('checked')
      expect(getByTestId('checkbox').getAttribute('data-checked')).toBe('true')
    })

    it('is unchecked in binary mode when modelValue is falsy', () => {
      const { getByTestId } = render(Checkbox, {
        props: { modelValue: false }
      })

      const input = getByTestId('checkbox__input') as HTMLInputElement
      expect(input.checked).toBe(false)
      expect(input.hasAttribute('aria-checked')).toBe(false)
      expect(getByTestId('checkbox').getAttribute('data-state')).toBe('unchecked')
      expect(getByTestId('checkbox').getAttribute('data-checked')).toBeNull()
    })

    it('is checked in scalar mode when modelValue equals value', () => {
      const { getByTestId } = render(Checkbox, {
        props: { value: 'x', modelValue: 'x' }
      })

      const input = getByTestId('checkbox__input') as HTMLInputElement
      expect(input.checked).toBe(true)
      expect(getByTestId('checkbox').getAttribute('data-state')).toBe('checked')
    })

    it('is checked in array mode when the array includes value', () => {
      const { getByTestId } = render(Checkbox, {
        props: { value: 'a', modelValue: ['a', 'b'] }
      })

      expect((getByTestId('checkbox__input') as HTMLInputElement).checked).toBe(true)
      expect(getByTestId('checkbox').getAttribute('data-state')).toBe('checked')
    })
  })

  describe('indeterminate', () => {
    it('sets the native indeterminate property, data-state and data-indeterminate, and renders the bar icon', () => {
      const { getByTestId } = render(Checkbox, {
        props: { modelValue: false, indeterminate: true }
      })

      const root = getByTestId('checkbox')
      const input = getByTestId('checkbox__input') as HTMLInputElement

      expect(input.indeterminate).toBe(true)
      expect(input.hasAttribute('aria-checked')).toBe(false)
      expect(root.getAttribute('data-state')).toBe('indeterminate')
      expect(root.getAttribute('data-indeterminate')).toBe('true')
      // The indeterminate (bar) glyph renders, not the checkmark.
      expect(getByTestId('checkbox__icon')).toBeTruthy()
    })

    it('reflects the native input.indeterminate DOM property when indeterminate turns on after mount', async () => {
      const { getByTestId, rerender } = render(Checkbox, {
        props: { modelValue: false, indeterminate: false }
      })

      const input = getByTestId('checkbox__input') as HTMLInputElement
      expect(input.indeterminate).toBe(false)

      await rerender({ modelValue: false, indeterminate: true })

      expect(input.indeterminate).toBe(true)
    })

    it('does not change modelValue itself — toggling still emits the binary negation', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { modelValue: false, indeterminate: true }
      })

      await fireEvent.click(getByTestId('checkbox__input'))

      // indeterminate is a visual only; onChange runs the binary branch on modelValue=false.
      expect(emitted()['update:modelValue'][0]).toEqual([true])
    })
  })

  describe('disabled look', () => {
    it('draws a disabled check mark in --text-muted, so checked still reads in dark', () => {
      const { getByTestId } = render(Checkbox, {
        props: { disabled: true, modelValue: true },
        attrs: { 'aria-label': 'Locked option' }
      })
      const box = getByTestId('checkbox')
      expect(box.getAttribute('data-checked')).toBe('true')
      expect(box.className).toContain('data-[disabled]:data-[checked]:text-(--text-muted)')
    })
  })

  describe('disabled suppresses interaction', () => {
    it('sets the native disabled + data-disabled and does not emit on click', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { modelValue: false, disabled: true }
      })

      const input = getByTestId('checkbox__input') as HTMLInputElement
      expect(input.disabled).toBe(true)
      expect(getByTestId('checkbox').getAttribute('data-disabled')).toBe('true')

      await fireEvent.change(input)

      expect(emitted()['update:modelValue']).toBeUndefined()
    })
  })

  describe('readonly suppresses interaction', () => {
    it('sets data-readonly and does not emit on change', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { modelValue: false, readonly: true }
      })

      expect(getByTestId('checkbox').getAttribute('data-readonly')).toBe('true')

      await fireEvent.change(getByTestId('checkbox__input'))

      expect(emitted()['update:modelValue']).toBeUndefined()
    })

    it('keeps the native input unchecked and exposes aria-readonly when clicked', async () => {
      const { getByRole, emitted } = render(Checkbox, {
        props: { modelValue: false, readonly: true },
        attrs: { 'aria-label': 'Locked' }
      })
      const input = getByRole('checkbox') as HTMLInputElement
      expect(input.getAttribute('aria-readonly')).toBe('true')
      await fireEvent.click(input)
      expect(input.checked).toBe(false)
      expect(emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('forwarded input attributes', () => {
    it('forwards the id and tabindex attributes and the name prop to the inner input', () => {
      const { getByTestId } = render(Checkbox, {
        props: { modelValue: false, name: 'terms' },
        attrs: { id: 'agree', tabindex: -1 }
      })

      const input = getByTestId('checkbox__input') as HTMLInputElement
      expect(input.id).toBe('agree')
      expect(input.getAttribute('name')).toBe('terms')
      expect(input.getAttribute('tabindex')).toBe('-1')
    })

    it('has no inputId or binary props: inputId does not set the id and binary does not force a boolean model', async () => {
      const { getByTestId, emitted } = render(Checkbox, {
        props: { value: 'a', modelValue: [] },
        attrs: { inputId: 'legacy', binary: true }
      })

      const input = getByTestId('checkbox__input') as HTMLInputElement
      expect(input.id).not.toBe('legacy')
      await fireEvent.click(input)
      expect(emitted('update:modelValue')?.[0]).toEqual([['a']])
    })
  })

  describe('a11y', () => {
    it('has no violations when checked with an accessible name', async () => {
      const { container } = render(Checkbox, {
        props: { modelValue: true },
        attrs: { id: 'a11y-checked', 'aria-label': 'Accept terms' }
      })

      await expectNoA11yViolations(container)
    })

    it('has no violations when unchecked with an accessible name', async () => {
      const { container } = render(Checkbox, {
        props: { modelValue: false },
        attrs: { id: 'a11y-unchecked', 'aria-label': 'Accept terms' }
      })

      await expectNoA11yViolations(container)
    })
  })

  describe('smoke over boolean state props', () => {
    it.each([
      ['checked', { modelValue: true }, 'checked'],
      ['unchecked', { modelValue: false }, 'unchecked'],
      ['indeterminate', { modelValue: false, indeterminate: true }, 'indeterminate']
    ] as const)('renders data-state=%s', (_label, props, expectedState) => {
      const { getByTestId } = render(Checkbox, { props })
      expect(getByTestId('checkbox').getAttribute('data-state')).toBe(expectedState)
    })
  })

  describe('documented examples', () => {
    it('renders the Default story', () => {
      const { getByTestId } = render(Default)
      expect(getByTestId('checkbox')).toBeTruthy()
    })

    it('renders the Indeterminate story with a mixed input', async () => {
      const { getByTestId } = render(Indeterminate)
      await nextTick()
      expect((getByTestId('checkbox__input') as HTMLInputElement).indeterminate).toBe(true)
    })

    it('renders the Disabled story with disabled inputs', () => {
      const { getAllByTestId } = render(Disabled)
      const inputs = getAllByTestId('checkbox__input') as HTMLInputElement[]
      expect(inputs.length).toBeGreaterThan(0)
      inputs.forEach((input) => expect(input.disabled).toBe(true))
    })
  })

  describe('touch target', () => {
    it('grows the native input to 24px, and 44px on coarse pointers', () => {
      const view = render(Checkbox, { attrs: { 'aria-label': 'Option' } })
      const input = view.getByRole('checkbox')

      expect(input.className).toContain('inset-[min(0rem,calc(50%-12px))]')
      expect(input.className).toContain('pointer-coarse:inset-[min(0rem,calc(50%-22px))]')
    })
  })
})
