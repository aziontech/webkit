import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/InputPassword.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import InputPassword from './input-password.vue'

const { Default } = composeStories(stories)

describe('InputPassword', () => {
  it('renders the input with the default testid and masks the value by default', () => {
    const { getByTestId } = render(InputPassword)

    const input = getByTestId('input-password') as HTMLInputElement
    expect(input.tagName).toBe('INPUT')
    // visible defaults to false → type is "password".
    expect(input.getAttribute('type')).toBe('password')
  })

  it('honors a consumer-supplied data-testid on the input', () => {
    const { getByTestId } = render(InputPassword, {
      attrs: { 'data-testid': 'my-password' }
    })

    const input = getByTestId('my-password') as HTMLInputElement
    expect(input.tagName).toBe('INPUT')
  })

  it('reflects the modelValue prop on the input value', () => {
    const { getByTestId } = render(InputPassword, {
      props: { modelValue: 'hunter2' }
    })

    expect((getByTestId('input-password') as HTMLInputElement).value).toBe('hunter2')
  })

  it('reflects the placeholder prop on the input', () => {
    const { getByTestId } = render(InputPassword, {
      props: { placeholder: 'Enter your password' }
    })

    expect(getByTestId('input-password').getAttribute('placeholder')).toBe('Enter your password')
  })

  it('reflects the maxLength prop on the native maxlength attribute', () => {
    const { getByTestId } = render(InputPassword, {
      props: { maxLength: 8 }
    })

    expect(getByTestId('input-password').getAttribute('maxlength')).toBe('8')
  })

  it('applies the autocomplete prop, defaulting to current-password', () => {
    const withDefault = render(InputPassword)
    expect(withDefault.getByTestId('input-password').getAttribute('autocomplete')).toBe(
      'current-password'
    )
    withDefault.unmount()

    const newPassword = render(InputPassword, { props: { autocomplete: 'new-password' } })
    expect(newPassword.getByTestId('input-password').getAttribute('autocomplete')).toBe(
      'new-password'
    )
  })

  // --- v-model / the only emitted event: update:modelValue ---

  it('emits update:modelValue with the new value on input', async () => {
    const { getByTestId, emitted } = render(InputPassword)

    const input = getByTestId('input-password') as HTMLInputElement
    await fireEvent.update(input, 'new-secret')

    const events = emitted()['update:modelValue']
    expect(events).toBeTruthy()
    expect(events[events.length - 1]).toEqual(['new-secret'])
  })

  it('emits the raw typed string, echoing exactly what the input carries', async () => {
    const { getByTestId, emitted } = render(InputPassword, {
      props: { modelValue: '' }
    })

    const input = getByTestId('input-password') as HTMLInputElement
    await fireEvent.update(input, 'AbC123!@#')

    expect(emitted()['update:modelValue']).toEqual([['AbC123!@#']])
  })

  // --- disabled suppresses interaction ---

  it('marks the input natively disabled so the field cannot be edited', () => {
    const { getByTestId } = render(InputPassword, {
      props: { disabled: true }
    })

    const input = getByTestId('input-password') as HTMLInputElement
    // Native disabled attribute is the mechanism that blocks user editing.
    expect(input.disabled).toBe(true)
    expect(input.hasAttribute('disabled')).toBe(true)
  })

  // --- grounded prop → data-* / aria-* reflections on the root span and input ---

  it('sets data-disabled on the root and disabled on the input only when disabled', () => {
    const on = render(InputPassword, { props: { disabled: true } })
    const onInput = on.getByTestId('input-password')
    const onRoot = onInput.closest('span[data-toggleable], span')
    expect(onInput.hasAttribute('disabled')).toBe(true)
    // data-disabled is rendered as `disabled || null` on the root span.
    expect(onRoot?.getAttribute('data-disabled')).toBe('true')
    on.unmount()

    const off = render(InputPassword, { props: { disabled: false } })
    const offInput = off.getByTestId('input-password')
    expect(offInput.hasAttribute('disabled')).toBe(false)
    expect(offInput.closest('span')?.getAttribute('data-disabled')).toBeNull()
  })

  it('sets aria-invalid on the input and data-invalid on the root only when invalid', () => {
    const on = render(InputPassword, { props: { invalid: true } })
    const onInput = on.getByTestId('input-password')
    expect(onInput.getAttribute('aria-invalid')).toBe('true')
    expect(onInput.closest('span')?.getAttribute('data-invalid')).toBe('true')
    on.unmount()

    const off = render(InputPassword, { props: { invalid: false } })
    const offInput = off.getByTestId('input-password')
    // aria-invalid is `invalid || undefined` → attribute absent when false.
    expect(offInput.hasAttribute('aria-invalid')).toBe(false)
    expect(offInput.closest('span')?.getAttribute('data-invalid')).toBeNull()
  })

  it('sets aria-required + required on the input and data-required on the root only when required', () => {
    const on = render(InputPassword, { props: { required: true } })
    const onInput = on.getByTestId('input-password')
    expect(onInput.getAttribute('aria-required')).toBe('true')
    expect(onInput.hasAttribute('required')).toBe(true)
    expect(onInput.closest('span')?.getAttribute('data-required')).toBe('true')
    on.unmount()

    const off = render(InputPassword, { props: { required: false } })
    const offInput = off.getByTestId('input-password')
    expect(offInput.hasAttribute('aria-required')).toBe(false)
    expect(offInput.hasAttribute('required')).toBe(false)
    expect(offInput.closest('span')?.getAttribute('data-required')).toBeNull()
  })

  it('sets the readonly attribute on the input when readonly', () => {
    const { getByTestId } = render(InputPassword, { props: { readonly: true } })

    expect((getByTestId('input-password') as HTMLInputElement).readOnly).toBe(true)
  })

  // --- toggleable visibility button behavior ---

  it('renders the visibility toggle button by default and flips the input type on click', async () => {
    const { getByTestId, getByRole } = render(InputPassword)

    const input = getByTestId('input-password') as HTMLInputElement
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
    const { queryByRole, getByTestId } = render(InputPassword, {
      props: { toggleable: false }
    })

    expect(queryByRole('button')).toBeNull()
    // Root reflects data-toggleable only when true; false → attribute absent.
    expect(
      getByTestId('input-password').closest('span')?.getAttribute('data-toggleable')
    ).toBeNull()
  })

  it('reflects data-toggleable on the root when toggleable is true', () => {
    const { getByTestId } = render(InputPassword, { props: { toggleable: true } })

    expect(getByTestId('input-password').closest('span')?.getAttribute('data-toggleable')).toBe(
      'true'
    )
  })

  it('disables the toggle button when the field is disabled', () => {
    const { getByRole } = render(InputPassword, { props: { disabled: true } })

    const toggle = getByRole('button', { name: 'Show password' }) as HTMLButtonElement
    expect(toggle.disabled).toBe(true)
  })

  // --- slots ---

  it('renders the iconLeft slot and marks its wrapper aria-hidden', () => {
    const { getByTestId } = render(InputPassword, {
      slots: { iconLeft: '<i data-testid="left-icon" class="pi pi-lock" />' }
    })

    const icon = getByTestId('left-icon')
    expect(icon).toBeTruthy()
    // The slot wrapper is aria-hidden per the template.
    expect(icon.closest('[aria-hidden="true"]')).toBeTruthy()
  })

  it('renders the iconRight slot only when toggleable is false', () => {
    const withToggle = render(InputPassword, {
      props: { toggleable: true },
      slots: { iconRight: '<i data-testid="right-icon" class="pi pi-key" />' }
    })
    // hasIconRight is `!toggleable && hasSlot` → not rendered while toggleable.
    expect(withToggle.queryByTestId('right-icon')).toBeNull()
    withToggle.unmount()

    const noToggle = render(InputPassword, {
      props: { toggleable: false },
      slots: { iconRight: '<i data-testid="right-icon" class="pi pi-key" />' }
    })
    expect(noToggle.queryByTestId('right-icon')).toBeTruthy()
    expect(
      noToggle.getByTestId('input-password').closest('span')?.getAttribute('data-has-icon-right')
    ).toBe('true')
  })

  // --- a11y ---

  it('has no a11y violations in the default toggleable render', async () => {
    const { container } = render(InputPassword, {
      props: { placeholder: 'Password' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when invalid and required (differing a11y semantics)', async () => {
    const { container } = render(InputPassword, {
      props: { invalid: true, required: true, modelValue: 'weak', placeholder: 'Password' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when toggleable is false with an iconRight slot', async () => {
    const { container } = render(InputPassword, {
      props: { toggleable: false, placeholder: 'Password' },
      slots: { iconRight: '<i class="pi pi-key" aria-hidden="true" />' }
    })

    await expectNoA11yViolations(container)
  })

  // --- story fixture proves composeStories wiring ---

  it('renders the Default story fixture cleanly', async () => {
    const { getByTestId, container } = render(Default())

    expect(getByTestId('input-password')).toBeTruthy()
    await expectNoA11yViolations(container)
  })
})
