import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ResourceGrid from './resource-grid.vue'

const TESTID = 'sections-resource-grid'
const TITLE = 'Guides and Resources'
const EYEBROW = 'Go Deeper'
const DESCRIPTION = 'Documentation, articles, and customer stories.'

const items = [
  { title: 'New to Azion? Start here', description: 'A guide to your first steps.', href: '/docs' },
  { title: 'Learning Center', description: 'Practical knowledge.', href: '/learning' },
  {
    title: 'Comply with Regulations for Fintech',
    description: 'Security and compliance together.',
    href: 'https://www.azion.com/en/blog/fintech/'
  },
  {
    title: 'How Justa is evolving its technology',
    description: 'PIX and QR Code transactions.',
    href: 'https://www.azion.com/en/blog/justa/'
  }
]

const extra = [
  { title: 'Build with Functions', description: 'Serverless functions.', href: '/docs/functions' },
  { title: 'SQL Database', description: 'Data-driven applications.', href: '/docs/sql' }
]

const ACTION = { label: 'See all guides', href: '/docs/guides', trailing: true, target: '_blank' }

const band = (props: Record<string, unknown> = {}) =>
  render(ResourceGrid, {
    props: { eyebrow: EYEBROW, title: TITLE, description: DESCRIPTION, items, ...props }
  })

describe('ResourceGrid', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ResourceGrid, {
      props: { title: TITLE, items },
      attrs: { 'data-testid': 'go-deeper' }
    })

    expect(getByTestId('go-deeper')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the copy with the title as the h2 naming one region', () => {
    const { getByRole, getAllByRole, getByText } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(getAllByRole('region', { name: TITLE })).toHaveLength(1)
    expect(getByText(EYEBROW)).toBeInTheDocument()
    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('renders one linked card per item, in order', () => {
    const { getAllByRole } = band()

    const headings = getAllByRole('heading', { level: 3 }).map((h) => h.textContent?.trim())
    expect(headings).toEqual(items.map((item) => item.title))
  })

  it('opens only external cards in a new tab', () => {
    const { getByRole } = band()

    const internal = getByRole('link', { name: /Learning Center/ })
    const external = getByRole('link', { name: /Fintech/ })
    expect(internal.getAttribute('href')).toBe('/learning')
    expect(internal.hasAttribute('target')).toBe(false)
    expect(external.getAttribute('target')).toBe('_blank')
    expect(external.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('skips a card with no title', () => {
    const { getAllByRole } = band({
      items: [...items, { title: '', description: 'Orphan', href: '/orphan' }]
    })

    expect(getAllByRole('heading', { level: 3 })).toHaveLength(items.length)
  })

  it('does not scroll with four cards', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).hasAttribute('data-scrollable')).toBe(false)
  })

  it('scrolls past four cards', () => {
    const { getByTestId, getAllByRole } = band({ items: [...items, ...extra] })

    expect(getByTestId(TESTID).hasAttribute('data-scrollable')).toBe(true)
    expect(getAllByRole('heading', { level: 3 })).toHaveLength(items.length + extra.length)
  })

  it('renders the action button with its link', () => {
    const { getByRole } = band({ primaryAction: ACTION })

    const action = getByRole('link', { name: /See all guides/ })
    expect(action.getAttribute('href')).toBe('/docs/guides')
    expect(action.getAttribute('target')).toBe('_blank')
  })

  it('drops the action when its link is missing', () => {
    const { queryByRole } = band({ primaryAction: { label: 'See all guides', href: '' } })

    expect(queryByRole('link', { name: /See all guides/ })).toBeNull()
  })

  it('renders nothing but the root when no item has a title', () => {
    const { getByTestId, queryByRole } = band({ items: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
  })

  it('has no a11y violations', async () => {
    const { container } = band({ primaryAction: ACTION })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when scrolling', async () => {
    const { container } = band({ items: [...items, ...extra], primaryAction: ACTION })

    await expectNoA11yViolations(container)
  })
})
