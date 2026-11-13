import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/password-input/default.vue'
import Monospace from '../../../../examples/password-input/monospace.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import PasswordInput from './password-input.vue'

describe('PasswordInput', () => {
  it('renders the input with the default testid and masks the value by default', () => {
    const { getByTestId } = render(PasswordInput)

    const input = getByTestId('password-input') as HTMLInputElement
    expect(input.tagName).toBe('INPUT')
    // visible defaults to false → type is "password".
    expect(input.getAttribute('type')).toBe('password')
  })

  it('honors a consumer-supplied data-testid on the input', () => {
    const { getByTestId } = render(PasswordInput, {
      attrs: { 'data-testid': 'my-password' }
    })

    const input = getByTestId('my-password') as HTMLInputElement
    expect(input.tagName).toBe('INPUT')
  })

  it('reflects the modelValue prop on the input value', () => {
    const { getByTestId } = render(PasswordInput, {
      props: { modelValue: 'hunter2' }
    })

    expect((getByTestId('password-input') as HTMLInputElement).value).toBe('hunter2')
  })

  it('reflects the placeholder prop on the input', () => {
    const { getByTestId } = render(PasswordInput, {
      props: { placeholder: 'Enter your password' }
    })

    expect(getByTestId('password-input').getAttribute('placeholder')).toBe('Enter your password')
  })

  it('reflects the maxLength prop on the native maxlength attribute', () => {
    const { getByTestId } = render(PasswordInput, {
      props: { maxLength: 8 }
    })

    expect(getByTestId('password-input').getAttribute('maxlength')).toBe('8')
  })

  it('applies the autocomplete prop, defaulting to current-password', () => {
    const withDefault = render(PasswordInput)
    expect(withDefault.getByTestId('password-input').getAttribute('autocomplete')).toBe(
      'current-password'
    )
    withDefault.unmount()

    const newPassword = render(PasswordInput, { props: { autocomplete: 'new-password' } })
    expect(newPassword.getByTestId('password-input').getAttribute('autocomplete')).toBe(
      'new-password'
    )
  })

  // --- v-model / the only emitted event: update:modelValue ---

  it('emits update:modelValue with the new value on input', async () => {
    const { getByTestId, emitted } = render(PasswordInput)

    const input = getByTestId('password-input') as HTMLInputElement
    await fireEvent.update(input, 'new-secret')

    const events = emitted()['update:modelValue']
    expect(events).toBeTruthy()
    expect(events[events.length - 1]).toEqual(['new-secret'])
  })

  it('emits the raw typed string, echoing exactly what the input carries', async () => {
    const { getByTestId, emitted } = render(PasswordInput, {
      props: { modelValue: '' }
    })

    const input = getByTestId('password-input') as HTMLInputElement
    await fireEvent.update(input, 'AbC123!@#')

    expect(emitted()['update:modelValue']).toEqual([['AbC123!@#']])
  })

  it('keeps its own value when no v-model is bound', async () => {
    const { getByTestId, emitted } = render(PasswordInput)
    const input = getByTestId('password-input') as HTMLInputElement
    await fireEvent.update(input, 'secret')
    await nextTick()
    expect(input.value).toBe('secret')
    expect(emitted()['update:modelValue']).toEqual([['secret']])
  })

  it('round-trips a controlled v-model in both directions', async () => {
    const value = ref('first')
    const Host = defineComponent({
      setup: () => () =>
        h(PasswordInput, {
          modelValue: value.value,
          'onUpdate:modelValue': (next: string) => {
            value.value = next
          }
        })
    })
    const { getByTestId } = render(Host)
    const input = getByTestId('password-input') as HTMLInputElement
    expect(input.value).toBe('first')
    await fireEvent.update(input, 'typed')
    expect(value.value).toBe('typed')
    value.value = 'from parent'
    await nextTick()
    expect(input.value).toBe('from parent')
  })

  // --- disabled suppresses interaction ---

  it('marks the input natively disabled so the field cannot be edited', () => {
    const { getByTestId } = render(PasswordInput, {
      props: { disabled: true }
    })

    const input = getByTestId('password-input') as HTMLInputElement
    // Native disabled attribute is the mechanism that blocks user editing.
    expect(input.disabled).toBe(true)
    expect(input.hasAttribute('disabled')).toBe(true)
  })

  // --- grounded prop → data-* / aria-* reflections on the root span and input ---

  it('sets data-disabled on the root and disabled on the input only when disabled', () => {
    const on = render(PasswordInput, { props: { disabled: true } })
    const onInput = on.getByTestId('password-input')
    const onRoot = onInput.closest('span[data-toggleable], span')
    expect(onInput.hasAttribute('disabled')).toBe(true)
    // data-disabled is rendered as `disabled || null` on the root span.
    expect(onRoot?.getAttribute('data-disabled')).toBe('true')
    on.unmount()

    const off = render(PasswordInput, { props: { disabled: false } })
    const offInput = off.getByTestId('password-input')
    expect(offInput.hasAttribute('disabled')).toBe(false)
    expect(offInput.closest('span')?.getAttribute('data-disabled')).toBeNull()
  })

  it('sets aria-invalid on the input and data-invalid on the root only when invalid', () => {
    const on = render(PasswordInput, { props: { invalid: true } })
    const onInput = on.getByTestId('password-input')
    expect(onInput.getAttribute('aria-invalid')).toBe('true')
    expect(onInput.closest('span')?.getAttribute('data-invalid')).toBe('true')
    on.unmount()

    const off = render(PasswordInput, { props: { invalid: false } })
    const offInput = off.getByTestId('password-input')
    // aria-invalid is `invalid || undefined` → attribute absent when false.
    expect(offInput.hasAttribute('aria-invalid')).toBe(false)
    expect(offInput.closest('span')?.getAttribute('data-invalid')).toBeNull()
  })

  it('sets aria-required + required on the input and data-required on the root only when required', () => {
    const on = render(PasswordInput, { props: { required: true } })
    const onInput = on.getByTestId('password-input')
    expect(onInput.getAttribute('aria-required')).toBe('true')
    expect(onInput.hasAttribute('required')).toBe(true)
    expect(onInput.closest('span')?.getAttribute('data-required')).toBe('true')
    on.unmount()

    const off = render(PasswordInput, { props: { required: false } })
    const offInput = off.getByTestId('password-input')
    expect(offInput.hasAttribute('aria-required')).toBe(false)
    expect(offInput.hasAttribute('required')).toBe(false)
    expect(offInput.closest('span')?.getAttribute('data-required')).toBeNull()
  })

  it('sets the readonly attribute on the input when readonly', () => {
    const { getByTestId } = render(PasswordInput, { props: { readonly: true } })

    expect((getByTestId('password-input') as HTMLInputElement).readOnly).toBe(true)
  })

  // --- toggleable visibility button behavior ---

  it('renders the visibility toggle button by default and flips the input type on click', async () => {
    const { getByTestId, getByRole } = render(PasswordInput)

    const input = getByTestId('password-input') as HTMLInputElement
    const root = input.closest('span') as HTMLElement
    expect(input.getAttribute('type')).toBe('password')
    // data-visible is `visible || null` → absent while masked.
    expect(root.getAttribute('data-visible')).toBeNull()

    // The IconButton exposes an accessible name; default label is "Show password".
    const toggle = getByRole('button', { name: 'Show password' })

    await fireEvent.click(toggle)

    // Type flips to text, the accessible name becomes "Hide password", data-visible set.
    expect(input.getAttribute('type')).toBe('text')
    expect(getByRole('button', { name: 'Hide password' })).toBeTruthy()
    expect(root.getAttribute('data-visible')).toBe('true')

    await fireEvent.click(getByRole('button', { name: 'Hide password' }))

    // And back to masked.
    expect(input.getAttribute('type')).toBe('password')
    expect(getByRole('button', { name: 'Show password' })).toBeTruthy()
    expect(root.getAttribute('data-visible')).toBeNull()
  })

  it('does not render the toggle button when toggleable is false', () => {
    const { queryByRole, getByTestId } = render(PasswordInput, {
      props: { toggleable: false }
    })

    expect(queryByRole('button')).toBeNull()
    // Root reflects data-toggleable only when true; false → attribute absent.
    expect(
      getByTestId('password-input').closest('span')?.getAttribute('data-toggleable')
    ).toBeNull()
  })

  it('reflects data-toggleable on the root when toggleable is true', () => {
    const { getByTestId } = render(PasswordInput, { props: { toggleable: true } })

    expect(getByTestId('password-input').closest('span')?.getAttribute('data-toggleable')).toBe(
      'true'
    )
  })

  it('disables the toggle button when the field is disabled', () => {
    const { getByRole } = render(PasswordInput, { props: { disabled: true } })

    const toggle = getByRole('button', { name: 'Show password' }) as HTMLButtonElement
    expect(toggle.disabled).toBe(true)
  })

  // --- slots ---

  it('renders the iconLeft slot and marks its wrapper aria-hidden', () => {
    const { getByTestId } = render(PasswordInput, {
      slots: { iconLeft: '<i data-testid="left-icon" class="pi pi-lock" />' }
    })

    const icon = getByTestId('left-icon')
    expect(icon).toBeTruthy()
    // The slot wrapper is aria-hidden per the template.
    expect(icon.closest('[aria-hidden="true"]')).toBeTruthy()
  })

  it('renders the iconRight slot only when toggleable is false', () => {
    const withToggle = render(PasswordInput, {
      props: { toggleable: true },
      slots: { iconRight: '<i data-testid="right-icon" class="pi pi-key" />' }
    })
    // hasIconRight is `!toggleable && hasSlot` → not rendered while toggleable.
    expect(withToggle.queryByTestId('right-icon')).toBeNull()
    withToggle.unmount()

    const noToggle = render(PasswordInput, {
      props: { toggleable: false },
      slots: { iconRight: '<i data-testid="right-icon" class="pi pi-key" />' }
    })
    expect(noToggle.queryByTestId('right-icon')).toBeTruthy()
    expect(
      noToggle.getByTestId('password-input').closest('span')?.getAttribute('data-has-icon-right')
    ).toBe('true')
  })

  // --- a11y ---

  // Field-only component: the label belongs to the wrapping form-field layer, so these
  // fixtures supply the accessible name a placeholder alone cannot hold (it disappears
  // as soon as the user types).
  it('has no a11y violations in the default toggleable render', async () => {
    const { container } = render(PasswordInput, {
      props: { placeholder: 'Password' },
      attrs: { 'aria-label': 'Password' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when invalid and required (differing a11y semantics)', async () => {
    const { container } = render(PasswordInput, {
      props: { invalid: true, required: true, modelValue: 'weak', placeholder: 'Password' },
      attrs: { 'aria-label': 'Password' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when toggleable is false with an iconRight slot', async () => {
    const { container } = render(PasswordInput, {
      props: { toggleable: false, placeholder: 'Password' },
      attrs: { 'aria-label': 'Password' },
      slots: { iconRight: '<i class="pi pi-key" aria-hidden="true" />' }
    })

    await expectNoA11yViolations(container)
  })

  // --- Default fixture renders ---

  it('renders the Default story fixture cleanly', async () => {
    // The story documents the bare field (its label is the form-field layer's job), so
    // the accessible name is supplied here rather than baked into the canonical story.
    const { getByTestId, container } = render(Default, { props: { 'aria-label': 'Password' } })

    expect(getByTestId('password-input')).toBeTruthy()
    await expectNoA11yViolations(container)
  })

  it('stays visible to password managers (no ignore hints on a password field)', () => {
    const { container } = render(PasswordInput)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.hasAttribute('data-1p-ignore')).toBe(false)
    expect(input.hasAttribute('data-lpignore')).toBe(false)
  })
})

describe('PasswordInput — direction of the typed value', () => {
  it('uses dir="auto" so a value in another script keeps its own direction', () => {
    const { getByTestId } = render(PasswordInput)
    expect(getByTestId('password-input').getAttribute('dir')).toBe('auto')
  })

  it('lets a dir attribute override the default', () => {
    const { getByTestId } = render(PasswordInput, { attrs: { dir: 'ltr' } })
    expect(getByTestId('password-input').getAttribute('dir')).toBe('ltr')
  })
})

describe('PasswordInput slot presence', () => {
  it('follows a v-if slot that appears and disappears after mount', async () => {
    const shown = ref(false)
    const { queryByTestId, container } = render({
      components: { PasswordInput },
      setup: () => ({ shown }),
      template: `<PasswordInput><template v-if="shown" #iconLeft><span data-testid="probe">Slotted</span></template></PasswordInput>`
    })
    expect(container.querySelector('[data-has-icon-left]')).toBeNull()

    shown.value = true
    await nextTick()
    expect(container.querySelector('[data-has-icon-left]')).not.toBeNull()
    expect(queryByTestId('probe')).not.toBeNull()

    shown.value = false
    await nextTick()
    expect(container.querySelector('[data-has-icon-left]')).toBeNull()
    expect(queryByTestId('probe')).toBeNull()
  })
})

describe('PasswordInput — monospace', () => {
  it('omits data-monospace by default', () => {
    const { container } = render(PasswordInput)
    expect((container.firstElementChild as HTMLElement).hasAttribute('data-monospace')).toBe(false)
  })

  it('marks the field with data-monospace, still edits and reveals the value', async () => {
    const { container, getByTestId, getByRole, emitted } = render(PasswordInput, {
      props: { monospace: true, autocomplete: 'off' }
    })
    expect((container.firstElementChild as HTMLElement).hasAttribute('data-monospace')).toBe(true)
    const input = getByTestId('password-input') as HTMLInputElement
    await fireEvent.update(input, 'azn_token')
    expect(emitted()['update:modelValue']).toEqual([['azn_token']])
    await fireEvent.click(getByRole('button', { name: 'Show password' }))
    expect(input.getAttribute('type')).toBe('text')
  })

  it('renders the Monospace example as a labelled token field with no a11y violations', async () => {
    const { container, getByLabelText } = render(Monospace)
    const input = getByLabelText('Personal token') as HTMLInputElement
    expect(input.getAttribute('autocomplete')).toBe('off')
    expect(input.getAttribute('spellcheck')).toBe('false')
    expect(container.querySelector('[data-monospace]')).not.toBeNull()
    await expectNoA11yViolations(container)
  })
})

describe('PasswordInput — exposed focus()', () => {
  it('focus() on a template ref moves focus to the native input', async () => {
    const field = ref<InstanceType<typeof PasswordInput> | null>(null)
    const Host = defineComponent({
      setup: () => () => h(PasswordInput, { ref: field, 'aria-label': 'Name' })
    })
    const { container } = render(Host)
    await nextTick()

    const native = container.querySelector('input')
    expect(native).not.toBeNull()
    expect(document.activeElement).not.toBe(native)

    field.value?.focus()

    expect(document.activeElement).toBe(native)
  })
})
