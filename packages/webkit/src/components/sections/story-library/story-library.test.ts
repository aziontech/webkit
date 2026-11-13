import { userEvent } from '@storybook/test'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import StoryLibrary from './story-library.vue'

const TESTID = 'sections-story-library'
const TITLE = 'Companies building with Azion'
const LIST = 'Success stories'

const items = [
  {
    key: 'case-gpa',
    href: '/success-cases/gpa',
    client: { name: 'GPA', logo: '/logos/gpa.svg' },
    category: 'Retail',
    description: 'GPA solved a targeted DNS attack.',
    facets: { industry: ['Retail'], solution: ['Secure'] }
  },
  {
    key: 'case-axur',
    href: '/success-cases/axur',
    client: { name: 'Axur', logo: '/logos/axur.svg' },
    category: 'Tech',
    description: 'Moving AI inference unlocked the fastest takedown.',
    facets: { industry: ['Tech'], solution: ['Build', 'Secure'] }
  },
  {
    key: 'case-exame',
    href: '/success-cases/exame',
    client: { name: 'Exame', logo: '/logos/exame.svg' },
    category: 'Media',
    description: 'Faster content delivery during news events.',
    facets: { industry: ['Media'], solution: ['Deploy'] }
  }
]

const facets = [
  {
    key: 'industry',
    label: 'Industry',
    allLabel: 'All industries',
    options: [
      { value: 'Media', label: 'Media' },
      { value: 'Retail', label: 'Retail' },
      { value: 'Tech', label: 'Tech' }
    ]
  },
  {
    key: 'solution',
    label: 'Solution',
    allLabel: 'All solutions',
    options: [
      { value: 'Build', label: 'Build' },
      { value: 'Deploy', label: 'Deploy' },
      { value: 'Secure', label: 'Secure' }
    ]
  }
]

const SEARCH = { placeholder: 'Search by company or story', label: 'Search success stories' }
const EMPTY = { title: 'No stories match these filters.', action: 'View all success stories' }

const band = (props: Record<string, unknown> = {}) =>
  render(StoryLibrary, {
    props: {
      anchor: 'cases',
      title: TITLE,
      items,
      facets,
      search: SEARCH,
      empty: EMPTY,
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

describe('StoryLibrary', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(StoryLibrary, {
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
    expect(getByRole('textbox', { name: SEARCH.label }).getAttribute('placeholder')).toBe(
      SEARCH.placeholder
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

    await userEvent.type(getByRole('textbox', { name: SEARCH.label }), 'news')

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
    await userEvent.type(getByRole('textbox', { name: SEARCH.label }), 'gpa')

    expect(queryByRole('list', { name: LIST })).toBeNull()
    expect(getByText(EMPTY.title)).toBeInTheDocument()
    expect(queryByRole('button', { name: 'Load more' })).toBeNull()

    await userEvent.click(getByRole('button', { name: EMPTY.action }))

    expect(cardNames(getByRole)).toHaveLength(items.length)
    expect((getByRole('textbox', { name: SEARCH.label }) as HTMLInputElement).value).toBe('')
  })

  it('renders the load-more button when moreLabel is set', () => {
    const first = band()

    expect(first.getByRole('button', { name: 'Load more' })).toBeInTheDocument()
    first.unmount()

    const { queryByRole } = band({ moreLabel: '' })
    expect(queryByRole('button', { name: 'Load more' })).toBeNull()
  })

  it('omits the toolbar when there is no search and no facet', () => {
    const { queryByRole } = band({ search: undefined, facets: [] })

    expect(queryByRole('search')).toBeNull()
  })

  it('renders the empty state when there are no stories', () => {
    const { getByText } = band({ items: [] })

    expect(getByText(EMPTY.title)).toBeInTheDocument()
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
