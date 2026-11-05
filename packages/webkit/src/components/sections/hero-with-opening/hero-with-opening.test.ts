import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import HeroWithOpening from './hero-with-opening.vue'

const TESTID = 'sections-hero-with-opening'
const TITLE_TESTID = 'marketing-hero-title'
const CELL_TESTID = 'marketing-card-grid-cell'
const SHORT_TITLE = 'One gateway for all your AI applications'
const LONG_TITLE = 'Programmable firewall for distributed applications'
const EYEBROW = 'Firewall'
const DESCRIPTION = 'Protect users, applications, and networks with rules you program.'

const primaryAction = { label: 'Start for free', href: '/signup' }
const secondaryAction = { label: 'Docs', href: '/docs', trailing: true }

const items = [
  {
    icon: 'pi pi-shield',
    title: 'Programmable rule engine',
    description: 'Define custom rules across OSI layers L3-L7.'
  },
  {
    icon: 'pi pi-code',
    title: 'Extensible with Functions',
    description: 'Run custom JavaScript security code.'
  },
  {
    icon: 'pi pi-sync',
    title: 'Real-time synchronization',
    description: 'Rules sync automatically across every data center.'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(HeroWithOpening, {
    props: {
      eyebrow: EYEBROW,
      title: LONG_TITLE,
      description: DESCRIPTION,
      primaryAction,
      secondaryAction,
      items,
      ...props
    }
  })

describe('HeroWithOpening', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(HeroWithOpening, {
      props: { title: LONG_TITLE },
      attrs: { 'data-testid': 'firewall-hero' }
    })

    expect(getByTestId('firewall-hero')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the page h1 and names the hero landmark by it', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 1, name: LONG_TITLE })).toBeInTheDocument()
    expect(getByRole('region', { name: LONG_TITLE })).toBeInTheDocument()
  })

  it('renders the eyebrow and the description', () => {
    const { getByText } = band()

    expect(getByText(EYEBROW)).toBeInTheDocument()
    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it.each([
    [SHORT_TITLE, 'xl'],
    [LONG_TITLE, '4xl']
  ])('caps the headline column for "%s" at %s', (title, width) => {
    const { getByTestId } = band({ title })

    expect(getByTestId(TITLE_TESTID).getAttribute('data-width')).toBe(width)
  })

  it('renders both actions with their links, in order', () => {
    const { getAllByRole } = band()

    expect(getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      primaryAction.href,
      secondaryAction.href
    ])
  })

  it('skips an action without a label', () => {
    const { getAllByRole } = band({ primaryAction: { label: '', href: '/signup' } })

    expect(getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      secondaryAction.href
    ])
  })

  it('renders one cell per item, in order, each with an h2', () => {
    const { getAllByTestId, getAllByRole } = band()

    expect(getAllByTestId(CELL_TESTID)).toHaveLength(items.length)
    expect(
      getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent?.trim())
    ).toEqual(items.map((item) => item.title))
  })

  it('omits the grid and its gap when items is empty', () => {
    const { getByRole, queryAllByTestId, queryByTestId } = band({ items: [] })

    expect(getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(queryAllByTestId(CELL_TESTID)).toHaveLength(0)
    expect(queryByTestId('marketing-section-gap')).toBeNull()
  })

  it('renders only the root when title is empty', () => {
    const { getByTestId, queryByRole, queryAllByTestId } = band({ title: '' })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading')).toBeNull()
    expect(queryAllByTestId(CELL_TESTID)).toHaveLength(0)
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
