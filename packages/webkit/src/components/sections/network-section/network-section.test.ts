import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import NetworkSection from './network-section.vue'

const TESTID = 'sections-network-section'
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
    logoTreatment: 'as-is' as const,
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
    icon: 'pi pi-globe',
    title: 'Global resilience beyond anycast',
    description: 'Traffic is steered around failures faster than BGP can reconverge.'
  },
  {
    icon: 'pi pi-stopwatch',
    title: 'Low latency everywhere',
    description: 'Compute, AI, databases and security run close to your users.'
  },
  {
    icon: 'pi pi-arrows-v',
    title: 'Zero-ops autoscaling and failover',
    description: 'Absorbs any traffic spike with no cold starts and no capacity planning.'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(NetworkSection, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      lead: LEAD,
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

  it.each(['outcomes', 'benefits'] as const)('mirrors kind=%s on data-kind', (kind) => {
    const { getByTestId } = band({ kind })

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe(kind)
  })

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

  it('renders the lead line', () => {
    const { getByText } = band()

    expect(getByText(LEAD)).toBeInTheDocument()
  })

  it('renders one list item per claim, in order', () => {
    const { getAllByRole } = band()

    expect(getAllByRole('listitem').map((item) => item.textContent?.trim())).toEqual(claims)
  })

  it('renders one mark per outcome with its alt and treatment on the outcomes floor', () => {
    const { container, getAllByRole } = band({ kind: 'outcomes' })

    const marks = getAllByRole('img')
    expect(marks.map((mark) => mark.getAttribute('alt'))).toEqual(
      outcomes.map((outcome) => outcome.logoAlt)
    )
    expect(marks.map((mark) => mark.getAttribute('data-treatment'))).toEqual([
      'monochrome',
      'as-is',
      'as-is'
    ])
    expect(
      Array.from(container.querySelectorAll('blockquote')).map((quote) => quote.textContent?.trim())
    ).toEqual(outcomes.map((outcome) => outcome.text))
  })

  it('renders one h3 per benefit, in order, and no mark on the benefits floor', () => {
    const { getAllByRole, queryAllByRole } = band({ kind: 'benefits' })

    expect(
      getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent?.trim())
    ).toEqual(benefits.map((benefit) => benefit.title))
    expect(queryAllByRole('img')).toHaveLength(0)
  })

  it('renders the band without a floor when outcomes is empty', () => {
    const { container, getByRole, queryAllByRole } = band({ kind: 'outcomes', outcomes: [] })

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(queryAllByRole('img')).toHaveLength(0)
    expect(container.querySelectorAll('blockquote')).toHaveLength(0)
  })

  it('has no a11y violations on the outcomes floor', async () => {
    const { container } = band({ kind: 'outcomes' })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations on the benefits floor', async () => {
    const { container } = band({ kind: 'benefits' })

    await expectNoA11yViolations(container)
  })
})
