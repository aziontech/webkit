import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import HeroSection from './hero-section.vue'

const TESTID = 'sections-hero-section'
const HERO_TESTID = 'marketing-hero'
const HERO_TITLE_TESTID = 'marketing-hero-title'
const TITLE = 'Deliver content fast, worldwide'
const HIGHLIGHT = 'Build and run applications'
const EYEBROW = 'Cache'
const DESCRIPTION = 'Serve cached content close to users.'
const MARKS = ['global-fashion-group', 'herospark', 'itau']

const NODE_TESTID = 'data-flow__node'
const CELL_TESTID = 'marketing-card-grid-cell'

const levels = [
  {
    nodes: [
      {
        eyebrow: 'Domain',
        icon: 'ai ai-domains',
        title: 'shop.example.com',
        label: 'Public',
        severity: 'info'
      },
      {
        eyebrow: 'Domain',
        icon: 'ai ai-domains',
        title: 'api.example.com',
        label: 'Public',
        severity: 'info'
      }
    ]
  },
  {
    nodes: [
      {
        eyebrow: 'Workload',
        icon: 'ai ai-workloads',
        title: 'shop-prod',
        label: 'Live',
        severity: 'success',
        lit: true
      }
    ]
  },
  {
    nodes: [
      {
        eyebrow: 'Application',
        icon: 'ai ai-edge-application',
        title: 'storefront',
        label: 'Active',
        severity: 'success'
      }
    ]
  }
]

const items = [
  {
    icon: 'ai ai-shield',
    title: 'Programmable rule engine',
    description: 'Define custom rules across OSI layers L3-L7.'
  },
  {
    icon: 'ai ai-code',
    title: 'Extensible with Functions',
    description: 'Run custom JavaScript security code.'
  },
  {
    icon: 'ai ai-sync',
    title: 'Real-time synchronization',
    description: 'Rules sync automatically across every data center.'
  }
]

const primaryAction = { label: 'Start for free', href: '/signup' }
const secondaryAction = { label: 'Docs', href: '/docs', trailing: true }

const band = (props: Record<string, unknown> = {}) =>
  render(HeroSection, {
    props: {
      variant: 'title-band',
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      primaryAction,
      secondaryAction,
      ...props
    }
  })

