import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ArticleCardsSection from './article-cards-section.vue'

const TESTID = 'article-cards-section'
const TITLE = 'Related articles'
const EYEBROW = 'Success cases'

const posts = [
  {
    id: 'latency',
    href: '/blog/how-to-reduce-ai-agent-latency',
    title: 'How do you reduce AI agent latency?',
    description: 'Learn where latency builds up in AI agents.',
    meta: 'SEP 23, 2026 • 8 min read',
    image: '/media/blog/reduce-ai-agent-latency.png'
  },
  {
    id: 'alternatives',
    href: '/blog/cloudflare-alternatives-and-competitors',
    title: 'Best Cloudflare alternatives and competitors',
    description: 'Compare six Cloudflare alternatives.',
    meta: 'SEP 22, 2026 • 13 min read',
    image: '/media/blog/best-cloudflare-alternatives.png'
  }
]

const stories = [
  {
    id: 'netshoes',
    href: '/success-cases/netshoes',
    title: 'Netshoes Blocks 4M+ Threats',
    description: 'Netshoes strengthened its e-commerce security.',
    meta: 'FEB 4, 2022 • 4 min read',
    mark: { name: 'Netshoes', logo: '/logos/netshoes.svg' }
  },
  {
    id: 'gpa',
    href: '/success-cases/gpa',
    title: 'GPA solved a cyberattack',
    description: 'Grupo Pão de Açúcar solved a targeted DNS attack.',
    meta: 'MAY 6, 2025 • 4 min read',
    mark: { name: 'GPA', logo: '/logos/gpa.svg' }
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ArticleCardsSection, {
    props: { title: TITLE, items: posts, ariaLabel: TITLE, ...props }
  })

describe('ArticleCardsSection', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ArticleCardsSection, {
      props: { title: TITLE, items: posts },
      attrs: { 'data-testid': 'related' }
    })

    expect(getByTestId('related')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it.each(['start', 'center'] as const)('mirrors align=%s on data-align', (align) => {
    const { getByTestId } = band({ align })

    expect(getByTestId(TESTID).getAttribute('data-align')).toBe(align)
  })

  it('defaults to the start alignment', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('data-align')).toBe('start')
  })

  it('names the section by its title and renders it as the h2', () => {
    const { getByTestId, getByRole } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('renders the eyebrow over the heading', () => {
    const { getByText } = band({ align: 'center', eyebrow: EYEBROW })

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

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'related' })

    expect(getByTestId(TESTID).id).toBe('related')
  })

  it('sets no id without an anchor', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).hasAttribute('id')).toBe(false)
  })

  it('opens an external card in a new tab and says so in its name', () => {
    const { getByRole } = band({ items: [{ ...posts[0], target: '_blank' }, posts[1]] })

    const external = getByRole('link', {
      name: /How Do You Reduce AI Agent Latency\? \(opens in a new tab\)/
    })
    expect(external.getAttribute('target')).toBe('_blank')
    expect(external.getAttribute('rel')).toBe('noopener noreferrer')

    const internal = getByRole('link', { name: /Best Cloudflare Alternatives/ })
    expect(internal.hasAttribute('target')).toBe(false)
    expect(internal.textContent).not.toContain('opens in a new tab')
  })

  it('has no a11y violations with the start alignment', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with the centered alignment and client marks', async () => {
    const { container } = band({ align: 'center', eyebrow: EYEBROW, items: stories })

    await expectNoA11yViolations(container)
  })

  it('drops a cover image that fails to load and keeps the neutral cover', async () => {
    const { container } = band({ items: posts })
    const first = container.querySelector<HTMLImageElement>('img[alt=""]')!
    const cover = first.parentElement!

    await fireEvent.error(first)

    expect(first.isConnected).toBe(false)
    expect(cover.isConnected).toBe(true)
    expect(cover.querySelector('img[alt=""]')).toBeNull()
  })
})
