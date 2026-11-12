import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import CommandGroup from '../../overlay/command/command-group/command-group.vue'
import CommandItem from '../../overlay/command/command-item/command-item.vue'
import { useConsoleLayout } from './composables/use-console-layout'
import ConsoleLayout, { type ConsoleLayoutNavGroup } from './console-layout.vue'

const navigation: ConsoleLayoutNavGroup[] = [
  {
    items: [
      { id: 'home', label: 'Home', icon: 'pi pi-home', to: '/' },
      { id: 'workloads', label: 'Workloads', icon: 'pi pi-box', to: '/workloads' }
    ]
  },
  {
    label: 'Security',
    items: [{ id: 'firewall', label: 'Firewall', href: '/firewall', tagValue: 'Preview' }]
  },
  {
    label: 'More',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        kind: 'drill',
        groups: [
          {
            label: 'Settings',
            items: [
              { id: 'settings-general', label: 'General', to: '/account' },
              { id: 'settings-users', label: 'Users management', to: '/account/users' }
            ]
          }
        ]
      }
    ]
  }
]

const fakeRouter = (path: string) => ({
  push: vi.fn(),
  resolve: (to: string | Record<string, unknown>) => ({
    href: typeof to === 'string' ? to : '/resolved'
  }),
  currentRoute: ref({ path })
})

const mount = (
  props: Record<string, unknown> = {},
  options: { router?: ReturnType<typeof fakeRouter>; width?: number; dir?: string } = {},
  slots: Record<string, unknown> = {}
) => {
  const { router, width = 1200, dir = 'ltr' } = options
  return render(
    defineComponent({
      render: () =>
        h('div', { style: { width: `${width}px` }, dir }, [
          h(
            ConsoleLayout,
            { navigation, ...props },
            { default: () => h('h1', 'Workloads page'), ...slots }
          )
        ])
    }),
    router ? { global: { config: { globalProperties: { $router: router } } } } : {}
  )
}

