import { userEvent } from '@storybook/test'
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
  state: 'pending' | 'streaming' | 'complete'
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
              h(ChatMessage, { key: turn.id, from: turn.from, state: turn.state }, () => turn.text)
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
    state: 'complete'
  }))

describe('Conversation', () => {
  beforeAll(() => {
    const style = document.createElement('style')
    style.textContent =
      '[data-testid="ai-conversation"]{display:flex;flex-direction:column;min-height:0;flex:1}[data-testid="ai-conversation__viewport"]{overflow-y:auto;min-height:0;flex:1}'
    document.head.append(style)
  })

  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(Conversation).getByTestId('ai-conversation')).toBeTruthy()
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

  it('hands alignment to its messages', () => {
    const { getAllByTestId } = thread(many(2), { alignment: 'start' })
    for (const message of getAllByTestId('ai-chat-message')) {
      expect(message).toHaveAttribute('data-alignment', 'start')
    }
  })

  it('does not announce the history it mounts with', async () => {
    const { getByTestId } = thread(many(2))
    await nextTick()
    expect(getByTestId('ai-conversation__announcer')).toHaveTextContent('')
  })

  it('announces an assistant message once it finishes, never while streaming', async () => {
    const { getByTestId, turns } = thread([{ id: 0, from: 'user', text: 'Hi', state: 'complete' }])
    turns.value = [...turns.value, { id: 1, from: 'assistant', text: 'Hel', state: 'streaming' }]
    await frame()
    const announcer = getByTestId('ai-conversation__announcer')
    expect(announcer).toHaveTextContent('')
    turns.value = turns.value.map((t) =>
      t.id === 1 ? { ...t, text: 'Hello there.', state: 'complete' } : t
    )
    await frame()
    expect(announcer).toHaveTextContent('AI assistant: Hello there.')
  })

  it('does not announce the user’s own new message', async () => {
    const { getByTestId, turns } = thread([])
    turns.value = [{ id: 0, from: 'user', text: 'Purge one URL', state: 'complete' }]
    await frame()
    expect(getByTestId('ai-conversation__announcer')).toHaveTextContent('')
  })

  it('follows the newest message, stops when the reader scrolls up, and returns on demand', async () => {
    const { getByRole, getByTestId, queryByTestId, turns } = thread(many(12))
    await frame()
    const log = getByRole('log')
    const atEnd = () => log.scrollHeight - log.scrollTop - log.clientHeight <= 32
    expect(log.scrollHeight).toBeGreaterThan(log.clientHeight)
    expect(atEnd()).toBe(true)
    expect(queryByTestId('ai-conversation__scroll-to-latest')).toBeNull()

    log.dispatchEvent(new WheelEvent('wheel', { deltaY: -400 }))
    log.scrollTop = 0
    log.dispatchEvent(new Event('scroll'))
    await frame()
    expect(getByTestId('ai-conversation')).not.toHaveAttribute('data-pinned')
    turns.value = [
      ...turns.value,
      ...many(14)
        .slice(12)
        .map((t) => ({ ...t, id: t.id + 100 }))
    ]
    await frame()
    expect(log.scrollTop).toBe(0)
    expect(getByTestId('ai-conversation__scroll-to-latest')).toBeTruthy()

    await userEvent.click(getByTestId('ai-conversation__scroll-to-latest'))
    await vi.waitFor(() => expect(atEnd()).toBe(true), { timeout: 2000 })
    expect(getByTestId('ai-conversation')).toHaveAttribute('data-pinned')
  })

  it('names the scroll button and has no axe violations', async () => {
    const { container, getByRole, getByTestId } = thread(many(12))
    await frame()
    const log = getByRole('log')
    log.dispatchEvent(new WheelEvent('wheel', { deltaY: -400 }))
    log.scrollTop = 0
    log.dispatchEvent(new Event('scroll'))
    await frame()
    expect(getByTestId('ai-conversation__scroll-to-latest')).toHaveAccessibleName(
      'Scroll to the latest message'
    )
    await expectNoA11yViolations(container)
  })
})
