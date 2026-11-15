import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import NetworkSection from './network-section.vue'

const TESTID = 'network-section'
const EYEBROW = 'Region: Earth.'
const TITLE = 'One distributed infrastructure without the complexity of managing it'
const LEAD = 'Built around your users. Distributed around your data.'

const claims = [
  '100+ data centers',
  '100+ Tbps network capacity',
  '30 ms median latency',
  '100% availability'
]

const outcomes = [
  {
    logo: '/logos/dafiti.svg',
    logoAlt: 'Dafiti',
    logoTreatment: 'monochrome' as const,
    text: '86% faster load times, with a 45% cost reduction in data transfer.',
    highlights: ['86% faster load times', '45% cost reduction']
  },
  {
    logo: '/logos/renner.svg',
    logoAlt: 'Renner',
    logoTreatment: 'color' as const,
    text: '67% saved on data transfer, even during massive traffic spikes.',
    highlights: ['67% saved']
  },
  {
    logo: '/logos/fourbank.svg',
    logoAlt: 'Fourbank',
    text: 'DDoS mitigated on applications and APIs, with a programmable security layer.'
  }
]

const benefits = [
  {
    icon: 'ai ai-globe',
    title: 'Global resilience beyond anycast',
    description: 'Traffic is steered around failures faster than BGP can reconverge.'
  },
  {
    icon: 'ai ai-stopwatch',
    title: 'Low latency everywhere',
    description: 'Compute, AI, databases and security run close to your users.'
  },
  {
    icon: 'ai ai-move-vertical',
    title: 'Zero-ops autoscaling and failover',
    description: 'Absorbs any traffic spike with no cold starts and no capacity planning.'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(NetworkSection, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      claimsEyebrow: LEAD,
      claims,
      outcomes,
      benefits,
      ...props
    }
  })

