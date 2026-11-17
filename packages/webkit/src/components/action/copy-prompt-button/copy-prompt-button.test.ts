import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import AgentsExample from '../../../../examples/copy-prompt-button/agents.vue'
import ClosableExample from '../../../../examples/copy-prompt-button/closable.vue'
import DefaultExample from '../../../../examples/copy-prompt-button/default.vue'
import DisabledExample from '../../../../examples/copy-prompt-button/disabled.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import CopyPromptButton from './copy-prompt-button.vue'

const PROMPT = 'Set up the Azion CLI and link this project.'

const mockClipboard = () => vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CopyPromptButton', () => {
  it('renders a dark-themed button named by the catalog label, with the fallback testids', () => {
    const { getByRole, getByTestId } = render(CopyPromptButton, { props: { value: PROMPT } })
    const button = getByRole('button', { name: 'Copy prompt' })
    expect(button).toBe(getByTestId('copy-prompt-button'))
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-theme', 'dark')
    expect(button).toHaveAttribute('data-state', 'idle')
    expect(getByTestId('copy-prompt-button__label')).toHaveTextContent('Copy prompt')
  })

  it('draws the default agent marks, hidden from the name and named in the description', () => {
    const { getByRole, getByTestId } = render(CopyPromptButton, { props: { value: PROMPT } })
    const marks = getByTestId('copy-prompt-button__agents')
    expect(marks).toHaveAttribute('aria-hidden', 'true')
    expect([...marks.querySelectorAll('i')].map((i) => i.dataset['agent'])).toEqual([
      'Claude',
      'ChatGPT',
      'Gemini',
      'Cursor'
    ])
    expect(marks.querySelector('i')).toHaveClass('az', 'az-claude')
    expect(getByRole('button')).toHaveAccessibleDescription(
      'Works with Claude, ChatGPT, Gemini, Cursor'
    )
  })

  it('takes a custom agent list and draws no marks for an empty one', () => {
    const custom = render(CopyPromptButton, {
      props: { value: PROMPT, agents: [{ name: 'Windsurf', icon: 'az az-windsurf' }] }
    })
    expect(custom.getByRole('button')).toHaveAccessibleDescription('Works with Windsurf')
    custom.unmount()
    const none = render(CopyPromptButton, { props: { value: PROMPT, agents: [] } })
    expect(none.queryByTestId('copy-prompt-button__agents')).toBeNull()
    expect(none.getByRole('button')).not.toHaveAttribute('aria-describedby')
  })

  it('draws an agent mark from its logo file in the chip ink', async () => {
    const { getByTestId } = render(CopyPromptButton, {
      props: {
        value: PROMPT,
        agents: [
          { name: 'Claude', logo: 'https://example.com/claude.svg' },
          { name: 'Cursor', icon: 'az az-cursor' }
        ]
      }
    })
    const marks = getByTestId('copy-prompt-button__agents')
    await waitFor(() => expect(marks.querySelector('[data-agent="Claude"]')).not.toBeNull())
    const logo = marks.querySelector<HTMLElement>('[data-agent="Claude"]')!
    expect(logo).toHaveAttribute('data-testid', 'logo')
    expect(logo).toHaveAttribute('data-variant', 'current')
    expect(logo).toHaveAttribute('aria-hidden', 'true')
    expect(marks.querySelector('i[data-agent="Cursor"]')).toHaveClass('az-cursor')
  })

  it('wraps the chip in a tooltip that says what it does', async () => {
    const user = userEvent.setup()
    const { getByRole, getByTestId } = render(CopyPromptButton, { props: { value: PROMPT } })
    expect(getByTestId('copy-prompt-button__tooltip')).toContainElement(getByRole('button'))
    await user.hover(getByRole('button'))
    await waitFor(() =>
      expect(document.body.querySelector('[role="tooltip"]')).toHaveTextContent(
        'Copies a setup prompt for your AI coding tool'
      )
    )
  })

  it('has no dismiss button unless closable', () => {
    const { queryByRole } = render(CopyPromptButton, { props: { value: PROMPT } })
    expect(queryByRole('button', { name: 'Dismiss' })).toBeNull()
  })

  it('removes itself and emits close with the click when dismissed', async () => {
    const user = userEvent.setup()
    const { findByRole, queryByTestId, emitted } = render(CopyPromptButton, {
      props: { value: PROMPT, closable: true }
    })
    await user.click(await findByRole('button', { name: 'Dismiss' }))
    expect(emitted('close')).toHaveLength(1)
    expect(emitted<unknown[]>('close')![0][0]).toBeInstanceOf(MouseEvent)
    expect(queryByTestId('copy-prompt-button')).toBeNull()
    expect(queryByTestId('copy-prompt-button__frame')).toBeNull()
  })

  it('emits update:open on dismiss and stays hidden or shown from v-model:open', async () => {
    const user = userEvent.setup()
    const view = render(CopyPromptButton, { props: { value: PROMPT, closable: true } })
    await user.click(await view.findByRole('button', { name: 'Dismiss' }))
    expect(view.emitted('update:open')?.[0]).toEqual([false])
    view.unmount()
    const hidden = render(CopyPromptButton, { props: { value: PROMPT, open: false } })
    expect(hidden.queryByTestId('copy-prompt-button')).toBeNull()
    await hidden.rerender({ value: PROMPT, open: true })
    expect(hidden.getByTestId('copy-prompt-button')).toBeTruthy()
  })

  it('copies the value, emits copy, shows and announces Copied, then resets', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const spy = mockClipboard()
    const { getByRole, getByTestId, emitted } = render(CopyPromptButton, {
      props: { value: PROMPT }
    })
    await fireEvent.click(getByRole('button'))
    await waitFor(() => expect(emitted('copy')).toEqual([[expect.any(MouseEvent), PROMPT]]))
    expect(spy).toHaveBeenCalledWith(PROMPT)
    const button = getByRole('button', { name: 'Copied' })
    expect(button).toHaveAttribute('data-state', 'copied')
    expect(getByTestId('copy-prompt-button__status')).toHaveTextContent('Copied')
    await vi.advanceTimersByTimeAsync(2100)
    await waitFor(() => expect(button).toHaveAttribute('data-state', 'idle'))
    expect(getByTestId('copy-prompt-button__status')).toHaveTextContent('')
    vi.useRealTimers()
  })

  it('copies on Enter and Space', async () => {
    const user = userEvent.setup()
    const spy = mockClipboard()
    const { getByRole } = render(CopyPromptButton, { props: { value: PROMPT } })
    getByRole('button').focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2))
  })

  it('does not copy or emit when disabled', async () => {
    const spy = mockClipboard()
    const { getByRole, emitted } = render(CopyPromptButton, {
      props: { value: PROMPT, disabled: true }
    })
    const button = getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('data-disabled')
    await fireEvent.click(button)
    expect(spy).not.toHaveBeenCalled()
    expect(emitted('copy')).toBeUndefined()
  })

  it('opens the manual-copy fallback when the clipboard refuses', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new DOMException('denied'))
    vi.spyOn(document, 'execCommand').mockReturnValue(false)
    const { getByRole, emitted } = render(CopyPromptButton, { props: { value: PROMPT } })
    await fireEvent.click(getByRole('button'))
    await waitFor(() => expect(document.body.querySelector('[role="dialog"]')).not.toBeNull())
    expect(emitted('copy')).toBeUndefined()
  })

  it('reads the label and description from the provider locale', () => {
    const InProvider = defineComponent({
      setup: () => () =>
        h(
          ConfigProvider,
          { catalogs: LOCALES, locale: 'pt-BR' },
          { default: () => h(CopyPromptButton, { value: PROMPT }) }
        )
    })
    const { getByRole } = render(InProvider)
    expect(getByRole('button', { name: 'Copiar prompt' })).toHaveAccessibleDescription(
      'Funciona com Claude, ChatGPT, Gemini, Cursor'
    )
  })

  it('keeps the label before the marks under dir="rtl"', () => {
    const InRtl = defineComponent({
      setup: () => () => h('div', { dir: 'rtl' }, [h(CopyPromptButton, { value: PROMPT })])
    })
    const { getByTestId } = render(InRtl)
    const label = getByTestId('copy-prompt-button__label')
    const marks = getByTestId('copy-prompt-button__agents')
    expect(label.compareDocumentPosition(marks) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders the examples', async () => {
    const a = render(DefaultExample)
    expect(a.getByRole('button', { name: 'Copy prompt' })).toBeTruthy()
    a.unmount()
    const b = render(AgentsExample)
    expect(b.getAllByRole('button', { name: 'Copy prompt' })).toHaveLength(2)
    b.unmount()
    const c = render(DisabledExample)
    expect(c.getByRole('button', { name: 'Copy prompt' })).toBeDisabled()
    c.unmount()
    const d = render(ClosableExample)
    expect(d.getByRole('button', { name: 'Onboard your agent' })).toBeTruthy()
    expect(await d.findByRole('button', { name: 'Dismiss' })).toBeTruthy()
  })

  it('has no axe violations idle, without marks and disabled', async () => {
    const a = render(CopyPromptButton, { props: { value: PROMPT } })
    await expectNoA11yViolations(a.container)
    a.unmount()
    const b = render(CopyPromptButton, { props: { value: PROMPT, agents: [] } })
    await expectNoA11yViolations(b.container)
    b.unmount()
    const c = render(CopyPromptButton, { props: { value: PROMPT, disabled: true } })
    await expectNoA11yViolations(c.container)
    c.unmount()
    const d = render(ClosableExample)
    await expectNoA11yViolations(d.container)
  })
})
