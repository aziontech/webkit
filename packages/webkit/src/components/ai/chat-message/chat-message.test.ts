import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, type VNodeChild } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import StreamingResponse from '../streaming-response/streaming-response.vue'
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

  it('draws no avatar, keeping the author and time in a visually hidden line', () => {
    const { getByRole, getByTestId, queryByRole } = render(ChatMessage, {
      props: { from: 'user', author: 'Jane Doe', timestamp: '10:42' },
      slots: { default: () => 'Hi' }
    })
    expect(getByRole('article', { name: 'Jane Doe at 10:42' })).toBeTruthy()
    expect(queryByRole('img')).toBeNull()
    expect(getByTestId('chat-message__author')).toHaveTextContent('Jane Doe at 10:42')
    expect(getByTestId('chat-message__author')).toHaveClass('sr-only')
  })

  it('shows the time on hover over the user bubble only', () => {
    const user = render(ChatMessage, {
      props: { from: 'user', timestamp: '10:42' },
      slots: { default: () => 'Hi' }
    })
    expect(user.getByTestId('chat-message__content')).toHaveAttribute('title', '10:42')
    const assistant = render(ChatMessage, {
      props: { timestamp: '10:43' },
      slots: { default: () => 'Hello' },
      attrs: { 'data-testid': 'answer' }
    })
    expect(assistant.getByTestId('answer__content')).not.toHaveAttribute('title')
  })

  it('drops the hidden author line when grouped', () => {
    const { queryByTestId, getByTestId } = render(ChatMessage, {
      props: { grouped: true },
      slots: { default: () => 'More' }
    })
    expect(queryByTestId('chat-message__author')).toBeNull()
    expect(getByTestId('chat-message')).toHaveAttribute('data-grouped')
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
    expect(emitted<unknown[]>('retry')![0]![0]).toBeInstanceOf(MouseEvent)
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
            'onUpdate:modelValue': (next: 'up' | 'down' | null) => {
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
            ConfigProvider,
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

  describe('action row', () => {
    afterEach(() => {
      vi.restoreAllMocks()
      vi.unstubAllGlobals()
    })

    function spySpeech() {
      const spoken: SpeechSynthesisUtterance[] = []
      vi.spyOn(window.speechSynthesis, 'speak').mockImplementation((utterance) => {
        spoken.push(utterance)
      })
      const cancel = vi.spyOn(window.speechSynthesis, 'cancel').mockImplementation(() => undefined)
      return { spoken, cancel }
    }

    function renderRow(
      props: Record<string, unknown> = {},
      content: () => VNodeChild = () => 'Plain answer.'
    ) {
      return render(
        defineComponent({
          setup: () => () =>
            h(
              ChatMessage,
              { status: 'success' },
              {
                default: content,
                actions: () =>
                  h(
                    ChatMessageActions,
                    { showReadAloud: true, ...props },
                    {
                      default: () => h('button', { type: 'button' }, 'Copy'),
                      trailing: () => h('button', { type: 'button' }, 'Sources')
                    }
                  )
              }
            )
        })
      )
    }

    it('places Read aloud after the actions and before the trailing slot', async () => {
      spySpeech()
      const { getByRole } = renderRow()
      await nextTick()
      const names = Array.from(
        getByRole('group', { name: 'Message actions' }).querySelectorAll('button')
      ).map((button) => button.getAttribute('aria-label') ?? button.textContent)
      expect(names).toEqual(['Copy', 'Read aloud', 'Sources'])
    })

    it('speaks the given text, turns into Stop reading, and stops when pressed again', async () => {
      const { spoken, cancel } = spySpeech()
      const { getByRole, getByTestId } = renderRow({ readAloudText: 'Hello there.' })
      await nextTick()
      await userEvent.click(getByRole('button', { name: 'Read aloud' }))
      expect(spoken).toHaveLength(1)
      expect(spoken[0]?.text).toBe('Hello there.')
      const stop = getByRole('button', { name: 'Stop reading' })
      expect(getByTestId('chat-message-actions__read-aloud')).toHaveAttribute('data-speaking')
      await userEvent.click(stop)
      expect(cancel).toHaveBeenCalled()
      expect(getByRole('button', { name: 'Read aloud' })).toBeTruthy()
    })

    it('returns to Read aloud when the speech ends', async () => {
      const { spoken } = spySpeech()
      const { getByRole } = renderRow({ readAloudText: 'Short.' })
      await nextTick()
      await userEvent.click(getByRole('button', { name: 'Read aloud' }))
      spoken[0]?.onend?.(new Event('end') as SpeechSynthesisEvent)
      await nextTick()
      expect(getByRole('button', { name: 'Read aloud' })).toBeTruthy()
    })

    it('reads the response text without citation chips when given no text', async () => {
      const { spoken } = spySpeech()
      const { getByRole } = renderRow({}, () =>
        h(StreamingResponse, {
          content: 'Purge **now** [1].',
          sources: [{ title: 'Purge', href: 'https://www.azion.com/' }],
          anchor: 'a'
        })
      )
      await nextTick()
      await userEvent.click(getByRole('button', { name: 'Read aloud' }))
      expect(spoken[0]?.text).toBe('Purge now .')
    })

    it('stops speaking when the message unmounts', async () => {
      const { cancel } = spySpeech()
      const { getByRole, unmount } = renderRow({ readAloudText: 'Long answer.' })
      await nextTick()
      await userEvent.click(getByRole('button', { name: 'Read aloud' }))
      cancel.mockClear()
      unmount()
      expect(cancel).toHaveBeenCalledTimes(1)
    })

    it('hides Read aloud where the browser has no speech synthesis', async () => {
      vi.stubGlobal('SpeechSynthesisUtterance', undefined)
      const { queryByRole } = renderRow()
      await nextTick()
      expect(queryByRole('button', { name: 'Read aloud' })).toBeNull()
    })

    it('has no axe violations with Read aloud', async () => {
      spySpeech()
      const { container } = renderRow()
      await nextTick()
      await expectNoA11yViolations(container)
    })
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
