import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../provider/webkit-provider/webkit-provider.vue'
import { useChatMessageContext } from './composables/use-chat-message-context'
import ChatMessage, { ChatMessageActions, ChatMessageFeedback } from './index'

describe('ChatMessage', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(
      render(ChatMessage, { slots: { default: () => 'Hi' } }).getByTestId('chat-message')
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
    expect(getByTestId('chat-message')).toHaveAttribute('data-from', from)
  })

  it('uses the author prop and hides the avatar from assistive tech', () => {
    const { getByRole, getByTestId } = render(ChatMessage, {
      props: { from: 'user', author: 'Ana Lima' },
      slots: { default: () => 'Hi' }
    })
    expect(getByRole('article', { name: 'Ana Lima' })).toBeTruthy()
    expect(getByTestId('chat-message__avatar')).toHaveAttribute('aria-hidden', 'true')
    expect(getByTestId('chat-message__author')).toHaveTextContent('Ana Lima')
  })

  it('drops avatar and author line when grouped', () => {
    const { queryByTestId } = render(ChatMessage, {
      props: { grouped: true },
      slots: { default: () => 'More' }
    })
    expect(queryByTestId('chat-message__author')).toBeNull()
    expect(queryByTestId('chat-message__avatar')?.children).toHaveLength(0)
  })

  it('renders loading text while pending and is busy while pending or streaming', async () => {
    const { getByTestId, queryByTestId, getByRole, rerender } = render(ChatMessage, {
      props: { status: 'pending' },
      slots: { default: () => 'Answer', actions: () => h('button', 'Copy') }
    })
    expect(getByRole('article')).toHaveAttribute('aria-busy', 'true')
    expect(getByTestId('chat-message__loading')).toHaveTextContent('Generating a response')
    expect(queryByTestId('chat-message__content')).toBeNull()
    expect(queryByTestId('chat-message__actions')).toBeNull()
    await rerender({ status: 'streaming' })
    expect(getByRole('article')).toHaveAttribute('aria-busy', 'true')
    expect(getByTestId('chat-message__content')).toHaveTextContent('Answer')
    expect(queryByTestId('chat-message__actions')).toBeNull()
    await rerender({ status: 'success' })
    expect(getByRole('article')).not.toHaveAttribute('aria-busy')
    expect(getByRole('article')).toHaveAttribute('data-status', 'success')
    expect(getByTestId('chat-message__actions')).toHaveTextContent('Copy')
  })

  it('shows the error line and emits retry', async () => {
    const { getByTestId, getByRole, emitted } = render(ChatMessage, {
      props: { status: 'error', errorMessage: 'Connection lost.' },
      slots: { default: () => 'Partial' }
    })
    expect(getByTestId('chat-message__content')).toHaveTextContent('Partial')
    expect(getByTestId('chat-message__error')).toHaveTextContent('Connection lost.')
    await userEvent.click(getByRole('button', { name: 'Try again' }))
    expect(emitted('retry')).toHaveLength(1)
    expect(emitted('retry')![0]![0]).toBeInstanceOf(MouseEvent)
  })

  it('provides from and status to its parts, and Actions render only when success', async () => {
    const seen: string[] = []
    const Probe = defineComponent({
      setup() {
        const { from, status } = useChatMessageContext()
        return () => {
          seen.push(`${from.value}:${status.value}`)
          return null
        }
      }
    })
    const status = ref<'streaming' | 'success'>('streaming')
    const { queryByRole } = render(
      defineComponent({
        setup: () => () =>
          h(
            ChatMessage,
            { from: 'assistant', status: status.value },
            {
              default: () => h(Probe),
              actions: () => h(ChatMessageActions, null, { default: () => h('button', 'Copy') })
            }
          )
      })
    )
    expect(seen.at(-1)).toBe('assistant:streaming')
    expect(queryByRole('group', { name: 'Message actions' })).toBeNull()
    status.value = 'success'
    await nextTick()
    expect(seen.at(-1)).toBe('assistant:success')
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
    expect(getByTestId('chat-message-feedback__status')).toHaveTextContent('Submitting feedback')
    loading.value = false
    await nextTick()
    expect(getByRole('button', { name: 'Not helpful' })).toHaveAttribute('aria-pressed', 'true')
    expect(getByRole('button', { name: 'Helpful' })).toBeDisabled()
    expect(getByTestId('chat-message-feedback__status')).toHaveTextContent('Feedback submitted')
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

  describe('slot presence', () => {
    it('follows a v-if slot that appears and disappears after mount', async () => {
      const shown = ref(false)
      const { queryByTestId } = render({
        components: { ChatMessage },
        setup: () => ({ shown }),
        template: `<ChatMessage status="success">Answer.<template v-if="shown" #actions><span data-testid="probe">Slotted</span></template></ChatMessage>`
      })
      expect(queryByTestId('chat-message__actions')).toBeNull()

      shown.value = true
      await nextTick()
      expect(queryByTestId('chat-message__actions')).not.toBeNull()
      expect(queryByTestId('probe')).not.toBeNull()

      shown.value = false
      await nextTick()
      expect(queryByTestId('chat-message__actions')).toBeNull()
      expect(queryByTestId('probe')).toBeNull()
    })
  })
})
