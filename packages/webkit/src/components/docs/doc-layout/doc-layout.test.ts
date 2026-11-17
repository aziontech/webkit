import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import DocChangelogEntry from '../doc-changelog-entry/doc-changelog-entry.vue'
import DocHeading from '../doc-heading/doc-heading.vue'
import DocLayout, { type DocLayoutNavGroup } from './doc-layout.vue'

const navigation: DocLayoutNavGroup[] = [
  {
    label: 'Fundamentals',
    items: [
      { id: 'overview', label: 'Overview', href: '/docs' },
      {
        id: 'get-started',
        label: 'Get started',
        children: [
          { id: 'create-account', label: 'Create an account', href: '/docs/create-account' },
          { id: 'first-deploy', label: 'First deploy', href: '/docs/first-deploy' }
        ]
      }
    ]
  }
]

const fakeRouter = (path: string) => ({
  push: vi.fn(),
  currentRoute: ref({ path })
})

const article = () =>
  h('article', [
    h('h1', 'First deploy'),
    h(DocHeading, { anchor: 'before-you-start', level: 2 }, () => 'Before you start'),
    h('p', 'Create an account first.'),
    h(DocHeading, { anchor: 'deploy-with-cli', level: 2 }, () => 'Deploy with Azion CLI'),
    h('p', 'Run azion deploy.')
  ])

const mount = (
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
  router?: ReturnType<typeof fakeRouter>,
  dir = 'ltr'
) =>
  render(
    defineComponent({
      render: () =>
        h('div', { dir }, [
          h(
            DocLayout,
            {
              navigation,
              sections: [{ label: 'Guides', href: '/docs/guides' }],
              ...props
            },
            { default: article, ...slots }
          )
        ])
    }),
    router ? { global: { config: { globalProperties: { $router: router } } } } : {}
  )

