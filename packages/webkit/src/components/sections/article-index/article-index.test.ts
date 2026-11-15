import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ArticleIndex from './article-index.vue'

const TESTID = 'sections-article-index'
const LIST = 'Articles'
const SEARCH = { placeholder: 'Search articles', label: 'Search articles' }

const items = [
  {
    key: 'portfolio',
    href: '/blog/portfolio',
    image: '/media/portfolio.png',
    meta: 'Developers • SEP 25, 2026',
    title: 'How I Shipped My Portfolio',
    description: 'From template to live URL with two commands.',
    authors: [{ name: 'Patrick Menoti' }],
    byline: 'Patrick Menoti · 9 min read',
    categories: ['Developers']
  },
  {
    key: 'latency',
    href: '/blog/latency',
    image: '/media/latency.png',
    meta: 'Serverless • SEP 23, 2026',
    title: 'How Do You Reduce AI Agent Latency?',
    description: 'Where latency builds up in AI agents.',
    authors: [{ name: 'Marilia Bafutto Costa' }],
    byline: 'Marilia Bafutto Costa · 8 min read',
    categories: ['Serverless']
  },
  {
    key: 'alternatives',
    href: '/blog/alternatives',
    image: '/media/alternatives.png',
    meta: 'Security • SEP 22, 2026',
    title: 'Best Cloudflare Alternatives',
    description: 'Compare six alternatives for CDN delivery.',
    categories: ['Security']
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ArticleIndex, {
    props: {
      anchor: 'posts',
      items,
      categories: ['Developers', 'Serverless', 'Security'],
      allLabel: 'All articles',
      categoryLabel: 'Category',
      search: SEARCH,
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

describe('ArticleIndex', () => {
  describe('category-search', () => {
    it('renders the band under the default testid with its anchor', () => {
      const { getByTestId } = band()

      expect(getByTestId(TESTID).id).toBe('posts')
    })

    it('lets a consumer data-testid win over the fallback', () => {
      const { getByTestId, queryByTestId } = render(ArticleIndex, {
        props: { items },
        attrs: { 'data-testid': 'blog' }
      })

      expect(getByTestId('blog')).toBeInTheDocument()
      expect(queryByTestId(TESTID)).toBeNull()
    })

    it('renders the toolbar as a search landmark with a named picker and field', () => {
      const { getByRole, getAllByRole } = band()

      expect(getByRole('search')).toBeInTheDocument()
      expect(getByRole('radiogroup', { name: 'Category' })).toBeInTheDocument()
      expect(getAllByRole('radio').map((radio) => radio.textContent?.trim())).toEqual([
        'All articles',
        'Developers',
        'Serverless',
        'Security'
      ])
      expect(getByRole('textbox', { name: SEARCH.label })).toBeInTheDocument()
    })

    it('renders one linked row per article, in order, in the byline layout', () => {
      const { getByRole } = band()

      expect(getByRole('list', { name: LIST }).getAttribute('data-kind')).toBe('byline')
      expect(headlines(getByRole)).toEqual(items.map((item) => item.title))
      expect(getByRole('link', { name: items[0]?.title }).getAttribute('href')).toBe(items[0]?.href)
    })

    it('draws the writers and the byline only when the article has one', () => {
      const { getByText, getAllByTestId, queryByText } = band()

      expect(getByText('Patrick Menoti · 9 min read')).toBeInTheDocument()
      expect(getAllByTestId('content-avatar')).toHaveLength(2)
      expect(queryByText(/Cloudflare Alternatives ·/)).toBeNull()
    })

    it('narrows the list by category', async () => {
      const { getByRole } = band()

      await userEvent.click(getByRole('radio', { name: 'Serverless' }))
      expect(headlines(getByRole)).toEqual(['How Do You Reduce AI Agent Latency?'])

      await userEvent.click(getByRole('radio', { name: 'All articles' }))
      expect(headlines(getByRole)).toHaveLength(items.length)
    })

    it('narrows the list by search, combined with the category', async () => {
      const { getByRole, queryByRole } = band()

      await userEvent.type(getByRole('textbox', { name: SEARCH.label }), 'cdn')
      expect(headlines(getByRole)).toEqual(['Best Cloudflare Alternatives'])

      await userEvent.click(getByRole('radio', { name: 'Developers' }))
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

    it('returns to the first page when the filters change', async () => {
      const { getByRole } = band({ pageSize: 1 })

      await userEvent.click(getByRole('button', { name: 'Load more' }))
      expect(headlines(getByRole)).toHaveLength(2)

      await userEvent.click(getByRole('radio', { name: 'Serverless' }))
      await userEvent.click(getByRole('radio', { name: 'All articles' }))
      expect(headlines(getByRole)).toHaveLength(1)
    })

    it('lists every match and no button without a more label', () => {
      const { getByRole, queryByRole } = band({ moreLabel: '', pageSize: 1 })

      expect(headlines(getByRole)).toHaveLength(items.length)
      expect(queryByRole('button', { name: 'Load more' })).toBeNull()
    })

    it('skips the leading articles until a filter applies', async () => {
      const { getByRole } = band({ leading: 1 })

      expect(headlines(getByRole)).toEqual([items[1]?.title, items[2]?.title])

      await userEvent.click(getByRole('radio', { name: 'Developers' }))
      expect(headlines(getByRole)).toEqual([items[0]?.title])
    })

    it('renders the empty state and clears every filter from its action', async () => {
      const { getByRole, getByText } = band({
        empty: {
          title: 'No articles match these filters',
          description: 'Try another category.',
          action: 'View all articles'
        }
      })

      await userEvent.type(getByRole('textbox', { name: SEARCH.label }), 'nothing like this')
      expect(getByText('No articles match these filters')).toBeInTheDocument()
      expect(getByText('Try another category.')).toBeInTheDocument()

      await userEvent.click(getByRole('button', { name: 'View all articles' }))
      expect(headlines(getByRole)).toHaveLength(items.length)
      expect((getByRole('textbox', { name: SEARCH.label }) as HTMLInputElement).value).toBe('')
    })

    it('names the band by its title, drawn as the h2', () => {
      const { getByRole } = band({ title: 'All articles' })

      expect(getByRole('heading', { level: 2, name: 'All articles' })).toBeInTheDocument()
      expect(getByRole('region', { name: 'All articles' })).toBeInTheDocument()
    })

    it('mirrors rowKind on the list', () => {
      const { getByRole } = band({ rowKind: 'centered' })

      expect(getByRole('list', { name: LIST }).getAttribute('data-kind')).toBe('centered')
    })

    it('draws the client mark when a row has no cover, and an author photo when given', () => {
      const { getByAltText, getByRole } = band({
        items: [
          {
            key: 'acme',
            href: 'https://example.com/acme',
            mark: { name: 'Acme', logo: '/logos/acme.svg' },
            meta: 'Case study',
            title: 'Acme moved its storefront',
            authors: [{ name: 'Jane Doe', avatar: '/people/jane.png' }],
            byline: 'Jane Doe · 4 min read',
            external: true
          }
        ]
      })

      expect(getByAltText('Acme').getAttribute('src')).toBe('/logos/acme.svg')
      expect(getByAltText('Jane Doe').getAttribute('src')).toBe('/people/jane.png')

      const link = getByRole('link', { name: /Acme moved its storefront \(opens in a new tab\)/ })
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener')
    })

    it('preselects the category named by the URL query parameter', async () => {
      const before = window.location.href
      window.history.replaceState(null, '', '?topic=Serverless')
      try {
        const { getByRole, findByRole } = band({ categoryParam: 'topic' })

        expect(await findByRole('radio', { name: 'Serverless', checked: true })).toBeInTheDocument()
        expect(headlines(getByRole)).toEqual(['How Do You Reduce AI Agent Latency?'])
      } finally {
        window.history.replaceState(null, '', before)
      }
    })

    it('ignores a query value that is not a category', async () => {
      const before = window.location.href
      window.history.replaceState(null, '', '?topic=Unknown')
      try {
        const { getByRole } = band({ categoryParam: 'topic' })

        await Promise.resolve()
        expect(headlines(getByRole)).toHaveLength(items.length)
      } finally {
        window.history.replaceState(null, '', before)
      }
    })

    it('omits the toolbar when there are no categories and no search', () => {
      const { queryByRole } = band({ categories: [], search: undefined })

      expect(queryByRole('search')).toBeNull()
    })

    it('renders only the section when items is empty', () => {
      const { getByTestId, queryByRole } = band({ items: [] })

      expect(getByTestId(TESTID)).toBeInTheDocument()
      expect(queryByRole('list', { name: LIST })).toBeNull()
    })

    it('has no a11y violations', async () => {
      const { container } = band()

      await expectNoA11yViolations(container)
    })

    it('has no a11y violations in the empty state', async () => {
      const { container, getByRole } = band({
        empty: { title: 'No articles match these filters', action: 'View all articles' }
      })

      await userEvent.type(getByRole('textbox', { name: SEARCH.label }), 'zzz')
      await expectNoA11yViolations(container)
    })
  })

  describe('facets filter bar', () => {
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
      render(ArticleIndex, {
        props: {
          filters: 'facets',
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

    describe('ArticleIndex — facets', () => {
      it('renders the band under the default testid with its anchor', () => {
        const { getByTestId } = band()

        expect(getByTestId(TESTID).id).toBe('resources')
      })

      it('lets a consumer data-testid win over the fallback', () => {
        const { getByTestId, queryByTestId } = render(ArticleIndex, {
          props: { filters: 'facets', items },
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
        expect(getByRole('link', { name: items[1]?.title }).getAttribute('href')).toBe(
          items[1]?.href
        )
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
  })

  describe('filters', () => {
    const facet = { key: 'topic', label: 'Topic', allLabel: 'All topics', options: ['Developers'] }

    it('draws only the category picker and the search field by default', () => {
      const { getByRole, queryByRole } = band({ facets: [facet] })

      expect(getByRole('list', { name: LIST }).getAttribute('data-filters')).toBe('category-search')
      expect(getByRole('radiogroup', { name: 'Category' })).toBeInTheDocument()
      expect(queryByRole('combobox', { name: 'Topic' })).toBeNull()
    })

    it('draws only the facet dropdowns with filters="facets", in the centered layout', () => {
      const { getByRole, queryByRole } = band({ filters: 'facets', facets: [facet] })

      const list = getByRole('list', { name: LIST })
      expect(list.getAttribute('data-filters')).toBe('facets')
      expect(list.getAttribute('data-kind')).toBe('centered')
      expect(getByRole('combobox', { name: 'Topic' })).toBeInTheDocument()
      expect(queryByRole('radiogroup', { name: 'Category' })).toBeNull()
      expect(queryByRole('textbox', { name: SEARCH.label })).toBeNull()
    })

    it('keeps an explicit rowKind over the filter default', () => {
      const { getByRole } = band({ filters: 'facets', facets: [facet], rowKind: 'byline' })

      expect(getByRole('list', { name: LIST }).getAttribute('data-kind')).toBe('byline')
    })
  })
})
