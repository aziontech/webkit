import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import BandStack from '../band-stack/band-stack.vue'
import MediaSplit from './media-split.vue'

const TESTID = 'marketing-media-split'
const GROUND = 'marketing-texture-material'

const TITLE = 'See every request as it happens.'
const DESCRIPTION = 'Logs stream from every edge location in real time, with no agent to install.'
const EYEBROW = 'Observability'
const ALT = 'A live log stream showing requests from twelve edge locations'
const SRC = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

const FOLLOWING = 4

const EVERY_CORNER = 'top-left top-right bottom-left bottom-right'
const CELLS = [`${TESTID}__copy-cell`, `${TESTID}__media-cell`]

function columnsOf(container: HTMLElement): globalThis.Element[] {
  const grid = container.querySelector(`[data-testid="${TESTID}__cells"]`)
  return grid ? [...grid.children] : []
}

describe('MediaSplit', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = render(MediaSplit, { props: { title: TITLE } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(MediaSplit, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'logs-band' }
    })

    expect(getByTestId('logs-band')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the band heading', () => {
    const { getByRole } = render(MediaSplit, { props: { title: TITLE } })

    expect(getByRole('heading', { level: 2 })).toHaveTextContent(TITLE)
  })

  it('exposes the band as a landmark named by its heading', () => {
    const { getByTestId, getByRole } = render(MediaSplit, { props: { title: TITLE } })
    const root = getByTestId(TESTID)

    expect(root.tagName).toBe('SECTION')
    expect(getByRole('region', { name: TITLE })).toBe(root)
    expect(getByRole('heading', { level: 2 })).toHaveTextContent(TITLE)
  })

  it('renders the description under the headline', () => {
    const { getByText } = render(MediaSplit, {
      props: { title: TITLE, description: DESCRIPTION }
    })

    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('lets the default slot replace the description prop', () => {
    const { getByText, queryByText } = render(MediaSplit, {
      props: { title: TITLE, description: DESCRIPTION },
      slots: { default: 'Sampling is off by default on every plan.' }
    })

    expect(getByText('Sampling is off by default on every plan.')).toBeInTheDocument()
    expect(queryByText(DESCRIPTION)).toBeNull()
  })

  it('renders no paragraph when neither the description nor the default slot is given', () => {
    const { container } = render(MediaSplit, { props: { title: TITLE } })

    expect(container.querySelector('p')).toBeNull()
  })

  it('renders no eyebrow when it is not set', () => {
    const { queryByText } = render(MediaSplit, { props: { title: TITLE } })

    expect(queryByText(EYEBROW)).toBeNull()
  })

  it('renders the eyebrow above the headline when it is set', () => {
    const { getByText, getByRole } = render(MediaSplit, {
      props: { title: TITLE, eyebrow: EYEBROW }
    })
    const eyebrow = getByText(EYEBROW)
    const heading = getByRole('heading', { level: 2 })

    expect(eyebrow.compareDocumentPosition(heading) & FOLLOWING).toBe(FOLLOWING)
  })

  it('renders the image from src with the alt it is given', () => {
    const { getByRole } = render(MediaSplit, { props: { title: TITLE, src: SRC, alt: ALT } })
    const image = getByRole('img', { name: ALT })

    expect(image.getAttribute('src')).toBe(SRC)
    expect(image.getAttribute('aria-hidden')).toBeNull()
  })

  it('hides an image given no alt from assistive technology', () => {
    const { container } = render(MediaSplit, { props: { title: TITLE, src: SRC } })
    const image = container.querySelector('img')

    expect(image).not.toBeNull()
    expect(image?.getAttribute('alt')).toBe('')
    expect(image?.getAttribute('aria-hidden')).toBe('true')
  })

  it('lets the media slot replace the image built from src', () => {
    const { getByTestId, container } = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT },
      slots: { media: '<figure data-testid="request-chart">Requests per second</figure>' }
    })

    expect(getByTestId('request-chart')).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders no media column when neither src nor the media slot is given', () => {
    const { container } = render(MediaSplit, {
      props: { title: TITLE, description: DESCRIPTION }
    })

    expect(container.querySelector('img')).toBeNull()
    expect(columnsOf(container)).toHaveLength(1)
  })

  it('renders a media column beside the copy when src is given', () => {
    const { container } = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT }
    })

    expect(columnsOf(container)).toHaveLength(2)
  })

  it.each(['media-end', 'media-start'] as const)('mirrors the %s kind onto data-kind', (kind) => {
    const { getByTestId } = render(MediaSplit, { props: { title: TITLE, kind } })

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe(kind)
  })

  it.each(['media-end', 'media-start'] as const)(
    'keeps the copy before the media in DOM order for the %s kind',
    (kind) => {
      const { container, getByRole } = render(MediaSplit, {
        props: { title: TITLE, description: DESCRIPTION, src: SRC, alt: ALT, kind }
      })
      const heading = getByRole('heading', { level: 2 })
      const image = getByRole('img', { name: ALT })
      const [copy, media] = columnsOf(container)

      expect(copy.contains(heading)).toBe(true)
      expect(media.contains(image)).toBe(true)
      expect(heading.compareDocumentPosition(image) & FOLLOWING).toBe(FOLLOWING)
    }
  )

  it.each(['horizontal', 'vertical'] as const)(
    'mirrors the %s orientation onto data-orientation',
    (orientation) => {
      const { getByTestId } = render(MediaSplit, { props: { title: TITLE, orientation } })

      expect(getByTestId(TESTID).getAttribute('data-orientation')).toBe(orientation)
    }
  )

  it('keeps both cells in a vertical band', () => {
    const { container } = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT, orientation: 'vertical' }
    })

    expect(columnsOf(container)).toHaveLength(2)
  })

  it('keeps the copy first in DOM for a vertical band that leads with its media', () => {
    const { container, getByRole } = render(MediaSplit, {
      props: {
        title: TITLE,
        description: DESCRIPTION,
        src: SRC,
        alt: ALT,
        orientation: 'vertical',
        kind: 'media-start'
      }
    })
    const heading = getByRole('heading', { level: 2 })
    const image = getByRole('img', { name: ALT })
    const [copy, media] = columnsOf(container)

    expect(copy.contains(heading)).toBe(true)
    expect(media.contains(image)).toBe(true)
    expect(heading.compareDocumentPosition(image) & FOLLOWING).toBe(FOLLOWING)
  })

  it('draws the seam unless the band asks for none', () => {
    const divided = render(MediaSplit, { props: { title: TITLE, src: SRC, alt: ALT } })
    expect(divided.getByTestId(TESTID).getAttribute('data-divided')).toBe('true')

    const seamless = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT, divided: false }
    })
    expect(seamless.getAllByTestId(TESTID)[1].getAttribute('data-divided')).toBeNull()
  })

  it('mirrors its media fill and type scale on the root', () => {
    const plain = render(MediaSplit, { props: { title: TITLE, src: SRC, alt: ALT } })
    expect(plain.getByTestId(TESTID).getAttribute('data-media-fill')).toBe('surface')
    expect(plain.getByTestId(TESTID).getAttribute('data-size')).toBe('medium')

    const large = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT, mediaFill: 'canvas', size: 'large' }
    })
    const root = large.getAllByTestId(TESTID)[1]
    expect(root.getAttribute('data-media-fill')).toBe('canvas')
    expect(root.getAttribute('data-size')).toBe('large')
  })

  it('mirrors its copy alignment on the root, top by default', () => {
    const flush = render(MediaSplit, { props: { title: TITLE, src: SRC, alt: ALT } })
    expect(flush.getByTestId(TESTID).getAttribute('data-align')).toBe('top')

    const centred = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT, align: 'center' }
    })
    expect(centred.getAllByTestId(TESTID)[1].getAttribute('data-align')).toBe('center')
  })

  it('grounds the media column on the texture the band paints', () => {
    const { container, getByTestId } = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT }
    })
    const ground = getByTestId(GROUND)
    const [, media] = columnsOf(container)

    expect(media.contains(ground)).toBe(true)
    expect(ground.getAttribute('data-kind')).toBe('grid')
    expect(ground.getAttribute('data-size')).toBe('medium')
    expect(ground.getAttribute('data-fade')).toBe('vignette')
    expect(ground.getAttribute('aria-hidden')).toBe('true')
  })

  it('lets the band name its own material, pitch and fade', () => {
    const { getByTestId } = render(MediaSplit, {
      props: {
        title: TITLE,
        src: SRC,
        alt: ALT,
        texture: 'pixelate',
        textureSize: 'small',
        textureFade: 'edges'
      }
    })
    const ground = getByTestId(GROUND)

    expect(ground.getAttribute('data-kind')).toBe('pixelate')
    expect(ground.getAttribute('data-size')).toBe('small')
    expect(ground.getAttribute('data-fade')).toBe('edges')
  })

  it('keeps the layer but paints nothing when the texture is none', () => {
    const { getByTestId } = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT, texture: 'none' }
    })

    expect(getByTestId(GROUND).getAttribute('data-kind')).toBe('none')
  })

  it('runs the media flush to the cell unless the band asks for the inset', () => {
    const flush = render(MediaSplit, { props: { title: TITLE, src: SRC, alt: ALT } })
    expect(flush.getByTestId(TESTID).getAttribute('data-media-padded')).toBeNull()

    const padded = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT, mediaPadded: true }
    })
    expect(padded.getAllByTestId(TESTID)[1].getAttribute('data-media-padded')).toBe('true')
  })

  it('draws no frame of its own by default', () => {
    const { queryByTestId } = render(MediaSplit, { props: { title: TITLE } })

    expect(queryByTestId('layout-frame-box')).toBeNull()
  })

  it('draws its own registration frame when framed', () => {
    const { getByTestId } = render(MediaSplit, { props: { title: TITLE, framed: true } })

    expect(getByTestId('layout-frame-box')).toBeInTheDocument()
  })

  it('leaves its cells unmarked by default', () => {
    const { getByTestId } = render(MediaSplit, { props: { title: TITLE, src: SRC, alt: ALT } })

    for (const cell of CELLS) expect(getByTestId(cell)).not.toHaveAttribute('data-marks')
  })

  it('frames the copy and the media as two cells, each with its four marks, when framed', () => {
    const { getByTestId } = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT, framed: true }
    })

    expect(getByTestId('layout-frame-box').getAttribute('data-borders')).toBe('bottom')
    expect(getByTestId('layout-frame-box').getAttribute('data-marks')).toBe('none')
    for (const cell of CELLS) {
      expect(getByTestId(cell).getAttribute('data-marks')).toBe(EVERY_CORNER)
      expect(getByTestId(cell).getAttribute('data-borders')).toBe('none')
    }
  })

  it('frames one cell when a framed band has no media', () => {
    const { getByTestId, queryByTestId } = render(MediaSplit, {
      props: { title: TITLE, framed: true }
    })

    expect(getByTestId(`${TESTID}__copy-cell`).getAttribute('data-marks')).toBe(EVERY_CORNER)
    expect(queryByTestId(`${TESTID}__media-cell`)).toBeNull()
  })

  it('frames its two cells inside a band stack without drawing rules of its own', () => {
    const { getByTestId, queryByTestId } = render(BandStack, {
      slots: { default: () => h(MediaSplit, { title: TITLE, src: SRC, alt: ALT }) }
    })

    expect(queryByTestId('layout-frame-box')).toBeNull()
    for (const cell of CELLS) {
      expect(getByTestId(cell).getAttribute('data-marks')).toBe(EVERY_CORNER)
      expect(getByTestId(cell).getAttribute('data-borders')).toBe('none')
    }
  })

  it('keeps the copy cell before the media cell in DOM order when the cells are framed', () => {
    const { getByTestId } = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT, framed: true, kind: 'media-start' }
    })
    const [copy, media] = CELLS.map((cell) => getByTestId(cell))

    expect(copy.compareDocumentPosition(media) & FOLLOWING).toBe(FOLLOWING)
    expect(copy.getAttribute('data-orientation')).toBe('horizontal')
  })

  it('has no a11y violations with its cells framed', async () => {
    const { container } = render(MediaSplit, {
      props: {
        title: TITLE,
        description: DESCRIPTION,
        src: SRC,
        alt: ALT,
        framed: true,
        mediaHref: '/site/docs'
      }
    })

    await expectNoA11yViolations(container)
  })

  it.each(['canvas', 'surface'] as const)('mirrors the %s fill onto data-fill', (fill) => {
    const { getByTestId } = render(MediaSplit, { props: { title: TITLE, fill } })

    expect(getByTestId(TESTID).getAttribute('data-fill')).toBe(fill)
  })

  it('renders further copy-column content from the content slot', () => {
    const { getByText } = render(MediaSplit, {
      props: { title: TITLE },
      slots: { content: '<ul><li>Azion CLI</li></ul>' }
    })

    expect(getByText('Azion CLI')).toBeInTheDocument()
  })

  it('renders no ground when the band has no media', () => {
    const { queryByTestId } = render(MediaSplit, { props: { title: TITLE } })

    expect(queryByTestId(GROUND)).toBeNull()
  })

  it('renders the controls placed in the actions slot', () => {
    const { getByRole } = render(MediaSplit, {
      props: { title: TITLE },
      slots: { actions: '<button type="button">Read the guide</button>' }
    })

    expect(getByRole('button', { name: 'Read the guide' })).toBeInTheDocument()
  })

  it('renders no control when the actions slot is not passed', () => {
    const { container } = render(MediaSplit, { props: { title: TITLE } })

    expect(container.querySelector('button')).toBeNull()
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = render(MediaSplit, {
      props: { title: TITLE, description: DESCRIPTION, eyebrow: EYEBROW, src: SRC, alt: ALT },
      slots: { actions: '<button type="button">Read the guide</button>' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when the image is decorative', async () => {
    const { container } = render(MediaSplit, {
      props: { title: TITLE, description: DESCRIPTION, src: SRC, kind: 'media-start' }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations as a seamless vertical band', async () => {
    const { container } = render(MediaSplit, {
      props: {
        title: TITLE,
        description: DESCRIPTION,
        eyebrow: EYEBROW,
        src: SRC,
        alt: ALT,
        orientation: 'vertical',
        kind: 'media-start',
        divided: false
      }
    })

    await expectNoA11yViolations(container)
  })

  it('leaves the media cell inert without mediaHref', () => {
    const { getByTestId, queryByRole } = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT }
    })

    const media = getByTestId(`${TESTID}__media`)
    expect(media.tagName).toBe('DIV')
    expect(queryByRole('link')).toBeNull()
  })

  it('turns the media cell into one link named by the band title', () => {
    const { getByRole, getByTestId } = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT, mediaHref: '/site/docs' }
    })

    const link = getByRole('link', { name: TITLE })
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('/site/docs')
    expect(link).toBe(getByTestId(`${TESTID}__media`))
    expect(getByTestId(TESTID).getAttribute('data-media-href')).toBe('true')
  })

  it('draws the chevron affordance as decoration inside that one link', () => {
    const { getByTestId } = render(MediaSplit, {
      props: { title: TITLE, src: SRC, alt: ALT, mediaHref: '/site/docs' }
    })

    const affordance = getByTestId(`${TESTID}__media-affordance`)
    expect(affordance.getAttribute('aria-hidden')).toBe('true')
    expect(affordance.closest('a')).toBe(getByTestId(`${TESTID}__media`))
    expect(affordance.querySelector('button')).toBeNull()
  })

  it('has no a11y violations with a linked media cell', async () => {
    const { container } = render(MediaSplit, {
      props: { title: TITLE, description: DESCRIPTION, src: SRC, alt: ALT, mediaHref: '/site/docs' }
    })

    await expectNoA11yViolations(container)
  })

  describe('clickable band', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    function stubOpen() {
      return vi.spyOn(globalThis, 'open').mockImplementation(() => null)
    }

    it('follows mediaHref from a click anywhere on the band', async () => {
      const open = stubOpen()
      const { getByRole } = render(MediaSplit, {
        props: {
          title: TITLE,
          description: DESCRIPTION,
          src: SRC,
          alt: ALT,
          mediaHref: '/site/docs'
        }
      })

      await fireEvent.click(getByRole('heading', { level: 2 }), { metaKey: true })

      expect(open).toHaveBeenCalledWith('/site/docs', '_blank', 'noopener')
    })

    it('leaves a link in the actions slot to its own destination', async () => {
      const open = stubOpen()
      const { getByRole } = render(MediaSplit, {
        props: { title: TITLE, src: SRC, alt: ALT, mediaHref: '/site/docs' },
        slots: { actions: () => h('a', { href: '/site/pricing' }, 'Pricing') }
      })

      await fireEvent.click(getByRole('link', { name: 'Pricing' }), { metaKey: true })

      expect(open).not.toHaveBeenCalled()
    })

    it('stays inert without mediaHref', async () => {
      const open = stubOpen()
      const { getByRole } = render(MediaSplit, { props: { title: TITLE, src: SRC, alt: ALT } })

      await fireEvent.click(getByRole('heading', { level: 2 }), { metaKey: true })

      expect(open).not.toHaveBeenCalled()
    })

    it('yields to a consumer click listener that prevents the default', async () => {
      const open = stubOpen()
      const { getByRole } = render(MediaSplit, {
        props: { title: TITLE, src: SRC, alt: ALT, mediaHref: '/site/docs' },
        attrs: { onClick: (event: MouseEvent) => event.preventDefault() }
      })

      await fireEvent.click(getByRole('heading', { level: 2 }), { metaKey: true })

      expect(open).not.toHaveBeenCalled()
    })
  })

  it('opens the band with an h2 by default', () => {
    const { getByRole } = render(MediaSplit, { props: { title: TITLE } })

    expect(getByRole('heading', { level: 2 })).toHaveTextContent(TITLE)
  })

  it('drops the headline to an h3 for a sub-band', () => {
    const { getByRole } = render(MediaSplit, { props: { title: TITLE, headingLevel: 3 } })

    expect(getByRole('heading', { level: 3 })).toHaveTextContent(TITLE)
  })
})
