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
    expect(user.getByTestId('chat-message__content')).toHaveAttribute('title', '\u206810:42\u2069')
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

  async function feedbackTrigger(
    getByRole: (role: string, options: { name: string }) => HTMLElement
  ) {
    await vi.waitFor(() => expect(getByRole('button', { name: 'Feedback' })).not.toBeDisabled())
    return getByRole('button', { name: 'Feedback' })
  }

  async function menuItem(name: string): Promise<HTMLElement> {
    return vi.waitFor(() => {
      const item = Array.from(
        document.body.querySelectorAll<HTMLElement>('[role^="menuitem"]')
      ).find((node) => node.textContent?.trim() === name)
      expect(item).toBeTruthy()
      return item as HTMLElement
    })
  }

  function renderFeedback() {
    const value = ref<'up' | 'down' | null>(null)
    const loading = ref(false)
    const view = render(
      defineComponent({
        setup: () => () =>
          h(ChatMessageFeedback, {
            modelValue: value.value,
            loading: loading.value,
            'onUpdate:modelValue': (next: 'up' | 'down' | null) => {
              value.value = next
              loading.value = next !== null
            }
          })
      })
    )
    return { ...view, value, loading }
  }

  it('shows one Feedback button that opens a menu below it with Good response and Bad response', async () => {
    const { getByRole, getAllByRole, getByTestId } = renderFeedback()
    const trigger = await feedbackTrigger(getByRole)
    expect(getAllByRole('button')).toHaveLength(1)
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).not.toHaveAttribute('data-selected')
    expect(trigger.querySelector('.az-thumbs-up')).not.toBeNull()
    expect(getByTestId('chat-message-feedback__trigger')).toBe(trigger)
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const items = await vi.waitFor(() => {
      const found = Array.from(document.body.querySelectorAll('[role^="menuitem"]'))
      expect(found).toHaveLength(2)
      return found
    })
    expect(items.map((item) => item.textContent?.trim())).toEqual(['Good response', 'Bad response'])
    expect(
      document.querySelector('[data-testid="chat-message-feedback__up"] .az-thumbs-up')
    ).not.toBeNull()
    expect(
      document.querySelector('[data-testid="chat-message-feedback__down"] .az-thumbs-down')
    ).not.toBeNull()
  })

  it('rates from the menu, marks the choice, confirms only to screen readers, and clears on a second choice', async () => {
    const { getByRole, getByTestId, value, loading } = renderFeedback()
    await userEvent.click(await feedbackTrigger(getByRole))
    await userEvent.click(await menuItem('Bad response'))
    expect(value.value).toBe('down')
    expect(getByTestId('chat-message-feedback')).toHaveAttribute('data-value', 'down')
    expect(getByTestId('chat-message-feedback__status')).toHaveTextContent('Submitting feedback')
    expect(getByTestId('chat-message-feedback__trigger')).toHaveAttribute('data-loading')
    loading.value = false
    await nextTick()
    const trigger = getByRole('button', { name: 'Feedback' })
    expect(trigger).toHaveAttribute('data-selected')
    expect(trigger.querySelector('.az-thumbs-down-fill')).not.toBeNull()
    expect(getByTestId('chat-message-feedback__status')).toHaveTextContent(
      'Thanks for your feedback'
    )
    expect(getByTestId('chat-message-feedback__status')).toHaveClass('sr-only')
    await userEvent.click(trigger)
    const bad = await menuItem('Bad response')
    expect(bad).toHaveAttribute('role', 'menuitemradio')
    expect(bad).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(bad)
    expect(value.value).toBeNull()
    loading.value = false
    await nextTick()
    expect(getByRole('button', { name: 'Feedback' })).not.toHaveAttribute('data-selected')
    expect(getByTestId('chat-message-feedback__status')).toHaveTextContent('')
  })

  it('opens with the keyboard, moves with the arrows, chooses with Enter, and returns focus on Escape', async () => {
    const { getByRole, value, loading } = renderFeedback()
    const trigger = await feedbackTrigger(getByRole)
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await menuItem('Good response')
    await vi.waitFor(() =>
      expect(document.activeElement?.textContent?.trim()).toBe('Good response')
    )
    await userEvent.keyboard('{ArrowDown}')
    await vi.waitFor(() => expect(document.activeElement?.textContent?.trim()).toBe('Bad response'))
    await userEvent.keyboard('{Enter}')
    expect(value.value).toBe('down')
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger))
    loading.value = false
    await nextTick()
    await userEvent.keyboard(' ')
    await menuItem('Good response')
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'))
    expect(document.activeElement).toBe(trigger)
    expect(value.value).toBe('down')
  })

  it('keeps the menu shut while the choice is being sent', async () => {
    const { getByRole, getByTestId, value } = renderFeedback()
    await userEvent.click(await feedbackTrigger(getByRole))
    await userEvent.click(await menuItem('Good response'))
    expect(value.value).toBe('up')
    const trigger = getByTestId('chat-message-feedback__trigger')
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
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
    const { container, getByRole } = render(
      defineComponent({
        setup: () => () =>
          h(
            ChatMessage,
            { timestamp: '10:42' },
            {
              default: () => 'Open Real-Time Purge.',
              actions: () =>
                h(ChatMessageActions, null, {
                  default: () => h(ChatMessageFeedback, { modelValue: 'up' })
                })
            }
          )
      })
    )
    await expectNoA11yViolations(container)
    await userEvent.click(await feedbackTrigger(getByRole))
    const item = await menuItem('Good response')
    await expectNoA11yViolations(item.closest('[role="menu"]') as HTMLElement)
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
                      default: () => h('button', { type: 'button' }, 'Export'),
                      trailing: () => h('button', { type: 'button' }, 'Sources')
                    }
                  )
              }
            )
        })
      )
    }

    it('places Read aloud before the app actions and the trailing slot', async () => {
      spySpeech()
      const { getByRole } = renderRow()
      await nextTick()
      const names = Array.from(
        getByRole('group', { name: 'Message actions' }).querySelectorAll('button')
      ).map((button) => button.getAttribute('aria-label') ?? button.textContent)
      expect(names).toEqual(['Read aloud', 'Export', 'Sources'])
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
          sources: [{ title: 'Purge', href: 'https://www.azion.com/' }]
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

  describe('built-in actions', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    function renderBuiltIn(width: number, props: Record<string, unknown> = {}) {
      const feedback = ref<'up' | 'down' | null>(null)
      const events: Array<[string, unknown]> = []
      const view = render(
        defineComponent({
          setup: () => () =>
            h('div', { style: `width: ${width}px` }, [
              h(
                ChatMessage,
                { status: 'success' },
                {
                  default: () => 'Open Real-Time Purge.',
                  actions: () =>
                    h(
                      ChatMessageActions,
                      {
                        copyable: true,
                        showFeedback: true,
                        shareable: true,
                        retryable: true,
                        branchable: true,
                        feedback: feedback.value,
                        'onUpdate:feedback': (next: 'up' | 'down' | null) =>
                          (feedback.value = next),
                        onShare: (event: MouseEvent) => events.push(['share', event]),
                        onRetry: (event: Event) => events.push(['retry', event]),
                        onBranch: (event: Event) => events.push(['branch', event]),
                        ...props
                      },
                      { trailing: () => h('button', { type: 'button' }, 'Sources') }
                    )
                }
              )
            ])
        })
      )
      return { ...view, feedback, events }
    }

    async function openMore(getByRole: (role: string, options: { name: string }) => HTMLElement) {
      await vi.waitFor(() =>
        expect(getByRole('button', { name: 'More actions' })).not.toBeDisabled()
      )
      await userEvent.click(getByRole('button', { name: 'More actions' }))
    }

    const namesIn = (root: HTMLElement) =>
      Array.from(root.querySelectorAll('button')).map(
        (button) => button.getAttribute('aria-label') ?? button.textContent?.trim()
      )

    it('lays the wide row out in order, on one line, with Branch in new chat in More', async () => {
      const { getByRole, getByTestId } = renderBuiltIn(800)
      const row = getByRole('group', { name: 'Message actions' })
      await vi.waitFor(() => expect(row).not.toHaveAttribute('data-compact'))
      expect(namesIn(row)).toEqual([
        'Copy',
        'Feedback',
        'Share',
        'Try again',
        'More actions',
        'Sources'
      ])
      expect(row).toHaveClass('flex-nowrap')
      expect(getByTestId('chat-message-actions__trailing')).toContainElement(
        getByRole('button', { name: 'Sources' })
      )
      await openMore(getByRole)
      const items = await vi.waitFor(() => {
        const found = Array.from(document.body.querySelectorAll('[role="menuitem"]'))
        expect(found.length).toBeGreaterThan(0)
        return found
      })
      expect(items.map((item) => item.textContent?.trim())).toEqual(['Branch in new chat'])
    })

    it('moves the thumbs and Try again into More when the row is narrow', async () => {
      const { getByRole, feedback, events } = renderBuiltIn(360)
      const row = getByRole('group', { name: 'Message actions' })
      await vi.waitFor(() => expect(row).toHaveAttribute('data-compact'))
      expect(namesIn(row)).toEqual(['Copy', 'Share', 'More actions', 'Sources'])
      await openMore(getByRole)
      const bad = await vi.waitFor(() => {
        const item = Array.from(document.body.querySelectorAll('[role^="menuitem"]')).find((node) =>
          node.textContent?.includes('Bad response')
        )
        expect(item).toBeTruthy()
        return item as HTMLElement
      })
      const labels = Array.from(document.body.querySelectorAll('[role^="menuitem"]')).map((node) =>
        node.textContent?.trim()
      )
      expect(labels).toEqual(['Good response', 'Bad response', 'Try again', 'Branch in new chat'])
      await userEvent.click(bad)
      expect(feedback.value).toBe('down')
      await openMore(getByRole)
      const retry = await vi.waitFor(() => {
        const item = Array.from(document.body.querySelectorAll('[role^="menuitem"]')).find((node) =>
          node.textContent?.includes('Try again')
        )
        expect(item).toBeTruthy()
        return item as HTMLElement
      })
      await userEvent.click(retry)
      expect(events.map(([name]) => name)).toEqual(['retry'])
      expect(events[0]?.[1]).toBeInstanceOf(Event)
    })

    it('emits share and retry with the click, and locks Try again while disabled', async () => {
      const view = renderBuiltIn(800)
      await vi.waitFor(() =>
        expect(view.getByRole('group', { name: 'Message actions' })).not.toHaveAttribute(
          'data-compact'
        )
      )
      await userEvent.click(view.getByRole('button', { name: 'Share' }))
      await userEvent.click(view.getByRole('button', { name: 'Try again' }))
      expect(view.events.map(([name]) => name)).toEqual(['share', 'retry'])
      expect(view.events[0]?.[1]).toBeInstanceOf(MouseEvent)
      view.unmount()
      const locked = renderBuiltIn(800, { disabled: true })
      await vi.waitFor(() =>
        expect(locked.getByRole('group', { name: 'Message actions' })).not.toHaveAttribute(
          'data-compact'
        )
      )
      expect(locked.getByRole('button', { name: 'Try again' })).toBeDisabled()
    })

    it('copies the text of the message when given no copy text', async () => {
      const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
      const { getByRole } = renderBuiltIn(800)
      await userEvent.click(getByRole('button', { name: 'Copy' }))
      expect(write).toHaveBeenCalledWith('Open Real-Time Purge.')
    })

    it('rates from the Feedback menu and clears on a second choice', async () => {
      const { getByRole, feedback } = renderBuiltIn(800)
      await userEvent.click(await feedbackTrigger(getByRole))
      await userEvent.click(await menuItem('Good response'))
      expect(feedback.value).toBe('up')
      await userEvent.click(getByRole('button', { name: 'Feedback' }))
      await userEvent.click(await menuItem('Good response'))
      expect(feedback.value).toBeNull()
    })

    it('has no axe violations with every built-in action', async () => {
      const { container, getByRole } = renderBuiltIn(800)
      await vi.waitFor(() => expect(getByRole('button', { name: 'Share' })).toBeTruthy())
      await expectNoA11yViolations(container)
    })
  })

  describe('editing a prompt', () => {
    function renderPrompt() {
      const edits: Array<[Event, string]> = []
      const view = render(
        defineComponent({
          setup: () => () =>
            h(
              ChatMessage,
              {
                from: 'user',
                onEdit: (event: Event, text: string) => edits.push([event, text])
              },
              {
                default: () => 'How do I purge one URL?',
                actions: () => h(ChatMessageActions, { copyable: true, editable: true })
              }
            )
        })
      )
      return { ...view, edits }
    }

    it('shows Copy and Edit under the bubble, transparent until hover or focus', () => {
      const { getByRole, getByTestId } = renderPrompt()
      const row = getByRole('group', { name: 'Message actions' })
      expect(
        Array.from(row.querySelectorAll('button')).map((b) => b.getAttribute('aria-label'))
      ).toEqual(['Copy', 'Edit message'])
      const actions = getByTestId('chat-message__actions')
      expect(actions).toHaveAttribute('data-from', 'user')
      expect(actions).toHaveClass('data-[from=user]:pointer-coarse:opacity-100')
    })

    it('opens the bubble as a field, sends the trimmed text and returns focus to Edit', async () => {
      const { getByRole, getByTestId, edits, queryByTestId } = renderPrompt()
      const editButton = getByRole('button', { name: 'Edit message' })
      await userEvent.click(editButton)
      const field = getByRole('textbox', { name: 'Edit your message' }) as HTMLTextAreaElement
      expect(field.value).toBe('How do I purge one URL?')
      await vi.waitFor(() => expect(document.activeElement).toBe(field))
      expect(getByTestId('chat-message__actions')).not.toBeVisible()
      await userEvent.clear(field)
      expect(getByRole('button', { name: 'Send' })).toBeDisabled()
      await userEvent.type(field, '  Purge a wildcard  ')
      await userEvent.click(getByRole('button', { name: 'Send' }))
      expect(edits).toHaveLength(1)
      expect(edits[0]?.[0]).toBeInstanceOf(MouseEvent)
      expect(edits[0]?.[1]).toBe('Purge a wildcard')
      expect(queryByTestId('chat-message__editor')).toBeNull()
      await vi.waitFor(() =>
        expect(document.activeElement).toBe(getByRole('button', { name: 'Edit message' }))
      )
    })

    it('cancels on Escape and sends on Ctrl+Enter', async () => {
      const { getByRole, queryByTestId, edits } = renderPrompt()
      await userEvent.click(getByRole('button', { name: 'Edit message' }))
      await userEvent.keyboard('{Escape}')
      expect(queryByTestId('chat-message__editor')).toBeNull()
      expect(edits).toHaveLength(0)
      await userEvent.click(getByRole('button', { name: 'Edit message' }))
      const field = getByRole('textbox', { name: 'Edit your message' })
      await userEvent.type(field, ' now')
      await userEvent.keyboard('{Control>}{Enter}{/Control}')
      expect(edits[0]?.[0]).toBeInstanceOf(KeyboardEvent)
      expect(edits[0]?.[1]).toBe('How do I purge one URL? now')
    })

    it('has no axe violations while editing', async () => {
      const { container, getByRole } = renderPrompt()
      await userEvent.click(getByRole('button', { name: 'Edit message' }))
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
