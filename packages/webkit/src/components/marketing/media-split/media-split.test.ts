import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import MediaSplit from './media-split.vue'

const TESTID = 'marketing-media-split'
const GROUND = 'marketing-texture-material'

const TITLE = 'See every request as it happens.'
const DESCRIPTION = 'Logs stream from every edge location in real time, with no agent to install.'
const EYEBROW = 'Observability'
const ALT = 'A live log stream showing requests from twelve edge locations'
const SRC = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

const FOLLOWING = 4

// The cells are addressed by the grid's own derived testid, so the helper does not move
// when the band gains or loses its registration frame.
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
    // the band is a named landmark; the name comes from its title, not from a wired id
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

  it('opens the band with an h2 by default', () => {
    const { getByRole } = render(MediaSplit, { props: { title: TITLE } })

    expect(getByRole('heading', { level: 2 })).toHaveTextContent(TITLE)
  })

  it('drops the headline to an h3 for a sub-band', () => {
    const { getByRole } = render(MediaSplit, { props: { title: TITLE, headingLevel: 3 } })

    expect(getByRole('heading', { level: 3 })).toHaveTextContent(TITLE)
  })
})
