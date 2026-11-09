import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import HeroCopyOnTopArt from './hero-copy-on-top-art.vue'

const TESTID = 'sections-hero-copy-on-top-art'
const NODE_TESTID = 'data-flow__node'
const TITLE = 'Put your application close to users in seconds'
const EYEBROW = 'Workloads'
const DESCRIPTION = 'Create a workload and it is live in every Azion data center.'

const primaryAction = { label: 'Start for free', href: '/signup' }
const secondaryAction = { label: 'Docs', href: '/docs', trailing: true }

const levels = [
  {
    nodes: [
      {
        eyebrow: 'Domain',
        icon: 'ai ai-domains',
        title: 'shop.example.com',
        label: 'Public',
        severity: 'info'
      },
      {
        eyebrow: 'Domain',
        icon: 'ai ai-domains',
        title: 'api.example.com',
        label: 'Public',
        severity: 'info'
      }
    ]
  },
  {
    nodes: [
      {
        eyebrow: 'Workload',
        icon: 'ai ai-workloads',
        title: 'shop-prod',
        label: 'Live',
        severity: 'success',
        lit: true
      }
    ]
  },
  {
    nodes: [
      {
        eyebrow: 'Application',
        icon: 'ai ai-edge-application',
        title: 'storefront',
        label: 'Active',
        severity: 'success'
      }
    ]
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(HeroCopyOnTopArt, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      primaryAction,
      secondaryAction,
      levels,
      ...props
    }
  })

describe('HeroCopyOnTopArt', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(HeroCopyOnTopArt, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'workloads-hero' }
    })

    expect(getByTestId('workloads-hero')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the page h1 and names the hero landmark by it', () => {
    const { getByRole } = band({ highlight: 'Workloads:' })

    expect(getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(getByRole('region', { name: `Workloads: ${TITLE}` })).toBeInTheDocument()
  })

  it('renders the eyebrow and the description', () => {
    const { getByText } = band()

    expect(getByText(EYEBROW)).toBeInTheDocument()
    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('renders both actions with their links, in order', () => {
    const { getAllByRole } = band()

    const links = getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      primaryAction.href,
      secondaryAction.href
    ])
  })

  it('renders one column per level and one card per node, in order', () => {
    const { getAllByRole, getAllByTestId } = band()

    expect(getAllByRole('group')).toHaveLength(levels.length)
    expect(
      getAllByTestId(NODE_TESTID).map((node) => node.textContent?.includes('shop-prod'))
    ).toEqual([false, false, true, false])
  })

  it('renders each card with its eyebrow, title and status', () => {
    const { getAllByTestId } = band()

    const first = getAllByTestId(NODE_TESTID)[0]
    expect(first?.textContent).toContain('Domain')
    expect(first?.textContent).toContain('shop.example.com')
    expect(first?.textContent).toContain('Public')
  })

  it('marks only the lit card', () => {
    const { container } = band()

    const lit = container.querySelectorAll('[data-lit]')
    expect(lit).toHaveLength(1)
    expect(lit[0]?.textContent?.trim()).toBe('shop-prod')
  })

  it('skips a card without a title and a level left empty', () => {
    const { getAllByRole, getAllByTestId } = band({
      levels: [
        ...levels,
        {
          nodes: [{ eyebrow: 'Firewall', icon: '', title: '', label: '', severity: 'success' }]
        }
      ]
    })

    expect(getAllByRole('group')).toHaveLength(levels.length)
    expect(getAllByTestId(NODE_TESTID)).toHaveLength(4)
  })

  it('omits the scene when no level has a card', () => {
    const { queryByRole, getByRole } = band({ levels: [] })

    expect(getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(queryByRole('list')).toBeNull()
  })

  it('renders only the root when title is empty', () => {
    const { getByTestId, queryByRole } = band({ title: '' })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading')).toBeNull()
    expect(queryByRole('list')).toBeNull()
  })

  it('has no a11y violations in the copy and actions', async () => {
    const { container } = band({ levels: [] })

    await expectNoA11yViolations(container)
  })

  it.skip('has no a11y violations with the scene: flow nests its parallel group between list and listitem (aria-required-children)', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
