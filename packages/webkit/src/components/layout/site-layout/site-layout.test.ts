import userEvent from '@testing-library/user-event'
import { render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import CommandGroup from '../../overlay/command/command-group/command-group.vue'
import CommandItem from '../../overlay/command/command-item/command-item.vue'
import SiteLayout, { type SiteLayoutFooter, type SiteLayoutNavigation } from './site-layout.vue'

const navigation: SiteLayoutNavigation = {
  home: '/',
  menus: [
    {
      value: 'products',
      label: 'Products',
      columns: [
        [
          {
            label: 'Build',
            items: [
              {
                label: 'Functions',
                description: 'Run code at the edge',
                href: '/products/functions'
              },
              { label: 'Applications', description: 'Deliver your apps' }
            ]
          }
        ]
      ]
    }
  ],
  links: [{ label: 'Pricing', href: '/pricing' }],
  primaryAction: { label: 'Start for free', href: 'https://console.azion.com/signup' }
}

const footer: SiteLayoutFooter = {
  home: '/',
  columns: [{ title: 'Company', links: [{ label: 'About us', href: '/about' }] }],
  statusLabel: 'All Systems Operational'
}

const fakeRouter = () => ({
  push: vi.fn(),
  currentRoute: ref({ path: '/' })
})

const mount = (
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
  router?: ReturnType<typeof fakeRouter>
) =>
  render(
    defineComponent({
      render: () =>
        h(
          SiteLayout,
          { navigation, footer, ...props },
          { default: () => h('h1', 'Build at the edge'), ...slots }
        )
    }),
    router ? { global: { config: { globalProperties: { $router: router } } } } : {}
  )

describe('SiteLayout', () => {
  it('renders the bar, one main landmark with the sections, and the footer', () => {
    const { getByTestId, getAllByRole, getByRole } = mount()
    expect(getByTestId('layout-site-layout')).toBeTruthy()
    expect(getByRole('banner', { name: 'Azion' })).toBeTruthy()
    const mains = getAllByRole('main')
    expect(mains).toHaveLength(1)
    expect(within(mains[0]!).getByText('Build at the edge')).toBeTruthy()
    expect(getByRole('contentinfo')).toBeTruthy()
    expect(within(getByRole('contentinfo')).getByText('About us')).toBeTruthy()
  })

  it('lets a consumer override data-testid', () => {
    const { getByTestId } = mount({ 'data-testid': 'site' })
    expect(getByTestId('site')).toBeTruthy()
  })

  it('renders no footer when none is given', () => {
    const { queryByRole } = mount({ footer: undefined })
    expect(queryByRole('contentinfo')).toBeNull()
  })

  it('opens the palette from the bar search with every navigation destination', async () => {
    const onOpen = vi.fn()
    const { getByRole } = mount({ 'onUpdate:searchOpen': onOpen })
    await userEvent.click(within(getByRole('banner')).getByRole('button', { name: 'Search' }))
    expect(onOpen).toHaveBeenCalledWith(true)
    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    const palette = within(dialog)
    expect(palette.getByText('Functions')).toBeTruthy()
    expect(palette.getByText('Pricing')).toBeTruthy()
    expect(palette.queryByText('Applications')).toBeNull()
    expect(palette.getByRole('combobox').getAttribute('placeholder')).toBe('Search the site')
  })

  it('follows an in-site destination with the router and emits navigate', async () => {
    const router = fakeRouter()
    const onNavigate = vi.fn()
    mount({ onNavigate, searchOpen: true }, {}, router)
    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    await userEvent.click(within(dialog).getByText('Functions'))
    expect(onNavigate.mock.calls[0]![1]).toEqual({
      label: 'Functions',
      href: '/products/functions'
    })
    expect(router.push).toHaveBeenCalledWith('/products/functions')
  })

  it('reports items of the search slot as search-select', async () => {
    const onSearchSelect = vi.fn()
    mount(
      { 'onSearch-select': onSearchSelect, searchOpen: true },
      {
        search: () =>
          h(CommandGroup, { heading: 'Articles' }, () =>
            h(CommandItem, { value: 'article:cache' }, () => 'Caching at the edge')
          )
      }
    )
    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    await userEvent.click(within(dialog).getByText('Caching at the edge'))
    expect(onSearchSelect.mock.calls[0]![1]).toBe('article:cache')
  })

  it('has no axe violations', async () => {
    const { container } = mount()
    await expectNoA11yViolations(container)
  })

  it('renders right-to-left without violations', async () => {
    const { container } = render(
      defineComponent({
        render: () => h('div', { dir: 'rtl' }, [h(SiteLayout, { navigation, footer })])
      })
    )
    await expectNoA11yViolations(container)
  })
})
