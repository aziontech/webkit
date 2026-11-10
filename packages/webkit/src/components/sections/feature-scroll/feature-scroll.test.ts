import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import FeatureScroll from './feature-scroll.vue'

const TESTID = 'sections-feature-scroll'
const EYEBROW = 'Workloads'
const TITLE = 'Everything a workload does, one screen at a time'
const DESCRIPTION = 'Scroll through the console a workload is run from.'

const items = [
  {
    title: 'Every workload on one list',
    description: 'See each workload with its domain, status and last deployment.',
    illustration: 'stay-in-control',
    action: { label: 'List docs', href: '/docs/list', trailing: true }
  },
  {
    title: 'Read the deployment topology',
    description: 'The domains, the application and the firewall a workload serves.',
    illustration: 'global-network',
    action: { label: 'Topology docs', href: '/docs/topology', trailing: true }
  },
  {
    title: 'Domains and TLS, handled',
    description: 'Add a domain and get its certificate issued and renewed.',
    illustration: 'dns-protection'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(FeatureScroll, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      items,
      ...props
    }
  })

describe('FeatureScroll', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(FeatureScroll, {
      props: { title: TITLE, items },
      attrs: { 'data-testid': 'workloads-feature-scroll' }
    })

    expect(getByTestId('workloads-feature-scroll')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the section after its title', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
  })

  it('renders the title as the h2 of the band', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('leaves the section unnamed and headerless when no title is set', () => {
    const { getByTestId, queryByRole } = render(FeatureScroll, { props: { items } })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('renders one media tile per item, in order, on the small layout', () => {
    const { getAllByTestId } = band()

    const tiles = getAllByTestId('marketing-media-tile')
    expect(tiles).toHaveLength(items.length)
    tiles.forEach((tile, index) => {
      expect(within(tile).getByText(items[index].title)).toBeInTheDocument()
    })
  })

  it('renders one step heading per item, in order, on the large layout', () => {
    const { getAllByRole } = band()

    expect(
      getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent?.trim())
    ).toEqual(items.map((item) => item.title))
  })

  it('renders each item action as a link to its href', () => {
    const { getAllByRole } = band()

    items
      .filter((item) => item.action)
      .forEach((item) => {
        const links = getAllByRole('link', { name: item.action?.label })
        expect(links.length).toBeGreaterThanOrEqual(1)
        links.forEach((link) => expect(link).toHaveAttribute('href', item.action?.href))
      })
  })

  it('renders no link for an item without an action', () => {
    const { queryByRole } = render(FeatureScroll, {
      props: { title: TITLE, items: [items[2]] }
    })

    expect(queryByRole('link')).toBeNull()
  })

  it('renders only the section when items is empty', () => {
    const { getByTestId, queryAllByRole, queryByRole, queryByTestId } = render(FeatureScroll, {
      props: { eyebrow: EYEBROW, title: TITLE, description: DESCRIPTION, items: [] }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryAllByRole('heading', { level: 3 })).toHaveLength(0)
    expect(queryByTestId('layout-frame-box')).toBeNull()
    expect(queryByTestId('marketing-sticky-stack')).toBeNull()
  })

  it('renders only the section when items is omitted', () => {
    const { getByTestId, queryAllByRole } = render(FeatureScroll)

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByRole('heading')).toHaveLength(0)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = render(FeatureScroll, { props: { title: TITLE, items: [] } })

    await expectNoA11yViolations(container)
  })
})
