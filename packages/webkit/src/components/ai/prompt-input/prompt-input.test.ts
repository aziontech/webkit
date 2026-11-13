import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent as keys } from 'vitest/browser'
import { defineComponent, h, nextTick, ref } from 'vue'

import ShortcutMenus from '../../../../examples/prompt-input/shortcut-menus.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import PromptInput from './prompt-input.vue'

function harness(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  const submitted: string[] = []
  const submitEvents: Event[] = []
  const stops: Event[] = []
  const value = ref((props.initial as string) ?? '')
  const Host = defineComponent({
    setup: () => () =>
      h(
        PromptInput,
        {
          ...props,
          modelValue: value.value,
          'onUpdate:modelValue': (next: string) => (value.value = next),
          onSubmit: (event: Event, payload: { value: string }) => {
            submitEvents.push(event)
            submitted.push(payload.value)
          },
          onStop: (event: Event) => stops.push(event)
        },
        slots
      )
  })
  return { ...render(Host), value, submitted, submitEvents, stops }
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
    const { getByRole, value, submitted, submitEvents } = harness()
    const textarea = getByRole('textbox')
    await userEvent.click(textarea)
    await userEvent.keyboard('  first line{Shift>}{Enter}{/Shift}second  ')
    expect(value.value).toBe('  first line\nsecond  ')
    expect(submitted).toEqual([])
    await userEvent.keyboard('{Enter}')
    expect(submitted).toEqual(['first line\nsecond'])
    expect(submitEvents[0]).toBeInstanceOf(KeyboardEvent)
  })

  it('submits from the Submit button, which stays disabled while empty', async () => {
    const { getByRole, submitted, submitEvents } = harness()
    const submit = getByRole('button', { name: 'Submit' })
    expect(submit).toBeDisabled()
    await userEvent.type(getByRole('textbox'), 'Purge one URL')
    expect(submit).not.toBeDisabled()
    await userEvent.click(submit)
    expect(submitted).toEqual(['Purge one URL'])
    expect(submitEvents[0]).toBeInstanceOf(MouseEvent)
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
      expect(stops[0]).toBeInstanceOf(MouseEvent)
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
    const settle = async () => {
      await nextTick()
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    }
    const typeInto = async (input: HTMLTextAreaElement, text: string) => {
      input.focus()
      await keys.keyboard(text)
      await settle()
    }
    const listbox = () => document.querySelector<HTMLElement>('[role="listbox"]')

    it('opens on a trigger at a word start, filters, and is driven from the text area', async () => {
      render(ShortcutMenus)
      const input = textbox()
      expect(input).toHaveAttribute('aria-keyshortcuts', '/ @')
      await typeInto(input, 'Check @im')
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
      await typeInto(input, 'Why does @')
      await keys.keyboard('{ArrowDown}{Enter}')
      await settle()
      expect(input.value).toBe('Why does @image-resize ')
      expect(listbox()).toBeNull()
      const refs = await view.findByRole('list', { name: 'References' })
      expect(refs.textContent).toContain('@image-resize')
      await typeInto(input, 'fail')
      await keys.keyboard('{Enter}')
      await settle()
      expect(view.getByText(/Sent “Why does @image-resize fail” with @image-resize/)).toBeTruthy()
    })

    it('does not open mid-word, closes on Escape, and Enter submits once closed', async () => {
      const view = render(ShortcutMenus)
      const input = textbox()
      await typeInto(input, 'a/b')
      expect(listbox()).toBeNull()
      await typeInto(input, ' /ex')
      expect(listbox()).toHaveAccessibleName('Commands')
      await keys.keyboard('{Escape}')
      await settle()
      expect(listbox()).toBeNull()
      await keys.keyboard('{Enter}')
      await settle()
      expect(view.getByText(/Sent “a\/b \/ex” with no references/)).toBeTruthy()
    })

    it('removing a reference chip removes its text', async () => {
      const view = render(ShortcutMenus)
      const input = textbox()
      await typeInto(input, '/sum')
      await keys.keyboard('{Tab}')
      await settle()
      expect(input.value).toBe('/summarize ')
      await keys.click(await view.findByRole('button', { name: /Remove/ }))
      await settle()
      expect(input.value).toBe('')
      expect(view.queryByRole('list', { name: 'References' })).toBeNull()
    })
  })
})

describe('PromptInput slot presence', () => {
  it('follows a v-if slot that appears and disappears after mount', async () => {
    const shown = ref(false)
    const { queryByTestId, container } = render({
      components: { PromptInput },
      setup: () => ({ shown }),
      template: `<PromptInput aria-label="Message"><template v-if="shown" #hint><span data-testid="probe">Slotted</span></template></PromptInput>`
    })
    expect(
      (container.querySelector('textarea')?.getAttribute('aria-describedby') ?? '').includes(
        queryByTestId('ai-prompt-input__hint')?.id ?? 'none'
      )
    ).toBe(false)

    shown.value = true
    await nextTick()
    expect(
      (container.querySelector('textarea')?.getAttribute('aria-describedby') ?? '').includes(
        queryByTestId('ai-prompt-input__hint')?.id ?? 'none'
      )
    ).toBe(true)
    expect(queryByTestId('probe')).not.toBeNull()

    shown.value = false
    await nextTick()
    expect(
      (container.querySelector('textarea')?.getAttribute('aria-describedby') ?? '').includes(
        queryByTestId('ai-prompt-input__hint')?.id ?? 'none'
      )
    ).toBe(false)
    expect(queryByTestId('probe')).toBeNull()
  })
})
