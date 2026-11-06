import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import MediaSplitBand from './media-split-band.vue'

const TESTID = 'sections-media-split-band'
const SPLIT_TESTID = 'marketing-media-split'
const EYEBROW = 'Our values'
const TITLE = 'Four values shape every role at Azion'
const DESCRIPTION = 'Quality, Drive, Accountability, and Innovation.'

const primaryAction = { label: 'Join us', href: '/careers' }
const secondaryAction = { label: 'Read the culture', href: '/culture', trailing: true }

const image = {
  src: '/marketing-components/illustrations/branches.svg',
  alt: 'Branches of a deployment',
  width: 360,
  height: 165
}

const band = (props: Record<string, unknown> = {}) =>
  render(MediaSplitBand, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      image,
      ...props
    }
  })

describe('MediaSplitBand', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(MediaSplitBand, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'values-band' }
    })

    expect(getByTestId('values-band')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the h2 that names the band region', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(getByRole('region', { name: TITLE })).toBeInTheDocument()
  })

  it('renders the eyebrow and the description', () => {
    const { getByText } = band()

    expect(getByText(EYEBROW)).toBeInTheDocument()
    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it.each(['medium', 'large'] as const)('forwards size=%s to the media split', (size) => {
    const { getByTestId } = band({ size })

    expect(getByTestId(SPLIT_TESTID).getAttribute('data-size')).toBe(size)
  })

  it('defaults to the medium size', () => {
    const { getByTestId } = band()

    expect(getByTestId(SPLIT_TESTID).getAttribute('data-size')).toBe('medium')
  })

  it('renders an image with its alt and intrinsic size', () => {
    const { getByRole } = band()

    const picture = getByRole('img', { name: image.alt })
    expect(picture.getAttribute('src')).toBe(image.src)
    expect(picture.getAttribute('width')).toBe('360')
    expect(picture.getAttribute('height')).toBe('165')
  })

  it('draws the scene instead of the image when both are set', async () => {
    const { container, getByTestId } = band({ scene: { component: 'BrandGlobeScene' } })

    expect(container.querySelector(`img[src="${image.src}"]`)).toBeNull()
    await waitFor(
      () => expect(getByTestId(SPLIT_TESTID).getAttribute('data-media')).not.toBeNull(),
      { timeout: 5000 }
    )
  })

  it('omits the media cell when no media is set', () => {
    const { getByTestId } = band({ image: undefined })

    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media')).toBe(false)
  })

  it('links the whole band to its only action', () => {
    const { getByTestId, getAllByRole } = band({ primaryAction })

    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-href')).toBe(true)
    expect(
      getAllByRole('link').some((link) => link.getAttribute('href') === primaryAction.href)
    ).toBe(true)
  })

  it('leaves the band unlinked with two actions and renders both buttons in order', () => {
    const { getByTestId, getAllByRole } = band({ primaryAction, secondaryAction })

    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-href')).toBe(false)
    expect(getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      primaryAction.href,
      secondaryAction.href
    ])
  })

  it('is not a link without actions', () => {
    const { getByTestId, queryAllByRole } = band()

    expect(getByTestId(SPLIT_TESTID).hasAttribute('data-media-href')).toBe(false)
    expect(queryAllByRole('link')).toHaveLength(0)
  })

  it('renders only the root when title is empty', () => {
    const { getByTestId, queryByTestId } = band({ title: '' })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByTestId(SPLIT_TESTID)).toBeNull()
  })

  it('has no a11y violations with two actions', async () => {
    const { container } = band({ primaryAction, secondaryAction })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when the band links', async () => {
    const { container } = band({ primaryAction })

    await expectNoA11yViolations(container)
  })
})
