import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import InvestorMarks from './investor-marks.vue'

const TESTID = 'sections-investor-marks'
const EYEBROW = 'Investors'
const TITLE = 'Backed by visionary investors'
const LINK_LABEL = 'Visit website'

const items = [
  {
    name: 'monashees+',
    logo: '/logos/monashees-reversed.svg',
    logoLight: '/logos/monashees-mono.svg',
    href: 'https://www.monashees.com'
  },
  {
    name: 'Qualcomm Ventures',
    logo: '/logos/qualcomm-reversed.svg',
    href: 'https://www.qualcommventures.com'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(InvestorMarks, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      linkLabel: LINK_LABEL,
      items,
      ...props
    }
  })

describe('InvestorMarks', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(InvestorMarks, {
      props: { title: TITLE, items },
      attrs: { 'data-testid': 'company-investor-marks' }
    })

    expect(getByTestId('company-investor-marks')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the section with the title', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toHaveAttribute('aria-label', TITLE)
  })

  it('renders the title as the h2 when set', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('renders one link per item, in order, with href and accessible name', () => {
    const { getAllByRole } = band()

    const links = getAllByRole('link')
    expect(links).toHaveLength(items.length)
    links.forEach((link, index) => {
      expect(link).toHaveAttribute('href', items[index].href)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('aria-label')).toBe(
        `${LINK_LABEL}, ${items[index].name} (opens in a new tab)`
      )
    })
  })

  it('renders the dark and light marks for an item with logoLight', () => {
    const { getByTestId } = render(InvestorMarks, {
      props: { items: [items[0]] }
    })

    const images = getByTestId(TESTID).querySelectorAll('img')
    expect(images).toHaveLength(2)
    expect(images[0].getAttribute('src')).toBe(items[0].logo)
    expect(images[1].getAttribute('src')).toBe(items[0].logoLight)
    expect(images[0].getAttribute('alt')).toBe(items[0].name)
    expect(images[1].getAttribute('alt')).toBe(items[0].name)
  })

  it('renders a single mark for an item without logoLight', () => {
    const { getByTestId } = render(InvestorMarks, {
      props: { items: [items[1]] }
    })

    const images = getByTestId(TESTID).querySelectorAll('img')
    expect(images).toHaveLength(1)
    expect(images[0].getAttribute('src')).toBe(items[1].logo)
  })

  it('renders only the section when items is empty', () => {
    const { getByTestId, queryAllByRole, queryByRole } = render(InvestorMarks, {
      props: { eyebrow: EYEBROW, title: TITLE, linkLabel: LINK_LABEL, items: [] }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryAllByRole('link')).toHaveLength(0)
  })

  it('renders only the section when items is omitted', () => {
    const { getByTestId, queryAllByRole } = render(InvestorMarks)

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByRole('link')).toHaveLength(0)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = render(InvestorMarks, { props: { title: TITLE, items: [] } })

    await expectNoA11yViolations(container)
  })
})
