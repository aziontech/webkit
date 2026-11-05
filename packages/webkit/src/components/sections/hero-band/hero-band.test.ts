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

  it('renders only the root when title is empty', () => {
    const { getByTestId, queryByTestId, queryByRole } = band({ title: '' })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByTestId(HERO_TESTID)).toBeNull()
    expect(queryByRole('heading')).toBeNull()
  })

  it.each(['centered', 'title-band', 'pixel-floor', 'copy-beside-art'] as const)(
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
