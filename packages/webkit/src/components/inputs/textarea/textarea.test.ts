import userEvent from '@testing-library/user-event'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/textarea/default.vue'
import Disabled from '../../../../examples/textarea/disabled.vue'
import Invalid from '../../../../examples/textarea/invalid.vue'
import Monospace from '../../../../examples/textarea/monospace.vue'
import ReadOnly from '../../../../examples/textarea/read-only.vue'
import Required from '../../../../examples/textarea/required.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Textarea from './textarea.vue'

describe('Textarea', () => {
  it('renders a <textarea> root carrying the default data-testid', () => {
    const { getByTestId } = render(Textarea)

    const root = getByTestId('input-textarea')
    expect(root.tagName).toBe('TEXTAREA')
  })

  it('reflects the placeholder prop onto the textarea', () => {
    const { getByTestId } = render(Textarea, { props: { placeholder: 'Write here' } })

    expect(getByTestId('input-textarea')).toHaveAttribute('placeholder', 'Write here')
  })

  it('binds the modelValue prop as the textarea value', () => {
    const { getByTestId } = render(Textarea, { props: { modelValue: 'seeded text' } })

    expect(getByTestId('input-textarea')).toHaveValue('seeded text')
  })

  it('sets data-filled on the textarea only when modelValue is non-empty', () => {
    const { getByTestId, rerender } = render(Textarea, { props: { modelValue: '' } })

    expect(getByTestId('input-textarea')).not.toHaveAttribute('data-filled')

    return rerender({ modelValue: 'now filled' }).then(() => {
      expect(getByTestId('input-textarea')).toHaveAttribute('data-filled')
    })
  })

  it('honours a consumer-supplied data-testid on the textarea', () => {
    const { getByTestId } = render(Textarea, {
      attrs: { 'data-testid': 'my-textarea' }
    })

    expect(getByTestId('my-textarea').tagName).toBe('TEXTAREA')
  })

  it('forwards arbitrary native attributes onto the textarea via $attrs', () => {
    const { getByTestId } = render(Textarea, {
      attrs: { rows: 6, maxlength: 120, name: 'message' }
    })

    const control = getByTestId('input-textarea')
    expect(control).toHaveAttribute('rows', '6')
    expect(control).toHaveAttribute('maxlength', '120')
    expect(control).toHaveAttribute('name', 'message')
  })

  describe('resizable', () => {
    it('defaults data-resize to vertical', () => {
      const { getByTestId } = render(Textarea)

      expect(getByTestId('input-textarea')).toHaveAttribute('data-resize', 'vertical')
    })

    it.each(['vertical', 'horizontal', 'both', 'none'] as const)(
      'maps resizable="%s" onto data-resize',
      (resizable) => {
        const { getByTestId } = render(Textarea, { props: { resizable } })

        expect(getByTestId('input-textarea')).toHaveAttribute('data-resize', resizable)
      }
    )
  })

  describe('v-model / update:modelValue', () => {
    it('emits update:modelValue with the new textarea value on input', async () => {
      const { getByTestId, emitted } = render(Textarea)

      await fireEvent.update(getByTestId('input-textarea'), 'hello world')

      expect(emitted('update:modelValue')).toHaveLength(1)
      expect(emitted('update:modelValue')[0]).toEqual(['hello world'])
    })

    it('emits the latest value on each subsequent input', async () => {
      const { getByTestId, emitted } = render(Textarea)

      const control = getByTestId('input-textarea')
      await fireEvent.update(control, 'first')
      await fireEvent.update(control, 'second')

      const events = emitted('update:modelValue')
      expect(events).toHaveLength(2)
      expect(events[0]).toEqual(['first'])
      expect(events[1]).toEqual(['second'])
    })

    it('keeps its own value and filled state when no v-model is bound', async () => {
      const { getByTestId, emitted } = render(Textarea)
      const control = getByTestId('input-textarea') as HTMLTextAreaElement
      expect(control.hasAttribute('data-filled')).toBe(false)
      await fireEvent.update(control, 'notes')
      await nextTick()
      expect(control.value).toBe('notes')
      expect(control.hasAttribute('data-filled')).toBe(true)
      expect(emitted('update:modelValue')).toEqual([['notes']])
    })

    it('round-trips a controlled v-model in both directions', async () => {
      const value = ref('first')
      const Host = defineComponent({
        setup: () => () =>
          h(Textarea, {
            modelValue: value.value,
            'onUpdate:modelValue': (next: string) => {
              value.value = next
            }
          })
      })
      const { getByTestId } = render(Host)
      const control = getByTestId('input-textarea') as HTMLTextAreaElement
      expect(control.value).toBe('first')
      await fireEvent.update(control, 'typed')
      expect(value.value).toBe('typed')
      value.value = 'from parent'
      await nextTick()
      expect(control.value).toBe('from parent')
    })

    it('blocks user input while disabled by marking the control natively disabled', () => {
      // The component relies on the native `disabled` attribute to stop real user
      // typing (programmatic value dispatch bypasses that guard, so asserting a
      // non-emit here would be a false positive). Grounding the actual mechanism.
      const { getByTestId } = render(Textarea, { props: { disabled: true } })

      expect(getByTestId('input-textarea')).toBeDisabled()
    })
  })

  describe('disabled', () => {
    it('sets data-disabled + native disabled + aria-disabled on the textarea', () => {
      const { getByTestId } = render(Textarea, { props: { disabled: true } })

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-disabled')
      expect(control).toBeDisabled()
      expect(control).toHaveAttribute('aria-disabled', 'true')
    })

    it('does not set data-disabled by default', () => {
      const { getByTestId } = render(Textarea)

      expect(getByTestId('input-textarea')).not.toHaveAttribute('data-disabled')
    })
  })

  describe('readonly', () => {
    it('keeps a read-only textarea focusable with its value', () => {
      const { getByTestId } = render(Textarea, {
        props: { readonly: true, modelValue: 'issued by Azion' }
      })
      const el = getByTestId('input-textarea') as HTMLTextAreaElement
      expect(el.readOnly).toBe(true)
      expect(el.disabled).toBe(false)
      expect(el.value).toBe('issued by Azion')
      el.focus()
      expect(document.activeElement).toBe(el)
    })

    it('does not emit update:modelValue from a read-only textarea', async () => {
      const { getByTestId, emitted } = render(Textarea, {
        props: { readonly: true, modelValue: 'issued by Azion' }
      })
      const el = getByTestId('input-textarea') as HTMLTextAreaElement
      el.focus()
      await userEvent.keyboard('x')
      expect(el.value).toBe('issued by Azion')
      expect(emitted()['update:modelValue']).toBeUndefined()
    })

    it('keeps the read-only state apart from the disabled state', () => {
      const readonly = render(Textarea, { props: { readonly: true } }).getAllByTestId(
        'input-textarea'
      )[0] as HTMLElement
      expect(readonly.hasAttribute('data-readonly')).toBe(true)
      expect(readonly.hasAttribute('data-disabled')).toBe(false)
    })

    it('renders the ReadOnly example inside a Field with its description', async () => {
      const { container, getByRole } = render(ReadOnly)
      await nextTick()
      const control = getByRole('textbox', { name: 'Certificate' })
      expect(control).toHaveAttribute('readonly')
      expect(control).toHaveAttribute('data-readonly')
      expect(control.getAttribute('aria-describedby')).toBeTruthy()
      await expectNoA11yViolations(container)
    })

    it('sets data-readonly + native readonly on the textarea', () => {
      const { getByTestId } = render(Textarea, { props: { readonly: true } })

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-readonly')
      expect(control).toHaveAttribute('readonly')
    })

    it('does not set data-readonly by default', () => {
      const { getByTestId } = render(Textarea)

      expect(getByTestId('input-textarea')).not.toHaveAttribute('data-readonly')
    })
  })

  describe('invalid', () => {
    it('sets data-invalid + aria-invalid on the textarea when invalid', () => {
      const { getByTestId } = render(Textarea, { props: { invalid: true } })

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-invalid')
      expect(control).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not set data-invalid or aria-invalid by default', () => {
      const { getByTestId } = render(Textarea)

      const control = getByTestId('input-textarea')
      expect(control).not.toHaveAttribute('data-invalid')
      expect(control).not.toHaveAttribute('aria-invalid')
    })
  })

  describe('required', () => {
    it('sets data-required + native required + aria-required on the textarea', () => {
      const { getByTestId } = render(Textarea, { props: { required: true } })

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-required')
      expect(control).toBeRequired()
      expect(control).toHaveAttribute('aria-required', 'true')
    })

    it('does not set data-required or aria-required by default', () => {
      const { getByTestId } = render(Textarea)

      const control = getByTestId('input-textarea')
      expect(control).not.toHaveAttribute('data-required')
      expect(control).not.toHaveAttribute('aria-required')
    })
  })

  describe('accessibility', () => {
    it('has no a11y violations for a labelled default textarea', async () => {
      const { container } = render(Textarea, {
        attrs: { 'aria-label': 'Alert' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no a11y violations for an invalid labelled textarea (aria-invalid semantics)', async () => {
      const { container } = render(Textarea, {
        props: { invalid: true },
        attrs: { 'aria-label': 'Alert' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no a11y violations for a disabled labelled textarea', async () => {
      const { container } = render(Textarea, {
        props: { disabled: true },
        attrs: { 'aria-label': 'Alert' }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('story fixtures', () => {
    it('composes the Default story with the placeholder from its args', () => {
      const { getByTestId } = render(Default)

      expect(getByTestId('input-textarea')).toHaveAttribute('placeholder', 'Write your message')
    })

    it('composes the Disabled story with a disabled control', () => {
      const { getByTestId } = render(Disabled)

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-disabled')
      expect(control).toBeDisabled()
    })

    it('composes the Invalid story with invalid semantics and a filled value', () => {
      const { getByTestId } = render(Invalid)

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-invalid')
      expect(control).toHaveAttribute('data-filled')
      expect(control).toHaveAttribute('aria-invalid', 'true')
    })

    it('composes the Required story with required semantics', () => {
      const { getByTestId } = render(Required)

      const control = getByTestId('input-textarea')
      expect(control).toHaveAttribute('data-required')
      expect(control).toHaveAttribute('aria-required', 'true')
    })
  })
})

describe('Textarea — direction of the typed value', () => {
  it('uses dir="auto" so a value in another script keeps its own direction', () => {
    const { getByTestId } = render(Textarea)
    expect(getByTestId('input-textarea').getAttribute('dir')).toBe('auto')
  })

  it('lets a dir attribute override the default', () => {
    const { getByTestId } = render(Textarea, { attrs: { dir: 'ltr' } })
    expect(getByTestId('input-textarea').getAttribute('dir')).toBe('ltr')
  })
})

describe('Textarea — monospace', () => {
  it('omits data-monospace by default', () => {
    const { getByTestId } = render(Textarea)
    expect(getByTestId('input-textarea').hasAttribute('data-monospace')).toBe(false)
  })

  it('marks the field with data-monospace and still edits the value', async () => {
    const { getByTestId, emitted } = render(Textarea, {
      props: { monospace: true },
      attrs: { 'aria-label': 'Zone file' }
    })
    const textarea = getByTestId('input-textarea')
    expect(textarea.hasAttribute('data-monospace')).toBe(true)
    await userEvent.type(textarea, '@ A')
    expect(emitted()['update:modelValue']?.at(-1)).toEqual(['@ A'])
  })

  it('renders the Monospace and ReadOnly examples in the code face with no a11y violations', async () => {
    const paste = render(Monospace)
    const zone = paste.getByLabelText('Zone file') as HTMLTextAreaElement
    expect(zone.hasAttribute('data-monospace')).toBe(true)
    expect(zone.value).toContain('$ORIGIN example.com.')
    await expectNoA11yViolations(paste.container)
    paste.unmount()
    const fixed = render(ReadOnly)
    expect(fixed.getByLabelText('Certificate').hasAttribute('data-monospace')).toBe(true)
  })
})

describe('Textarea — exposed focus()', () => {
  it('focus() on a template ref moves focus to the native textarea', async () => {
    const field = ref<InstanceType<typeof Textarea> | null>(null)
    const Host = defineComponent({
      setup: () => () => h(Textarea, { ref: field, 'aria-label': 'Name' })
    })
    const { container } = render(Host)
    await nextTick()

    const native = container.querySelector('textarea')
    expect(native).not.toBeNull()
    expect(document.activeElement).not.toBe(native)

    field.value?.focus()

    expect(document.activeElement).toBe(native)
  })
})
