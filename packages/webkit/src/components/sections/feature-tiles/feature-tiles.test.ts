import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import FeatureTiles from './feature-tiles.vue'

const TESTID = 'sections-feature-tiles'
const TILE_TESTID = 'marketing-media-tile'
const EYEBROW = 'Why Azion'
const TITLE = 'From commit to live traffic, on one platform'
const DESCRIPTION = 'Build, ship, and run an application on the same platform that serves it.'

const artworkTiles = [
  {
    image: '/illustrations/branches.svg',
    title: 'Build at AI speed.',
    description: 'Go from commit to a live URL in minutes.'
  },
  {
    image: '/illustrations/personal-tokens.svg',
    title: 'Secure by default.',
    description: 'Every workload runs in its own isolated environment.'
  },
  {
    image: '/illustrations/azion-highlight.svg',
    title: 'No ops required.',
    description: 'Nothing to provision, nothing to manage.'
  },
  {
    image: '/illustrations/usage-chart.svg',
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
    illustration: 'stay-in-control',
    title: 'Stay in control.',
    description: 'Scale without losing control of your bill.'
  },
  {
    illustration: 'white-gloves-when-it-matters',
    scale: 0.8,
    title: 'White-glove when it matters.',
    description: 'Self-service when you want it, experts when you need them.'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(FeatureTiles, {
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

describe('FeatureTiles', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(FeatureTiles, {
      props: { title: TITLE, tiles: artworkTiles },
      attrs: { 'data-testid': 'why-azion' }
    })

    expect(getByTestId('why-azion')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it.each([
    ['artwork', artworkTiles],
    ['illustrated', illustratedTiles]
  ] as const)('mirrors kind=%s on data-kind', (kind, tiles) => {
    const { getByTestId } = band({ kind, tiles })

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe(kind)
  })

  it('defaults to the artwork kind', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe('artwork')
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
    expect(tileLeads(container)).toEqual(artworkTiles.map((tile) => tile.title))
  })

  it('renders an artwork tile as an image from its url', () => {
    const { getAllByTestId } = band()

    getAllByTestId(TILE_TESTID).forEach((tile, index) => {
      const image = tile.querySelector('img')
      expect(image).not.toBeNull()
      expect(image?.getAttribute('src')).toBe(artworkTiles[index]?.image)
    })
  })

  it('renders an illustrated tile without an image', () => {
    const { container, getAllByTestId } = band({ kind: 'illustrated', tiles: illustratedTiles })

    const tiles = getAllByTestId(TILE_TESTID)
    expect(tiles).toHaveLength(illustratedTiles.length)
    expect(tileLeads(container)).toEqual(illustratedTiles.map((tile) => tile.title))
    tiles.forEach((tile) => {
      expect(tile.querySelector('img')).toBeNull()
    })
  })

  it('renders only the section when tiles is empty', () => {
    const { getByTestId, queryAllByTestId, queryByRole, queryByTestId } = band({ tiles: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryAllByTestId(TILE_TESTID)).toHaveLength(0)
    expect(queryByTestId('layout-frame-box')).toBeNull()
  })

  it('renders only the section when tiles is omitted', () => {
    const { getByTestId, queryAllByTestId } = render(FeatureTiles)

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByTestId(TILE_TESTID)).toHaveLength(0)
  })

  it('has no a11y violations with the artwork kind', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with the illustrated kind', async () => {
    const { container } = band({ kind: 'illustrated', tiles: illustratedTiles })

    await expectNoA11yViolations(container)
  })
})
