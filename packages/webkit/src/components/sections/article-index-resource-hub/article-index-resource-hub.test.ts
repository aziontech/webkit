import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ArticleIndexResourceHub from './article-index-resource-hub.vue'

const TESTID = 'sections-article-index-resource-hub'
const TITLE = 'Explore all resources'
const LIST = 'Resources'

const items = [
  {
    key: 'security-ebook',
    href: '/lp/security',
    image: '/media/security.png',
    meta: 'E-books • OCT 15, 2026',
    title: 'Security for applications, APIs, and AI agents',
    description: 'Bring security policies into deployment.',
    facets: { contentType: ['E-books'], industry: ['Fintech'] }
  },
  {
    key: 'mcp',
    href: '/blog/mcp',
    image: '/media/mcp.svg',
    meta: 'Blog • OCT 14, 2026',
    title: 'Azion MCP servers',
    description: 'Connect your coding agent to Azion.',
    facets: { contentType: ['Blog'], industry: ['Tech'] }
  },
  {
    key: 'cloudflare',
    href: '/lp/cloudflare',
    image: '/media/cloudflare.png',
    meta: 'Comparisons • OCT 3, 2026',
    title: 'Azion vs Cloudflare',
    description: 'The same platform on every plan.',
    facets: { contentType: ['Comparisons'], industry: ['Tech'] }
  }
]