describe('HeroSection', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(HeroSection, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'page-hero' }
    })

    expect(getByTestId('page-hero')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it.each(['center', 'title-band', 'pixel-floor', 'copy-beside-art'] as const)(
    'mirrors variant=%s on data-variant',
    (variant) => {
      const { getByTestId } = band({ variant })

      expect(getByTestId(TESTID).getAttribute('data-variant')).toBe(variant)
    }
  )

  it('defaults to the title-band variant as a band-height hero', () => {
    const { getByTestId } = render(HeroSection, { props: { title: TITLE } })

    expect(getByTestId(TESTID).getAttribute('data-variant')).toBe('title-band')
    expect(getByTestId(HERO_TESTID).getAttribute('data-variant')).toBe('band')
    expect(getByTestId(HERO_TESTID).getAttribute('data-size')).toBe('medium')
  })

  it('takes the site header token out of a screen-filling band, and nothing out of a band', async () => {
    const { getByTestId, rerender } = band({ variant: 'center' })

    expect(getByTestId(HERO_TESTID).getAttribute('data-variant')).toBe('screen')
    expect(getByTestId(HERO_TESTID).style.getPropertyValue('--hero-banner-offset')).toBe(
      'var(--layout-header-height)'
    )

    await rerender({ headerOffset: '' })
    expect(getByTestId(HERO_TESTID).style.getPropertyValue('--hero-banner-offset')).toBe('')

    await rerender({ variant: 'title-band', headerOffset: 'var(--layout-header-height)' })
    expect(getByTestId(HERO_TESTID).style.getPropertyValue('--hero-banner-offset')).toBe('')
  })

  it('sets a short headline on the narrow measure in the centered layouts only', () => {
    for (const variant of ['center', 'title-band', 'center-band']) {
      const { getByTestId, unmount } = band({ variant })
      expect(getByTestId(TESTID)).toHaveAttribute('data-title-measure', 'narrow')
      unmount()
    }
    for (const props of [
      { variant: 'center', titleLength: 'long' },
      { variant: 'compact-band' },
      { variant: 'copy-beside-art' },
      { variant: 'pixel-floor' }
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

  it('sets the title-band headline in the wide column by default', () => {
    const { getByTestId } = band()

    expect(getByTestId(HERO_TITLE_TESTID).getAttribute('data-width')).toBe('4xl')
  })

  it('keeps the title-band headline in the wide column with titleLength=long', () => {
    const { getByTestId } = band({ titleLength: 'long' })

    expect(getByTestId(HERO_TITLE_TESTID).getAttribute('data-width')).toBe('4xl')
  })

  it('sets the centered headline in the narrow column by default', () => {
    const { getByTestId } = band({ variant: 'center' })

    expect(getByTestId(HERO_TITLE_TESTID).getAttribute('data-width')).toBe('xl')
  })

  it('widens the centered headline column with titleLength=long', () => {
    const { getByTestId } = band({ variant: 'center', titleLength: 'long' })

    expect(getByTestId(HERO_TITLE_TESTID).getAttribute('data-width')).toBe('3xl')
  })

  it.each([
    ['pixel-floor', '4xl'],
    ['copy-beside-art', 'xl']
  ] as const)('ignores titleLength with variant=%s', (variant, width) => {
    const short = band({ variant, titleLength: 'short' })
    expect(short.getByTestId(HERO_TITLE_TESTID).getAttribute('data-width')).toBe(width)
    short.unmount()

    const long = band({ variant, titleLength: 'long' })
    expect(long.getByTestId(HERO_TITLE_TESTID).getAttribute('data-width')).toBe(width)
  })

  it.each(['center', 'pixel-floor', 'copy-beside-art'] as const)(
    'fills a screen with variant=%s',
    (variant) => {
      const { getByTestId } = band({ variant })

      expect(getByTestId(HERO_TESTID).getAttribute('data-variant')).toBe('screen')
    }
  )

  it('renders the title as the page h1 with its highlight', () => {
    const { getByRole } = band({ titleHighlight: HIGHLIGHT })

    expect(getByRole('heading', { level: 1 }).textContent?.replace(/\s+/g, ' ').trim()).toBe(
      `${HIGHLIGHT} ${TITLE}`
    )
  })

  it('names the hero landmark by the full headline', () => {
    const { getByRole } = band({ titleHighlight: HIGHLIGHT })

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

  it('ignores the removed carouselMarks and carouselLabel', () => {
    const { queryByTestId } = band({ carouselMarks: MARKS, carouselLabel: 'Old label' })
    expect(queryByTestId('marketing-marquee')).toBeNull()
  })

  it('renders the client strip only when it has marks', async () => {
    const withMarks = band({ marqueeMarks: MARKS, marqueeLabel: 'Trusted by teams' })

    await waitFor(() => expect(withMarks.getByTestId('marketing-marquee')).toBeInTheDocument(), {
      timeout: 5000
    })
    withMarks.unmount()

    const withoutMarks = band()
    expect(withoutMarks.queryByTestId('marketing-marquee')).toBeNull()
  })

  it('renders the illustration only in the copy-beside-art layout', () => {
    const beside = band({ variant: 'copy-beside-art', illustration: 'global-network' })
    expect(beside.getByTestId(HERO_TESTID).getAttribute('data-media-align')).toBe('end')
    beside.unmount()

    const titleBand = band({ illustration: 'global-network' })
    expect(titleBand.getByTestId(HERO_TESTID).hasAttribute('data-media')).toBe(false)
    titleBand.unmount()

    const bare = band({ variant: 'copy-beside-art' })
    expect(bare.getByTestId(HERO_TESTID).hasAttribute('data-media')).toBe(false)
  })

  it('sets the anchor as the band id, and no id without one', () => {
    const { getByTestId, unmount } = band({ anchor: 'top' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'top')
    unmount()
    expect(band().getByTestId(TESTID)).not.toHaveAttribute('id')
  })

  it('labels the client strip from the locale catalog when no label is set', async () => {
    const { getByText } = band({ marqueeMarks: MARKS })

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
      const view = band({ variant: 'copy-beside-art', illustration })
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
    const { getByRole, unmount } = band({ variant: 'copy-beside-art', image: portrait })

    const img = getByRole('img', { name: portrait.alt })
    expect(img).toHaveAttribute('src', '/team.jpg')
    expect(img).toHaveAttribute('data-orientation', 'portrait')
    unmount()

    const landscape = band({
      variant: 'copy-beside-art',
      image: { ...portrait, width: 1600, height: 900 }
    })
    expect(landscape.getByRole('img', { name: portrait.alt })).not.toHaveAttribute(
      'data-orientation'
    )
  })

  it('fills a screen with centered copy and the top scene in copy-on-top-art', () => {
    const { getByTestId } = render(HeroSection, {
      props: { variant: 'copy-on-top-art', title: TITLE },
      slots: { top: '<div data-testid="scene">scene</div>' }
    })

    const hero = getByTestId(HERO_TESTID)
    expect(getByTestId(TESTID)).toHaveAttribute('data-variant', 'copy-on-top-art')
    expect(hero).toHaveAttribute('data-variant', 'screen')
    expect(hero).not.toHaveAttribute('data-padded')
    expect(hero).toContainElement(getByTestId('scene'))
    expect(getByTestId('marketing-hero-title')).toHaveAttribute('data-align', 'center')
  })

  it('renders only the root when title is empty', () => {
    const { getByTestId, queryByTestId, queryByRole } = band({ title: '' })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByTestId(HERO_TESTID)).toBeNull()
    expect(queryByRole('heading')).toBeNull()
  })

  it('has no a11y violations with an image beside the copy', async () => {
    const { container } = band({
      variant: 'copy-beside-art',
      image: { src: '/team.jpg', alt: 'The team at the office', width: 900, height: 1600 }
    })

    await expectNoA11yViolations(container)
  })

  it.each(['center', 'title-band', 'pixel-floor', 'copy-beside-art', 'copy-on-top-art'] as const)(
    'has no a11y violations with variant=%s',
    async (variant) => {
      const { container } = band({
        variant,
        titleHighlight: variant === 'center' ? HIGHLIGHT : '',
        illustration: variant === 'copy-beside-art' ? 'global-network' : '',
        illustrationAriaLabel: 'A global network'
      })

      await expectNoA11yViolations(container)
    }
  )

  describe('sample opening bands', () => {
    it.each(['center-band', 'compact-band'] as const)(
      'renders %s as a band, not a screen',
      (variant) => {
        const { getByTestId } = render(HeroSection, { props: { variant: variant, title: TITLE } })
        expect(getByTestId(TESTID)).toHaveAttribute('data-variant', variant)
        expect(getByTestId(HERO_TESTID)).toHaveAttribute('data-variant', 'band')
      }
    )

    it('renders the top and bottom scene slots', () => {
      const { getByText } = render(HeroSection, {
        props: { variant: 'center', title: TITLE },
        slots: { top: '<p>Top scene</p>', bottom: '<p>Bottom scene</p>' }
      })
      expect(getByText('Top scene')).toBeInTheDocument()
      expect(getByText('Bottom scene')).toBeInTheDocument()
    })

    it('has no axe violations in the sample bands example', async () => {
      const { default: Bands } = await import('../../../../examples/hero-section/bands.vue')
      const { container } = render(Bands)
      await expectNoA11yViolations(container)
    })

    describe('levels topology', () => {
      const topology = (props: Record<string, unknown> = {}) =>
        band({ variant: 'copy-on-top-art', levels, ...props })

      it('draws one column per level and one card per node, in order', async () => {
        const { container, findAllByTestId } = topology()
        const nodes = await findAllByTestId(NODE_TESTID)

        expect(
          container.querySelectorAll('[role="listitem"][data-slot="flow-diagram-parallel"]')
        ).toHaveLength(levels.length)
        expect(nodes.map((node) => node.textContent?.includes('shop-prod'))).toEqual([
          false,
          false,
          true,
          false
        ])
      })

      it('renders each card with its eyebrow, title and status, and marks only the lit card', async () => {
        const { findAllByTestId, container } = topology()

        const first = (await findAllByTestId(NODE_TESTID))[0]
        expect(first?.textContent).toContain('Domain')
        expect(first?.textContent).toContain('shop.example.com')
        expect(first?.textContent).toContain('Public')
        const lit = container.querySelectorAll('[data-lit]')
        expect(lit).toHaveLength(1)
        expect(lit[0]?.textContent?.trim()).toBe('shop-prod')
      })

      it('skips a card without a title and a level left empty', async () => {
        const { container, findAllByTestId } = topology({
          levels: [
            ...levels,
            {
              nodes: [{ eyebrow: 'Firewall', icon: '', title: '', label: '', severity: 'success' }]
            }
          ]
        })

        expect(await findAllByTestId(NODE_TESTID)).toHaveLength(4)
        expect(container.querySelectorAll('[data-slot="flow-diagram-parallel"]')).toHaveLength(
          levels.length
        )
      })

      it('draws nothing in other layouts or when a scene slot is given', () => {
        const other = band({ variant: 'center', levels })
        expect(other.queryAllByTestId(NODE_TESTID)).toHaveLength(0)
        other.unmount()

        const slotted = render(HeroSection, {
          props: { variant: 'copy-on-top-art', title: TITLE, levels },
          slots: { bottom: '<div>scene</div>' }
        })
        expect(slotted.getByText('scene')).toBeInTheDocument()
        expect(slotted.queryAllByTestId(NODE_TESTID)).toHaveLength(0)
        slotted.unmount()

        const top = render(HeroSection, {
          props: { variant: 'copy-on-top-art', title: TITLE, levels },
          slots: { top: '<div>top scene</div>' }
        })
        expect(top.queryAllByTestId(NODE_TESTID)).toHaveLength(0)
      })

      it('has no a11y violations with the topology', async () => {
        const { container, findAllByTestId } = topology()
        await findAllByTestId(NODE_TESTID)

        await expectNoA11yViolations(container)
      })
    })

    describe('items grid', () => {
      it('renders one cell per item, in order, each with an h2', async () => {
        const { findAllByTestId, getAllByRole } = band({ items })

        expect(await findAllByTestId(CELL_TESTID)).toHaveLength(items.length)
        expect(
          getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent?.trim())
        ).toEqual(items.map((item) => item.title))
      })

      it('omits the grid and its gap when items is empty, and everything without a title', () => {
        const empty = band()
        expect(empty.queryAllByTestId(CELL_TESTID)).toHaveLength(0)
        expect(empty.queryByTestId('marketing-section-gap')).toBeNull()
        empty.unmount()

        const untitled = band({ items, title: '' })
        expect(untitled.getByTestId(TESTID).children).toHaveLength(0)
      })

      it('has no a11y violations with the grid', async () => {
        const { container, findAllByTestId } = band({ items })
        await findAllByTestId(CELL_TESTID)

        await expectNoA11yViolations(container)
      })
    })
  })
})
