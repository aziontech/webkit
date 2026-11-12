import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/otp-input/default.vue'
import Grouped from '../../../../examples/otp-input/grouped.vue'
import States from '../../../../examples/otp-input/states.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import OtpInput from './otp-input.vue'

afterEach(() => cleanup())

const boxes = (): HTMLElement[] =>
  Array.from(document.body.querySelectorAll<HTMLElement>('[data-testid="otp-input__box"]'))
const field = (): HTMLInputElement =>
  document.body.querySelector<HTMLInputElement>('[data-testid="otp-input__input"]')!

const mountBound = (props: Record<string, unknown> = {}) => {
  const value = ref('')
  const completed: string[] = []
  const Host = defineComponent({
    setup: () => () =>
      h(OtpInput, {
        ...props,
        modelValue: value.value,
        'onUpdate:modelValue': (next: string) => (value.value = next),
        onComplete: (next: string) => completed.push(next)
      })
  })
  render(Host)
  return { value, completed }
}

const paste = async (text: string) => {
  const data = new DataTransfer()
  data.setData('text', text)
  const event = new ClipboardEvent('paste', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'clipboardData', { value: data })
  field().dispatchEvent(event)
  await nextTick()
}

describe('OtpInput', () => {
  it('is one input with one-time-code autofill over six hidden boxes', () => {
    render(OtpInput)
    const input = field()
    expect(input).toHaveAttribute('autocomplete', 'one-time-code')
    expect(input).toHaveAttribute('inputmode', 'numeric')
    expect(input).toHaveAttribute('maxlength', '6')
    expect(boxes()).toHaveLength(6)
    boxes().forEach((box) => expect(box).toHaveAttribute('aria-hidden', 'true'))
  })

  it('fills the next box as digits are typed and drops other characters', async () => {
    const { value } = mountBound()
    await userEvent.click(field())
    expect(boxes()[0]).toHaveAttribute('data-active')
    await userEvent.keyboard('1a2')
    expect(value.value).toBe('12')
    expect(boxes()[0]!.textContent).toBe('1')
    expect(boxes()[1]!.textContent).toBe('2')
    expect(boxes()[1]).toHaveAttribute('data-state', 'filled')
    expect(boxes()[2]).toHaveAttribute('data-active')
  })

  it('clears the last character with Backspace', async () => {
    const { value } = mountBound()
    await userEvent.click(field())
    await userEvent.keyboard('123')
    await userEvent.keyboard('{Backspace}')
    expect(value.value).toBe('12')
    expect(boxes()[2]).toHaveAttribute('data-state', 'empty')
    expect(boxes()[2]).toHaveAttribute('data-active')
  })

  it('keeps the caret at the end on arrow keys', async () => {
    mountBound()
    await userEvent.click(field())
    await userEvent.keyboard('123{ArrowLeft}{Home}4')
    expect(field().value).toBe('1234')
  })

  it('takes a pasted code with spaces and fires complete once', async () => {
    const { value, completed } = mountBound()
    field().focus()
    await paste('482 913\n')
    expect(value.value).toBe('482913')
    expect(completed).toEqual(['482913'])
    await paste('482913')
    expect(completed).toEqual(['482913'])
  })

  it('replaces a partial value when a full code is pasted', async () => {
    const { value } = mountBound()
    await userEvent.click(field())
    await userEvent.keyboard('99')
    await paste('123-456')
    expect(value.value).toBe('123456')
  })

  it('fires complete when the last digit is typed, and again after an edit', async () => {
    const { completed } = mountBound()
    await userEvent.click(field())
    await userEvent.keyboard('123456')
    expect(completed).toEqual(['123456'])
    await userEvent.keyboard('{Backspace}7')
    expect(completed).toEqual(['123456', '123457'])
  })

  it('keeps letters and digits in upper case in alphanumeric mode', async () => {
    const { value } = mountBound({ mode: 'alphanumeric', length: 8 })
    expect(field()).toHaveAttribute('inputmode', 'text')
    await userEvent.click(field())
    await userEvent.keyboard('ab-12cd')
    expect(value.value).toBe('AB12CD')
  })

  it('draws a separator between groups', () => {
    render(OtpInput, { props: { group: 3 } })
    const separators = document.body.querySelectorAll('[data-testid="otp-input__separator"]')
    expect(separators).toHaveLength(1)
    expect(separators[0]).toHaveAttribute('aria-hidden', 'true')
  })

  it('is named by its Field label and described by its description', async () => {
    const view = render(Default)
    await nextTick()
    const input = view.getByLabelText('Authentication code')
    expect(input).toBe(field())
    expect(input).not.toHaveAttribute('aria-label')
    expect(input).toHaveAccessibleDescription(/6-digit code/)
  })

  it('names a standalone field from the catalog, in the active locale', () => {
    render(OtpInput)
    expect(field()).toHaveAttribute('aria-label', 'One-time code')
    cleanup()
    const Host = defineComponent({
      render: () =>
        h(WebkitProvider, { locale: 'pt-BR', catalogs: LOCALES }, { default: () => h(OtpInput) })
    })
    render(Host)
    expect(field()).toHaveAttribute('aria-label', 'Código de uso único')
  })

  it('marks invalid and disabled from the Field', () => {
    const view = render(States)
    const inputs = view.getAllByLabelText('Authentication code') as HTMLInputElement[]
    expect(inputs[0]).toHaveAttribute('aria-invalid', 'true')
    expect(inputs[1]).toBeDisabled()
  })

  it('focuses on mount with autofocus', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const app = createApp(OtpInput, { autofocus: true })
    app.mount(host)
    expect(document.activeElement).toBe(field())
    app.unmount()
    host.remove()
  })

  it('keeps the code left to right under rtl', () => {
    render({ render: () => h('div', { dir: 'rtl' }, [h(OtpInput, { modelValue: '12' })]) })
    const root = document.body.querySelector('[data-testid="otp-input"]')!
    expect(root).toHaveAttribute('dir', 'ltr')
    expect(boxes()[0]!.compareDocumentPosition(boxes()[1]!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(boxes()[0]!.textContent).toBe('1')
  })

  it('cuts a longer model value to length', () => {
    render(OtpInput, { props: { modelValue: '1234567890', length: 4 } })
    expect(field().value).toBe('1234')
  })

  it('updates the boxes when the parent clears the value', async () => {
    const { value } = mountBound()
    await userEvent.click(field())
    await userEvent.keyboard('123456')
    value.value = ''
    await nextTick()
    expect(field().value).toBe('')
    expect(boxes().every((box) => box.getAttribute('data-state') === 'empty')).toBe(true)
  })

  it('disables the input', () => {
    render(OtpInput, { props: { disabled: true } })
    expect(field()).toBeDisabled()
    expect(document.body.querySelector('[data-testid="otp-input"]')).toHaveAttribute(
      'data-disabled'
    )
  })

  it('has no axe violations', async () => {
    for (const Example of [Default, Grouped, States]) {
      const { container } = render(Example)
      await expectNoA11yViolations(container)
      cleanup()
    }
  })
})
