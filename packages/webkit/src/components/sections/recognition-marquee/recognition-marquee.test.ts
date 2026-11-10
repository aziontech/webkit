import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import RecognitionMarquee from './recognition-marquee.vue'

const TESTID = 'sections-recognition-marquee'
const TITLE = 'Recognized as a market leader'
const ARIA_LABEL = 'Analyst recognitions'

const items = [
  {
    text: 'Named a Leader and Fast Mover.',
    reportName: 'GigaOm Radar for Full-Stack Edge Deployments',
    date: 'May 2026',
    firmName: 'GigaOm',
    logo: '/logos/gigaom-reversed.svg',
    logoLight: '/logos/gigaom-color.svg'
  },
  {
    text: 'Recognized as a Leader in CDN.',
    reportName: 'G2 Reports',
    date: 'March 2026',
    firmName: 'G2',
    logo: '/logos/g2.svg'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(RecognitionMarquee, {
    props: { eyebrow: 'Analysts', title: TITLE, ariaLabel: ARIA_LABEL, items, ...props }
  })

const outsideCopy = (container: HTMLElement, text: string) =>
  Array.from(container.querySelectorAll('*'))
    .filter((el) => el.textContent?.trim() === text && el.children.length === 0)
    .filter((el) => el.closest('[aria-hidden="true"]') === null)

describe('RecognitionMarquee', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(RecognitionMarquee, {
      props: { title: TITLE, items },
      attrs: { 'data-testid': 'home-recognitions' }
    })

    expect(getByTestId('home-recognitions')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the section by its title', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
  })

  it('renders the title as the h2', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('renders the strip as a region named by ariaLabel', () => {
    const { getByRole } = band()

    expect(getByRole('region', { name: ARIA_LABEL })).toHaveAttribute('tabindex', '0')
  })

  it('renders each recognition text twice, once in the duplicate copy hidden from assistive tech', () => {
    const { getAllByText, container } = band()

    for (const item of items) {
      expect(getAllByText(item.text)).toHaveLength(2)
      expect(outsideCopy(container, item.text)).toHaveLength(1)
    }
  })

  it('marks the second list as the aria-hidden duplicate', () => {
    const { container } = band()

    const lists = container.querySelectorAll('ul')
    expect(lists).toHaveLength(2)
    expect(lists[0].getAttribute('aria-hidden')).toBeNull()
    expect(lists[1].getAttribute('aria-hidden')).toBe('true')
  })

  it('renders each firm mark with the firm name as alt text in both copies', () => {
    const { getAllByAltText } = band()

    expect(getAllByAltText('G2')).toHaveLength(2)
    expect(getAllByAltText('GigaOm')).toHaveLength(4)
  })

  it('renders only the section when items is empty', () => {
    const { getByTestId, queryByRole, queryAllByRole } = render(RecognitionMarquee, {
      props: { title: TITLE, ariaLabel: ARIA_LABEL, items: [] }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('region', { name: ARIA_LABEL })).toBeNull()
    expect(queryAllByRole('heading')).toHaveLength(0)
  })

  it('renders only the section when items is omitted', () => {
    const { getByTestId, queryAllByRole } = render(RecognitionMarquee)

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByRole('heading')).toHaveLength(0)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
