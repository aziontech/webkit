import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import DocHeading from '../doc-heading/doc-heading.vue'
import DocLayout, { type DocLayoutNavGroup } from './doc-layout.vue'

const navigation: DocLayoutNavGroup[] = [
  {
    label: 'Fundamentals',
    items: [
      { id: 'overview', label: 'Overview', to: '/docs' },
      {
        id: 'get-started',
        label: 'Get started',
        children: [
          { id: 'create-account', label: 'Create an account', to: '/docs/create-account' },
          { id: 'first-deploy', label: 'First deploy', to: '/docs/first-deploy' }
        ]
      }
    ]
  }
]

const outline = [
  { id: 'before-you-start', text: 'Before you start', depth: 2 },
  { id: 'deploy-with-cli', text: 'Deploy with Azion CLI', depth: 2 }
]

const fakeRouter = (path: string) => ({
  push: vi.fn(),
  resolve: (to: string) => ({ href: to }),
  currentRoute: ref({ path })
})

const article = () =>
  h('article', [
    h('h1', 'First deploy'),
    h(DocHeading, { id: 'before-you-start', level: 2 }, () => 'Before you start'),
    h('p', 'Create an account first.'),
    h(DocHeading, { id: 'deploy-with-cli', level: 2 }, () => 'Deploy with Azion CLI'),
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
              outline,
              sections: [{ label: 'Guides', to: '/docs/guides' }],
              ...props
            },
            { default: article, ...slots }
          )
        ])
    }),
    router ? { global: { config: { globalProperties: { $router: router } } } } : {}
  )

describe('DocLayout', () => {
  it('renders the header, the rail, one main landmark with the article and the outline', () => {
    const { getByTestId, getAllByRole, getByRole } = mount()
    expect(getByTestId('documentation-doc-layout')).toBeTruthy()
    expect(getByRole('banner')).toBeTruthy()
    const mains = getAllByRole('main')
    expect(mains).toHaveLength(1)
    expect(within(mains[0]!).getByRole('heading', { name: /First deploy/ })).toBeTruthy()
    expect(getByRole('complementary', { name: 'Documentation' })).toBeTruthy()
    expect(
      within(getByTestId('documentation-doc-layout__aside')).getByText('Deploy with Azion CLI')
    ).toBeTruthy()
  })

  it('lets a consumer override data-testid', () => {
    const { getByTestId } = mount({ 'data-testid': 'docs' })
    expect(getByTestId('docs')).toBeTruthy()
  })

  it('has no end rail without an outline or aside content', () => {
    const { queryByTestId } = mount({ outline: [] })
    expect(queryByTestId('documentation-doc-layout__aside')).toBeNull()
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
    const { getByTestId } = mount()
    const rail = within(getByTestId('documentation-doc-layout__aside'))
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

  it('renders the actions, navigation-footer, aside and footer slots', () => {
    const { getByRole, getByTestId, getByText } = mount(
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
      within(getByTestId('documentation-doc-layout__aside')).getByText('Ready to build?')
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

  it('has no axe violations', async () => {
    const { container } = mount()
    await expectNoA11yViolations(container)
  })

  it('renders right-to-left without violations', async () => {
    const { container } = mount({}, {}, undefined, 'rtl')
    await expectNoA11yViolations(container)
  })
})
