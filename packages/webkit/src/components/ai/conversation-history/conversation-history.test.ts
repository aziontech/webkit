import userEvent from '@testing-library/user-event'
import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { h } from 'vue'

import Default from '../../../../examples/conversation-history/default.vue'
import Projects from '../../../../examples/conversation-history/projects.vue'
import RichRows from '../../../../examples/conversation-history/rich-rows.vue'
import States from '../../../../examples/conversation-history/states.vue'
import StatusGroups from '../../../../examples/conversation-history/status-groups.vue'
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

  it('names a row in a hover title only when its title is cut off', async () => {
    const style = document.createElement('style')
    style.textContent =
      'nav ul { padding: 0; } nav button { display: block; width: 100%; } bdi { display: block; overflow: hidden; white-space: nowrap; }'
    document.head.appendChild(style)
    const host = document.createElement('div')
    host.style.width = '160px'
    document.body.appendChild(host)
    const long = 'A conversation title far too long to fit the narrow panel'
    const view = render(ConversationHistory, {
      props: {
        items: [
          { id: 'a', title: 'Short', updatedAt: '2026-11-11T10:00:00', projectId: 'p1' },
          { id: 'b', title: long, updatedAt: '2026-11-11T09:00:00' }
        ],
        projects: [{ id: 'p1', title: 'Hi' }],
        openKeys: ['p1'],
        now
      },
      container: host
    })
    const short = view.getByRole('button', { name: 'Short' })
    const cut = view.getByRole('button', { name: long })
    const folder = view.getByRole('button', { name: 'Hi' })
    for (const row of [short, cut, folder]) {
      expect(row).not.toHaveAttribute('title')
      await fireEvent.pointerEnter(row)
    }
    expect(short).not.toHaveAttribute('title')
    expect(folder).not.toHaveAttribute('title')
    expect(cut).toHaveAttribute('title', long)
    host.remove()
    style.remove()
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
      expect(document.getElementById(header.getAttribute('aria-controls')!)).toContainElement(list)
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

  describe('row actions, sections and rich rows', () => {
    const projects = [
      { id: 'p1', title: 'storefront' },
      { id: 'p2', title: 'Acme docs' }
    ]
    const chats = [
      { id: 'a', title: 'Alpha', updatedAt: '2026-11-11T14:00:00', projectId: 'p1' },
      { id: 'b', title: 'Bravo', updatedAt: '2026-11-11T13:00:00', pinned: true },
      { id: 'c', title: 'Charlie', updatedAt: '2026-11-11T12:00:00' },
      { id: 'd', title: 'Delta', updatedAt: '2026-11-10T12:00:00', archived: true }
    ]
    const actions = ['pin', 'rename', 'share', 'lock', 'move', 'archive'] as const

    const openMenu = async (view: ReturnType<typeof render>, name: string) => {
      const more = await waitFor(() => {
        const found = view.getByRole('button', { name })
        expect(found).toHaveAttribute('aria-haspopup', 'menu')
        return found
      })
      await userEvent.click(more)
      return waitFor(() => {
        const menu = document.querySelector<HTMLElement>('[role="menu"]')
        expect(menu?.querySelectorAll('[role="menuitem"]').length).toBeGreaterThan(0)
        return menu!
      })
    }

    it('keeps today’s rows when no new field or prop is given', () => {
      const view = render(ConversationHistory, { props: { items, now, removable: true } })
      expect(view.queryByRole('button', { name: /^More actions/ })).toBeNull()
      expect(view.queryByRole('button', { name: /^Pin / })).toBeNull()
      expect(view.queryByText('Pinned')).toBeNull()
      expect(view.getAllByRole('button', { name: /^Delete / })).toHaveLength(items.length)
      expect(view.getByRole('button', { name: 'Later today' })).not.toHaveAttribute(
        'aria-describedby'
      )
    })

    it('puts pinned chats in a Pinned group on top and hides archived ones by date', () => {
      const view = render(ConversationHistory, { props: { items: chats, now } })
      const pinned = view.getByRole('list', { name: 'Pinned' })
      expect(within(pinned).getByRole('button')).toHaveTextContent('Bravo')
      expect(within(view.getByRole('list', { name: 'Today' })).getAllByRole('button')).toHaveLength(
        2
      )
      expect(view.queryByText('Delta')).toBeNull()
    })

    it('emits every chat action from the More menu with the event and the item', async () => {
      const calls: [string, unknown[]][] = []
      const record =
        (name: string) =>
        (...args: unknown[]) =>
          calls.push([name, args])
      const view = render(ConversationHistory, {
        props: {
          items: chats,
          projects,
          now,
          removable: true,
          itemActions: [...actions],
          onItemPin: record('pin'),
          onItemShare: record('share'),
          onItemLock: record('lock'),
          onItemArchive: record('archive'),
          onRemove: record('remove')
        }
      })
      for (const [label, name] of [
        ['Pin', 'pin'],
        ['Share', 'share'],
        ['Lock', 'lock'],
        ['Archive', 'archive'],
        ['Delete', 'remove']
      ] as const) {
        const menu = await openMenu(view, 'More actions for Charlie')
        await userEvent.click(within(menu).getByRole('menuitem', { name: new RegExp(`^${label}`) }))
        const [event, subject] = calls.at(-1)![1] as [Event, unknown]
        expect(calls.at(-1)![0]).toBe(name)
        expect(event).toBeInstanceOf(Event)
        expect(name === 'remove' ? subject : (subject as { id: string }).id).toBe('c')
      }
      const menu = await openMenu(view, 'More actions for Bravo')
      expect(within(menu).getByRole('menuitem', { name: /^Unpin/ })).toBeTruthy()
      expect(within(menu).getByRole('menuitem', { name: /^Unpin/ })).toHaveTextContent('P')
      await userEvent.keyboard('{Escape}')
    })

    it('runs a shortcut hint only while its menu is open', async () => {
      const pins: string[] = []
      const view = render(ConversationHistory, {
        props: {
          items: chats,
          now,
          itemActions: ['pin', 'archive'],
          onItemPin: (_event: Event, item: { id: string }) => pins.push(item.id)
        }
      })
      await userEvent.keyboard('p')
      expect(pins).toEqual([])
      await openMenu(view, 'More actions for Charlie')
      await userEvent.keyboard('p')
      expect(pins).toEqual(['c'])
    })

    it('pins from the hover button', async () => {
      const view = render(ConversationHistory, {
        props: { items: chats, now, itemActions: ['pin'] }
      })
      await userEvent.click(view.getByRole('button', { name: 'Unpin Bravo' }))
      await userEvent.click(view.getByRole('button', { name: 'Pin Charlie' }))
      const emitted = view.emitted('item-pin') as [Event, { id: string }][]
      expect(emitted.map(([, item]) => item.id)).toEqual(['b', 'c'])
    })

    it('moves a chat to another project from the sub-menu', async () => {
      const view = render(ConversationHistory, {
        props: { items: chats, projects, now, openKeys: ['p1'], itemActions: ['move'] }
      })
      const menu = await openMenu(view, 'More actions for Alpha')
      await userEvent.click(within(menu).getByRole('menuitem', { name: 'Move to project' }))
      const sub = await waitFor(() => {
        const panels = document.querySelectorAll<HTMLElement>('[role="menu"]')
        expect(panels.length).toBe(2)
        return panels[1]!
      })
      const options = within(sub).getAllByRole('menuitem')
      expect(options.map((option) => option.textContent?.trim())).toEqual(['Acme docs'])
      await userEvent.click(options[0]!)
      const [[event, payload]] = view.emitted('item-move') as [
        Event,
        { item: { id: string }; project: { id: string } }
      ][]
      expect(event).toBeInstanceOf(Event)
      expect(payload.item.id).toBe('a')
      expect(payload.project.id).toBe('p2')
    })

    it('renames inline: Enter saves, Escape cancels, focus returns to the row', async () => {
      const view = render(ConversationHistory, {
        props: { items: chats, now, itemActions: ['rename'] }
      })
      let menu = await openMenu(view, 'More actions for Charlie')
      await userEvent.click(within(menu).getByRole('menuitem', { name: /^Rename/ }))
      const field = await waitFor(() => {
        const found = view.getByRole('textbox', { name: 'Rename Charlie' })
        expect(document.activeElement).toBe(found)
        return found
      })
      await userEvent.clear(field)
      await userEvent.type(field, '  Charlie two {Enter}')
      const [[event, payload]] = view.emitted('item-rename') as [
        Event,
        { item: { id: string }; title: string }
      ][]
      expect(event).toBeInstanceOf(KeyboardEvent)
      expect(payload).toEqual({ item: expect.objectContaining({ id: 'c' }), title: 'Charlie two' })
      await waitFor(() => expect(document.activeElement).toHaveAccessibleName('Charlie'))
      menu = await openMenu(view, 'More actions for Charlie')
      await userEvent.click(within(menu).getByRole('menuitem', { name: /^Rename/ }))
      await waitFor(() =>
        expect(document.activeElement).toBe(view.getByRole('textbox', { name: 'Rename Charlie' }))
      )
      await userEvent.keyboard('X{Escape}')
      expect(view.emitted('item-rename')).toHaveLength(1)
      await waitFor(() => expect(document.activeElement).toHaveAccessibleName('Charlie'))
    })

    it('emits the project actions', async () => {
      const view = render(ConversationHistory, {
        props: {
          items: chats,
          projects,
          now,
          projectActions: ['pin', 'settings', 'remove', 'chat-create']
        }
      })
      await userEvent.click(view.getByRole('button', { name: 'New chat in storefront' }))
      expect((view.emitted('project-chat-create') as [Event, { id: string }][])[0]![1].id).toBe(
        'p1'
      )
      for (const [label, name] of [
        ['Pin project', 'project-pin'],
        ['Project settings', 'project-settings-open'],
        ['Delete project', 'project-remove']
      ] as const) {
        const menu = await openMenu(view, 'More actions for Acme docs')
        await userEvent.click(within(menu).getByRole('menuitem', { name: label }))
        const [[event, project]] = view.emitted(name) as [Event, { id: string }][]
        expect(event).toBeInstanceOf(Event)
        expect(project.id).toBe('p2')
      }
    })

    it('lists pinned projects first', () => {
      const view = render(ConversationHistory, {
        props: {
          items: chats,
          projects: [projects[0]!, { ...projects[1]!, pinned: true }],
          now
        }
      })
      expect(
        view.getAllByTestId('conversation-history__project').map((b) => b.textContent!.trim())
      ).toEqual(['Acme docs', 'storefront'])
    })

    it('collapses Recents through v-model:openSectionKeys', async () => {
      const view = render(ConversationHistory, { props: { items: chats, projects, now } })
      const recents = view.getByRole('button', { name: 'Recents' })
      expect(recents).toHaveAttribute('aria-expanded', 'true')
      expect(view.getByText('Charlie')).toBeTruthy()
      await userEvent.click(recents)
      expect(view.emitted('update:openSectionKeys')![0]).toEqual([['working']])
      expect(recents).toHaveAttribute('aria-expanded', 'false')
      expect(view.queryByText('Charlie')).toBeNull()
    })

    it('renders a rich row: tag, description, age, lock and status describe the button', () => {
      const view = render(ConversationHistory, {
        props: {
          now,
          showTime: true,
          items: [
            {
              id: 'r',
              title: 'Rich',
              updatedAt: '2026-11-11T14:50:00',
              tag: 'Bug',
              description: 'fix/branch',
              status: 'running',
              locked: true
            },
            { id: 'e', title: 'Failed one', updatedAt: '2026-11-11T00:00:00', status: 'error' }
          ]
        }
      })
      const rich = view.getByRole('button', { name: 'Rich' })
      expect(rich).toHaveAttribute('data-description')
      expect(rich).toHaveAccessibleDescription('Bug fix/branch Locked Working 10m')
      expect(view.getByRole('button', { name: 'Failed one' })).toHaveAccessibleDescription(
        'Failed 15h'
      )
      expect(rich.querySelector('time')).toHaveAttribute(
        'datetime',
        new Date('2026-11-11T14:50:00').toISOString()
      )
    })

    it('composes a row through the item and item-meta slots', () => {
      const view = render(ConversationHistory, {
        props: { items: chats.slice(2, 3), now },
        slots: {
          item: ({ item }: { item: { title: string } }) => h('strong', `Custom ${item.title}`),
          'item-meta': () => h('span', 'meta')
        }
      })
      const row = view.getByRole('button', { name: 'Custom Charlie' })
      expect(row).toHaveAccessibleDescription('meta')
      expect(row.querySelector('strong')).toHaveTextContent('Custom Charlie')
    })

    it('groups by status: Working first with its count, Settled collapsed with archived chats', async () => {
      const view = render(StatusGroups)
      const working = view.getByRole('button', { name: 'Working 2' })
      const settled = view.getByRole('button', { name: 'Settled 3' })
      expect(working).toHaveAttribute('aria-expanded', 'true')
      expect(settled).toHaveAttribute('aria-expanded', 'false')
      expect(
        within(view.getByRole('list', { name: 'Working 2' }))
          .getAllByRole('button')
          .map((b) => b.getAttribute('aria-current') ?? '')
      ).toEqual(['page', ''])
      expect(view.queryByText('Draft the docs-site navigation')).toBeNull()
      await userEvent.click(settled)
      expect(view.getByText('Draft the docs-site navigation')).toBeTruthy()
      expect(
        within(view.getByRole('list', { name: 'Settled 3' })).getAllByRole('button')
      ).toHaveLength(3)
      await expectNoA11yViolations(view.container)
    })

    it('emits search-open from the toolbar and moves New chat and New project into it', async () => {
      const opened: Event[] = []
      const view = render(ConversationHistory, {
        props: {
          items,
          now,
          projects,
          showToolbar: true,
          creatable: true,
          projectCreatable: true,
          'onSearch-open': (event: Event) => opened.push(event)
        }
      })
      const toolbar = await view.findByTestId('conversation-history__toolbar')
      await userEvent.click(within(toolbar).getByRole('button', { name: /Search chats/ }))
      expect(opened[0]).toBeInstanceOf(MouseEvent)
      expect(view.getAllByRole('button', { name: 'New chat' })).toHaveLength(1)
      expect(view.getAllByRole('button', { name: 'New project' })).toHaveLength(1)
      await userEvent.click(within(toolbar).getByRole('button', { name: 'New project' }))
      expect(view.emitted('project-create')).toHaveLength(1)
    })

    it('reads the new strings from the locale catalog', async () => {
      const view = render(ConfigProvider, {
        props: { locale: 'es', catalogs: LOCALES },
        slots: {
          default: () =>
            h(ConversationHistory, {
              items: chats,
              now,
              itemActions: ['pin'],
              groupBy: 'status'
            })
        }
      })
      expect(view.getByText('Fijados')).toBeTruthy()
      expect(view.getByRole('button', { name: /^Finalizados/ })).toBeTruthy()
      expect(view.getByRole('button', { name: 'Dejar de fijar Bravo' })).toBeTruthy()
    })

    it('renders the RichRows example with no axe violations', async () => {
      const view = render(RichRows)
      await waitFor(() =>
        expect(
          view.getByRole('button', { name: 'More actions for Purge the cache after a deploy' })
        ).toHaveAttribute('aria-haspopup', 'menu')
      )
      await expectNoA11yViolations(view.container)
      const menu = await openMenu(view, 'More actions for Purge the cache after a deploy')
      await userEvent.click(within(menu).getByRole('menuitem', { name: 'Delete' }))
      await waitFor(() => expect(view.queryByText('Purge the cache after a deploy')).toBeNull())
      await userEvent.click(view.getByRole('button', { name: 'Undo' }))
      expect(view.getByText('Purge the cache after a deploy')).toBeTruthy()
    })
  })
})
