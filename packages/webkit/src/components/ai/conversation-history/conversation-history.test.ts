import userEvent from '@testing-library/user-event'
import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { h } from 'vue'

import Default from '../../../../examples/conversation-history/default.vue'
import Projects from '../../../../examples/conversation-history/projects.vue'
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
    })
  })
  describe('projects', () => {
    const projects = [
      { id: 'p1', title: 'storefront' },
      { id: 'p2', title: 'Acme docs' },
      { id: 'p3', title: 'Billing' }
    ]
    const filed = [
      ...items,
      {
        id: 'g',
        title: 'Storefront 502 errors',
        updatedAt: '2026-11-11T13:00:00',
        projectId: 'p1'
      },
      { id: 'h', title: 'Storefront cache', updatedAt: '2026-11-08T10:00:00', projectId: 'p1' },
      { id: 'i', title: 'Docs redirects', updatedAt: '2026-11-11T14:00:00', projectId: 'p2' },
      { id: 'j', title: 'Orphan chat', updatedAt: '2026-11-11T11:00:00', projectId: 'gone' }
    ]
    const projectNames = (view: ReturnType<typeof render>) =>
      view.getAllByTestId('conversation-history__project').map((b) => b.textContent!.trim())

    it('lists projects above Recents and keeps project chats out of the date groups', () => {
      const view = render(ConversationHistory, {
        props: { items: filed, projects, now, openKeys: ['p1', 'p3'] }
      })
      const header = view.getByRole('button', { name: 'Projects' })
      expect(header).toHaveAttribute('aria-expanded', 'true')
      const list = view.getByRole('list', { name: 'Projects' })
      expect(header).toHaveAttribute('aria-controls', list.id)
      const storefront = view.getByRole('button', { name: 'storefront' })
      expect(storefront).toHaveAttribute('aria-expanded', 'true')
      const chats = view.getByRole('list', { name: 'storefront' })
      expect(
        within(chats)
          .getAllByRole('button')
          .map((b) => b.textContent!.trim())
      ).toEqual(['Storefront 502 errors', 'Storefront cache'])
      expect(view.getByRole('button', { name: 'Acme docs' })).toHaveAttribute(
        'aria-expanded',
        'false'
      )
      expect(view.queryByText('Docs redirects')).toBeNull()
      expect(view.getByTestId('conversation-history__recents')).toHaveTextContent('Recents')
      const today = view.getByRole('list', { name: 'Today' })
      const titles = within(today)
        .getAllByRole('button')
        .map((b) => b.textContent!.trim())
      expect(titles).toEqual(['Later today', 'Orphan chat', 'Earlier today'])
      expect(
        within(view.getByRole('list', { name: 'Billing' })).getByRole('listitem')
      ).toHaveTextContent('No chats in this project yet.')
    })

    it('expands and collapses projects and the section through their models', async () => {
      const view = render(ConversationHistory, { props: { items: filed, projects, now } })
      await userEvent.click(view.getByRole('button', { name: 'Acme docs' }))
      expect(view.emitted('update:openKeys')![0]).toEqual([['p2']])
      expect(view.getByText('Docs redirects')).toBeTruthy()
      await userEvent.click(view.getByRole('button', { name: 'Docs redirects' }))
      expect(view.emitted('update:modelValue')![0]).toEqual(['i'])
      await userEvent.click(view.getByRole('button', { name: 'Acme docs' }))
      expect(view.emitted('update:openKeys')![1]).toEqual([[]])
      expect(view.queryByText('Docs redirects')).toBeNull()
      await userEvent.click(view.getByRole('button', { name: 'Projects' }))
      expect(view.emitted('update:projectsOpen')![0]).toEqual([false])
      expect(view.getByRole('button', { name: 'Projects' })).toHaveAttribute(
        'aria-expanded',
        'false'
      )
      expect(view.queryByRole('button', { name: 'storefront' })).toBeNull()
    })

    it('sorts projects by recent activity or by name from the Organize menu', async () => {
      const view = render(ConversationHistory, { props: { items: filed, projects, now } })
      expect(projectNames(view)).toEqual(['Acme docs', 'storefront', 'Billing'])
      const organize = await waitFor(() => {
        const found = view.getByRole('button', { name: 'Organize projects' })
        expect(found).toHaveAttribute('aria-haspopup', 'menu')
        return found
      })
      await userEvent.click(organize)
      const name = await waitFor(() => {
        const found = document.querySelector<HTMLElement>(
          '[role="menuitemradio"][aria-checked="false"]'
        )
        expect(found).toBeTruthy()
        return found!
      })
      expect(
        document.querySelector('[role="menuitemradio"][aria-checked="true"]')
      ).toHaveTextContent('Recent activity')
      expect(name).toHaveTextContent('Name')
      await userEvent.click(name)
      expect(view.emitted('update:projectSort')![0]).toEqual(['name'])
      await view.rerender({ items: filed, projects, now, projectSort: 'name' })
      expect(projectNames(view)).toEqual(['Acme docs', 'Billing', 'storefront'])
    })

    it('emits project-create with the click and shows the section with no projects yet', async () => {
      const calls: MouseEvent[] = []
      const view = render(ConversationHistory, {
        props: {
          items,
          now,
          projectCreatable: true,
          'onProject-create': (event: MouseEvent) => calls.push(event)
        }
      })
      expect(view.getByRole('button', { name: 'Projects' })).toBeTruthy()
      expect(view.queryByRole('button', { name: 'Organize projects' })).toBeNull()
      await userEvent.click(view.getByRole('button', { name: 'New project' }))
      expect(calls).toHaveLength(1)
      expect(calls[0]).toBeInstanceOf(MouseEvent)
    })

    it('searches across projects and Recents without changing the models', async () => {
      const view = render(ConversationHistory, {
        props: { items: filed, projects, now, searchable: true, projectsOpen: false }
      })
      await userEvent.type(view.getByRole('searchbox'), 'storefront')
      expect(projectNames(view)).toEqual(['storefront'])
      expect(view.getByRole('button', { name: 'storefront' })).toHaveAttribute(
        'aria-expanded',
        'true'
      )
      expect(
        view.getAllByTestId('conversation-history__item').map((row) => row.textContent?.trim())
      ).toEqual(['Storefront 502 errors', 'Storefront cache'])
      expect(view.queryByTestId('conversation-history__recents')).toBeNull()
      await userEvent.clear(view.getByRole('searchbox'))
      await userEvent.type(view.getByRole('searchbox'), 'today')
      expect(view.queryByRole('button', { name: 'Projects' })).toBeNull()
      expect(view.getAllByTestId('conversation-history__item')).toHaveLength(2)
      expect(view.emitted('update:openKeys')).toBeUndefined()
      expect(view.emitted('update:projectsOpen')).toBeUndefined()
    })

    it('renders no project parts without projects', () => {
      const view = render(ConversationHistory, { props: { items: filed, now } })
      expect(view.queryByRole('button', { name: 'Projects' })).toBeNull()
      expect(view.queryByTestId('conversation-history__recents')).toBeNull()
      expect(view.getAllByTestId('conversation-history__item')).toHaveLength(filed.length)
    })

    it('reads the project strings from the locale catalog', () => {
      const view = render(ConfigProvider, {
        props: { locale: 'pt-BR', catalogs: LOCALES },
        slots: {
          default: () =>
            h(ConversationHistory, { items: filed, projects, now, projectCreatable: true })
        }
      })
      expect(view.getByRole('button', { name: 'Projetos' })).toBeTruthy()
      expect(view.getByRole('button', { name: 'Novo projeto' })).toBeTruthy()
      expect(view.getByRole('button', { name: 'Organizar projetos' })).toBeTruthy()
      expect(view.getByText('Recentes')).toBeTruthy()
    })

    it('renders the Projects example with no axe violations', async () => {
      const view = render(Projects)
      expect(view.getByRole('button', { name: 'storefront' })).toHaveAttribute(
        'aria-expanded',
        'true'
      )
      await expectNoA11yViolations(view.container)
    })
  })
})
