import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import ChatMessage from '../chat-message/chat-message.vue'
import Conversation from './conversation.vue'

type Turn = {
  id: number
  from: 'user' | 'assistant'
  text: string
  status: 'pending' | 'streaming' | 'success'
}

const frame = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 30)))

function thread(initial: Turn[], props: Record<string, unknown> = {}) {
  const turns = ref<Turn[]>(initial)
  const Host = defineComponent({
    setup: () => () =>
      h('div', { style: 'height: 240px; display: flex; flex-direction: column' }, [
        h(Conversation, props, {
          default: () =>
            turns.value.map((turn) =>
              h(
                ChatMessage,
                { key: turn.id, from: turn.from, status: turn.status },
                () => turn.text
              )
            )
        })
      ])
  })
  return { ...render(Host), turns }
}

const many = (n: number): Turn[] =>
  Array.from({ length: n }, (_, i) => ({
    id: i,
    from: i % 2 ? 'assistant' : 'user',
    text: `Message ${i} `.repeat(12),
    status: 'success'
  }))

function older(initial: Turn[], options: { moreMessages?: boolean; loadingMore?: boolean } = {}) {
  const turns = ref<Turn[]>(initial)
  const state = ref({ moreMessages: true, loadingMore: false, ...options })
  const onLoadMore = vi.fn()
  const Host = defineComponent({
    setup: () => () =>
      h('div', { style: 'height: 240px; display: flex; flex-direction: column' }, [
        h(
          Conversation,
          { ...state.value, onLoadMore },
          {
            default: () =>
              turns.value.map((turn) =>
                h(
                  ChatMessage,
                  { key: turn.id, from: turn.from, status: turn.status },
                  () => turn.text
                )
              )
          }
        )
      ])
  })
  return { ...render(Host), turns, state, onLoadMore }
}

const earlier = (n: number, from = 1000): Turn[] =>
  many(n).map((turn) => ({ ...turn, id: turn.id + from, text: `Older ${turn.id} `.repeat(12) }))

function readerScrollsTo(log: HTMLElement, top: number): void {
  log.dispatchEvent(new WheelEvent('wheel', { deltaY: -400 }))
  log.scrollTop = top
  log.dispatchEvent(new Event('scroll'))
}

