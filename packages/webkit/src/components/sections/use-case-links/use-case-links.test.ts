import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import UseCaseLinks from './use-case-links.vue'

const TESTID = 'sections-use-case-links'
const EYEBROW = 'Use Cases'
const TITLE = 'What teams use Application Accelerator for'
const DESCRIPTION =
  'Cache what standard CDN caching cannot, with the methods, query strings and cookies you choose.'

const items = [
  {
    icon: 'pi pi-code',
    title: 'Accelerate REST and GraphQL APIs',
    description:
      'Cache API responses with query string and cookie-based segmentation for faster client applications.',
    href: '/solutions/api-gateway'
  },
  {
    icon: 'pi pi-shopping-cart',
    title: 'Optimize product catalogs',
    description: 'Segment listings by category, region, and user preferences with cache key rules.',
    href: '/solutions/application-acceleration'
  },
  {
    icon: 'pi pi-bolt',
    title: 'Reduce API latency',
    description: 'Short TTLs for rapidly changing data endpoints and real-time applications.',
    href: '/docs'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(UseCaseLinks, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      items,
      ...props
    }
  })

describe('UseCaseLinks', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(UseCaseLinks, {
      props: { title: TITLE, items },
      attrs: { 'data-testid': 'accelerator-use-case-links' }
    })

    expect(getByTestId('accelerator-use-case-links')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the section after its title and renders it as the h2', () => {
    const { getByRole, getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('leaves the section unnamed and without a header when no title is set', () => {
    const { getByTestId, queryByRole } = render(UseCaseLinks, {
      props: { eyebrow: EYEBROW, description: DESCRIPTION, items }
    })

    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
    expect(queryByRole('heading', { level: 2 })).toBeNull()
  })

  it('renders one h3 per item, in order', () => {
    const { getAllByRole } = band()

    expect(
      getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent?.trim())
    ).toEqual(items.map((item) => item.title))
  })

  it('renders each item as a link to its href', () => {
    const { getAllByRole } = band()

    expect(getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(
      items.map((item) => item.href)
    )
  })

  it('renders only the section when items is empty', () => {
    const { getByTestId, queryAllByRole, queryByRole, queryByTestId } = render(UseCaseLinks, {
      props: { eyebrow: EYEBROW, title: TITLE, description: DESCRIPTION, items: [] }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading')).toBeNull()
    expect(queryAllByRole('link')).toHaveLength(0)
    expect(queryByTestId('layout-frame-box')).toBeNull()
  })

  it('renders only the section when items is omitted', () => {
    const { getByTestId, queryAllByRole } = render(UseCaseLinks)

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByRole('heading')).toHaveLength(0)
    expect(queryAllByRole('link')).toHaveLength(0)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = render(UseCaseLinks, { props: { title: TITLE, items: [] } })

    await expectNoA11yViolations(container)
  })
})
