import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import LogoWallQuote from './logo-wall-quote.vue'

const TESTID = 'sections-logo-wall-quote'
const TITLE = "Trusted by the world's largest banks"
const quote = {
  text: 'Azion delivered the protection we needed.',
  name: 'Ismael Aguilar',
  jobTitle: 'Information Security Manager at Zoop',
  logo: '/logos/zoop.svg',
  logoAlt: 'Zoop'
}
const primaryAction = {
  label: 'Read the case study',
  href: '/success-case/zoop',
  trailing: true,
  target: '_blank' as const
}

const logos = [
  { name: 'Magalu', logo: '/logos/magalu.svg', href: '/success-case/magalu' },
  {
    name: 'Banco',
    logo: '/logos/banco.svg',
    logoTreatment: 'monochrome' as const,
    href: '/success-case/banco'
  },
  {
    name: 'Agibank',
    logo: '/logos/agibank-reversed.svg',
    logoLight: '/logos/agibank-color.svg',
    href: '/success-case/agibank'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(LogoWallQuote, {
    props: {
      eyebrow: 'Customers',
      title: TITLE,
      ariaLabel: 'Companies on Azion',
      logos,
      quote,
      primaryAction,
      ...props
    }
  })

describe('LogoWallQuote', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(LogoWallQuote, {
      props: { title: TITLE, logos },
      attrs: { 'data-testid': 'customers-band' }
    })

    expect(getByTestId('customers-band')).toBeInTheDocument()
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

  it('renders one mark image per logo, named by its client', () => {
    const { getByRole } = band()

    expect(getByRole('img', { name: 'Magalu' })).toHaveAttribute('src', '/logos/magalu.svg')
    expect(getByRole('img', { name: 'Banco' })).toHaveAttribute('src', '/logos/banco.svg')
  })

  it('reflects logoTreatment on the mark, defaulting to as-is', () => {
    const { getByRole } = band()

    expect(getByRole('img', { name: 'Magalu' })).toHaveAttribute('data-treatment', 'as-is')
    expect(getByRole('img', { name: 'Banco' })).toHaveAttribute('data-treatment', 'monochrome')
  })

  it('renders two theme images for a logo with logoLight', () => {
    const { getAllByRole } = band()

    const marks = getAllByRole('img', { name: 'Agibank' })
    expect(marks).toHaveLength(2)
    expect(marks.map((mark) => mark.getAttribute('src'))).toEqual([
      '/logos/agibank-reversed.svg',
      '/logos/agibank-color.svg'
    ])
  })

  it('renders the quote text and its action link', () => {
    const { getByText, getByRole } = band()

    expect(getByText(quote.text)).toBeInTheDocument()
    expect(getByRole('link', { name: primaryAction.label })).toHaveAttribute(
      'href',
      primaryAction.href
    )
  })

  it('renders no quote and no link when they are omitted', () => {
    const { queryByText, queryByRole } = render(LogoWallQuote, {
      props: { title: TITLE, logos }
    })

    expect(queryByText(quote.text)).toBeNull()
    expect(queryByRole('link', { name: primaryAction.label })).toBeNull()
  })

  it('renders only the section when logos is empty', () => {
    const { getByTestId, queryByRole, queryAllByRole } = render(LogoWallQuote, {
      props: { eyebrow: 'Customers', title: TITLE, logos: [] }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryAllByRole('img')).toHaveLength(0)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = render(LogoWallQuote, { props: { title: TITLE, logos: [] } })

    await expectNoA11yViolations(container)
  })
})
