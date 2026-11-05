import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ClientMosaic from './client-mosaic.vue'

const TESTID = 'sections-client-mosaic'
const ARIA_LABEL = 'Client stories'
const LINK_LABEL = 'Read the case study'

const stories = [
  {
    logo: '/logos/netshoes.svg',
    logoAlt: 'Netshoes',
    photo: '/photos/netshoes.jpg',
    text: 'Netshoes automatically blocks more than 4 million threats in six months',
    href: '/success-case/netshoes'
  },
  {
    logo: '/logos/gpa.svg',
    logoAlt: 'GPA',
    photo: '/photos/gpa.jpg',
    text: 'GPA stops a cyberattack and reduces costs by 30%',
    href: '/success-case/gpa',
    fill: 'primary' as const,
    logoTreatment: 'knockout' as const
  }
]

const logos = [
  { logo: '/logos/dafiti.svg', logoAlt: 'Dafiti', href: '/success-case/dafiti' },
  {
    logo: '/logos/agibank.svg',
    logoAlt: 'Agibank',
    href: '/success-case/agibank',
    fill: 'white' as const,
    logoTreatment: 'knockout' as const
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ClientMosaic, {
    props: {
      ariaLabel: ARIA_LABEL,
      linkLabel: LINK_LABEL,
      stories,
      logos,
      ...props
    }
  })

describe('ClientMosaic', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ClientMosaic, {
      props: { stories, logos },
      attrs: { 'data-testid': 'home-client-mosaic' }
    })

    expect(getByTestId('home-client-mosaic')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the section with ariaLabel', () => {
    const { getByRole } = band()

    expect(getByRole('region', { name: ARIA_LABEL })).toBeInTheDocument()
  })

  it('leaves the section unnamed when ariaLabel is empty', () => {
    const { getByTestId } = render(ClientMosaic, { props: { stories, logos } })

    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('renders one case study link per story, named by linkLabel, pointing at its href', () => {
    const { getAllByRole } = band()

    const links = getAllByRole('link', { name: LINK_LABEL })
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      stories.map((story) => story.href)
    )
  })

  it('renders one mark link per logo, pointing at its href', () => {
    const { getByAltText } = band()

    logos.forEach((logo) => {
      expect(getByAltText(logo.logoAlt).closest('a')?.getAttribute('href')).toBe(logo.href)
    })
  })

  it('defaults the mark treatment to monochrome and honours knockout', () => {
    const { getByAltText } = band()

    expect(getByAltText('Netshoes').getAttribute('data-treatment')).toBe('monochrome')
    expect(getByAltText('Dafiti').getAttribute('data-treatment')).toBe('monochrome')
    expect(getByAltText('GPA').getAttribute('data-treatment')).toBe('knockout')
    expect(getByAltText('Agibank').getAttribute('data-treatment')).toBe('knockout')
  })

  it('defaults story faces to surface and mark faces to canvas, and honours fill', () => {
    const { getByText, getByAltText } = band()

    expect(getByText(stories[0].text).closest('[data-fill]')?.getAttribute('data-fill')).toBe(
      'surface'
    )
    expect(getByText(stories[1].text).closest('[data-fill]')?.getAttribute('data-fill')).toBe(
      'primary'
    )
    expect(getByAltText('Dafiti').closest('[data-fill]')?.getAttribute('data-fill')).toBe('canvas')
    expect(getByAltText('Agibank').closest('[data-fill]')?.getAttribute('data-fill')).toBe('white')
  })

  it('marks only the first story as the lead', () => {
    const { getByText, container } = band()

    expect(getByText(stories[0].text).hasAttribute('data-lead')).toBe(true)
    expect(getByText(stories[1].text).hasAttribute('data-lead')).toBe(false)
    expect(container.querySelectorAll('[data-lead]')).toHaveLength(1)
  })

  it('renders only the section when stories and logos are empty', () => {
    const { getByTestId, queryAllByRole, queryByRole } = render(ClientMosaic, {
      props: { ariaLabel: ARIA_LABEL, linkLabel: LINK_LABEL }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('link')).toBeNull()
    expect(queryAllByRole('img')).toHaveLength(0)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = render(ClientMosaic, { props: { ariaLabel: ARIA_LABEL } })

    await expectNoA11yViolations(container)
  })
})
