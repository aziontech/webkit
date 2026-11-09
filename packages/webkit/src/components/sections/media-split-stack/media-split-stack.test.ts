import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import MediaSplitStack from './media-split-stack.vue'

const TESTID = 'sections-media-split-stack'
const BAND_TESTID = 'marketing-media-split'
const EYEBROW = 'Managed Infrastructure'
const TITLE = 'Stop managing regions and capacity by hand'

const bands = [
  {
    image: '/illustrations/quick-start-with-templates.svg',
    imageAlt: 'A project started from a template',
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
  render(MediaSplitStack, { props: { bands, ...props } })

const bandSides = (container: HTMLElement) =>
  Array.from(container.querySelectorAll(`[data-testid="${BAND_TESTID}"]`)).map((band) =>
    band.getAttribute('data-kind')
  )

describe('MediaSplitStack', () => {
  it('renders the run under the default testid', () => {
    const { getByTestId } = run()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = run({ 'data-testid': 'solutions' })

    expect(getByTestId('solutions')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it.each(['media-end', 'alternating'] as const)('mirrors kind=%s on data-kind', (kind) => {
    const { getByTestId } = run({ kind })

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe(kind)
  })

  it('defaults to the media-end kind with every picture at the closing end', () => {
    const { container, getByTestId } = run()

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe('media-end')
    expect(bandSides(container)).toEqual(['media-end', 'media-end', 'media-end'])
  })

  it('alternates the media side band by band, starting at the opening end', () => {
    const { container } = run({ kind: 'alternating' })

    expect(bandSides(container)).toEqual(['media-start', 'media-end', 'media-start'])
  })

  it('renders one band per entry, in order, each named by its title', () => {
    const { getAllByTestId, getByRole } = run()

    expect(getAllByTestId(BAND_TESTID)).toHaveLength(bands.length)
    bands.forEach((band) => {
      expect(getByRole('region', { name: band.title })).toBeInTheDocument()
      expect(getByRole('heading', { level: 2, name: band.title })).toBeInTheDocument()
    })
  })

  it('renders the image of a band with its alt text', () => {
    const { getByAltText } = run()

    expect(getByAltText('A project started from a template').getAttribute('src')).toBe(
      bands[0]?.image
    )
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

  it('has no a11y violations with the media-end kind', async () => {
    const { container } = run()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with the alternating kind and a header', async () => {
    const { container } = run({ kind: 'alternating', eyebrow: EYEBROW, title: TITLE })

    await expectNoA11yViolations(container)
  })
})
