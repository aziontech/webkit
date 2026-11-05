import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ArticleCards from './article-cards.vue'

const TESTID = 'sections-article-cards'
const TITLE = 'Related Articles'
const EYEBROW = 'Success cases'

const posts = [
  {
    key: 'latency',
    href: '/blog/how-to-reduce-ai-agent-latency',
    title: 'How Do You Reduce AI Agent Latency?',
    description: 'Learn where latency builds up in AI agents.',
    meta: 'SEP 23, 2026 • 8 min read',
    image: '/media/blog/reduce-ai-agent-latency.png'
  },
  {
    key: 'alternatives',
    href: '/blog/cloudflare-alternatives-and-competitors',
    title: 'Best Cloudflare Alternatives and Competitors',
    description: 'Compare six Cloudflare alternatives.',
    meta: 'SEP 22, 2026 • 13 min read',
    image: '/media/blog/best-cloudflare-alternatives.png'
  }
]

const stories = [
  {
    key: 'netshoes',
    href: '/success-cases/netshoes',
    title: 'Netshoes Blocks 4M+ Threats',
    description: 'Netshoes strengthened its e-commerce security.',
    meta: 'FEB 4, 2022 • 4 min read',
    mark: { name: 'Netshoes', logo: '/logos/netshoes.svg' }
  },
  {
    key: 'gpa',
    href: '/success-cases/gpa',
    title: 'GPA solved a cyberattack',
    description: 'Grupo Pão de Açúcar solved a targeted DNS attack.',
    meta: 'MAY 6, 2025 • 4 min read',
    mark: { name: 'GPA', logo: '/logos/gpa.svg' }
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ArticleCards, {
    props: { title: TITLE, items: posts, ariaLabel: TITLE, ...props }
  })

describe('ArticleCards', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ArticleCards, {
      props: { title: TITLE, items: posts },
      attrs: { 'data-testid': 'related' }
    })

    expect(getByTestId('related')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it.each(['left', 'centered'] as const)('mirrors kind=%s on data-kind', (kind) => {
    const { getByTestId } = band({ kind })

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe(kind)
  })

  it('defaults to the left kind', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe('left')
  })

  it('names the section by its title and renders it as the h2', () => {
    const { getByTestId, getByRole } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('renders the eyebrow over the heading', () => {
    const { getByText } = band({ kind: 'centered', eyebrow: EYEBROW })

    expect(getByText(EYEBROW)).toBeInTheDocument()
  })

  it('names the grid with ariaLabel', () => {
    const { getByRole } = band()

    expect(getByRole('group', { name: TITLE })).toBeInTheDocument()
  })

  it('renders one linked card per item, in order', () => {
    const { getAllByRole } = band()

    const headings = getAllByRole('heading', { level: 3 }).map((h) => h.textContent?.trim())
    expect(headings).toEqual(posts.map((post) => post.title))
    const links = getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual(posts.map((post) => post.href))
  })

  it('draws the cover as a decorative image', () => {
    const { getAllByRole } = band()

    getAllByRole('link').forEach((link, index) => {
      const image = link.querySelector('img')
      expect(image?.getAttribute('src')).toBe(posts[index]?.image)
      expect(image?.getAttribute('alt')).toBe('')
    })
  })

  it('draws the client mark, named by the client, when there is no cover', () => {
    const { getByRole } = band({ items: stories })

    expect(getByRole('img', { name: 'Netshoes' }).getAttribute('src')).toBe('/logos/netshoes.svg')
    expect(getByRole('img', { name: 'GPA' })).toBeInTheDocument()
  })

  it('renders the meta overline of each card', () => {
    const { getByText } = band()

    posts.forEach((post) => expect(getByText(post.meta)).toBeInTheDocument())
  })

  it('renders no header when no title is set', () => {
    const { getByTestId, queryByRole } = band({ title: '' })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('renders only the section when items is empty', () => {
    const { getByTestId, queryByRole, queryAllByRole } = band({ items: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryAllByRole('link')).toHaveLength(0)
  })

  it('has no a11y violations with the left kind', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with the centered kind and client marks', async () => {
    const { container } = band({ kind: 'centered', eyebrow: EYEBROW, items: stories })

    await expectNoA11yViolations(container)
  })
})
