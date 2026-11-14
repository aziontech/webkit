import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import HeroBand from './hero-band.vue'

const TESTID = 'sections-hero-band'
const HERO_TESTID = 'marketing-hero'
const TITLE = 'Deliver content fast, worldwide'
const HIGHLIGHT = 'Build and run applications'
const EYEBROW = 'Cache'
const DESCRIPTION = 'Serve cached content close to users.'
const MARKS = ['global-fashion-group', 'herospark', 'itau']

const primaryAction = { label: 'Start for free', href: '/signup' }
const secondaryAction = { label: 'Docs', href: '/docs', trailing: true }

const band = (props: Record<string, unknown> = {}) =>
  render(HeroBand, {
    props: {
      kind: 'title-band',
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      primaryAction,
      secondaryAction,
      ...props
    }
  })

describe('HeroBand', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(HeroBand, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'page-hero' }
    })

    expect(getByTestId('page-hero')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it.each(['centered', 'title-band', 'pixel-floor', 'copy-beside-art'] as const)(
    'mirrors kind=%s on data-kind',
    (kind) => {
      const { getByTestId } = band({ kind })

      expect(getByTestId(TESTID).getAttribute('data-kind')).toBe(kind)
    }
  )

  it('defaults to the title-band kind as a band-height hero', () => {
    const { getByTestId } = render(HeroBand, { props: { title: TITLE } })

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe('title-band')
    expect(getByTestId(HERO_TESTID).getAttribute('data-kind')).toBe('band')
    expect(getByTestId(HERO_TESTID).getAttribute('data-size')).toBe('medium')
  })

  it('takes the site header token out of a screen-filling band, and nothing out of a band', async () => {
    const { getByTestId, rerender } = band({ kind: 'centered' })

    expect(getByTestId(HERO_TESTID).getAttribute('data-kind')).toBe('screen')
    expect(getByTestId(HERO_TESTID).style.getPropertyValue('--banner-offset')).toBe(
      'var(--layout-header-height)'
    )

    await rerender({ headerOffset: '' })
    expect(getByTestId(HERO_TESTID).style.getPropertyValue('--banner-offset')).toBe('')

    await rerender({ kind: 'title-band', headerOffset: 'var(--layout-header-height)' })
    expect(getByTestId(HERO_TESTID).style.getPropertyValue('--banner-offset')).toBe('')
  })

  it('sets a short headline on the narrow measure in the centered layouts only', () => {
    for (const kind of ['centered', 'title-band', 'centered-band']) {
      const { getByTestId, unmount } = band({ kind })
      expect(getByTestId(TESTID)).toHaveAttribute('data-title-measure', 'narrow')
      unmount()
    }
    for (const props of [
      { kind: 'centered', titleLength: 'long' },
      { kind: 'compact-band' },
      { kind: 'copy-beside-art' },
      { kind: 'pixel-floor' }
    ]) {
      const { getByTestId, unmount } = band(props)
      expect(getByTestId(TESTID)).not.toHaveAttribute('data-title-measure')
      unmount()
    }
  })

  it('passes size to the hero rhythm', () => {
    const { getByTestId } = band({ size: 'large' })

    expect(getByTestId(HERO_TESTID).getAttribute('data-size')).toBe('large')
  })

  it.each(['centered', 'pixel-floor', 'copy-beside-art'] as const)(
    'fills a screen with kind=%s',
    (kind) => {
      const { getByTestId } = band({ kind })

      expect(getByTestId(HERO_TESTID).getAttribute('data-kind')).toBe('screen')
    }
  )

  it('renders the title as the page h1 with its highlight', () => {
    const { getByRole } = band({ highlight: HIGHLIGHT })

    expect(getByRole('heading', { level: 1 }).textContent?.replace(/\s+/g, ' ').trim()).toBe(
      `${HIGHLIGHT} ${TITLE}`
    )
  })

  it('names the hero landmark by the full headline', () => {
    const { getByRole } = band({ highlight: HIGHLIGHT })

    expect(getByRole('region', { name: `${HIGHLIGHT} ${TITLE}` })).toBeInTheDocument()
  })

  it('renders the eyebrow and the description', () => {
    const { getByText } = band()

    expect(getByText(EYEBROW)).toBeInTheDocument()
    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('renders both actions with their links, in order', () => {
    const { getAllByRole } = band()

    const links = getAllByRole('link')
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      primaryAction.label,
      secondaryAction.label
    ])
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      primaryAction.href,
      secondaryAction.href
    ])
  })

  it('skips an action without a link', () => {
    const { getAllByRole } = band({ secondaryAction: { label: 'Docs', href: '' } })

    expect(getAllByRole('link')).toHaveLength(1)
  })

  it('renders no actions when none is set', () => {
    const { queryAllByRole } = band({ primaryAction: undefined, secondaryAction: undefined })

    expect(queryAllByRole('link')).toHaveLength(0)
  })

  it('renders the client strip only when it has marks', async () => {
    const withMarks = band({ carouselMarks: MARKS, carouselLabel: 'Trusted by teams' })

    await waitFor(() => expect(withMarks.getByTestId('marketing-ticker')).toBeInTheDocument(), {
      timeout: 5000
    })
    withMarks.unmount()

    const withoutMarks = band()
    expect(withoutMarks.queryByTestId('marketing-ticker')).toBeNull()
  })

  it('renders the illustration only in the copy-beside-art layout', () => {
    const beside = band({ kind: 'copy-beside-art', illustration: 'global-network' })
    expect(beside.getByTestId(HERO_TESTID).getAttribute('data-media-align')).toBe('end')
    beside.unmount()

    const titleBand = band({ illustration: 'global-network' })
    expect(titleBand.getByTestId(HERO_TESTID).hasAttribute('data-media')).toBe(false)
    titleBand.unmount()

    const bare = band({ kind: 'copy-beside-art' })
    expect(bare.getByTestId(HERO_TESTID).hasAttribute('data-media')).toBe(false)
  })

  it('sets the anchor as the band id, and no id without one', () => {
    const { getByTestId, unmount } = band({ anchor: 'top' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'top')
    unmount()
    expect(band().getByTestId(TESTID)).not.toHaveAttribute('id')
  })

  it('labels the client strip from the locale catalog when no label is set', async () => {
    const { getByText } = band({ carouselMarks: MARKS })

    await waitFor(
      () => expect(getByText('Proven on mission-critical workloads')).toBeInTheDocument(),
      {
        timeout: 5000
      }
    )
  })

  it('draws the eyebrow prefix it is given, and none without an eyebrow', () => {
    const custom = band({ eyebrowPrefix: '</>' })
    expect(custom.getByTestId('marketing-hero-title').textContent).toContain('</>')
    custom.unmount()

    const bare = band({ eyebrow: '', eyebrowPrefix: '</>' })
    expect(bare.getByTestId('marketing-hero-title').textContent).not.toContain('</>')
  })

  it('sizes a known illustration from its drawn bounds and any other from the default bounds', () => {
    const art = (illustration: string) => {
      const view = band({ kind: 'copy-beside-art', illustration })
      const box = view
        .getByTestId(HERO_TESTID)
        .querySelector<HTMLElement>('[style*="--hero-art-width"]')
      const vars = ['width', 'bleed', 'trim-top', 'trim-bottom'].map((name) =>
        box?.style.getPropertyValue(`--hero-art-${name}`)
      )
      view.unmount()
      return vars
    }

    expect(art('azion-to-vercel')).toEqual(['169.95%', '29.95%', '13.78%', '13.78%'])
    expect(art('global-network')).toEqual(['161.45%', '35.73%', '0.00%', '0.00%'])
  })

  it('sets an image beside the copy when no illustration is given, marking a portrait one', () => {
    const portrait = { src: '/team.jpg', alt: 'The team at the office', width: 900, height: 1600 }
    const { getByRole, unmount } = band({ kind: 'copy-beside-art', image: portrait })

    const img = getByRole('img', { name: portrait.alt })
    expect(img).toHaveAttribute('src', '/team.jpg')
    expect(img).toHaveAttribute('data-orientation', 'portrait')
    unmount()

    const landscape = band({
      kind: 'copy-beside-art',
      image: { ...portrait, width: 1600, height: 900 }
    })
    expect(landscape.getByRole('img', { name: portrait.alt })).not.toHaveAttribute(
      'data-orientation'
    )
  })

  it('fills a screen with centered copy and the top scene in copy-on-top-art', () => {
    const { getByTestId } = render(HeroBand, {
      props: { kind: 'copy-on-top-art', title: TITLE },
      slots: { top: '<div data-testid="scene">scene</div>' }
    })

    const hero = getByTestId(HERO_TESTID)
    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', 'copy-on-top-art')
    expect(hero).toHaveAttribute('data-kind', 'screen')
    expect(hero).not.toHaveAttribute('data-padded')
    expect(hero).toContainElement(getByTestId('scene'))
    expect(getByTestId('marketing-hero-title')).toHaveAttribute('data-centered')
  })

  it('renders only the root when title is empty', () => {
    const { getByTestId, queryByTestId, queryByRole } = band({ title: '' })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByTestId(HERO_TESTID)).toBeNull()
    expect(queryByRole('heading')).toBeNull()
  })

  it('has no a11y violations with an image beside the copy', async () => {
    const { container } = band({
      kind: 'copy-beside-art',
      image: { src: '/team.jpg', alt: 'The team at the office', width: 900, height: 1600 }
    })

    await expectNoA11yViolations(container)
  })

  it.each(['centered', 'title-band', 'pixel-floor', 'copy-beside-art', 'copy-on-top-art'] as const)(
    'has no a11y violations with kind=%s',
    async (kind) => {
      const { container } = band({
        kind,
        highlight: kind === 'centered' ? HIGHLIGHT : '',
        illustration: kind === 'copy-beside-art' ? 'global-network' : '',
        illustrationAriaLabel: 'A global network'
      })

      await expectNoA11yViolations(container)
    }
  )
})

describe('HeroBand — sample opening bands', () => {
  it.each(['centered-band', 'compact-band'] as const)(
    'renders %s as a band, not a screen',
    (kind) => {
      const { getByTestId } = render(HeroBand, { props: { kind, title: TITLE } })
      expect(getByTestId(TESTID)).toHaveAttribute('data-kind', kind)
      expect(getByTestId(HERO_TESTID)).toHaveAttribute('data-kind', 'band')
    }
  )

  it('renders the top and bottom scene slots', () => {
    const { getByText } = render(HeroBand, {
      props: { kind: 'centered', title: TITLE },
      slots: { top: '<p>Top scene</p>', bottom: '<p>Bottom scene</p>' }
    })
    expect(getByText('Top scene')).toBeInTheDocument()
    expect(getByText('Bottom scene')).toBeInTheDocument()
  })

  it('has no axe violations in the sample bands example', async () => {
    const { default: Bands } = await import('../../../../examples/hero-band/bands.vue')
    const { container } = render(Bands)
    await expectNoA11yViolations(container)
  })
})
