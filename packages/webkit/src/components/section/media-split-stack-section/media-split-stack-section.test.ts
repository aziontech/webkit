import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ProductMedia from '../../../../examples/media-split-stack-section/product-media.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import MediaSplitStackSection from './media-split-stack-section.vue'

const TESTID = 'media-split-stack-section'
const BAND_TESTID = 'media-split'
const EYEBROW = 'Managed Infrastructure'
const TITLE = 'Stop managing regions and capacity by hand'

const bands = [
  {
    illustration: 'quick-start-with-templates',
    illustrationLabel: 'A project started from a template',
    title: 'Modern applications',
    description: 'Build static sites, run serverless applications.',
    action: { label: 'Learn more about apps', href: '/solutions/web-apps/' }
  },
  {
    illustration: 'ai-applications',
    illustrationLabel: 'An AI agent served close to users',
    title: 'AI applications',
    description: 'Build and deploy AI agents.',
    action: { label: 'Learn more about AI', href: '/solutions/ai/' }
  },
  {
    illustration: 'automate-threat-mitigation',
    title: 'Protected applications and APIs',
    description: 'Protect web applications and APIs.'
  }
]

const run = (props: Record<string, unknown> = {}) =>
  render(MediaSplitStackSection, { props: { bands, ...props } })

const bandSides = (container: HTMLElement) =>
  Array.from(container.querySelectorAll(`[data-testid="${BAND_TESTID}"]`)).map((band) =>
    band.getAttribute('data-variant')
  )