describe('DocLayout', () => {
  it('renders the header, the rail, one main landmark with the article and the outline', async () => {
    const { findByTestId, getByTestId, getAllByRole, getByRole } = mount()
    expect(getByTestId('doc-layout')).toBeTruthy()
    expect(getByRole('banner')).toBeTruthy()
    const mains = getAllByRole('main')
    expect(mains).toHaveLength(1)
    expect(within(mains[0]!).getByRole('heading', { name: /First deploy/ })).toBeTruthy()
    expect(getByRole('complementary', { name: 'Documentation' })).toBeTruthy()
    expect(
      within(await findByTestId('doc-layout__aside')).getByText('Deploy with Azion CLI')
    ).toBeTruthy()
  })

  it('tabs from the mark through the section links to the search, then the actions', async () => {
    const { getByRole, getByTestId } = mount(
      {},
      { actions: () => h('a', { href: 'https://console.azion.com' }, 'Console') }
    )
    const order = [
      getByRole('link', { name: 'Azion Docs home' }),
      getByRole('link', { name: 'Guides' }),
      getByTestId('doc-layout__search'),
      getByRole('link', { name: 'Console' })
    ]
    for (let i = 1; i < order.length; i += 1) {
      expect(
        order[i - 1]!.compareDocumentPosition(order[i]!) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy()
    }
  })

  it('lets a consumer override data-testid', () => {
    const { getByTestId } = mount({ 'data-testid': 'docs' })
    expect(getByTestId('docs')).toBeTruthy()
  })

  it('has no end rail when the page registers no heading, even with aside content', async () => {
    const { queryByTestId, getByText } = mount(
      {},
      {
        default: () => h('article', [h(DocHeading, { level: 2 }, () => 'Start by interface')]),
        aside: () => h('p', 'Ready to build?')
      }
    )
    await nextTick()
    await nextTick()
    expect(getByText('Start by interface')).toBeTruthy()
    expect(queryByTestId('doc-layout__aside')).toBeNull()
  })

  it('builds the outline from the headings a page body registers, in document order', async () => {
    const Page = defineComponent({
      setup: () => () =>
        h('article', [
          h(DocHeading, { level: 1, anchor: 'title' }, () => 'Release notes'),
          h(DocHeading, { level: 2, anchor: 'overview' }, () => 'Overview'),
          h(DocHeading, { level: 3, anchor: 'scope' }, () => 'Scope'),
          h(DocHeading, { level: 4, anchor: 'detail' }, () => 'Detail'),
          h(DocHeading, { level: 2 }, () => 'Unanchored'),
          h(DocChangelogEntry, { label: 'June 2026', title: 'Faster deploys', anchor: 'june' }),
          h(DocHeading, { level: 2, anchor: 'next-steps' }, () => 'Next steps')
        ])
    })
    const { findByTestId } = mount({}, { default: () => h(Page) })
    const rail = await findByTestId('doc-layout__aside')
    await waitFor(() =>
      expect(
        within(rail)
          .getAllByRole('link')
          .map((link) => link.textContent?.trim())
      ).toEqual(['Overview', 'Scope', 'Faster deploys', 'Next steps'])
    )
    expect(within(rail).getByRole('link', { name: 'Overview' }).getAttribute('href')).toBe(
      '#overview'
    )
  })

  it('swaps the outline when the page body changes', async () => {
    const page = ref<'first' | 'second'>('first')
    const first = () =>
      h('article', { key: 'first' }, [h(DocHeading, { anchor: 'alpha' }, () => 'Alpha')])
    const second = () =>
      h('article', { key: 'second' }, [h(DocHeading, { anchor: 'beta' }, () => 'Beta')])
    const { findByTestId } = mount(
      {},
      { default: () => (page.value === 'first' ? first() : second()) }
    )
    const rail = await findByTestId('doc-layout__aside')
    await waitFor(() => expect(within(rail).getByRole('link', { name: 'Alpha' })).toBeTruthy())
    page.value = 'second'
    await waitFor(async () =>
      expect(
        within(await findByTestId('doc-layout__aside')).queryByRole('link', { name: 'Alpha' })
      ).toBeNull()
    )
    expect(
      within(await findByTestId('doc-layout__aside')).getByRole('link', { name: 'Beta' })
    ).toBeTruthy()
  })

  it('expands the row that holds the current page and marks it', () => {
    const router = fakeRouter('/docs/first-deploy')
    const { getByRole } = mount({}, {}, router)
    expect(getByRole('link', { name: 'First deploy' }).getAttribute('aria-current')).toBe('page')
  })

  it('follows a row with the router and emits navigate', async () => {
    const router = fakeRouter('/docs')
    const onNavigate = vi.fn()
    const { getByRole } = mount({ onNavigate }, {}, router)
    await userEvent.click(getByRole('link', { name: 'Overview' }))
    expect(onNavigate.mock.calls[0]![1].id).toBe('overview')
    expect(router.push).toHaveBeenCalledWith('/docs')
  })

  it('follows a section link with the router', async () => {
    const router = fakeRouter('/docs')
    const { getByRole } = mount({}, {}, router)
    await fireEvent.click(
      within(getByRole('navigation', { name: 'Documentation sections' })).getByRole('link', {
        name: 'Guides'
      })
    )
    expect(router.push).toHaveBeenCalledWith('/docs/guides')
  })

  it('jumps to a heading from the outline and marks it as the current location', async () => {
    const replace = vi.spyOn(globalThis.history, 'replaceState')
    const { findByTestId } = mount()
    const rail = within(await findByTestId('doc-layout__aside'))
    await userEvent.click(rail.getByRole('link', { name: 'Deploy with Azion CLI' }))
    await waitFor(() =>
      expect(
        rail.getByRole('link', { name: 'Deploy with Azion CLI' }).getAttribute('aria-current')
      ).toBe('location')
    )
    expect(document.activeElement?.id).toBe('deploy-with-cli')
    expect(replace.mock.calls.at(-1)?.[2]).toBe('#deploy-with-cli')
    replace.mockRestore()
  })

  it('jumps from a heading anchor through the provided heading navigation', async () => {
    const { getByRole } = mount()
    const main = within(getByRole('main'))
    const anchor = main
      .getAllByRole('link')
      .find((link) => link.getAttribute('href') === '#before-you-start')
    expect(anchor).toBeTruthy()
    await fireEvent.click(anchor!)
    expect(document.activeElement?.id).toBe('before-you-start')
  })

  it('opens the palette with every navigation page', async () => {
    const { getByRole } = mount()
    await userEvent.click(within(getByRole('banner')).getByRole('button', { name: 'Search docs' }))
    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    expect(within(dialog).getByText('First deploy')).toBeTruthy()
    expect(within(dialog).getByText('Overview')).toBeTruthy()
  })

  it('keeps navigation pages out of search-select', async () => {
    const onSearchSelect = vi.fn()
    const { getByRole } = mount(
      { 'onSearch-select': onSearchSelect, searchOpen: true },
      {},
      fakeRouter('/docs')
    )
    expect(getByRole('main')).toBeTruthy()
    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    await userEvent.click(within(dialog).getByText('Overview'))
    expect(onSearchSelect).not.toHaveBeenCalled()
  })

  it('renders the actions, navigation-footer, aside and footer slots', async () => {
    const { getByRole, findByTestId, getByText } = mount(
      {},
      {
        actions: () => h('a', { href: 'https://github.com/aziontech' }, 'GitHub'),
        'navigation-footer': () => h('span', 'Theme'),
        aside: () => h('p', 'Ready to build?'),
        footer: () => h('footer', 'Footer links')
      }
    )
    expect(within(getByRole('banner')).getByRole('link', { name: 'GitHub' })).toBeTruthy()
    expect(getByText('Theme')).toBeTruthy()
    expect(
      within(await findByTestId('doc-layout__aside')).getByText('Ready to build?')
    ).toBeTruthy()
    expect(getByRole('contentinfo').textContent).toContain('Footer links')
  })

  it('opens the navigation drawer from the header menu button', async () => {
    const { getByRole } = mount()
    await userEvent.click(
      within(getByRole('banner')).getByRole('button', { name: 'Open documentation navigation' })
    )
    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    expect(within(dialog).getByText('Overview')).toBeTruthy()
  })

  it('lists the sections in the navigation drawer and follows one from there', async () => {
    const router = fakeRouter('/docs')
    const { getByRole } = mount({}, {}, router)
    await userEvent.click(
      within(getByRole('banner')).getByRole('button', { name: 'Open documentation navigation' })
    )
    const dialog = await waitFor(() => within(document.body).getByRole('dialog'))
    await fireEvent.click(
      within(within(dialog).getByRole('navigation', { name: 'Documentation sections' })).getByRole(
        'link',
        { name: 'Guides' }
      )
    )
    expect(router.push).toHaveBeenCalledWith('/docs/guides')
  })

  it('has no axe violations', async () => {
    const { container } = mount()
    await expectNoA11yViolations(container)
  })

  it('renders right-to-left without violations', async () => {
    const { container } = mount({}, {}, undefined, 'rtl')
    await expectNoA11yViolations(container)
  })

  describe('resizable, collapsible rail', () => {
    const rail = (view: ReturnType<typeof mount>) =>
      within(view.getByTestId('doc-layout__navigation'))

    it('names the resize handle and the collapse button from the locale catalog', () => {
      const view = mount()
      expect(rail(view).getByRole('separator', { name: 'Resize navigation' })).toBeTruthy()
      expect(rail(view).getByRole('button', { name: 'Collapse navigation' })).toBeTruthy()
    })

    it('collapses the rail and emits update:navigationOpen', async () => {
      const onExpanded = vi.fn()
      const view = mount({ 'onUpdate:navigationOpen': onExpanded })
      await userEvent.click(rail(view).getByRole('button', { name: 'Collapse navigation' }))
      expect(onExpanded).toHaveBeenLastCalledWith(false)
    })

    it('brings a collapsed rail back from the edge affordance', async () => {
      const onExpanded = vi.fn()
      const view = mount({ navigationOpen: false, 'onUpdate:navigationOpen': onExpanded })
      expect(view.getByTestId('doc-layout__navigation').hasAttribute('inert')).toBe(true)
      await userEvent.click(view.getByRole('button', { name: 'Expand navigation' }))
      expect(onExpanded).toHaveBeenLastCalledWith(true)
    })

    it('emits update:navigationWidth when the handle is moved with the keyboard', async () => {
      const onWidth = vi.fn()
      const view = mount({ navigationWidth: 300, 'onUpdate:navigationWidth': onWidth })
      rail(view).getByRole('separator', { name: 'Resize navigation' }).focus()
      await userEvent.keyboard('{ArrowRight}')
      expect(onWidth).toHaveBeenCalled()
      expect(onWidth.mock.calls.at(-1)![0]).toBeGreaterThan(300)
    })

    it('has no axe violations with the rail collapsed', async () => {
      const { container } = mount({ navigationOpen: false })
      await expectNoA11yViolations(container)
    })
  })

  describe('Back in the rail', () => {
    const drill: DocLayoutNavGroup[] = [
      {
        label: 'Legal',
        items: [
          { id: 'overview', label: 'Overview', href: '/docs' },
          {
            id: 'agreements',
            label: 'Agreements and Policies',
            type: 'drill',
            children: [
              { id: 'privacy', label: 'Privacy Policy', href: '/docs/privacy' },
              {
                id: 'versions',
                label: 'Previous versions',
                type: 'drill',
                children: [{ id: 'privacy-2024', label: 'Privacy Policy 2024', href: '/docs/p24' }]
              }
            ]
          }
        ]
      }
    ]

    const back = (view: ReturnType<typeof mount>) =>
      within(view.getByTestId('doc-layout__navigation')).getByTestId('sidebar-menu-back')

    it('names the docs root on the first drill level', async () => {
      const view = mount({ navigation: drill, activeId: 'privacy' })
      await waitFor(() => expect(back(view).textContent?.trim()).toBe('Back to Docs'))
    })

    it('takes rootLabel over the locale default', async () => {
      const view = mount({ navigation: drill, activeId: 'privacy', rootLabel: 'API reference' })
      await waitFor(() => expect(back(view).textContent?.trim()).toBe('Back to API reference'))
    })

    it('names the parent row on a deeper level', async () => {
      const view = mount({ navigation: drill, activeId: 'privacy-2024' })
      await waitFor(() =>
        expect(back(view).textContent?.trim()).toBe('Back to Agreements and Policies')
      )
    })
  })
})
