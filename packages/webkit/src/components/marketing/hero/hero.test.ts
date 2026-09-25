import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import Hero from './hero.vue'

const TESTID = 'marketing-hero'

describe('Hero', () => {
  it('renders with the default testid and the default band configuration', () => {
    const { getByTestId } = render(Hero)
    const root = getByTestId(TESTID)

    expect(root).toBeInTheDocument()
    expect(root.tagName).toBe('SECTION')
    expect(root).toHaveAttribute('data-kind', 'band')
    expect(root).toHaveAttribute('data-width', '7xl')
    expect(root).toHaveAttribute('data-bordered')
    expect(root).toHaveAttribute('data-padded')
    expect(root).not.toHaveAttribute('data-media')
  })

  it('lets a consumer-supplied data-testid win', () => {
    const { getByTestId } = render(Hero, {
      attrs: { 'data-testid': 'platform-hero' }
    })
    expect(getByTestId('platform-hero')).toBeInTheDocument()
  })

  it.each(['3xl', '4xl', '5xl', '6xl', '7xl', 'site', 'full'] as const)(
    'carries the %s width on data-width',
    (maxWidth) => {
      const { getByTestId } = render(Hero, { props: { maxWidth } })
      expect(getByTestId(TESTID)).toHaveAttribute('data-width', maxWidth)
    }
  )

  it.each(['band', 'screen'] as const)('mirrors the %s kind onto data-kind', (kind) => {
    const { getByTestId } = render(Hero, { props: { kind } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', kind)
  })

  it('drops its bottom rule when bordered is false', () => {
    const { getByTestId } = render(Hero, { props: { bordered: false } })
    expect(getByTestId(TESTID)).not.toHaveAttribute('data-bordered')
  })

  it('drops its vertical rhythm when padded is false', () => {
    const { getByTestId } = render(Hero, { props: { padded: false } })
    expect(getByTestId(TESTID)).not.toHaveAttribute('data-padded')
  })

  it('renders the background slot, hidden from assistive tech', () => {
    const { getByTestId, getByText } = render(Hero, {
      slots: { background: '<div>texture</div>', default: '<h1>Headline</h1>' }
    })
    const backdrop = getByText('texture').closest('[aria-hidden="true"]') as HTMLElement

    expect(backdrop).not.toBeNull()
    expect(getByTestId(TESTID)).toContainElement(backdrop)
  })

  it('renders no backdrop wrapper when neither the texture nor the slot asks for one', () => {
    const { getByTestId } = render(Hero, { slots: { default: '<h1>Headline</h1>' } })
    expect(getByTestId(TESTID).querySelector('[aria-hidden="true"]')).toBeNull()
  })

  it.each(['dots', 'grid', 'dither', 'pixelate'] as const)(
    'paints the %s texture from the prop, with no slot to wire',
    (texture) => {
      const { getByTestId } = render(Hero, {
        props: { texture },
        slots: { default: '<h1>Headline</h1>' }
      })
      const layer = getByTestId('marketing-texture-material')

      expect(layer).toHaveAttribute('data-kind', texture)
      expect(layer.closest('[aria-hidden="true"]')).not.toBeNull()
    }
  )

  it('paints no texture by default', () => {
    const { queryByTestId } = render(Hero, { slots: { default: '<h1>Headline</h1>' } })
    expect(queryByTestId('marketing-texture-material')).toBeNull()
  })

  it('lets the background slot stand beside the texture', () => {
    const { getByTestId, getByText } = render(Hero, {
      props: { texture: 'dots' },
      slots: { background: '<div>artwork</div>', default: '<h1>Headline</h1>' }
    })
    const backdrop = getByText('artwork').closest('[aria-hidden="true"]') as HTMLElement

    expect(backdrop).not.toBeNull()
    expect(backdrop).toContainElement(getByTestId('marketing-texture-material'))
  })

  it.each(['top', 'center', 'bottom'] as const)(
    'carries the %s content alignment on data-align',
    (align) => {
      const { getByTestId } = render(Hero, { props: { kind: 'screen', align } })
      expect(getByTestId(TESTID)).toHaveAttribute('data-align', align)
    }
  )

  it('centers its content by default', () => {
    const { getByTestId } = render(Hero, { props: { kind: 'screen' } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-align', 'center')
  })

  it('passes the texture fade down to the layer it paints', () => {
    const { getByTestId } = render(Hero, {
      props: { texture: 'dots', textureFade: 'bottom' },
      slots: { default: '<h1>Headline</h1>' }
    })
    expect(getByTestId('marketing-texture-material')).toHaveAttribute('data-fade', 'bottom')
  })

  it('renders no asset window when neither slot is filled', () => {
    const { getByTestId } = render(Hero, { slots: { default: '<h1>Headline</h1>' } })
    const root = getByTestId(TESTID)

    expect(root.children).toHaveLength(1)
  })

  it('renders the top asset window when the slot is filled', () => {
    const { getByTestId, getByText } = render(Hero, {
      slots: { top: '<div>scene</div>', default: '<h1>Headline</h1>' }
    })
    expect(getByTestId(TESTID)).toContainElement(getByText('scene'))
  })

  it('hides the top asset window from assistive tech', () => {
    const { getByText } = render(Hero, {
      slots: { top: '<div>scene</div>', default: '<h1>Headline</h1>' }
    })
    expect(getByText('scene').closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('renders the bottom asset window and keeps it reachable', () => {
    const { getByTestId, getByText } = render(Hero, {
      slots: { bottom: '<div>carousel</div>', default: '<h1>Headline</h1>' }
    })
    const asset = getByText('carousel')

    expect(getByTestId(TESTID)).toContainElement(asset)
    expect(asset.closest('[aria-hidden="true"]')).toBeNull()
  })

  it('paints no floor texture by default', () => {
    const { getByTestId } = render(Hero, { slots: { default: '<h1>Headline</h1>' } })
    expect(getByTestId(TESTID).querySelector('[data-floor]')).toBeNull()
  })

  it.each(['dots', 'grid', 'dither', 'pixelate'] as const)(
    'stands the %s floor texture in the bottom window, with no slot to wire',
    (floorTexture) => {
      const { getByTestId } = render(Hero, {
        props: { floorTexture },
        slots: { default: '<h1>Headline</h1>' }
      })
      const layer = getByTestId('marketing-texture-material')

      expect(layer).toHaveAttribute('data-kind', floorTexture)
      expect(layer.closest('[data-floor]')).not.toBeNull()
    }
  )

  it('opens the floor window for the texture even with no bottom slot', () => {
    const { getByTestId } = render(Hero, {
      props: { floorTexture: 'pixelate' },
      slots: { default: '<h1>Headline</h1>' }
    })
    expect(getByTestId(TESTID).querySelector('[data-floor]')).not.toBeNull()
  })

  it('keeps the backdrop texture and the floor texture on separate layers', () => {
    const { getAllByTestId } = render(Hero, {
      props: { texture: 'dots', floorTexture: 'pixelate' },
      slots: { default: '<h1>Headline</h1>' }
    })
    const [backdrop, floor] = getAllByTestId('marketing-texture-material')

    expect(backdrop).toHaveAttribute('data-kind', 'dots')
    expect(backdrop.closest('[data-floor]')).toBeNull()
    expect(floor).toHaveAttribute('data-kind', 'pixelate')
    expect(floor.closest('[data-floor]')).not.toBeNull()
  })

  it('lets the bottom slot share the window with the floor texture', () => {
    const { getByTestId, getByText } = render(Hero, {
      props: { floorTexture: 'pixelate' },
      slots: { bottom: '<div>field</div>', default: '<h1>Headline</h1>' }
    })
    const window = getByTestId(TESTID).querySelector('[data-floor]') as HTMLElement

    expect(window).toContainElement(getByText('field'))
    expect(window).toContainElement(getByTestId('marketing-texture-material'))
  })

  it('stands no brand strip on the floor by default', () => {
    const { queryByTestId } = render(Hero, { slots: { default: '<h1>Headline</h1>' } })
    expect(queryByTestId('marketing-brand-carousel')).toBeNull()
  })

  it('stands the brand strip on the floor when carousel is set', async () => {
    const { getByTestId, findByTestId } = render(Hero, {
      props: { carousel: true, carouselMarks: ['Itau', 'NZN'] },
      slots: { default: '<h1>Headline</h1>' }
    })
    const strip = await findByTestId('marketing-brand-carousel')

    expect(getByTestId(TESTID)).toContainElement(strip)
    expect(strip.closest('[aria-hidden="true"]')).toBeNull()
    expect(strip).toHaveTextContent('NZN')
  })

  it('names the strip with an overline when carouselLabel is set', async () => {
    const { findByTestId } = render(Hero, {
      props: { carousel: true, carouselMarks: ['NZN'], carouselLabel: 'Trusted in production' },
      slots: { default: '<h1>Headline</h1>' }
    })
    const strip = await findByTestId('marketing-brand-carousel')

    expect(strip).toHaveTextContent('Trusted in production')
  })

  it('shares one floor between the bottom window and the strip', async () => {
    const { findByTestId, getByText } = render(Hero, {
      props: { carousel: true, carouselMarks: ['NZN'] },
      slots: { bottom: '<div>field</div>', default: '<h1>Headline</h1>' }
    })
    const strip = await findByTestId('marketing-brand-carousel')

    expect(strip.parentElement).toContainElement(getByText('field'))
  })

  it('leaves the copy in a single column when no media is slotted', () => {
    const { getByTestId, getByRole } = render(Hero, {
      slots: { default: '<h1>Headline</h1>' }
    })

    expect(getByTestId(TESTID)).not.toHaveAttribute('data-media')
    expect(getByRole('heading', { level: 1 }).parentElement?.childElementCount).toBe(1)
  })

  it('splits the column and keeps the copy first when media is slotted', () => {
    const { getByTestId, getByRole, getByText } = render(Hero, {
      slots: { default: '<h1>Headline</h1>', media: '<figure>Diagram</figure>' }
    })
    const heading = getByRole('heading', { level: 1 })
    const media = getByText('Diagram')
    const FOLLOWING = 4

    expect(getByTestId(TESTID)).toHaveAttribute('data-media')
    expect(heading.compareDocumentPosition(media) & FOLLOWING).toBe(FOLLOWING)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(Hero, {
      slots: { background: '<div>texture</div>', default: '<h1>Headline</h1>' }
    })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations with a textured backdrop', async () => {
    const { container } = render(Hero, {
      props: { texture: 'dots' },
      slots: { default: '<h1>Headline</h1>' }
    })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations with both asset windows filled', async () => {
    const { container } = render(Hero, {
      props: { kind: 'screen', texture: 'dots', textureFade: 'bottom' },
      slots: {
        top: '<div>scene</div>',
        bottom: '<div>carousel</div>',
        default: '<h1>Headline</h1>'
      }
    })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations with a floor texture', async () => {
    const { container } = render(Hero, {
      props: { floorTexture: 'pixelate' },
      slots: { default: '<h1>Headline</h1>' }
    })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations with the brand strip on the floor', async () => {
    const { container, findByTestId } = render(Hero, {
      props: { carousel: true, carouselMarks: ['NZN', 'Itau'] },
      slots: { default: '<h1>Headline</h1>' }
    })
    await findByTestId('marketing-brand-carousel')
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations with a media column', async () => {
    const { container } = render(Hero, {
      slots: { default: '<h1>Headline</h1>', media: '<figure>Diagram</figure>' }
    })
    await expectNoA11yViolations(container)
  })
})