describe('MediaSplitStackSection', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the run under the default testid', () => {
    const { getByTestId } = run()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = run({ 'data-testid': 'solutions' })

    expect(getByTestId('solutions')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('sets every picture at the closing end, with no alternating layout left', () => {
    const { container, getByTestId } = run({ variant: 'alternating' })

    expect(getByTestId(TESTID).hasAttribute('data-variant')).toBe(false)
    expect(bandSides(container as HTMLElement)).toEqual(['media-end', 'media-end', 'media-end'])
  })

  it('renders one band per entry, in order, each named by its title', () => {
    const { getAllByTestId, getByRole } = run()

    expect(getAllByTestId(BAND_TESTID)).toHaveLength(bands.length)
    bands.forEach((band) => {
      expect(getByRole('region', { name: band.title })).toBeInTheDocument()
      expect(getByRole('heading', { level: 2, name: band.title })).toBeInTheDocument()
    })
  })

  it('draws the illustration of a band from the registry under its label', async () => {
    const { findByRole } = run({ bands: [bands[0]] })

    const scene = await findByRole('img', { name: 'A project started from a template' })
    expect(scene).toHaveAttribute('data-testid', 'illustration')
    expect(scene.getAttribute('data-placeholder')).toBeNull()
  })

  it('renders each band action as a link to its href', () => {
    const { getAllByRole } = run()

    bands
      .filter((band) => band.action)
      .forEach((band) => {
        const links = getAllByRole('link', { name: band.action?.label })
        expect(links.length).toBeGreaterThanOrEqual(1)
        links.forEach((link) => expect(link).toHaveAttribute('href', band.action?.href))
      })
  })

  it('renders no link for a band without an action', () => {
    const { queryByRole } = run({ bands: [bands[2]] })

    expect(queryByRole('link')).toBeNull()
  })

  it('renders the header and names the run by its title', () => {
    const { getByRole, getByTestId, getByText } = run({ eyebrow: EYEBROW, title: TITLE })

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(getByText(EYEBROW)).toBeInTheDocument()
  })

  it('opens the run with the medium section title', () => {
    const { getByTestId } = run({ title: TITLE })

    expect(getByTestId('module-header').getAttribute('data-size')).toBe('medium')
  })

  it('drops the band headlines to h3 under a section title', () => {
    const { getByRole, queryAllByRole } = run({ title: TITLE })

    expect(queryAllByRole('heading', { level: 2 })).toHaveLength(1)
    bands.forEach((band) => {
      expect(getByRole('heading', { level: 3, name: band.title })).toBeInTheDocument()
    })
  })

  it('renders the description under the section title', () => {
    const { getByText } = run({ title: TITLE, description: 'Ship without picking a region.' })

    expect(getByText('Ship without picking a region.')).toBeInTheDocument()
  })

  it('renders a band eyebrow above its headline', () => {
    const { getByText } = run({ bands: [{ ...bands[1], eyebrow: 'AI Inference' }] })

    expect(getByText('AI Inference')).toBeInTheDocument()
  })

  it('links the whole band to its href, ahead of its action', () => {
    const { getAllByRole, getByTestId } = run({
      bands: [{ ...bands[0], href: '/solutions/overview/' }]
    })

    expect(getByTestId(BAND_TESTID).hasAttribute('data-media-href')).toBe(true)
    const hrefs = getAllByRole('link').map((link) => link.getAttribute('href'))
    expect(hrefs).toContain('/solutions/overview/')
    expect(hrefs).toContain(bands[0]?.action?.href)
  })

  it('links a band with an href and no action', () => {
    const { getByTestId } = run({ bands: [{ ...bands[2], href: '/solutions/security/' }] })

    expect(getByTestId(BAND_TESTID).hasAttribute('data-media-href')).toBe(true)
  })

  it('draws a band scene ahead of its other media', async () => {
    const { findByTestId, getByTestId } = run({
      bands: [
        {
          ...bands[1],
          scene: { component: 'ConsoleMockup', props: { name: 'kv-store-key' } }
        }
      ]
    })

    expect(await findByTestId('console-mockup', {}, { timeout: 5000 })).toHaveAttribute(
      'data-name',
      'kv-store-key'
    )
    expect(getByTestId(BAND_TESTID).hasAttribute('data-media-padded')).toBe(true)
  })

  it('sets the anchor as the run id', () => {
    const { getByTestId } = run({ anchor: 'solutions' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'solutions')
  })

  it('renders no header and leaves the run unnamed when no title is set', () => {
    const { getByTestId, queryByText } = run({ eyebrow: EYEBROW })

    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
    expect(queryByText(EYEBROW)).toBeNull()
  })

  it('renders only the section when bands is empty', () => {
    const { getByTestId, queryAllByTestId, queryByRole } = run({ bands: [], title: TITLE })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading')).toBeNull()
    expect(queryAllByTestId(BAND_TESTID)).toHaveLength(0)
  })

  it('has no a11y violations', async () => {
    const { container } = run()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with a header', async () => {
    const { container } = run({ eyebrow: EYEBROW, title: TITLE })

    await expectNoA11yViolations(container)
  })

  it('draws a widget inset from the cell and an illustration flush to it', async () => {
    const { container, findByRole, findByTestId } = render(ProductMedia)

    const widget = await findByTestId('console-mockup', {}, { timeout: 5000 })
    expect(widget.getAttribute('data-name')).toBe('data-stream-source')
    expect(
      await findByRole('img', { name: 'A chart of the error rate over time' })
    ).toHaveAttribute('data-testid', 'illustration')
    await expect.poll(() => widget.textContent).toContain('Data Source')
    expect(widget.textContent).not.toContain('Priya')
    const splits = Array.from(container.querySelectorAll(`[data-testid="${BAND_TESTID}"]`))
    expect(splits.map((split) => split.hasAttribute('data-media-padded'))).toEqual([true, false])
  })

  it('draws no diagram, and warns in development about a band left without a picture', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { container, queryByTestId } = run({
      bands: [
        bands[1],
        { title: 'Failover', description: 'Route around an origin.', diagram: 'load-balancer' },
        {
          title: 'Cache',
          description: 'Serve from the nearest location.',
          scene: { component: 'Diagram', props: { name: 'cache' } }
        }
      ]
    })

    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(queryByTestId('diagram')).toBeNull()
    const splits = Array.from(container.querySelectorAll(`[data-testid="${BAND_TESTID}"]`))
    expect(splits.map((split) => split.hasAttribute('data-media'))).toEqual([true, false, false])
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0]?.[0]).toContain('"Failover", "Cache" has no picture')
  })

  it('runs every illustration flush', () => {
    const { container } = run()

    const splits = Array.from(container.querySelectorAll(`[data-testid="${BAND_TESTID}"]`))
    expect(splits.map((split) => split.hasAttribute('data-media-padded'))).toEqual([
      false,
      false,
      false
    ])
  })

  it('prefers a widget over the illustration of the same band', async () => {
    const { container, findByTestId } = run({
      bands: [{ ...bands[0], widget: 'kv-store-key' }]
    })

    await findByTestId('console-mockup', {}, { timeout: 5000 })
    expect(container.querySelector('[data-testid="illustration"]')).toBeNull()
  })

  it('has no a11y violations with product media', async () => {
    const { container, findByTestId } = render(ProductMedia)

    await findByTestId('console-mockup', {}, { timeout: 5000 })
    await expectNoA11yViolations(container)
  })
})