describe('NetworkSection', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(NetworkSection, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'network-band' }
    })

    expect(getByTestId('network-band')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it.each(['outcomes', 'benefits', 'stats'] as const)(
    'mirrors variant=%s on data-variant',
    (variant) => {
      const { getByTestId } = band({ variant })

      expect(getByTestId(TESTID).getAttribute('data-variant')).toBe(variant)
    }
  )

  it('names the section after its title', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
  })

  it('renders only the section when the title is empty', () => {
    const { getByTestId, queryAllByRole, queryByText } = band({ title: '' })

    const root = getByTestId(TESTID)
    expect(root).toBeInTheDocument()
    expect(root.hasAttribute('aria-label')).toBe(false)
    expect(root.children).toHaveLength(0)
    expect(queryAllByRole('heading')).toHaveLength(0)
    expect(queryByText(LEAD)).toBeNull()
  })

  it('renders the title as the h2 of the band', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('renders the claims eyebrow', () => {
    const { getByText } = band()

    expect(getByText(LEAD)).toBeInTheDocument()
  })

  it('renders one list item per claim, in order', () => {
    const { getAllByRole } = band()

    expect(getAllByRole('listitem').map((item) => item.textContent?.trim())).toEqual(claims)
  })

  it('renders one mark per outcome with its alt and treatment on the outcomes floor', () => {
    const { container, getAllByRole } = band({ variant: 'outcomes' })

    const marks = getAllByRole('img')
    expect(marks.map((mark) => mark.getAttribute('alt'))).toEqual(
      outcomes.map((outcome) => outcome.logoAlt)
    )
    expect(marks.map((mark) => mark.getAttribute('data-treatment'))).toEqual([
      'monochrome',
      'color',
      'color'
    ])
    expect(
      Array.from(container.querySelectorAll('blockquote')).map((quote) => quote.textContent?.trim())
    ).toEqual(outcomes.map((outcome) => outcome.text))
  })

  it('renders one h3 per benefit, in order, and no mark on the benefits floor', () => {
    const { getAllByRole, queryAllByRole } = band({ variant: 'benefits' })

    expect(
      getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent?.trim())
    ).toEqual(benefits.map((benefit) => benefit.title))
    expect(queryAllByRole('img')).toHaveLength(0)
  })

  it.each([
    [1, '2'],
    [2, '2'],
    [3, '3'],
    [4, '4'],
    [5, '4']
  ])('sets the outcomes floor columns from %i outcomes to %s', (count, columns) => {
    const { container } = band({
      variant: 'outcomes',
      outcomes: Array.from({ length: count }, (_, index) => ({
        ...outcomes[0],
        logoAlt: `Client ${index}`
      }))
    })

    expect(container.querySelector('[data-columns]')?.getAttribute('data-columns')).toBe(columns)
  })

  it.each([
    [3, '3'],
    [4, '2'],
    [6, '3']
  ])('balances %i benefits on up to three columns, %s per row', (count, perRow) => {
    const { container } = band({
      variant: 'benefits',
      benefits: Array.from({ length: count }, (_, index) => ({
        ...benefits[0],
        title: `Benefit ${index}`
      }))
    })

    const floor = container.querySelector<HTMLElement>('[data-columns]')
    expect(floor?.getAttribute('data-layout')).toBe('balanced')
    expect(floor?.style.getPropertyValue('--card-grid-columns-lg')).toBe(perRow)
  })

  it('renders a benefit without an icon as a topic with its h3', () => {
    const plain = benefits.map(({ title, description }) => ({ title, description }))
    const { getAllByRole, getByText } = band({ variant: 'benefits', benefits: plain })

    expect(
      getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent?.trim())
    ).toEqual(plain.map((benefit) => benefit.title))
    expect(getByText(plain[0]!.description)).toBeInTheDocument()
  })

  it('renders one figure per stat on the stats floor', () => {
    const stats = [
      { value: '100', suffix: '+', label: 'Data centers' },
      { value: '30', suffix: 'ms', label: 'Median latency' },
      { value: '100', suffix: '+ Tbps', label: 'Network capacity' },
      { value: '100', suffix: '%', label: 'Availability' }
    ]
    const { container, getByTestId } = band({ variant: 'stats', stats })

    expect(getByTestId('stats')).toBeInTheDocument()
    const figures = Array.from(container.querySelectorAll('figure'))
    expect(figures).toHaveLength(stats.length)
    figures.forEach((figure, index) => expect(figure).toHaveTextContent(stats[index]!.label))
    expect(container.querySelectorAll('blockquote')).toHaveLength(0)
  })

  it('renders no stats floor without stats', () => {
    const { queryByTestId } = band({ variant: 'stats', stats: [] })

    expect(queryByTestId('stats')).toBeNull()
  })

  it('marks a claim that sits out the narrow band, and keeps string claims on it', () => {
    const { getAllByRole } = band({
      claims: ['100+ data centers', { label: '100% availability', mobile: false }]
    })

    const items = getAllByRole('listitem')
    expect(items.map((item) => item.textContent?.trim())).toEqual([
      '100+ data centers',
      '100% availability'
    ])
    expect(items[0]?.hasAttribute('data-mobile')).toBe(false)
    expect(items[1]).toHaveAttribute('data-mobile', 'hidden')
  })

  it('sets the anchor as the band id, and no id without one', () => {
    const { getByTestId, unmount } = band({ anchor: 'network' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'network')
    unmount()

    expect(band().getByTestId(TESTID).hasAttribute('id')).toBe(false)
  })

  it('renders an outcome without a logo as its quote alone', () => {
    const { container, queryAllByRole } = band({
      variant: 'outcomes',
      outcomes: [
        { text: '7x faster pages', highlights: ['7x'] },
        { text: '90% lower cloud costs', highlights: ['90%'] }
      ]
    })

    expect(queryAllByRole('img')).toHaveLength(0)
    expect(container.querySelectorAll('blockquote')).toHaveLength(2)
  })

  it('renders the band without a floor when outcomes is empty', () => {
    const { container, getByRole, queryAllByRole } = band({ variant: 'outcomes', outcomes: [] })

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(queryAllByRole('img')).toHaveLength(0)
    expect(container.querySelectorAll('blockquote')).toHaveLength(0)
  })

  it('has no a11y violations on the outcomes floor', async () => {
    const { container } = band({ variant: 'outcomes' })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations on the benefits floor', async () => {
    const { container } = band({ variant: 'benefits' })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations on the stats floor', async () => {
    const { container } = band({
      variant: 'stats',
      stats: [
        { value: '100', suffix: '+', label: 'Data centers' },
        { value: '30', suffix: 'ms', label: 'Median latency' }
      ]
    })

    await expectNoA11yViolations(container)
  })
})
