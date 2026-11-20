import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import FeatureTilesSection from './feature-tiles-section.vue'

const TESTID = 'feature-tiles-section'
const TILE_TESTID = 'media-tile'
const EYEBROW = 'Why Azion'
const TITLE = 'From commit to live traffic, on one platform'
const DESCRIPTION = 'Build, ship, and run an application on the same platform that serves it.'

const artworkTiles = [
  {
    illustration: 'branches',
    title: 'Build at AI speed.',
    description: 'Go from commit to a live URL in minutes.'
  },
  {
    illustration: 'personal-tokens',
    title: 'Secure by default.',
    description: 'Every workload runs in its own isolated environment.'
  },
  {
    illustration: 'azion-highlight',
    title: 'No ops required.',
    description: 'Nothing to provision, nothing to manage.'
  },
  {
    illustration: 'usage-chart',
    title: 'Faster and more efficient workloads.',
    description: 'Compute and security run in the data center closest to the request.'
  }
]

const illustratedTiles = [
  {
    illustration: 'no-idle-no-waste',
    scale: 0.7,
    title: 'No idle. No waste.',
    description: 'Azion bills for actual consumption.'
  },
  {
    illustration: 'traffic-and-cost-bar-chart',
    title: 'Stay in control.',
    description: 'Scale without losing control of your bill.'
  },
  {
    illustration: 'chat-and-headset-tiles',
    scale: 0.8,
    title: 'White-glove when it matters.',
    description: 'Self-service when you want it, experts when you need them.'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(FeatureTilesSection, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      tiles: artworkTiles,
      ...props
    }
  })

const tileLeads = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('figcaption strong')).map((lead) =>
    lead.textContent?.trim()
  )

describe('FeatureTilesSection', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(FeatureTilesSection, {
      props: { title: TITLE, tiles: artworkTiles },
      attrs: { 'data-testid': 'why-azion' }
    })

    expect(getByTestId('why-azion')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it.each([
    ['artwork', artworkTiles],
    ['illustrated', illustratedTiles]
  ] as const)('mirrors variant=%s on data-variant', (variant, tiles) => {
    const { getByTestId } = band({ variant, tiles })

    expect(getByTestId(TESTID).getAttribute('data-variant')).toBe(variant)
  })

  it('defaults to the artwork variant', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('data-variant')).toBe('artwork')
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'why-azion' })

    expect(getByTestId(TESTID).id).toBe('why-azion')
  })

  it('renders no id when the anchor is empty', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).hasAttribute('id')).toBe(false)
  })

  it('names the section by its title', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
  })

  it('renders the title as the h2 of the header', () => {
    const { getByRole, getByText } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(getByText(EYEBROW)).toBeInTheDocument()
    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('renders no header and leaves the section unnamed when no title is set', () => {
    const { getByTestId, queryByRole, queryByText } = band({
      title: '',
      eyebrow: EYEBROW,
      description: DESCRIPTION
    })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryByText(EYEBROW)).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('renders one tile per entry, in order', () => {
    const { container, getAllByTestId } = band()

    expect(getAllByTestId(TILE_TESTID)).toHaveLength(artworkTiles.length)
    expect(tileLeads(container as HTMLElement)).toEqual(artworkTiles.map((tile) => tile.title))
  })

  it('draws an artwork tile from the registry when it names an illustration', async () => {
    const { findByTestId, getAllByTestId } = band({ tiles: [artworkTiles[2]] })

    const scene = await findByTestId('illustration')
    expect(scene.getAttribute('data-placeholder')).toBeNull()
    expect(getAllByTestId(TILE_TESTID)[0]?.querySelector('img')).toBeNull()
  })

  it('renders a tile without an illustration with no media', () => {
    const { getAllByTestId, queryByTestId } = band({
      tiles: [
        { title: 'Build at AI speed.', description: 'Go from commit to a live URL in minutes.' }
      ]
    })

    const tile = getAllByTestId(TILE_TESTID)[0]
    expect(queryByTestId('illustration')).toBeNull()
    expect(tile?.querySelector('img')).toBeNull()
    expect(tile?.hasAttribute('data-media')).toBe(false)
  })

  it('renders an illustrated tile without an image', () => {
    const { container, getAllByTestId } = band({ variant: 'illustrated', tiles: illustratedTiles })

    const tiles = getAllByTestId(TILE_TESTID)
    expect(tiles).toHaveLength(illustratedTiles.length)
    expect(tileLeads(container as HTMLElement)).toEqual(illustratedTiles.map((tile) => tile.title))
    tiles.forEach((tile) => {
      expect(tile.querySelector('img')).toBeNull()
    })
  })

  it('renders only the section when tiles is empty', () => {
    const { getByTestId, queryAllByTestId, queryByRole, queryByTestId } = band({ tiles: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryAllByTestId(TILE_TESTID)).toHaveLength(0)
    expect(queryByTestId('registration-frame')).toBeNull()
  })

  it('renders only the section when tiles is omitted', () => {
    const { getByTestId, queryAllByTestId } = render(FeatureTilesSection)

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByTestId(TILE_TESTID)).toHaveLength(0)
  })

  it('has no a11y violations with the artwork variant', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with the illustrated variant', async () => {
    const { container } = band({ variant: 'illustrated', tiles: illustratedTiles })

    await expectNoA11yViolations(container)
  })
})
