import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import StoryIndex from './story-index.vue'

const TESTID = 'sections-story-index'
const TITLE = 'Companies building with Azion'
const LIST = 'Success stories'

const items = [
  {
    id: 'case-gpa',
    href: '/success-cases/gpa',
    client: { name: 'GPA', logo: '/logos/gpa.svg' },
    category: 'Retail',
    description: 'GPA solved a targeted DNS attack.',
    facets: { industry: ['Retail'], solution: ['Secure'] }
  },
  {
    id: 'case-axur',
    href: '/success-cases/axur',
    client: { name: 'Axur', logo: '/logos/axur.svg' },
    category: 'Tech',
    description: 'Moving AI inference unlocked the fastest takedown.',
    facets: { industry: ['Tech'], solution: ['Build', 'Secure'] }
  },
  {
    id: 'case-exame',
    href: '/success-cases/exame',
    client: { name: 'Exame', logo: '/logos/exame.svg' },
    category: 'Media',
    description: 'Faster content delivery during news events.',
    facets: { industry: ['Media'], solution: ['Deploy'] }
  }
]

const facets = [
  {
    id: 'industry',
    label: 'Industry',
    allLabel: 'All industries',
    options: [
      { value: 'Media', label: 'Media' },
      { value: 'Retail', label: 'Retail' },
      { value: 'Tech', label: 'Tech' }
    ]
  },
  {
    id: 'solution',
    label: 'Solution',
    allLabel: 'All solutions',
    options: [
      { value: 'Build', label: 'Build' },
      { value: 'Deploy', label: 'Deploy' },
      { value: 'Secure', label: 'Secure' }
    ]
  }
]

const SEARCH = {
  searchPlaceholder: 'Search by company or story',
  searchAriaLabel: 'Search success stories'
}
const EMPTY = {
  emptyTitle: 'No stories match these filters.',
  emptyActionLabel: 'View all success stories'
}

const band = (props: Record<string, unknown> = {}) =>
  render(StoryIndex, {
    props: {
      anchor: 'cases',
      title: TITLE,
      items,
      facets,
      ...SEARCH,
      ...EMPTY,
      linkLabel: 'Read story',
      moreLabel: 'Load more',
      ariaLabel: LIST,
      ...props
    }
  })

const cardNames = (getByRole: ReturnType<typeof band>['getByRole']) =>
  Array.from(getByRole('list', { name: LIST }).querySelectorAll('a')).map((a) =>
    a.getAttribute('aria-label')
  )

const pick = async (facet: string, option: string) => {
  await userEvent.click(screen.getByRole('combobox', { name: facet }))
  await userEvent.click(await screen.findByRole('option', { name: option }))
}

