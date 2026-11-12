import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, KeepAlive, nextTick, onMounted, ref } from 'vue'
import { renderToString, type SSRContext } from 'vue/server-renderer'

import FillPageExample from '../../../../examples/console-layout/fill-page.vue'
import NavigationExpandedExample from '../../../../examples/console-layout/navigation-expanded.vue'
import PageBreadcrumbsExample from '../../../../examples/console-layout/page-breadcrumbs.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import CommandGroup from '../../overlay/command/command-group/command-group.vue'
import CommandItem from '../../overlay/command/command-item/command-item.vue'
import { useConsoleLayout } from './composables/use-console-layout'
import ConsoleLayout, { type ConsoleLayoutNavGroup } from './console-layout.vue'
import ConsoleLayoutBreadcrumbs from './console-layout-breadcrumbs/console-layout-breadcrumbs.vue'
import ConsoleLayoutCompound from './index'

const navigation: ConsoleLayoutNavGroup[] = [
  {
    items: [
      { id: 'home', label: 'Home', icon: 'pi pi-home', href: '/' },
      { id: 'workloads', label: 'Workloads', icon: 'pi pi-box', href: '/workloads' }
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
              { id: 'settings-general', label: 'General', href: '/account' },
              { id: 'settings-users', label: 'Users management', href: '/account/users' }
            ]
          }
        ]
      }
    ]
  }
]

