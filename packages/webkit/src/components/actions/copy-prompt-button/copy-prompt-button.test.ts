import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import AgentsExample from '../../../../examples/copy-prompt-button/agents.vue'
import DefaultExample from '../../../../examples/copy-prompt-button/default.vue'
import DisabledExample from '../../../../examples/copy-prompt-button/disabled.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
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
    expect(button).toBe(getByTestId('actions-copy-prompt-button'))
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-theme', 'dark')
    expect(button).toHaveAttribute('data-state', 'idle')
    expect(getByTestId('actions-copy-prompt-button__label')).toHaveTextContent('Copy prompt')
  })

  it('draws the default agent marks, hidden from the name and named in the description', () => {
    const { getByRole, getByTestId } = render(CopyPromptButton, { props: { value: PROMPT } })
    const marks = getByTestId('actions-copy-prompt-button__agents')
    expect(marks).toHaveAttribute('aria-hidden', 'true')
    expect([...marks.querySelectorAll('i')].map((i) => i.dataset['agent'])).toEqual([
      'Claude',
      'ChatGPT',
      'Gemini',
      'Cursor'
    ])
    expect(marks.querySelector('i')).toHaveClass('ai', 'ai-claude')
    expect(getByRole('button')).toHaveAccessibleDescription(
      'Works with Claude, ChatGPT, Gemini, Cursor'
    )
  })

  it('takes a custom agent list and draws no marks for an empty one', () => {
    const custom = render(CopyPromptButton, {
      props: { value: PROMPT, agents: [{ name: 'Windsurf', icon: 'ai ai-windsurf' }] }
    })
    expect(custom.getByRole('button')).toHaveAccessibleDescription('Works with Windsurf')
    custom.unmount()
    const none = render(CopyPromptButton, { props: { value: PROMPT, agents: [] } })
    expect(none.queryByTestId('actions-copy-prompt-button__agents')).toBeNull()
    expect(none.getByRole('button')).not.toHaveAttribute('aria-describedby')
  })

  it('copies the value, emits copy, shows and announces Copied, then resets', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const spy = mockClipboard()
    const { getByRole, getByTestId, emitted } = render(CopyPromptButton, {
      props: { value: PROMPT }
    })
    await fireEvent.click(getByRole('button'))
    await waitFor(() => expect(emitted('copy')).toEqual([[PROMPT]]))
    expect(spy).toHaveBeenCalledWith(PROMPT)
    const button = getByRole('button', { name: 'Copied' })
    expect(button).toHaveAttribute('data-state', 'copied')
    expect(getByTestId('actions-copy-prompt-button__status')).toHaveTextContent('Copied')
    await vi.advanceTimersByTimeAsync(2100)
    await waitFor(() => expect(button).toHaveAttribute('data-state', 'idle'))
    expect(getByTestId('actions-copy-prompt-button__status')).toHaveTextContent('')
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
    const { getByRole, emitted } = render(CopyPromptButton, { props: { value: PROMPT } })
    await fireEvent.click(getByRole('button'))
    await waitFor(() => expect(document.body.querySelector('[role="dialog"]')).not.toBeNull())
    expect(emitted('copy')).toBeUndefined()
  })

  it('reads the label and description from the provider locale', () => {
    const InProvider = defineComponent({
      setup: () => () =>
        h(
          WebkitProvider,
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
    const label = getByTestId('actions-copy-prompt-button__label')
    const marks = getByTestId('actions-copy-prompt-button__agents')
    expect(label.compareDocumentPosition(marks) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders the examples', () => {
    const a = render(DefaultExample)
    expect(a.getByRole('button', { name: 'Copy prompt' })).toBeTruthy()
    a.unmount()
    const b = render(AgentsExample)
    expect(b.getAllByRole('button', { name: 'Copy prompt' })).toHaveLength(2)
    b.unmount()
    const c = render(DisabledExample)
    expect(c.getByRole('button', { name: 'Copy prompt' })).toBeDisabled()
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
  })
})