describe('StoryIndex', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(StoryIndex, {
      props: { items },
      attrs: { 'data-testid': 'library' }
    })

    expect(getByTestId('library')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('sets the anchor and names the section by its h2 title', () => {
    const { getByTestId, getByRole } = band()

    const root = getByTestId(TESTID)
    expect(root.id).toBe('cases')
    expect(root.getAttribute('aria-label')).toBe(TITLE)
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('renders the toolbar as a search landmark with a named field and selects', () => {
    const { getByRole } = band()

    expect(getByRole('search')).toBeInTheDocument()
    expect(getByRole('textbox', { name: SEARCH.searchAriaLabel }).getAttribute('placeholder')).toBe(
      SEARCH.searchPlaceholder
    )
    expect(getByRole('combobox', { name: 'Industry' })).toBeInTheDocument()
    expect(getByRole('combobox', { name: 'Solution' })).toBeInTheDocument()
  })

  it('renders one card per story, in order, named by its client', () => {
    const { getByRole } = band()

    expect(cardNames(getByRole)).toEqual(items.map((item) => `Read story: ${item.client.name}`))
    const first = getByRole('link', { name: 'Read story: GPA' })
    expect(first.getAttribute('href')).toBe('/success-cases/gpa')
    expect(first.querySelector('img')?.getAttribute('src')).toBe('/logos/gpa.svg')
  })

  it('narrows the stories by the search term', async () => {
    const { getByRole } = band()

    await userEvent.type(getByRole('textbox', { name: SEARCH.searchAriaLabel }), 'news')

    expect(cardNames(getByRole)).toEqual(['Read story: Exame'])
  })

  it('narrows the stories by a facet, combined with another', async () => {
    const { getByRole } = band()

    await pick('Solution', 'Secure')
    expect(cardNames(getByRole)).toEqual(['Read story: GPA', 'Read story: Axur'])

    await pick('Industry', 'Tech')
    expect(cardNames(getByRole)).toEqual(['Read story: Axur'])
  })

  it('shows the empty state when nothing matches, and its action clears every filter', async () => {
    const { getByRole, queryByRole, getByText } = band()

    await pick('Industry', 'Media')
    await userEvent.type(getByRole('textbox', { name: SEARCH.searchAriaLabel }), 'gpa')

    expect(queryByRole('list', { name: LIST })).toBeNull()
    expect(getByText(EMPTY.emptyTitle)).toBeInTheDocument()
    expect(queryByRole('button', { name: 'Load more' })).toBeNull()

    await userEvent.click(getByRole('button', { name: EMPTY.emptyActionLabel }))

    expect(cardNames(getByRole)).toHaveLength(items.length)
    expect((getByRole('textbox', { name: SEARCH.searchAriaLabel }) as HTMLInputElement).value).toBe(
      ''
    )
  })

  it('renders the load-more button when moreLabel is set', () => {
    const first = band({ pageSize: 2 })

    expect(first.getByRole('button', { name: 'Load more' })).toBeInTheDocument()
    first.unmount()

    const { queryByRole } = band({ moreLabel: '' })
    expect(queryByRole('button', { name: 'Load more' })).toBeNull()
  })

  it('lists one page and reveals the next with the load-more button', async () => {
    const { getByRole, queryByRole } = band({ pageSize: 2 })

    expect(cardNames(getByRole)).toEqual(['Read story: GPA', 'Read story: Axur'])

    await userEvent.click(getByRole('button', { name: 'Load more' }))
    expect(cardNames(getByRole)).toHaveLength(items.length)
    expect(queryByRole('button', { name: 'Load more' })).toBeNull()
  })

  it('returns to the first page when the filters change', async () => {
    const { getByRole } = band({ pageSize: 1 })

    await userEvent.click(getByRole('button', { name: 'Load more' }))
    expect(cardNames(getByRole)).toHaveLength(2)

    await userEvent.type(getByRole('textbox', { name: SEARCH.searchAriaLabel }), 'a')
    expect(cardNames(getByRole)).toHaveLength(1)
  })

  it('lists every match and no button without a more label', () => {
    const { getByRole, queryByRole } = band({ moreLabel: '', pageSize: 1 })

    expect(cardNames(getByRole)).toHaveLength(items.length)
    expect(queryByRole('button', { name: 'Load more' })).toBeNull()
  })

  it('clears one facet from its all option', async () => {
    const { getByRole } = band()

    await pick('Industry', 'Tech')
    expect(cardNames(getByRole)).toEqual(['Read story: Axur'])

    await pick('Industry', 'All industries')
    expect(cardNames(getByRole)).toHaveLength(items.length)
  })

  it('toggles the folded filters from the filter button', async () => {
    const { getByTestId } = band()

    const button = getByTestId(`${TESTID}__filter-button`)
    const panel = getByTestId(`${TESTID}__filters`)
    expect(button.getAttribute('aria-controls')).toBe(panel.id)
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(panel.getAttribute('data-state')).toBe('closed')

    await userEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(panel.getAttribute('data-state')).toBe('open')
  })

  it('lists each applied facet as a removable chip and counts it on the filter button', async () => {
    const { getByRole, getByTestId, queryByTestId } = band({ filterLabel: 'Refine' })

    expect(getByTestId(`${TESTID}__filter-button`).textContent).toContain('Refine')

    await pick('Industry', 'Tech')
    const applied = getByTestId(`${TESTID}__applied`)
    await waitFor(() => expect(applied.textContent).toContain('Industry: Tech'))
    expect(getByTestId(`${TESTID}__filter-button`).textContent).toContain('Refine (1)')

    await userEvent.click(within(applied).getByRole('button'))
    expect(queryByTestId(`${TESTID}__applied`)).toBeNull()
    expect(cardNames(getByRole)).toHaveLength(items.length)
  })

  it('searches the options only of a select with more than seven', async () => {
    const long = {
      id: 'product',
      label: 'Product',
      allLabel: 'All products',
      options: [
        'Cache',
        'DNS',
        'Firewall',
        'Functions',
        'Observe',
        'Routing',
        'SQL',
        'Storage'
      ].map((value) => ({ value, label: value }))
    }
    band({ facets: [facets[0], long] })

    await userEvent.click(screen.getByRole('combobox', { name: 'Industry' }))
    expect(screen.queryByRole('textbox', { name: 'Search industry' })).toBeNull()
    await userEvent.keyboard('{Escape}')

    await userEvent.click(screen.getByRole('combobox', { name: 'Product' }))
    expect(await screen.findByRole('textbox', { name: 'Search product' })).toBeInTheDocument()
  })

  it('seeds a facet from the URL query only when seedFromQuery is set', async () => {
    const before = window.location.href
    window.history.replaceState(null, '', '?industry=Media')
    try {
      const off = band()
      await Promise.resolve()
      expect(cardNames(off.getByRole)).toHaveLength(items.length)
      off.unmount()

      const { getByRole } = band({ seedFromQuery: true })
      await waitFor(() => expect(cardNames(getByRole)).toEqual(['Read story: Exame']))
    } finally {
      window.history.replaceState(null, '', before)
    }
  })

  it('opens a _blank story in a new tab and says so in its name', () => {
    const { getByRole } = band({ items: [{ ...items[0], target: '_blank' }, items[1]] })

    const link = getByRole('link', { name: 'Read story: GPA (opens in a new tab)' })
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener')
    expect(getByRole('link', { name: 'Read story: Axur' }).hasAttribute('target')).toBe(false)
  })

  it('omits the toolbar when there is no search and no facet', () => {
    const { queryByRole } = band({ searchPlaceholder: '', searchAriaLabel: '', facets: [] })

    expect(queryByRole('search')).toBeNull()
  })

  it('renders the empty state when there are no stories', () => {
    const { getByText } = band({ items: [] })

    expect(getByText(EMPTY.emptyTitle)).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations in the empty state', async () => {
    const { container } = band({ items: [] })

    await expectNoA11yViolations(container)
  })
})
