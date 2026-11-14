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
    const { getByRole } = band()

    logos.forEach((logo) => {
      expect(getByRole('img', { name: logo.logoAlt }).closest('a')?.getAttribute('href')).toBe(
        logo.href
      )
    })
  })

  it('defaults the mark treatment to monochrome and honours knockout', () => {
    const { getByRole } = band()

    expect(getByRole('img', { name: 'Netshoes' }).getAttribute('data-treatment')).toBe('monochrome')
    expect(getByRole('img', { name: 'Dafiti' }).getAttribute('data-treatment')).toBe('monochrome')
    expect(getByRole('img', { name: 'GPA' }).getAttribute('data-treatment')).toBe('knockout')
    expect(getByRole('img', { name: 'Agibank' }).getAttribute('data-treatment')).toBe('knockout')
  })

  it('defaults story faces to surface and mark faces to canvas, and honours fill', () => {
    const { getByText, getByRole } = band()

    expect(getByText(stories[0].text).closest('[data-fill]')?.getAttribute('data-fill')).toBe(
      'surface'
    )
    expect(getByText(stories[1].text).closest('[data-fill]')?.getAttribute('data-fill')).toBe(
      'primary'
    )
    expect(
      getByRole('img', { name: 'Dafiti' }).closest('[data-fill]')?.getAttribute('data-fill')
    ).toBe('canvas')
    expect(
      getByRole('img', { name: 'Agibank' }).closest('[data-fill]')?.getAttribute('data-fill')
    ).toBe('white')
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

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'clients' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'clients')
  })

  it('renders a story without a photo on its fill', () => {
    const { getByText, container } = band({
      stories: [{ ...stories[0], photo: undefined }],
      logos: []
    })

    expect(getByText(stories[0].text)).toBeInTheDocument()
    expect(container.querySelector('img[src="/photos/netshoes.jpg"]')).toBeNull()
  })

  it('places ordered cells with their own spans, interleaving stories and marks', () => {
    const { container, getByRole, getByText } = band({
      cells: [
        { ...stories[0], span: '2', rows: '2' },
        { logo: '/logos/dafiti.svg', logoAlt: 'Dafiti', href: '/success-case/dafiti' },
        {
          logo: '/logos/gpa.svg',
          logoAlt: 'GPA',
          text: stories[1].text,
          href: '/success-case/gpa',
          rows: '2',
          stacked: true
        },
        {
          logo: '/logos/agibank.svg',
          logoAlt: 'Agibank',
          href: '/success-case/agibank',
          logoTreatment: 'as-is'
        }
      ]
    })

    const placed = Array.from(container.querySelectorAll<HTMLElement>('[data-cell]'))
    expect(placed.map((cell) => cell.dataset.cell)).toEqual(['story', 'logo', 'story', 'logo'])
    expect(placed.map((cell) => [cell.dataset.span, cell.dataset.rows])).toEqual([
      ['2', '2'],
      ['1', '1'],
      ['1', '2'],
      ['1', '1']
    ])
    expect(getByText(stories[0].text)).toHaveAttribute('data-lead')
    expect(getByText(stories[1].text)).not.toHaveAttribute('data-lead')
    expect(getByText(stories[1].text).closest('[data-fill]')).toHaveAttribute('data-fill', 'canvas')
    expect(getByRole('img', { name: 'GPA' })).toHaveAttribute('data-stacked')
    expect(getByRole('img', { name: 'Agibank' })).toHaveAttribute('data-kind', 'color')
    expect(getByRole('img', { name: 'Dafiti' })).toHaveAttribute('data-kind', 'monochrome')
    expect(container.querySelector('img[src="/photos/netshoes.jpg"]')).not.toBeNull()
  })

  it('lets cells replace stories and logos', () => {
    const { queryByRole } = band({
      cells: [{ logo: '/logos/zoop.svg', logoAlt: 'Zoop', href: '/success-case/zoop' }]
    })

    expect(queryByRole('img', { name: 'Zoop' })).not.toBeNull()
    expect(queryByRole('img', { name: 'Netshoes' })).toBeNull()
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
