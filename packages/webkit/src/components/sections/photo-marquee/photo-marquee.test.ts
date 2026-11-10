import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import PhotoMarquee from './photo-marquee.vue'

const TESTID = 'sections-photo-marquee'
const TITLE = 'Work at Azion'
const ARIA_LABEL = 'Azion offices'
const photos = [
  { src: '/careers/office-desks.jpg', alt: 'An open-plan office', width: 1066, height: 1600 },
  { src: '/careers/office-lounge.jpg', alt: 'A lounge corridor', width: 1600, height: 1066 },
  { src: '/careers/team-talk.jpg', alt: 'A team member giving a talk', width: 900, height: 1600 }
]

const band = (props: Record<string, unknown> = {}) =>
  render(PhotoMarquee, {
    props: { title: TITLE, ariaLabel: ARIA_LABEL, photos, ...props }
  })

describe('PhotoMarquee', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(PhotoMarquee, {
      props: { title: TITLE, photos },
      attrs: { 'data-testid': 'careers-photo-marquee' }
    })

    expect(getByTestId('careers-photo-marquee')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the section by its title', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
  })

  it('renders the title as the h2 when set', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('renders no heading when the title is empty', () => {
    const { queryByRole, getByTestId } = render(PhotoMarquee, { props: { photos } })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('names the scrolling region by ariaLabel', () => {
    const { getByRole } = band()

    expect(getByRole('region', { name: ARIA_LABEL })).toBeInTheDocument()
  })

  it('renders each photo once with its alt, and counts only the first copy as visible images', () => {
    const { getByRole, getAllByRole, container } = band()

    photos.forEach((photo) => {
      expect(getByRole('img', { name: photo.alt })).toHaveAttribute('src', photo.src)
    })
    expect(getAllByRole('img')).toHaveLength(photos.length)
    expect(container.querySelectorAll('img[alt=""]')).toHaveLength(photos.length)
  })

  it('renders only the section when photos is empty', () => {
    const { getByTestId, queryByRole, queryAllByRole } = render(PhotoMarquee, {
      props: { title: TITLE, ariaLabel: ARIA_LABEL, photos: [] }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('region', { name: ARIA_LABEL })).toBeNull()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryAllByRole('img')).toHaveLength(0)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = render(PhotoMarquee, { props: { title: TITLE, photos: [] } })

    await expectNoA11yViolations(container)
  })
})