const fakeRouter = (path: string) => ({
  push: vi.fn(),
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

  it('follows an in-app row with the router and emits navigate with the row', async () => {
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

  it('leaves a modified click on a route row to the browser', async () => {
    const router = fakeRouter('/')
    const { getByRole } = mount({}, { router })
    await fireEvent.click(getByRole('link', { name: 'Workloads' }), { ctrlKey: true })
    expect(router.push).not.toHaveBeenCalled()
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

  it('renders rows as anchors to their href', () => {
    const { getByRole } = mount()
    expect(getByRole('link', { name: 'Workloads' }).getAttribute('href')).toBe('/workloads')
    expect(getByRole('link', { name: /Firewall/ }).getAttribute('href')).toBe('/firewall')
  })

  it('follows an external row the browser way, not with the router', async () => {
    const router = fakeRouter('/')
    const { getByRole } = mount(
      {
        navigation: [
          {
            items: [{ id: 'docs', label: 'Docs', href: 'https://www.azion.com/en/documentation/' }]
          }
        ]
      },
      { router }
    )
    await fireEvent.click(getByRole('link', { name: 'Docs' }))
    expect(router.push).not.toHaveBeenCalled()
  })

  it('shows the breadcrumbs and follows a crumb route with the router', async () => {
    const router = fakeRouter('/workloads/42')
    const { getByRole } = mount(
      { breadcrumbs: [{ label: 'Workloads', href: '/workloads' }, { label: 'edge-app' }] },
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

  it('returns null outside the layout with the optional form', () => {
    let seen: unknown = 'unset'
    const Loose = defineComponent({
      setup() {
        seen = useConsoleLayout({ optional: true })
        return () => h('p', 'Standalone body')
      }
    })
    const { getByText } = render(Loose)
    expect(getByText('Standalone body')).toBeTruthy()
    expect(seen).toBeNull()
  })

  it('opens the palette through the optional form inside the layout', async () => {
    const Page = defineComponent({
      setup() {
        const layout = useConsoleLayout({ optional: true })
        return () =>
          h('button', { type: 'button', onClick: () => layout?.openSearch() }, 'Find a workload')
      }
    })
    const { getByRole } = mount({}, {}, { default: () => h(Page) })
    await userEvent.click(getByRole('button', { name: 'Find a workload' }))
    expect(await waitFor(() => within(document.body).getByRole('dialog'))).toBeTruthy()
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

describe('ConsoleLayout — page entrance on route change', () => {
  const countingPage = () => {
    const mounts = { count: 0 }
    const Page = defineComponent({
      setup() {
        onMounted(() => {
          mounts.count += 1
        })
        return () => h('h1', 'Page body')
      }
    })
    return { mounts, Page }
  }

  it('remounts the main landmark and the page body when the route path changes', async () => {
    const router = fakeRouter('/workloads')
    const { mounts, Page } = countingPage()
    const { getByRole } = mount({}, { router }, { default: () => h(Page) })
    const first = getByRole('main')
    expect(mounts.count).toBe(1)
    router.currentRoute.value = { path: '/firewall' }
    await nextTick()
    await nextTick()
    const second = getByRole('main')
    expect(second).not.toBe(first)
    expect(first.isConnected).toBe(false)
    expect(mounts.count).toBe(2)
    expect(within(second).getByText('Page body')).toBeTruthy()
  })

  it('keeps the page body while the route path stays the same', async () => {
    const router = fakeRouter('/workloads')
    const { mounts, Page } = countingPage()
    const { getByRole } = mount({}, { router }, { default: () => h(Page) })
    const first = getByRole('main')
    router.currentRoute.value = { path: '/workloads' }
    await nextTick()
    await nextTick()
    expect(getByRole('main')).toBe(first)
    expect(mounts.count).toBe(1)
  })

  it('mounts the page body once without a router, then remounts it on popstate', async () => {
    const original = `${location.pathname}${location.search}${location.hash}`
    const { mounts, Page } = countingPage()
    try {
      const { getByRole } = mount({}, {}, { default: () => h(Page) })
      await nextTick()
      await nextTick()
      const first = getByRole('main')
      expect(mounts.count).toBe(1)
      history.replaceState(history.state, '', '/console-layout-route-change')
      dispatchEvent(new PopStateEvent('popstate'))
      await waitFor(() => expect(mounts.count).toBe(2))
      expect(getByRole('main')).not.toBe(first)
    } finally {
      history.replaceState(history.state, '', original)
    }
  })
})

describe('ConsoleLayout — navigation rail state', () => {
  const rail = (view: ReturnType<typeof render>) =>
    view.getByTestId('layout-console-layout__navigation')

  it('renders the rail expanded by default', () => {
    const view = mount()
    expect(rail(view).hasAttribute('data-collapsed')).toBe(false)
  })

  it('collapses the rail when navigationExpanded is false', () => {
    const view = mount({ navigationExpanded: false })
    expect(rail(view).hasAttribute('data-collapsed')).toBe(true)
  })

  it('emits update:navigationExpanded when the rail collapses itself', async () => {
    const onExpanded = vi.fn()
    const view = mount({ 'onUpdate:navigationExpanded': onExpanded })
    await userEvent.click(view.getByRole('button', { name: 'Collapse sidebar' }))
    expect(onExpanded).toHaveBeenCalledWith(false)
    await waitFor(() => expect(rail(view).hasAttribute('data-collapsed')).toBe(true))
  })

  it('folds and restores the rail from the palette in the NavigationExpanded example', async () => {
    const view = render(
      defineComponent({
        render: () => h('div', { style: { width: '1200px' } }, [h(NavigationExpandedExample)])
      })
    )
    await waitFor(() => rail(view))
    expect(rail(view).hasAttribute('data-collapsed')).toBe(false)

    await userEvent.click(
      within(view.getByTestId('layout-console-layout__header')).getByRole('button', {
        name: /search/i
      })
    )
    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    await userEvent.click(within(dialog).getByText('Collapse sidebar'))
    await waitFor(() => expect(rail(view).hasAttribute('data-collapsed')).toBe(true))

    await userEvent.click(
      within(view.getByTestId('layout-console-layout__header')).getByRole('button', {
        name: /search/i
      })
    )
    const reopened = await waitFor(() => within(document.body).getByRole('dialog'))
    await userEvent.click(within(reopened).getByText('Expand sidebar'))
    await waitFor(() => expect(rail(view).hasAttribute('data-collapsed')).toBe(false))
  })
})

describe('ConsoleLayout — page trail', () => {
  const pageTrail = (control?: () => unknown) =>
    h(
      ConsoleLayoutBreadcrumbs,
      {
        items: [
          { label: 'Applications', href: '/applications' },
          { label: 'azion-site', href: '/applications/azion-site' }
        ]
      },
      control ? { default: control } : undefined
    )

  it('attaches Breadcrumbs to the compound root', () => {
    expect(ConsoleLayoutCompound.Breadcrumbs).toBe(ConsoleLayoutBreadcrumbs)
  })

  it('replaces the layout trail with the page trail and ends on its control crumb', async () => {
    const { getByRole, getByTestId } = mount(
      { breadcrumbs: [{ label: 'Layout crumb' }] },
      {},
      {
        default: () => [
          pageTrail(() =>
            h('button', { type: 'button', 'aria-label': 'Switch environment' }, 'Production')
          ),
          h('h1', 'Application page')
        ]
      }
    )
    const header = within(getByRole('banner'))
    await waitFor(() => expect(header.getByRole('link', { name: 'azion-site' })).toBeTruthy())
    expect(header.queryByText('Layout crumb')).toBeNull()
    const trail = header.getByRole('navigation', { name: 'Breadcrumb' })
    const crumbs = within(trail).getAllByRole('listitem')
    expect(crumbs).toHaveLength(3)
    expect(
      within(crumbs[2]!).getByRole('button', { name: 'Switch environment' })
    ).toBeTruthy()
    expect(within(getByTestId('layout-console-layout__main')).queryByText('Production')).toBeNull()
  })

  it('gives each top-level control its own crumb', async () => {
    const { getByRole } = mount({}, {}, {
      default: () =>
        pageTrail(() => [
          h('button', { type: 'button' }, 'Production'),
          h('button', { type: 'button' }, 'Version 3')
        ])
    })
    const header = within(getByRole('banner'))
    await waitFor(() => expect(header.getByRole('button', { name: 'Version 3' })).toBeTruthy())
    const crumbs = within(header.getByRole('navigation', { name: 'Breadcrumb' })).getAllByRole(
      'listitem'
    )
    expect(crumbs.map((crumb) => crumb.textContent?.trim())).toEqual([
      'Applications',
      'azion-site',
      'Production',
      'Version 3'
    ])
  })

  it('renders data-only page crumbs with the last one as the current page', async () => {
    const { getByRole } = mount({ breadcrumbs: [{ label: 'Layout crumb' }] }, {}, {
      default: () => pageTrail()
    })
    const header = within(getByRole('banner'))
    await waitFor(() => expect(header.getByText('azion-site')).toBeTruthy())
    expect(header.queryByText('Layout crumb')).toBeNull()
    expect(header.getByText('azion-site').closest('[aria-current="page"]')).toBeTruthy()
  })

  it('keeps the page reactivity in the control crumb', async () => {
    const count = ref(0)
    const { getByRole } = mount({}, {}, {
      default: () =>
        pageTrail(() =>
          h('button', { type: 'button', onClick: () => count.value++ }, `Version ${count.value}`)
        )
    })
    const header = within(getByRole('banner'))
    const control = await waitFor(() => header.getByRole('button', { name: 'Version 0' }))
    await userEvent.click(control)
    await waitFor(() => expect(header.getByRole('button', { name: 'Version 1' })).toBeTruthy())
  })

  it('follows a page crumb with the router', async () => {
    const router = fakeRouter('/applications/azion-site')
    const { getByRole } = mount({}, { router }, {
      default: () => pageTrail(() => h('span', 'Production'))
    })
    const header = within(getByRole('banner'))
    await fireEvent.click(await waitFor(() => header.getByRole('link', { name: 'Applications' })))
    expect(router.push).toHaveBeenCalledWith('/applications')
  })

  it('restores the layout trail when the page unmounts', async () => {
    const shown = ref(true)
    const { getByRole } = mount({ breadcrumbs: [{ label: 'Layout crumb' }] }, {}, {
      default: () => (shown.value ? pageTrail(() => h('span', 'Production')) : null)
    })
    const header = within(getByRole('banner'))
    await waitFor(() => expect(header.getByText('Production')).toBeTruthy())
    shown.value = false
    await waitFor(() => expect(header.getByText('Layout crumb')).toBeTruthy())
    expect(header.queryByText('Production')).toBeNull()
    expect(header.queryByText('azion-site')).toBeNull()
  })

  it('shows the most recent page trail and falls back to the earlier one', async () => {
    const second = ref(true)
    const { getByRole } = mount({}, {}, {
      default: () => [
        h(ConsoleLayoutBreadcrumbs, { items: [{ label: 'First page' }] }),
        second.value ? h(ConsoleLayoutBreadcrumbs, { items: [{ label: 'Second page' }] }) : null
      ]
    })
    const header = within(getByRole('banner'))
    await waitFor(() => expect(header.getByText('Second page')).toBeTruthy())
    expect(header.queryByText('First page')).toBeNull()
    second.value = false
    await waitFor(() => expect(header.getByText('First page')).toBeTruthy())
  })

  it('clears a kept-alive page trail while the page is deactivated', async () => {
    const PageA = defineComponent({
      name: 'PageA',
      render: () => h(ConsoleLayoutBreadcrumbs, { items: [{ label: 'Page A' }] })
    })
    const PageB = defineComponent({ name: 'PageB', render: () => h('p', 'Page B body') })
    const current = ref<'a' | 'b'>('a')
    const { getByRole } = mount({ breadcrumbs: [{ label: 'Layout crumb' }] }, {}, {
      default: () => h(KeepAlive, null, [current.value === 'a' ? h(PageA) : h(PageB)])
    })
    const header = within(getByRole('banner'))
    await waitFor(() => expect(header.getByText('Page A')).toBeTruthy())
    current.value = 'b'
    await waitFor(() => expect(header.getByText('Layout crumb')).toBeTruthy())
    current.value = 'a'
    await waitFor(() => expect(header.getByText('Page A')).toBeTruthy())
  })

  it('renders nothing and does not throw outside a ConsoleLayout', () => {
    const { container } = render(
      defineComponent({
        render: () => h('div', [pageTrail(() => h('span', 'Production')), h('p', 'Body')])
      })
    )
    expect(container.textContent).toBe('Body')
  })

  it('server-renders the layout trail and hydrates without mismatches, then shows the page trail', async () => {
    const App = defineComponent({
      render: () => h('div', { style: { width: '1200px' } }, [h(PageBreadcrumbsExample)])
    })
    const context: SSRContext = {}
    const html = await renderToString(createSSRApp(App), context)
    const host = document.createElement('div')
    host.innerHTML = html
    document.body.appendChild(host)
    const teleported: Node[] = []
    for (const [to, markup] of Object.entries(context.teleports ?? {})) {
      const target = document.querySelector(to) as (Element & { _lpa?: Node | null }) | null
      if (!target) continue
      const parsed = document.createElement('template')
      parsed.innerHTML = markup
      teleported.push(...Array.from(parsed.content.childNodes))
      target._lpa = null
      target.prepend(parsed.content)
    }
    const serverHeader = host.querySelector('[data-testid="layout-console-layout__header"]')
    expect(serverHeader?.textContent).toContain('Applications')
    expect(serverHeader?.textContent).not.toContain('azion-site')
    const messages: string[] = []
    const collect = (...args: unknown[]) => messages.push(args.map(String).join(' '))
    const warn = vi.spyOn(console, 'warn').mockImplementation(collect)
    const error = vi.spyOn(console, 'error').mockImplementation(collect)
    try {
      const app = createSSRApp(App)
      app.mount(host)
      await nextTick()
      expect(messages.filter((m) => /hydration/i.test(m))).toEqual([])
      const header = within(host.querySelector('header') as HTMLElement)
      await waitFor(() => expect(header.getByText('azion-site')).toBeTruthy())
      expect(header.getByRole('combobox', { name: 'Switch environment' })).toBeTruthy()
      app.unmount()
    } finally {
      warn.mockRestore()
      error.mockRestore()
      host.remove()
      for (const node of teleported) node.parentNode?.removeChild(node)
    }
  })

  it('has no axe violations with a page trail ending on a select', async () => {
    const { container, getByRole } = render(
      defineComponent({
        render: () => h('div', { style: { width: '1200px' } }, [h(PageBreadcrumbsExample)])
      })
    )
    await waitFor(() =>
      expect(within(getByRole('banner')).getByText('azion-site')).toBeTruthy()
    )
    await expectNoA11yViolations(container)
  })
})

describe('ConsoleLayout — fill page', () => {
  it('keeps the fill root a direct child of the main landmark', () => {
    const { getByRole } = render(FillPageExample)
    const main = getByRole('main')
    const root = main.querySelector(':scope > [data-layout-fill]')
    expect(root).toBeTruthy()
    expect(within(root as HTMLElement).getByRole('group', { name: 'Source lines' })).toBeTruthy()
    expect(getByRole('main').querySelectorAll('[data-layout-fill]')).toHaveLength(1)
  })

  it('has no axe violations', async () => {
    const { container } = render(FillPageExample)
    await expectNoA11yViolations(container)
  })
})