const facets = [
  {
    key: 'contentType',
    label: 'Content type',
    allLabel: 'All content types',
    options: ['E-books', 'Blog', 'Comparisons']
  },
  {
    key: 'industry',
    label: 'Industry',
    allLabel: 'All industries',
    options: ['Fintech', 'Tech']
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ArticleIndexResourceHub, {
    props: {
      anchor: 'resources',
      title: TITLE,
      items,
      facets,
      rowLabel: 'Read article',
      moreLabel: 'Load more',
      ariaLabel: LIST,
      ...props
    }
  })

const headlines = (getByRole: ReturnType<typeof band>['getByRole']) =>
  Array.from(getByRole('list', { name: LIST }).querySelectorAll('h3')).map((h) =>
    h.textContent?.trim()
  )

const pick = async (facet: string, option: string) => {
  await userEvent.click(screen.getByRole('combobox', { name: facet }))
  await userEvent.click(await screen.findByRole('option', { name: option }))
}

describe('ArticleIndexResourceHub', () => {
  it('renders the band under the default testid with its anchor', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).id).toBe('resources')
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ArticleIndexResourceHub, {
      props: { items },
      attrs: { 'data-testid': 'hub' }
    })

    expect(getByTestId('hub')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the section by its h2 title inside the search toolbar', () => {
    const { getByTestId, getByRole } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
    const heading = getByRole('heading', { level: 2, name: TITLE })
    expect(getByRole('search').contains(heading)).toBe(true)
  })

  it('renders one named dropdown per facet showing its all label', () => {
    const { getByRole } = band()

    expect(getByRole('combobox', { name: 'Content type' }).textContent).toContain(
      'All content types'
    )
    expect(getByRole('combobox', { name: 'Industry' }).textContent).toContain('All industries')
  })

  it('renders one linked row per resource, in order, in the centered layout', () => {
    const { getByRole } = band()

    expect(getByRole('list', { name: LIST }).getAttribute('data-kind')).toBe('centered')
    expect(headlines(getByRole)).toEqual(items.map((item) => item.title))
    expect(getByRole('link', { name: items[1]?.title }).getAttribute('href')).toBe(items[1]?.href)
  })

  it('narrows the list by facets that combine', async () => {
    const { getByRole } = band()

    await pick('Industry', 'Tech')
    expect(headlines(getByRole)).toEqual(['Azion MCP servers', 'Azion vs Cloudflare'])

    await pick('Content type', 'Blog')
    expect(headlines(getByRole)).toEqual(['Azion MCP servers'])

    await pick('Industry', 'All industries')
    await pick('Content type', 'All content types')
    expect(headlines(getByRole)).toHaveLength(items.length)
  })

  it('hides the list and the button when nothing matches', async () => {
    const { queryByRole } = band()

    await pick('Industry', 'Fintech')
    await pick('Content type', 'Blog')

    expect(queryByRole('list', { name: LIST })).toBeNull()
    expect(queryByRole('button', { name: 'Load more' })).toBeNull()
  })

  it('renders the read cue and the load-more button from their labels', () => {
    const { getByRole, getAllByText } = band({ pageSize: 2 })

    expect(getAllByText('Read article')).toHaveLength(2)
    expect(getByRole('button', { name: 'Load more' })).toBeInTheDocument()
  })

  it('lists one page and reveals the next with the load-more button', async () => {
    const { getByRole, queryByRole } = band({ pageSize: 2 })

    expect(headlines(getByRole)).toEqual([items[0]?.title, items[1]?.title])

    await userEvent.click(getByRole('button', { name: 'Load more' }))
    expect(headlines(getByRole)).toEqual(items.map((item) => item.title))
    expect(queryByRole('button', { name: 'Load more' })).toBeNull()
  })

  it('returns to the first page when a facet changes', async () => {
    const { getByRole } = band({ pageSize: 1 })

    await userEvent.click(getByRole('button', { name: 'Load more' }))
    expect(headlines(getByRole)).toHaveLength(2)

    await pick('Industry', 'Tech')
    expect(headlines(getByRole)).toEqual(['Azion MCP servers'])
  })

  it('lists every match and no button without a more label', () => {
    const { getByRole, queryByRole } = band({ moreLabel: '', pageSize: 1 })

    expect(headlines(getByRole)).toHaveLength(items.length)
    expect(queryByRole('button', { name: 'Load more' })).toBeNull()
  })

  it('skips the leading resources until a facet applies', async () => {
    const { getByRole } = band({ leading: 1 })

    expect(headlines(getByRole)).toEqual([items[1]?.title, items[2]?.title])

    await pick('Industry', 'Fintech')
    expect(headlines(getByRole)).toEqual([items[0]?.title])
  })

  it('renders the empty state and resets every facet from its action', async () => {
    const { getByRole, getByText } = band({
      empty: {
        title: 'No resources match these filters',
        description: 'Try another content type or industry.',
        action: 'View all resources'
      }
    })

    await pick('Industry', 'Fintech')
    await pick('Content type', 'Blog')
    expect(getByText('No resources match these filters')).toBeInTheDocument()
    expect(getByText('Try another content type or industry.')).toBeInTheDocument()

    await userEvent.click(getByRole('button', { name: 'View all resources' }))
    expect(headlines(getByRole)).toHaveLength(items.length)
    expect(getByRole('combobox', { name: 'Industry' }).textContent).toContain('All industries')
  })

  it('searches the options only of a dropdown with more than seven', async () => {
    const long = {
      key: 'topic',
      label: 'Topic',
      allLabel: 'All topics',
      options: ['Caching', 'Routing', 'Serverless', 'Security', 'Storage', 'Edge', 'Data', 'AI']
    }
    band({ facets: [facets[0], long] })

    await userEvent.click(screen.getByRole('combobox', { name: 'Content type' }))
    expect(screen.queryByRole('textbox', { name: 'Search content type' })).toBeNull()
    await userEvent.keyboard('{Escape}')

    await userEvent.click(screen.getByRole('combobox', { name: 'Topic' }))
    expect(await screen.findByRole('textbox', { name: 'Search topic' })).toBeInTheDocument()
  })

  it('mirrors rowKind on the list', () => {
    const { getByRole } = band({ rowKind: 'byline' })

    expect(getByRole('list', { name: LIST }).getAttribute('data-kind')).toBe('byline')
  })

  it('draws the client mark when a row has no cover and opens an external row in a new tab', () => {
    const { getByAltText, getByRole } = band({
      items: [
        {
          key: 'acme',
          href: 'https://example.com/acme',
          mark: { name: 'Acme', logo: '/logos/acme.svg' },
          meta: 'Success stories',
          title: 'Acme moved its storefront',
          external: true
        }
      ]
    })

    expect(getByAltText('Acme').getAttribute('src')).toBe('/logos/acme.svg')
    const link = getByRole('link', { name: /Acme moved its storefront \(opens in a new tab\)/ })
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener')
  })

  it('omits the toolbar when there is no title and no facet', () => {
    const { queryByRole } = band({ title: '', facets: [] })

    expect(queryByRole('search')).toBeNull()
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
