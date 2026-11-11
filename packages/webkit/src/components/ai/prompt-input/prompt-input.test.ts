import { userEvent } from '@storybook/test'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import ShortcutMenus from '../../../../examples/prompt-input/shortcut-menus.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import PromptInput from './prompt-input.vue'

function harness(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  const submitted: string[] = []
  const stops: number[] = []
  const value = ref((props.initial as string) ?? '')
  const Host = defineComponent({
    setup: () => () =>
      h(
        PromptInput,
        {
          ...props,
          modelValue: value.value,
          'onUpdate:modelValue': (next: string) => (value.value = next),
          onSubmit: (text: string) => submitted.push(text),
          onStop: () => stops.push(1)
        },
        slots
      )
  })
  return { ...render(Host), value, submitted, stops }
}

describe('PromptInput', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(PromptInput).getByTestId('ai-prompt-input')).toBeTruthy()
    expect(
      render(PromptInput, { attrs: { 'data-testid': 'mine' } }).getByTestId('mine')
    ).toBeTruthy()
  })

  it('names the text area and shows the placeholder from the catalog', () => {
    const { getByRole } = render(PromptInput)
    const textarea = getByRole('textbox', { name: 'Prompt' })
    expect(textarea).toHaveAttribute('placeholder', 'Ask a question')
    expect(textarea).toHaveAttribute('enterkeyhint', 'send')
  })

  it('submits the trimmed prompt on Enter and adds a line on Shift+Enter', async () => {
    const { getByRole, value, submitted } = harness()
    const textarea = getByRole('textbox')
    await userEvent.click(textarea)
    await userEvent.keyboard('  first line{Shift>}{Enter}{/Shift}second  ')
    expect(value.value).toBe('  first line\nsecond  ')
    expect(submitted).toEqual([])
    await userEvent.keyboard('{Enter}')
    expect(submitted).toEqual(['first line\nsecond'])
  })

  it('submits from the Submit button, which stays disabled while empty', async () => {
    const { getByRole, submitted } = harness()
    const submit = getByRole('button', { name: 'Submit' })
    expect(submit).toBeDisabled()
    await userEvent.type(getByRole('textbox'), 'Purge one URL')
    expect(submit).not.toBeDisabled()
    await userEvent.click(submit)
    expect(submitted).toEqual(['Purge one URL'])
  })

  it('does not submit during an IME composition', async () => {
    const { getByRole, submitted } = harness({ initial: 'かな' })
    const textarea = getByRole('textbox')
    textarea.dispatchEvent(new CompositionEvent('compositionstart'))
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(submitted).toEqual([])
    textarea.dispatchEvent(new CompositionEvent('compositionend'))
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(submitted).toEqual(['かな'])
  })

  it.each(['submitted', 'streaming'] as const)(
    'swaps Submit for Stop while %s and blocks Enter',
    async (state) => {
      const { getByRole, queryByRole, submitted, stops } = harness({
        initial: 'next prompt',
        state
      })
      expect(queryByRole('button', { name: 'Submit' })).toBeNull()
      const textarea = getByRole('textbox')
      expect(textarea).not.toBeDisabled()
      await userEvent.click(textarea)
      await userEvent.keyboard('{Enter}')
      expect(submitted).toEqual([])
      await userEvent.click(getByRole('button', { name: 'Stop generating' }))
      expect(stops).toHaveLength(1)
    }
  )

  it('counts characters and blocks submit over the limit', async () => {
    const { getByRole, getByTestId, submitted } = harness({ initial: 'abcdef', maxLength: 4 })
    const textarea = getByRole('textbox')
    expect(getByTestId('ai-prompt-input__counter')).toHaveTextContent('6/4')
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(textarea.getAttribute('aria-describedby')).toContain(
      getByTestId('ai-prompt-input__counter').id
    )
    expect(getByTestId('ai-prompt-input__limit')).toHaveTextContent('2 characters over the limit')
    expect(getByRole('button', { name: 'Submit' })).toBeDisabled()
    await userEvent.click(textarea)
    await userEvent.keyboard('{Enter}')
    expect(submitted).toEqual([])
  })

  it('disables the text area, submit and the actions slot', () => {
    const { getByRole } = harness(
      { initial: 'x', disabled: true },
      { actions: () => h('button', { type: 'button' }, 'Attach') }
    )
    expect(getByRole('textbox')).toBeDisabled()
    expect(getByRole('button', { name: 'Submit' })).toBeDisabled()
    expect(getByRole('button', { name: 'Attach' })).toBeDisabled()
  })

  it('describes the text area with the hint and renders attachments', () => {
    const { getByRole, getByTestId } = harness(
      {},
      { hint: () => 'The AI assistant can make mistakes.', attachments: () => h('span', 'log.txt') }
    )
    const hint = getByTestId('ai-prompt-input__hint')
    expect(getByRole('textbox').getAttribute('aria-describedby')).toContain(hint.id)
    expect(getByTestId('ai-prompt-input__attachments')).toHaveTextContent('log.txt')
  })

  it('grows with the text up to maxRows', async () => {
    const { getByRole } = harness({ maxRows: 3 })
    const textarea = getByRole('textbox') as HTMLTextAreaElement
    const one = textarea.getBoundingClientRect().height
    await userEvent.click(textarea)
    await userEvent.keyboard('a{Shift>}{Enter}{/Shift}b')
    const two = textarea.getBoundingClientRect().height
    expect(two).toBeGreaterThan(one)
    await userEvent.keyboard(
      '{Shift>}{Enter}{/Shift}c{Shift>}{Enter}{/Shift}d{Shift>}{Enter}{/Shift}e'
    )
    const capped = textarea.getBoundingClientRect().height
    expect(textarea.style.overflowY).toBe('auto')
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}f')
    expect(textarea.getBoundingClientRect().height).toBe(capped)
  })

  it('reads its strings from the provider locale', () => {
    const { getByRole } = render(
      defineComponent({
        setup: () => () =>
          h(WebkitProvider, { locale: 'es', catalogs: LOCALES }, { default: () => h(PromptInput) })
      })
    )
    expect(getByRole('textbox')).toHaveAttribute('placeholder', 'Haz una pregunta')
    expect(getByRole('button', { name: 'Enviar' })).toBeTruthy()
  })

  it('has no axe violations', async () => {
    const { container } = harness({ initial: 'abc', maxLength: 10 }, { hint: () => 'Disclaimer.' })
    await expectNoA11yViolations(container)
  })

  describe('shortcut menus', () => {
    const textbox = () => document.querySelector<HTMLTextAreaElement>('textarea')!
    const listbox = () => document.querySelector<HTMLElement>('[role="listbox"]')

    it('opens on a trigger at a word start, filters, and is driven from the text area', async () => {
      render(ShortcutMenus)
      const input = textbox()
      expect(input).toHaveAttribute('aria-keyshortcuts', '/ @')
      await userEvent.type(input, 'Check @im')
      expect(listbox()).toHaveAccessibleName('Resources')
      const options = [...listbox()!.querySelectorAll('[role="option"]')]
      expect(options.map((option) => option.textContent?.trim())).toEqual(['image-resizeFunction'])
      expect(input.getAttribute('aria-controls')).toBe(listbox()!.id)
      expect(input.getAttribute('aria-activedescendant')).toBe(options[0]!.id)
      expect(document.body.textContent).toContain('1 suggestion')
      await expectNoA11yViolations(document.body.firstElementChild as HTMLElement)
    })

    it('inserts the choice, adds a reference chip and submits it with the text', async () => {
      const view = render(ShortcutMenus)
      const input = textbox()
      await userEvent.type(input, 'Why does @')
      await userEvent.keyboard('{ArrowDown}{Enter}')
      expect(input.value).toBe('Why does @image-resize ')
      expect(listbox()).toBeNull()
      const refs = view.getByRole('list', { name: 'References' })
      expect(refs.textContent).toContain('@image-resize')
      await userEvent.type(input, 'fail')
      await userEvent.keyboard('{Enter}')
      expect(view.getByText(/Sent “Why does @image-resize fail” with @image-resize/)).toBeTruthy()
    })

    it('does not open mid-word, closes on Escape, and Enter submits once closed', async () => {
      const view = render(ShortcutMenus)
      const input = textbox()
      await userEvent.type(input, 'a/b')
      expect(listbox()).toBeNull()
      await userEvent.type(input, ' /ex')
      expect(listbox()).toHaveAccessibleName('Commands')
      await userEvent.keyboard('{Escape}')
      expect(listbox()).toBeNull()
      await userEvent.keyboard('{Enter}')
      expect(view.getByText(/Sent “a\/b \/ex” with no references/)).toBeTruthy()
    })

    it('removing a reference chip removes its text', async () => {
      const view = render(ShortcutMenus)
      const input = textbox()
      await userEvent.type(input, '/sum')
      await userEvent.keyboard('{Tab}')
      expect(input.value).toBe('/summarize ')
      await userEvent.click(view.getByRole('button', { name: /Remove/ }))
      expect(input.value).toBe('')
      expect(view.queryByRole('list', { name: 'References' })).toBeNull()
    })
  })
})