describe('ConsoleLayout', () => {
  it('renders the chrome around one main landmark holding the page body', () => {
    const { getByTestId, getAllByRole, getByText } = mount()
    expect(getByTestId('layout-console-layout')).toBeTruthy()
    const mains = getAllByRole('main')
    expect(mains).toHaveLength(1)
    expect(within(mains[0]!).getByText('Workloads page')).toBeTruthy()
    expect(getByText('Workloads')).toBeTruthy()
    expect(getByText('Preview')).toBeTruthy()
  })

  it('lets a consumer override data-testid', () => {
    const { getByTestId } = mount({ 'data-testid': 'console' })
    expect(getByTestId('console')).toBeTruthy()
  })

  it('marks the row matching the current route as the current page', () => {
    const router = fakeRouter('/workloads/42')
    const { getByRole } = mount({}, { router })
    expect(getByRole('link', { name: 'Workloads' }).getAttribute('aria-current')).toBe('page')
    expect(getByRole('link', { name: 'Home' }).getAttribute('aria-current')).toBeNull()
  })

  it('prefers an explicit activeId over the route', () => {
    const router = fakeRouter('/workloads')
    const { getByRole } = mount({ activeId: 'firewall' }, { router })
    expect(getByRole('link', { name: /Firewall/ }).getAttribute('aria-current')).toBe('page')
  })

  it('opens the drill level that holds the current row', async () => {
    const router = fakeRouter('/account/users')
    const { findByRole } = mount({}, { router })
    const row = await findByRole('link', { name: 'Users management' })
    expect(row.getAttribute('aria-current')).toBe('page')
  })

  it('follows a `to` row with the router and emits navigate with the row', async () => {
    const router = fakeRouter('/')
    const onNavigate = vi.fn()
    const { getByRole } = mount({ onNavigate }, { router })
    await userEvent.click(getByRole('link', { name: 'Workloads' }))
    expect(onNavigate).toHaveBeenCalledTimes(1)
    const [event, item] = onNavigate.mock.calls[0]!
    expect(event).toBeInstanceOf(MouseEvent)
    expect(item.id).toBe('workloads')
    expect(router.push).toHaveBeenCalledWith('/workloads')
  })

  it('leaves a row with no destination to the navigate handler', async () => {
    const router = fakeRouter('/')
    const onNavigate = vi.fn()
    const { getByRole } = mount(
      { onNavigate, navigation: [{ items: [{ id: 'agent', label: 'Agent' }] }] },
      { router }
    )
    await userEvent.click(getByRole('button', { name: 'Agent' }))
    expect(onNavigate.mock.calls[0]![1].id).toBe('agent')
    expect(router.push).not.toHaveBeenCalled()
  })

  it('renders `to` rows as anchors with the resolved address', () => {
    const { getByRole } = mount()
    expect(getByRole('link', { name: 'Workloads' }).getAttribute('href')).toBe('/workloads')
    expect(getByRole('link', { name: /Firewall/ }).getAttribute('href')).toBe('/firewall')
  })

  it('shows the breadcrumbs and follows a crumb route with the router', async () => {
    const router = fakeRouter('/workloads/42')
    const { getByRole } = mount(
      { breadcrumbs: [{ label: 'Workloads', to: '/workloads' }, { label: 'edge-app' }] },
      { router }
    )
    const header = within(getByRole('banner'))
    expect(header.getByText('edge-app')).toBeTruthy()
    await fireEvent.click(header.getByRole('link', { name: 'Workloads' }))
    expect(router.push).toHaveBeenCalledWith('/workloads')
  })

  it('opens the palette from the header search with every navigation page', async () => {
    const onOpen = vi.fn()
    const { getByRole } = mount({ 'onUpdate:searchOpen': onOpen })
    await userEvent.click(within(getByRole('banner')).getByRole('button', { name: /search/i }))
    expect(onOpen).toHaveBeenCalledWith(true)
    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    const palette = within(dialog)
    expect(palette.getByText('Workloads')).toBeTruthy()
    expect(palette.getByText('Users management')).toBeTruthy()
    expect(palette.getByRole('combobox').getAttribute('placeholder')).toBe(
      'Search pages and commands'
    )
  })

  it('navigates to a palette page and reports other palette items as search-select', async () => {
    const router = fakeRouter('/')
    const onNavigate = vi.fn()
    const onSearchSelect = vi.fn()
    const { getByRole } = mount(
      { onNavigate, 'onSearch-select': onSearchSelect, searchOpen: true },
      { router },
      {
        search: ({ query }: { query: string }) =>
          query
            ? null
            : h(CommandGroup, { heading: 'Recents' }, () =>
                h(CommandItem, { value: 'recent:edge-app' }, () => 'edge-app')
              )
      }
    )
    expect(getByRole('main')).toBeTruthy()
    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    await userEvent.click(within(dialog).getByText('edge-app'))
    expect(onSearchSelect).toHaveBeenCalledTimes(1)
    expect(onSearchSelect.mock.calls[0]![1]).toBe('recent:edge-app')
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('follows a palette page with the router', async () => {
    const router = fakeRouter('/')
    const onNavigate = vi.fn()
    mount({ onNavigate, searchOpen: true }, { router })
    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    await userEvent.click(within(dialog).getByText('Users management'))
    expect(onNavigate.mock.calls[0]![1].id).toBe('settings-users')
    expect(router.push).toHaveBeenCalledWith('/account/users')
  })

  it('lets a page open the palette through useConsoleLayout', async () => {
    const Page = defineComponent({
      setup() {
        const { openSearch } = useConsoleLayout()
        return () => h('button', { type: 'button', onClick: openSearch }, 'Find a workload')
      }
    })
    const { getByRole } = mount({}, {}, { default: () => h(Page) })
    await userEvent.click(getByRole('button', { name: 'Find a workload' }))
    expect(await waitFor(() => within(document.body).getByRole('dialog'))).toBeTruthy()
  })

  it('throws when useConsoleLayout is used outside the layout', () => {
    const Loose = defineComponent({
      setup() {
        useConsoleLayout()
        return () => null
      }
    })
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => render(Loose)).toThrow(/within <ConsoleLayout>/)
    spy.mockRestore()
  })

  it('shows the account and opens the account menu from the header avatar', async () => {
    const { getByRole, getByText } = mount(
      { account: { name: 'Ana Souza', email: 'ana@example.com' } },
      {},
      { 'account-menu': () => h('p', 'Account settings') }
    )
    expect(getByText('Ana Souza')).toBeTruthy()
    const trigger = within(getByRole('banner')).getByRole('button', { name: 'Account menu' })
    await userEvent.click(trigger)
    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'))
    expect(within(document.body).getAllByText('Account settings').length).toBeGreaterThan(0)
  })

  it('renders the actions slot with the compact flag', () => {
    const { getByRole } = mount(
      {},
      {},
      {
        actions: ({ compact }: { compact: boolean }) =>
          h('button', { type: 'button' }, compact ? 'New' : 'Create')
      }
    )
    expect(within(getByRole('banner')).getByRole('button', { name: 'Create' })).toBeTruthy()
  })

  it('swaps the breadcrumbs for the hamburger and the brand on a narrow layout', async () => {
    const { getByRole } = mount(
      { breadcrumbs: [{ label: 'Workloads' }] },
      { width: 480 },
      {
        actions: ({ compact }: { compact: boolean }) =>
          h('button', { type: 'button' }, compact ? 'New' : 'Create')
      }
    )
    const header = within(getByRole('banner'))
    await waitFor(() =>
      expect(header.getByRole('button', { name: 'Open navigation' })).toBeTruthy()
    )
    expect(header.getByRole('link', { name: 'Azion home' })).toBeTruthy()
    expect(header.queryByText('Workloads')).toBeNull()
    expect(header.getByRole('button', { name: 'New' })).toBeTruthy()
  })

  it('renders a header-start switcher and a composed breadcrumb trail', () => {
    const { getByRole } = mount(
      { breadcrumbs: [{ label: 'Ignored' }] },
      {},
      {
        'header-start': () => h('button', { type: 'button' }, 'Switch account'),
        breadcrumbs: () => h('span', 'Composed trail')
      }
    )
    const header = within(getByRole('banner'))
    expect(header.getByRole('button', { name: 'Switch account' })).toBeTruthy()
    expect(header.getByText('Composed trail')).toBeTruthy()
    expect(header.queryByText('Ignored')).toBeNull()
  })

  it('shows flash notifications and toggles the tools region from an action', async () => {
    const onTools = vi.fn()
    const { getByRole, getByText } = mount(
      { toolsLabel: 'Notifications', 'onUpdate:toolsOpen': onTools },
      {},
      {
        notifications: () => h('div', { role: 'status' }, 'Deploy failed'),
        actions: ({ toggleTools }: { toggleTools: () => void }) =>
          h('button', { type: 'button', onClick: toggleTools }, 'Bell'),
        tools: () => h('p', 'You are all caught up')
      }
    )
    expect(getByRole('status').textContent).toContain('Deploy failed')
    await userEvent.click(within(getByRole('banner')).getByRole('button', { name: 'Bell' }))
    expect(onTools).toHaveBeenCalledWith(true)
    await waitFor(() => expect(getByText('You are all caught up')).toBeTruthy())
    expect(getByRole('region', { name: 'Notifications' })).toBeTruthy()
  })

  it('has no axe violations', async () => {
    const { container } = mount({
      breadcrumbs: [{ label: 'Workloads', href: '/workloads' }, { label: 'edge-app' }],
      account: { name: 'Ana Souza' }
    })
    await expectNoA11yViolations(container)
  })

  it('renders right-to-left without violations', async () => {
    const { container, getByRole } = mount({}, { dir: 'rtl' })
    expect(getByRole('main')).toBeTruthy()
    await expectNoA11yViolations(container)
  })
})
