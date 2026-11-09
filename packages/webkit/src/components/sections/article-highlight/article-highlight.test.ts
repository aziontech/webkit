import { userEvent } from '@storybook/test'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ArticleHighlight from './article-highlight.vue'

const TESTID = 'sections-article-highlight'
const WALL = 'Highlight articles'

const items = [
  {
    key: 'portfolio',
    href: '/blog/portfolio',
    image: '/media/portfolio.png',
    highlightImage: '/media/portfolio-highlight.png',
    meta: 'Developers • SEP 25, 2026',
    title: 'How I Shipped My Portfolio',
    description: 'From template to live URL.',
    readTime: '9 min read'
  },
  {
    key: 'latency',
    href: '/blog/latency',
    image: '/media/latency.png',
    meta: 'Serverless • SEP 23, 2026',
    title: 'How Do You Reduce AI Agent Latency?',
    description: 'Where latency builds up.',
    readTime: '8 min read'
  },
  {
    key: 'alternatives',
    href: '/blog/alternatives',
    image: '/media/alternatives.png',
    meta: 'Security • SEP 22, 2026',
    title: 'Best Cloudflare Alternatives',
    description: 'Compare six alternatives.',
    readTime: '13 min read'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ArticleHighlight, {
    props: { items, actionLabel: 'Read article', ariaLabel: WALL, ...props }
  })

const panelHeadline = (getByRole: ReturnType<typeof band>['getByRole']) =>
  getByRole('heading', { level: 2 }).textContent?.trim()

describe('ArticleHighlight', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ArticleHighlight, {
      props: { items },
      attrs: { 'data-testid': 'highlight' }
    })

    expect(getByTestId('highlight')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'articles' })

    expect(getByTestId(TESTID).id).toBe('articles')
  })

  it('renders no id when the anchor is empty', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).hasAttribute('id')).toBe(false)
  })

  it('renders one tab per article in a named tablist, the first selected', () => {
    const { getByRole, getAllByRole } = band()

    expect(getByRole('tablist', { name: WALL })).toBeInTheDocument()
    const tabs = getAllByRole('tab')
    expect(tabs).toHaveLength(items.length)
    expect(tabs.map((tab) => tab.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false'])
    expect(tabs.map((tab) => tab.getAttribute('tabindex'))).toEqual(['0', '-1', '-1'])
  })

  it('labels the panel by the selected tab and links it back', () => {
    const { getByRole, getAllByRole } = band()

    const [first] = getAllByRole('tab')
    const panel = getByRole('tabpanel')
    expect(panel.getAttribute('aria-labelledby')).toBe(first?.id)
    expect(first?.getAttribute('aria-controls')).toBe(panel.id)
  })

  it('features the first article with its highlight cover and action', () => {
    const { getByRole } = band()

    expect(panelHeadline(getByRole)).toBe(items[0]?.title)
    const panel = getByRole('tabpanel')
    expect(panel.querySelector('article img')?.getAttribute('src')).toBe(items[0]?.highlightImage)
    expect(getByRole('link', { name: /Read article/ }).getAttribute('href')).toBe(items[0]?.href)
  })

  it('swaps the panel when a tab is clicked', async () => {
    const { getByRole, getAllByRole } = band()

    await userEvent.click(getAllByRole('tab')[1] as HTMLElement)

    expect(panelHeadline(getByRole)).toBe(items[1]?.title)
    expect(getAllByRole('tab')[1]?.getAttribute('aria-selected')).toBe('true')
    const panel = getByRole('tabpanel')
    expect(panel.querySelector('article img')?.getAttribute('src')).toBe(items[1]?.image)
  })

  it('moves the selection and focus with the arrow, Home and End keys', async () => {
    const { getByRole, getAllByRole } = band()

    const tabs = getAllByRole('tab')
    tabs[0]?.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(getAllByRole('tab')[1])
    expect(panelHeadline(getByRole)).toBe(items[1]?.title)

    await userEvent.keyboard('{End}')
    expect(document.activeElement).toBe(getAllByRole('tab')[2])

    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(getAllByRole('tab')[0])

    await userEvent.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(getAllByRole('tab')[2])

    await userEvent.keyboard('{Home}')
    expect(document.activeElement).toBe(getAllByRole('tab')[0])
    expect(panelHeadline(getByRole)).toBe(items[0]?.title)
  })

  it('runs the wall four across with four or more articles', () => {
    const fourth = { ...items[0], key: 'fourth', title: 'Fourth' }
    const three = band()
    expect(three.getByRole('tablist').getAttribute('data-columns')).toBe('3')
    three.unmount()

    const { getByRole } = band({ items: [...items, fourth] })
    expect(getByRole('tablist').getAttribute('data-columns')).toBe('4')
  })

  it('omits the button when actionLabel is empty', () => {
    const { queryByRole } = band({ actionLabel: '' })

    expect(queryByRole('link', { name: /Read article/ })).toBeNull()
  })

  it('renders only the section when items is empty', () => {
    const { getByTestId, queryByRole } = band({ items: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('tablist')).toBeNull()
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
