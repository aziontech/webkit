import userEvent from '@testing-library/user-event'
import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { h } from 'vue'

import Default from '../../../../examples/conversation-history/default.vue'
import States from '../../../../examples/conversation-history/states.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import ConversationHistory from './conversation-history.vue'

afterEach(() => cleanup())

const now = '2026-11-11T15:00:00'
const items = [
  { id: 'a', title: 'Older one', updatedAt: '2026-01-01T10:00:00' },
  { id: 'b', title: 'Earlier today', updatedAt: '2026-11-11T08:00:00' },
  { id: 'c', title: 'Later today', updatedAt: '2026-11-11T12:00:00' },
  { id: 'd', title: 'Late yesterday', updatedAt: '2026-11-10T23:30:00' },
  { id: 'e', title: 'Last week', updatedAt: '2026-11-06T10:00:00' },
  { id: 'f', title: 'Last month', updatedAt: '2026-10-20T10:00:00' }
]

describe('ConversationHistory', () => {
  it('groups by calendar day, newest first, inside a named nav', () => {
    const view = render(ConversationHistory, { props: { items, now } })
    const nav = view.getByRole('navigation', { name: 'Conversation history' })
    const lists = within(nav).getAllByRole('list')
    expect(
      lists.map(
        (list) =>
          list.getAttribute('aria-labelledby') &&
          document.getElementById(list.getAttribute('aria-labelledby')!)!.textContent!.trim()
      )
    ).toEqual(['Today', 'Yesterday', 'Previous 7 days', 'Previous 30 days', 'Older'])
    expect(
      within(lists[0]!)
        .getAllByRole('button')
        .map((b) => b.textContent!.trim())
    ).toEqual(['Later today', 'Earlier today'])
    expect(within(lists[1]!).getByRole('button')).toHaveTextContent('Late yesterday')
  })

  it('marks the open conversation current and selects another', async () => {
    const view = render(ConversationHistory, { props: { items, now, modelValue: 'b' } })
    expect(view.getByRole('button', { name: 'Earlier today' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    await fireEvent.click(view.getByRole('button', { name: 'Last week' }))
    expect(view.emitted('update:modelValue')![0]).toEqual(['e'])
  })

  it('emits remove with the event and the id from a named Delete button', async () => {
    const view = render(ConversationHistory, { props: { items, now, removable: true } })
    await userEvent.click(view.getByRole('button', { name: 'Delete Last month' }))
    const [pointer, id] = view.emitted('remove')![0] as [Event, string]
    expect(pointer).toBeInstanceOf(MouseEvent)
    expect(id).toBe('f')
    view.getByRole('button', { name: 'Delete Last week' }).focus()
    await userEvent.keyboard('{Enter}')
    const [keyboard, next] = view.emitted('remove')![1] as [Event, string]
    expect(keyboard).toBeInstanceOf(Event)
    expect(next).toBe('e')
  })

  it('shows loading and empty states', () => {
    const view = render(States)
    const [loading, empty] = view.getAllByRole('navigation')
    expect(loading).toHaveAttribute('aria-busy', 'true')
    expect(within(empty!).getByText('No conversations yet.')).toBeTruthy()
    expect(
      within(empty!).getByText(
        'Your chats with the assistant appear here after you ask it something.'
      )
    ).toBeTruthy()
  })

  it('reads its strings from the locale catalog', () => {
    const view = render(ConfigProvider, {
      props: { locale: 'pt-BR', catalogs: LOCALES },
      slots: { default: () => h(ConversationHistory, { items, now, removable: true }) }
    })
    expect(view.getByRole('navigation', { name: 'Histórico de conversas' })).toBeTruthy()
    expect(view.getByText('Ontem')).toBeTruthy()
    expect(view.getByRole('button', { name: 'Excluir Older one' })).toBeTruthy()
  })

  it('isolates titles under rtl', () => {
    const host = document.createElement('div')
    host.dir = 'rtl'
    document.body.appendChild(host)
    const view = render(ConversationHistory, { props: { items, now }, container: host })
    expect(view.getByText('Older one').tagName).toBe('BDI')
    host.remove()
  })

  it('asks before it removes a row in the example and has no axe violations', async () => {
    await page.viewport(1280, 800)
    const view = render(Default)
    await expectNoA11yViolations(view.container)
    await userEvent.click(view.getByRole('button', { name: 'Delete Edge storage pricing' }))
    const dialog = await waitFor(() => {
      const found = document.querySelector<HTMLElement>('[role="alertdialog"]')
      expect(found).toBeTruthy()
      return found!
    })
    expect(view.queryByText('Edge storage pricing')).not.toBeNull()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete conversation' }))
    await waitFor(() => expect(view.queryByText('Edge storage pricing')).toBeNull())
    await waitFor(() =>
      expect(document.activeElement?.textContent?.trim()).toBe(
        'Migrate DNS records from another provider'
      )
    )
    const states = render(States)
    await expectNoA11yViolations(states.container)
    await page.viewport(414, 896)
  })

  it('opens from a drawer on a phone and closes it once a conversation is chosen', async () => {
    await page.viewport(390, 844)
    const view = render(Default)
    const menu = await view.findByRole('button', { name: 'Open conversation history' })
    expect(view.queryByRole('navigation', { name: 'Conversation history' })).toBeNull()
    await userEvent.click(menu)
    const drawer = await waitFor(() => {
      const found = document.querySelector<HTMLElement>('[role="dialog"]')
      expect(found).toBeTruthy()
      return found!
    })
    const nav = within(drawer).getByRole('navigation', { name: 'Conversation history' })
    await userEvent.click(within(nav).getByRole('button', { name: 'Edge storage pricing' }))
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
    expect(view.getByText('Edge storage pricing')).toBeInTheDocument()
    await page.viewport(414, 896)
  })

  it('offers New chat first and emits create with the click', async () => {
    const calls: MouseEvent[] = []
    const view = render(ConversationHistory, {
      props: { items, now, creatable: true, onCreate: (event: MouseEvent) => calls.push(event) }
    })
    const buttons = within(view.getByRole('navigation')).getAllByRole('button')
    expect(buttons[0]).toHaveAccessibleName('New chat')
    await userEvent.click(buttons[0]!)
    expect(calls).toHaveLength(1)
    expect(calls[0]).toBeInstanceOf(MouseEvent)
  })

  it('renders neither New chat nor search unless asked', () => {
    const view = render(ConversationHistory, { props: { items, now } })
    expect(view.queryByRole('button', { name: 'New chat' })).toBeNull()
    expect(view.queryByRole('searchbox', { name: 'Search conversations' })).toBeNull()
  })

  it('filters titles case-insensitively and says when nothing matches', async () => {
    const view = render(ConversationHistory, { props: { items, now, searchable: true } })
    const search = view.getByRole('searchbox', { name: 'Search conversations' })
    await userEvent.type(search, 'TODAY')
    const rows = view.getAllByTestId('conversation-history__item')
    expect(rows.map((row) => row.textContent?.trim())).toEqual(['Later today', 'Earlier today'])
    expect(view.queryByText('Older one')).toBeNull()
    await userEvent.clear(search)
    await userEvent.type(search, 'zzz')
    expect(view.getByTestId('conversation-history__no-match')).toHaveTextContent(
      'No conversations match “zzz”.'
    )
    expect(view.queryAllByTestId('conversation-history__item')).toHaveLength(0)
    await userEvent.clear(search)
    expect(view.getAllByTestId('conversation-history__item')).toHaveLength(items.length)
  })

  it('moves focus to the next row after a delete', async () => {
    const view = render(ConversationHistory, {
      props: {
        items,
        now,
        removable: true,
        onRemove: (_event: MouseEvent, id: string) =>
          view.rerender({ items: items.filter((item) => item.id !== id), now, removable: true })
      }
    })
    const remove = view.getByRole('button', { name: 'Delete Later today' })
    remove.focus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(document.activeElement?.textContent?.trim()).toBe('Earlier today'))
  })

  describe('reference time from ConfigProvider', () => {
    const groupNames = (view: ReturnType<typeof render>) =>
      within(view.getByRole('navigation', { name: 'Conversation history' }))
        .getAllByRole('list')
        .map((list) =>
          document.getElementById(list.getAttribute('aria-labelledby')!)!.textContent!.trim()
        )

    it('groups against the provider now when the now prop is unset', () => {
      const view = render(ConfigProvider, {
        props: { catalogs: LOCALES, now },
        slots: { default: () => h(ConversationHistory, { items }) }
      })
      expect(groupNames(view)).toEqual([
        'Today',
        'Yesterday',
        'Previous 7 days',
        'Previous 30 days',
        'Older'
      ])
    })

    it('lets the now prop override the provider', () => {
      const view = render(ConfigProvider, {
        props: { catalogs: LOCALES, now: '2027-06-01T12:00:00' },
        slots: { default: () => h(ConversationHistory, { items, now }) }
      })
      expect(groupNames(view)[0]).toBe('Today')
    })
  })

  describe('naming and test ids', () => {
    it('takes its accessible name from ariaLabel, not from the removed label', () => {
      const named = render(ConversationHistory, { props: { items, now, ariaLabel: 'Chats' } })
      expect(named.getByRole('navigation', { name: 'Chats' })).toBeInTheDocument()
      named.unmount()
      const legacy = render(ConversationHistory, {
        props: { items, now, label: 'Old chats' } as never
      })
      expect(legacy.queryByRole('navigation', { name: 'Old chats' })).toBeNull()
    })

    it('lets a consumer data-testid win over the fallback', () => {
      const { getByTestId, queryByTestId } = render(ConversationHistory, {
        props: { items, now },
        attrs: { 'data-testid': 'chats' }
      })
      expect(getByTestId('chats')).toBeInTheDocument()
      expect(queryByTestId('conversation-history')).toBeNull()
    })

    it('keeps every conversation of a large history, newest first in each group', () => {
      const many = Array.from({ length: 300 }, (_, i) => ({
        id: `c${i}`,
        title: `Chat ${i}`,
        updatedAt: new Date(Date.parse('2026-11-11T14:00:00') - i * 60_000).toISOString()
      }))
      const { getAllByTestId } = render(ConversationHistory, { props: { items: many, now } })
      const rows = getAllByTestId('conversation-history__item')
      expect(rows).toHaveLength(300)
      expect(rows[0]!.textContent).toContain('Chat 0')
      expect(rows[299]!.textContent).toContain('Chat 299')
    })

    it('mounts a long group in chunks instead of every row at once', async () => {
      const base = Date.parse('2026-11-11T14:00:00')
      const items = Array.from({ length: 1000 }, (_, i) => ({
        id: `c${i}`,
        title: `Conversation ${i}`,
        updatedAt: base - 40 * 86_400_000 - i * 60_000
      }))
      const { getAllByTestId, container } = render(ConversationHistory, {
        props: { items, now: '2026-11-11T15:00:00' }
      })
      expect(getAllByTestId('conversation-history__item').length).toBeLessThan(1000)
      expect(getAllByTestId('conversation-history__item')[0]).toHaveTextContent('Conversation 0')
      expect(container.querySelector('[data-chunk][aria-hidden="true"]')).not.toBeNull()
      const placeholder = container.querySelector<HTMLElement>('[data-chunk][aria-hidden="true"]')!
      expect(placeholder.style.height).toBe(`${100 * 48}px`)
    })
  })
})