describe('Conversation', () => {
  beforeAll(() => {
    const style = document.createElement('style')
    style.textContent =
      '[data-testid="conversation"]{display:flex;flex-direction:column;min-height:0;flex:1}[data-testid="conversation__viewport"]{overflow-y:auto;min-height:0;flex:1}'
    document.head.append(style)
  })

  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(Conversation).getByTestId('conversation')).toBeTruthy()
    expect(
      render(Conversation, { attrs: { 'data-testid': 'mine' } }).getByTestId('mine')
    ).toBeTruthy()
  })

  it('is a named, focusable log whose own live behavior is off', () => {
    const { getByRole } = render(Conversation)
    const log = getByRole('log', { name: 'Conversation' })
    expect(log).toHaveAttribute('aria-live', 'off')
    expect(log).toHaveAttribute('tabindex', '0')
  })

  it('hands its layout to its messages', () => {
    const { getAllByTestId } = thread(many(2), { layout: 'start' })
    for (const message of getAllByTestId('chat-message')) {
      expect(message).toHaveAttribute('data-alignment', 'start')
    }
  })

  it('does not announce the history it mounts with', async () => {
    const { getByTestId } = thread(many(2))
    await nextTick()
    expect(getByTestId('conversation__announcer')).toHaveTextContent('')
  })

  it('announces an assistant message once it finishes, never while streaming', async () => {
    const { getByTestId, turns } = thread([{ id: 0, from: 'user', text: 'Hi', status: 'success' }])
    turns.value = [...turns.value, { id: 1, from: 'assistant', text: 'Hel', status: 'streaming' }]
    await frame()
    const announcer = getByTestId('conversation__announcer')
    expect(announcer).toHaveTextContent('')
    turns.value = turns.value.map((t) =>
      t.id === 1 ? { ...t, text: 'Hello there.', status: 'success' } : t
    )
    await frame()
    expect(announcer).toHaveTextContent('AI assistant: Hello there.')
  })

  it('does not announce the user’s own new message', async () => {
    const { getByTestId, turns } = thread([])
    turns.value = [{ id: 0, from: 'user', text: 'Purge one URL', status: 'success' }]
    await frame()
    expect(getByTestId('conversation__announcer')).toHaveTextContent('')
  })

  it('follows the newest message, stops when the reader scrolls up, and returns on demand', async () => {
    const { getByRole, getByTestId, queryByTestId, turns } = thread(many(12))
    await frame()
    const log = getByRole('log')
    const atEnd = () => log.scrollHeight - log.scrollTop - log.clientHeight <= 32
    expect(log.scrollHeight).toBeGreaterThan(log.clientHeight)
    expect(atEnd()).toBe(true)
    expect(queryByTestId('conversation__scroll-to-latest')).toBeNull()

    log.dispatchEvent(new WheelEvent('wheel', { deltaY: -400 }))
    log.scrollTop = 0
    log.dispatchEvent(new Event('scroll'))
    await frame()
    expect(getByTestId('conversation')).not.toHaveAttribute('data-pinned')
    turns.value = [
      ...turns.value,
      ...many(14)
        .slice(12)
        .map((t) => ({ ...t, id: t.id + 100 }))
    ]
    await frame()
    expect(log.scrollTop).toBe(0)
    expect(getByTestId('conversation__scroll-to-latest')).toBeTruthy()

    await userEvent.click(getByTestId('conversation__scroll-to-latest'))
    await vi.waitFor(() => expect(atEnd()).toBe(true), { timeout: 2000 })
    expect(getByTestId('conversation')).toHaveAttribute('data-pinned')
  })

  it('names the scroll button and has no axe violations', async () => {
    const { container, getByRole, getByTestId } = thread(many(12))
    await frame()
    const log = getByRole('log')
    log.dispatchEvent(new WheelEvent('wheel', { deltaY: -400 }))
    log.scrollTop = 0
    log.dispatchEvent(new Event('scroll'))
    await frame()
    expect(getByTestId('conversation__scroll-to-latest')).toHaveAccessibleName(
      'Scroll to the latest message'
    )
    await expectNoA11yViolations(container)
  })

  it('shows no load control unless older messages exist', () => {
    const { queryByTestId } = thread(many(2))
    expect(queryByTestId('conversation__older')).toBeNull()
  })

  it('loads older messages from the button with the click as the payload', async () => {
    const { getByRole, onLoadMore } = older(many(2))
    await frame()
    onLoadMore.mockClear()
    await userEvent.click(getByRole('button', { name: 'Load earlier messages' }))
    expect(onLoadMore).toHaveBeenCalledTimes(1)
    expect(onLoadMore.mock.calls[0][0]).toBeInstanceOf(MouseEvent)
  })

  it('marks the loading state and holds further requests while loading', async () => {
    const { getByRole, getByTestId, onLoadMore, state } = older(many(2))
    await frame()
    onLoadMore.mockClear()
    state.value = { ...state.value, loadingMore: true }
    await frame()
    const button = getByRole('button', { name: 'Loading earlier messages' })
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(getByRole('log')).toHaveAttribute('aria-busy', 'true')
    expect(getByTestId('conversation')).toHaveAttribute('data-loading-more')
    expect(getByTestId('conversation__announcer')).toHaveTextContent('Loading earlier messages')
    await userEvent.click(button)
    expect(onLoadMore).not.toHaveBeenCalled()
  })

  it('asks for older messages when the reader scrolls near the top, once per load', async () => {
    const { getByRole, onLoadMore, state } = older(many(12))
    await frame()
    expect(onLoadMore).not.toHaveBeenCalled()
    readerScrollsTo(getByRole('log'), 0)
    await vi.waitFor(() => expect(onLoadMore).toHaveBeenCalledTimes(1))
    expect(onLoadMore.mock.calls[0][0]).toBeInstanceOf(Event)
    expect(onLoadMore.mock.calls[0][0].type).toBe('load-more')
    state.value = { ...state.value, loadingMore: true }
    await frame()
    state.value = { ...state.value, loadingMore: false }
    await frame()
    await frame()
    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })

  it('keeps the message in view where it was when older messages are prepended', async () => {
    const { getByRole, getAllByTestId, turns, state } = older(many(12))
    await frame()
    const log = getByRole('log')
    readerScrollsTo(log, Math.round(log.scrollHeight / 2))
    await frame()
    const top = log.getBoundingClientRect().top
    const inView = getAllByTestId('chat-message').find(
      (message) => message.getBoundingClientRect().bottom > top
    ) as HTMLElement
    const before = inView.getBoundingClientRect().top
    state.value = { ...state.value, loadingMore: true }
    await frame()
    turns.value = [...earlier(6), ...turns.value]
    state.value = { ...state.value, loadingMore: false }
    await frame()
    expect(Math.abs(inView.getBoundingClientRect().top - before)).toBeLessThan(2)
    expect(log.scrollTop).toBeGreaterThan(0)
  })

  it('announces the load without reading the prepended messages as new', async () => {
    const { getByTestId, turns, state } = older(many(2))
    await frame()
    state.value = { ...state.value, loadingMore: true }
    await frame()
    turns.value = [...earlier(4), ...turns.value]
    state.value = { ...state.value, loadingMore: false }
    await frame()
    await frame()
    const announcer = getByTestId('conversation__announcer')
    expect(announcer).toHaveTextContent('Earlier messages loaded')
    expect(announcer).not.toHaveTextContent('Older')
  })

  it('keeps the button as the retry path when a load adds nothing', async () => {
    const { getByRole, getByTestId, onLoadMore, state } = older(many(2))
    await frame()
    onLoadMore.mockClear()
    state.value = { ...state.value, loadingMore: true }
    await frame()
    state.value = { ...state.value, loadingMore: false }
    await frame()
    await frame()
    expect(onLoadMore).not.toHaveBeenCalled()
    expect(getByTestId('conversation__announcer')).not.toHaveTextContent('Earlier messages loaded')
    await userEvent.click(getByRole('button', { name: 'Load earlier messages' }))
    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })

  it('moves focus to the log when the focused button leaves at the start of the thread', async () => {
    const { getByRole, state } = older(many(2))
    await frame()
    getByRole('button', { name: 'Load earlier messages' }).focus()
    state.value = { moreMessages: false, loadingMore: false }
    await frame()
    expect(document.activeElement).toBe(getByRole('log'))
  })

  it('has no axe violations with the load control', async () => {
    const { container } = older(many(2))
    await frame()
    await expectNoA11yViolations(container)
  })
})
