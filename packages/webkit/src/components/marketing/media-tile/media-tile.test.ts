import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import MediaTile from './media-tile.vue'

const TESTID = 'marketing-media-tile'
const FRAME = `${TESTID}__frame`

const TITLE = 'AI workloads.'
const DESCRIPTION =
  'Run tasks with reduced latency and higher concurrency, delivering faster results.'
const ALT = 'Three inference jobs running side by side'
const SRC = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

function captionOf(container: globalThis.HTMLElement): globalThis.HTMLElement | null {
  return container.querySelector('figcaption')
}

describe('MediaTile', () => {
  it('renders the tile under the default testid', () => {
    const { getByTestId } = render(MediaTile, { props: { title: TITLE } })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(MediaTile, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'workload-tile' }
    })

    expect(getByTestId('workload-tile')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('captions the tile as a figure', () => {
    const { container, getByTestId } = render(MediaTile, {
      props: { title: TITLE, description: DESCRIPTION }
    })

    expect(getByTestId(TESTID).tagName).toBe('FIGURE')
    expect(captionOf(container)).toBeInTheDocument()
  })

  it('runs the lead into the body as one caption string', () => {
    const { container } = render(MediaTile, {
      props: { title: TITLE, description: DESCRIPTION }
    })

    expect(captionOf(container)?.textContent).toBe(`${TITLE} ${DESCRIPTION}`)
  })

  it('renders the lead as the caption strong', () => {
    const { container } = render(MediaTile, {
      props: { title: TITLE, description: DESCRIPTION }
    })

    expect(container.querySelector('figcaption strong')?.textContent).toBe(TITLE)
  })

  it('renders the lead alone when no body is given', () => {
    const { container, getByTestId } = render(MediaTile, { props: { title: TITLE } })

    expect(captionOf(container)?.textContent).toBe(TITLE)
    expect(getByTestId(TESTID)).not.toHaveAttribute('data-described')
  })

  it('flags a caption that carries a body', () => {
    const { getByTestId } = render(MediaTile, {
      props: { title: TITLE, description: DESCRIPTION }
    })

    expect(getByTestId(TESTID)).toHaveAttribute('data-described', 'true')
  })

  it('lets the default slot replace the description prop', () => {
    const { container, queryByText } = render(MediaTile, {
      props: { title: TITLE, description: DESCRIPTION },
      slots: { default: 'Scheduled close to the request that needs them.' }
    })

    expect(captionOf(container)?.textContent).toBe(
      `${TITLE} Scheduled close to the request that needs them.`
    )
    expect(queryByText(DESCRIPTION)).toBeNull()
  })

  it('renders the image from src with the alt it is given', () => {
    const { getByRole } = render(MediaTile, { props: { title: TITLE, src: SRC, alt: ALT } })
    const image = getByRole('img', { name: ALT })

    expect(image.getAttribute('src')).toBe(SRC)
    expect(image.getAttribute('aria-hidden')).toBeNull()
  })

  it('hides an image given no alt from assistive technology', () => {
    const { container } = render(MediaTile, { props: { title: TITLE, src: SRC } })
    const image = container.querySelector('img')

    expect(image).toBeInTheDocument()
    expect(image?.getAttribute('alt')).toBe('')
    expect(image?.getAttribute('aria-hidden')).toBe('true')
  })

  it('lets the media slot replace the image built from src', () => {
    const { container, getByTestId } = render(MediaTile, {
      props: { title: TITLE, src: SRC, alt: ALT },
      slots: { media: '<span data-testid="scene">scene</span>' }
    })

    expect(getByTestId('scene')).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })

  it('draws the frame even when it holds no media', () => {
    const { getByTestId } = render(MediaTile, { props: { title: TITLE } })

    expect(getByTestId(FRAME)).toBeInTheDocument()
    expect(getByTestId(TESTID)).not.toHaveAttribute('data-media')
  })

  it('flags a tile that holds media', () => {
    const { getByTestId } = render(MediaTile, { props: { title: TITLE, src: SRC, alt: ALT } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-media', 'true')
  })

  it('insets the media from the frame by default', () => {
    const { getByTestId } = render(MediaTile, { props: { title: TITLE, src: SRC, alt: ALT } })

    expect(getByTestId(FRAME)).toHaveAttribute('data-padded', 'true')
  })

  it('drops the inset when padded is turned off', () => {
    const { getByTestId } = render(MediaTile, {
      props: { title: TITLE, src: SRC, alt: ALT, padded: false }
    })

    expect(getByTestId(FRAME)).not.toHaveAttribute('data-padded')
  })

  it('derives the frame testid from a consumer-supplied one', () => {
    const { getByTestId } = render(MediaTile, {
      props: { title: TITLE },
      attrs: { 'data-testid': 'workload-tile' }
    })

    expect(getByTestId('workload-tile__frame')).toBeInTheDocument()
  })

  it('frames the media in the default register', () => {
    const { getByTestId } = render(MediaTile, { props: { title: TITLE } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', 'frame')
    expect(getByTestId(FRAME)).toHaveAttribute('data-borders')
  })

  it('draws no rules around the media in the plain register', () => {
    const { getByTestId } = render(MediaTile, { props: { title: TITLE, kind: 'plain' } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-kind', 'plain')
    expect(getByTestId(FRAME)).not.toHaveAttribute('data-borders')
  })

  it('captions a plain tile the same way it captions a framed one', () => {
    const { container } = render(MediaTile, {
      props: { title: TITLE, description: DESCRIPTION, kind: 'plain' }
    })

    expect(captionOf(container)?.textContent).toBe(`${TITLE} ${DESCRIPTION}`)
  })

  it('has no a11y violations as a plain tile', async () => {
    const { container } = render(MediaTile, {
      props: { title: TITLE, description: DESCRIPTION, kind: 'plain', src: SRC, alt: ALT }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations as a captioned tile', async () => {
    const { container } = render(MediaTile, {
      props: { title: TITLE, description: DESCRIPTION, src: SRC, alt: ALT }
    })

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with a decorative image', async () => {
    const { container } = render(MediaTile, {
      props: { title: TITLE, description: DESCRIPTION, src: SRC }
    })

    await expectNoA11yViolations(container)
  })
})
