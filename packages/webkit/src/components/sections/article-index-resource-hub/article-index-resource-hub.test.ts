import { userEvent } from '@storybook/test'
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
    const { getByRole, getAllByText } = band()

    expect(getAllByText('Read article')).toHaveLength(items.length)
    expect(getByRole('button', { name: 'Load more' })).toBeInTheDocument()
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
