import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ComplianceBadges from './compliance-badges.vue'

const TESTID = 'sections-compliance-badges'
const TITLE = 'Meet your compliance requirements'
const EYEBROW = 'Compliance'
const ARIA_LABEL = 'Compliance certifications'
const primaryAction = { label: 'See more', href: '/compliance' }

const certifications = [
  { label: 'SOC 2 & 3', badge: '/badges/soc.svg', alt: 'AICPA SOC 2 Type 2 and SOC 3 badge' },
  { label: 'PCI DSS', badge: '/badges/pci.svg', alt: 'PCI DSS badge' },
  { label: 'LGPD', badge: '/badges/lgpd.svg', alt: 'LGPD badge' }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ComplianceBadges, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      ariaLabel: ARIA_LABEL,
      certifications,
      primaryAction,
      ...props
    }
  })

describe('ComplianceBadges', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ComplianceBadges, {
      props: { title: TITLE, certifications },
      attrs: { 'data-testid': 'custom-compliance' }
    })

    expect(getByTestId('custom-compliance')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the section with the title', () => {
    const { getByRole } = band()

    expect(getByRole('region', { name: TITLE })).toBeInTheDocument()
  })

  it('renders only the section when the title is empty', () => {
    const { getByTestId, queryByRole, queryAllByRole } = render(ComplianceBadges, {
      props: { certifications, primaryAction }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryAllByRole('img')).toHaveLength(0)
  })

  it('renders the title as the h2', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('renders one image per certification, in order, with its alt', () => {
    const { getAllByRole } = band()

    const images = getAllByRole('img')
    expect(images.map((image) => image.getAttribute('alt'))).toEqual(
      certifications.map((certification) => certification.alt)
    )
  })

  it('renders each pill label', () => {
    const { getByText } = band()

    certifications.forEach((certification) => {
      expect(getByText(certification.label)).toBeInTheDocument()
    })
  })

  it('renders the see-more link with its href and label when the action is set', () => {
    const { getByRole } = band()

    expect(getByRole('link', { name: primaryAction.label })).toHaveAttribute(
      'href',
      primaryAction.href
    )
  })

  it('renders no link when the primary action is omitted', () => {
    const { queryByRole } = render(ComplianceBadges, { props: { title: TITLE, certifications } })

    expect(queryByRole('link')).toBeNull()
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations without the see-more link', async () => {
    const { container } = render(ComplianceBadges, { props: { title: TITLE, certifications } })

    await expectNoA11yViolations(container)
  })
})
