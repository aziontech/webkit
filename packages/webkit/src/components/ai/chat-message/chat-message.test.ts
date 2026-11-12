import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import { useChatMessageContext } from './composables/use-chat-message-context'
import ChatMessage, { ChatMessageActions, ChatMessageFeedback } from './index'

describe('ChatMessage', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(
      render(ChatMessage, { slots: { default: () => 'Hi' } }).getByTestId('ai-chat-message')
    ).toBeTruthy()
    expect(
      render(ChatMessage, {
        attrs: { 'data-testid': 'mine' },
        slots: { default: () => 'Hi' }
      }).getByTestId('mine')
    ).toBeTruthy()
  })

  it('attaches the parts to the compound', () => {
    expect(ChatMessage.Actions).toBe(ChatMessageActions)
    expect(ChatMessage.Feedback).toBe(ChatMessageFeedback)
  })

  it.each([
    ['user', 'You'],
    ['assistant', 'AI assistant'],
    ['system', 'System']
  ] as const)('names a %s message after its author and time', (from, author) => {
    const { getByRole, getByTestId } = render(ChatMessage, {
      props: { from, timestamp: '10:42' },
      slots: { default: () => 'Text' }
    })
    expect(getByRole('article', { name: `${author} at 10:42` })).toBeTruthy()
    expect(getByTestId('ai-chat-message')).toHaveAttribute('data-from', from)
  })

  it('uses the author prop and hides the avatar from assistive tech', () => {
    const { getByRole, getByTestId } = render(ChatMessage, {
      props: { from: 'user', author: 'Ana Lima' },
      slots: { default: () => 'Hi' }
    })
    expect(getByRole('article', { name: 'Ana Lima' })).toBeTruthy()
    expect(getByTestId('ai-chat-message__avatar')).toHaveAttribute('aria-hidden', 'true')
    expect(getByTestId('ai-chat-message__author')).toHaveTextContent('Ana Lima')
  })

  it('drops avatar and author line when grouped', () => {
    const { queryByTestId } = render(ChatMessage, {
      props: { grouped: true },
      slots: { default: () => 'More' }
    })
    expect(queryByTestId('ai-chat-message__author')).toBeNull()
    expect(queryByTestId('ai-chat-message__avatar')?.children).toHaveLength(0)
  })

  it('renders loading text while pending and is busy while pending or streaming', async () => {
    const { getByTestId, queryByTestId, getByRole, rerender } = render(ChatMessage, {
      props: { state: 'pending' },
      slots: { default: () => 'Answer', actions: () => h('button', 'Copy') }
    })
    expect(getByRole('article')).toHaveAttribute('aria-busy', 'true')
    expect(getByTestId('ai-chat-message__loading')).toHaveTextContent('Generating a response')
    expect(queryByTestId('ai-chat-message__content')).toBeNull()
    expect(queryByTestId('ai-chat-message__actions')).toBeNull()
    await rerender({ state: 'streaming' })
    expect(getByRole('article')).toHaveAttribute('aria-busy', 'true')
    expect(getByTestId('ai-chat-message__content')).toHaveTextContent('Answer')
    expect(queryByTestId('ai-chat-message__actions')).toBeNull()
    await rerender({ state: 'complete' })
    expect(getByRole('article')).not.toHaveAttribute('aria-busy')
    expect(getByTestId('ai-chat-message__actions')).toHaveTextContent('Copy')
  })

  it('shows the error line and emits retry', async () => {
    const { getByTestId, getByRole, emitted } = render(ChatMessage, {
      props: { state: 'error', errorMessage: 'Connection lost.' },
      slots: { default: () => 'Partial' }
    })
    expect(getByTestId('ai-chat-message__content')).toHaveTextContent('Partial')
    expect(getByTestId('ai-chat-message__error')).toHaveTextContent('Connection lost.')
    await userEvent.click(getByRole('button', { name: 'Try again' }))
    expect(emitted('retry')).toHaveLength(1)
  })

  it('provides from and state to its parts, and Actions render only when complete', async () => {
    const seen: string[] = []
    const Probe = defineComponent({
      setup() {
        const { from, state } = useChatMessageContext()
        return () => {
          seen.push(`${from.value}:${state.value}`)
          return null
        }
      }
    })
    const state = ref<'streaming' | 'complete'>('streaming')
    const { queryByRole } = render(
      defineComponent({
        setup: () => () =>
          h(
            ChatMessage,
            { from: 'assistant', state: state.value },
            {
              default: () => h(Probe),
              actions: () => h(ChatMessageActions, null, { default: () => h('button', 'Copy') })
            }
          )
      })
    )
    expect(seen.at(-1)).toBe('assistant:streaming')
    expect(queryByRole('group', { name: 'Message actions' })).toBeNull()
    state.value = 'complete'
    await nextTick()
    expect(seen.at(-1)).toBe('assistant:complete')
    expect(queryByRole('group', { name: 'Message actions' })).toBeTruthy()
  })

  it('throws a clear error when a part is used outside a message', () => {
    expect(() => render(ChatMessageActions)).toThrow(/within a ChatMessage/)
  })

  it('records feedback once, disabling the other thumb and confirming', async () => {
    const value = ref<'up' | 'down' | null>(null)
    const loading = ref(false)
    const { getByRole, getByTestId } = render(
      defineComponent({
        setup: () => () =>
          h(ChatMessageFeedback, {
            modelValue: value.value,
            loading: loading.value,
            'onUpdate:modelValue': (next: 'up' | 'down') => {
              value.value = next
              loading.value = true
            }
          })
      })
    )
    const up = getByRole('button', { name: 'Helpful' })
    const down = getByRole('button', { name: 'Not helpful' })
    expect(up).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(down)
    expect(value.value).toBe('down')
    expect(getByTestId('ai-chat-message-feedback__status')).toHaveTextContent('Submitting feedback')
    loading.value = false
    await nextTick()
    expect(getByRole('button', { name: 'Not helpful' })).toHaveAttribute('aria-pressed', 'true')
    expect(getByRole('button', { name: 'Helpful' })).toBeDisabled()
    expect(getByTestId('ai-chat-message-feedback__status')).toHaveTextContent('Feedback submitted')
  })

  it('reads author names from the provider locale', () => {
    const { getByRole } = render(
      defineComponent({
        setup: () => () =>
          h(
            WebkitProvider,
            { locale: 'pt-BR', catalogs: LOCALES },
            { default: () => h(ChatMessage, { from: 'assistant' }, () => 'Oi') }
          )
      })
    )
    expect(getByRole('article', { name: 'Assistente de IA' })).toBeTruthy()
  })

  it('has no axe violations with actions and feedback', async () => {
    const { container } = render(
      defineComponent({
        setup: () => () =>
          h(
            ChatMessage,
            { timestamp: '10:42' },
            {
              default: () => 'Open Real-Time Purge.',
              actions: () =>
                h(ChatMessageActions, null, {
                  default: () => h(ChatMessageFeedback, { modelValue: null })
                })
            }
          )
      })
    )
    await expectNoA11yViolations(container)
  })
})
