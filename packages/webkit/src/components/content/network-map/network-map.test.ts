import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import NetworkMap from './network-map.vue'
import { NETWORK_MAP_REGIONS } from './network-map-data'

const TESTID = 'content-network-map'

const REGIONS = [
  'world',
  'atlantic',
  'americas',
  'north-america',
  'south-america',
  'europe',
  'africa',
  'asia',
  'oceania'
] as const
const FADES = ['none', 'top', 'bottom', 'left', 'right', 'edges', 'vignette'] as const
const DENSITY_PATHS = [
  ['none', 0],
  ['low', 3],
  ['medium', 6],
  ['high', 9]
] as const
const POSITIONS = [
  ['center', 'xMidYMid meet'],
  ['top', 'xMidYMin meet'],
  ['bottom', 'xMidYMax meet'],
  ['left', 'xMinYMid meet'],
  ['right', 'xMaxYMid meet'],
  ['top-left', 'xMinYMin meet'],
  ['top-right', 'xMaxYMin meet'],
  ['bottom-left', 'xMinYMax meet'],
  ['bottom-right', 'xMaxYMax meet']
] as const

const popPaths = (root: HTMLElement) => root.querySelectorAll('path[data-phase]')

describe('NetworkMap', () => {
  it('renders with the default testid and defaults mirrored on the root', () => {
    const { getByTestId } = render(NetworkMap)
    const root = getByTestId(TESTID)

    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('data-region', 'world')
    expect(root).toHaveAttribute('data-density', 'medium')
    expect(root).toHaveAttribute('data-fade', 'none')
  })

  it('lets a consumer-supplied data-testid win', () => {
    const { getByTestId, queryByTestId } = render(NetworkMap, {
      attrs: { 'data-testid': 'custom-map' }
    })

    expect(getByTestId('custom-map')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('hides the layer from assistive tech', () => {
    const { getByTestId } = render(NetworkMap)
    expect(getByTestId(TESTID)).toHaveAttribute('aria-hidden', 'true')
  })

  it.each(REGIONS)('lights only the PoPs inside the %s region', (region) => {
    const { getByTestId } = render(NetworkMap, { props: { region, density: 'high' } })
    const root = getByTestId(TESTID)
    const [x, y, width, height] = NETWORK_MAP_REGIONS[region].split(' ').map(Number)
    const cells = Array.from(popPaths(root)).flatMap((path) =>
      Array.from((path.getAttribute('d') ?? '').matchAll(/M(\d+) (\d+)/g), ([, cx, cy]) => [
        Number(cx),
        Number(cy)
      ])
    )

    expect(root).toHaveAttribute('data-region', region)
    cells.forEach(([cx, cy]) => {
      expect(cx >= x && cx < x + width && cy >= y && cy < y + height).toBe(true)
    })
  })

  it('keeps the whole world framed whatever the region', () => {
    const viewBoxOf = (region: (typeof REGIONS)[number]) =>
      render(NetworkMap, { props: { region } })
        .container.querySelector('svg')
        ?.getAttribute('viewBox')

    expect(viewBoxOf('europe')).toBe(viewBoxOf('world'))
  })

  it('lights fewer PoPs in a region than across the world', () => {
    const count = (region: (typeof REGIONS)[number]) =>
      Array.from(
        popPaths(
          render(NetworkMap, { props: { region, density: 'high' } }).container as HTMLElement
        )
      ).reduce(
        (total, path) => total + ((path.getAttribute('d') ?? '').match(/M/g)?.length ?? 0),
        0
      )

    expect(count('world')).toBe(309)
    expect(count('europe')).toBe(48)
  })

  it('lights the main Brazilian capitals at the lowest density', () => {
    const { getByTestId } = render(NetworkMap, { props: { density: 'low' } })
    const lit = Array.from(popPaths(getByTestId(TESTID)))
      .map((path) => path.getAttribute('d') ?? '')
      .join('')
    const CAPITALS = {
      'São Paulo': 'M490 740',
      'Rio de Janeiro': 'M500 740',
      Brasília: 'M510 700',
      Salvador: 'M540 680',
      Fortaleza: 'M550 620',
      Manaus: 'M450 620',
      'Porto Alegre': 'M480 780'
    }

    Object.values(CAPITALS).forEach((cell) => expect(lit).toContain(`${cell}h5v5h-5z`))
  })

  it.each(['asia', 'oceania'] as const)('draws no PoP path for %s', (region) => {
    const { getByTestId } = render(NetworkMap, { props: { region } })
    expect(popPaths(getByTestId(TESTID))).toHaveLength(0)
  })

  it.each(FADES)('carries the %s fade on data-fade', (fade) => {
    const { getByTestId } = render(NetworkMap, { props: { fade } })
    expect(getByTestId(TESTID)).toHaveAttribute('data-fade', fade)
  })

  it.each(DENSITY_PATHS)('lights the %s density with %i PoP paths', (density, count) => {
    const { getByTestId } = render(NetworkMap, { props: { density } })
    const root = getByTestId(TESTID)

    expect(root).toHaveAttribute('data-density', density)
    expect(popPaths(root)).toHaveLength(count)
  })

  it('tags every PoP path with its wave phase', () => {
    const { getByTestId } = render(NetworkMap, { props: { density: 'low' } })
    const phases = Array.from(popPaths(getByTestId(TESTID))).map((path) =>
      path.getAttribute('data-phase')
    )

    expect(phases).toEqual(['0', '1', '2'])
  })

  it('leaves data-animated off the PoPs when static', () => {
    const { getByTestId } = render(NetworkMap)
    const paths = Array.from(popPaths(getByTestId(TESTID)))

    expect(paths.length).toBeGreaterThan(0)
    paths.forEach((path) => expect(path).not.toHaveAttribute('data-animated'))
  })

  it('sets data-animated on every PoP when animated', () => {
    const { getByTestId } = render(NetworkMap, { props: { animated: true } })
    const paths = Array.from(popPaths(getByTestId(TESTID)))

    expect(paths.length).toBeGreaterThan(0)
    paths.forEach((path) => expect(path).toHaveAttribute('data-animated'))
  })

  it('applies the opacity to the landmass path', () => {
    const { getByTestId } = render(NetworkMap, { props: { opacity: 0.25 } })
    const land = getByTestId(TESTID).querySelector('path:not([data-phase])')

    expect(land).toHaveAttribute('opacity', '0.25')
  })

  it('defaults the landmass opacity to 0.4', () => {
    const { getByTestId } = render(NetworkMap)
    const land = getByTestId(TESTID).querySelector('path:not([data-phase])')

    expect(land).toHaveAttribute('opacity', '0.4')
  })

  it('fills the landmass with the dot pattern it defines', () => {
    const { getByTestId } = render(NetworkMap)
    const root = getByTestId(TESTID)
    const pattern = root.querySelector('pattern')
    const land = root.querySelector('path:not([data-phase])')

    expect(pattern).not.toBeNull()
    expect(land).toHaveAttribute('fill', `url(#${pattern?.getAttribute('id')})`)
  })

  it.each(POSITIONS)('parks the %s position as %s', (position, alignment) => {
    const { getByTestId } = render(NetworkMap, { props: { position } })
    expect(getByTestId(TESTID).querySelector('svg')).toHaveAttribute(
      'preserveAspectRatio',
      alignment
    )
  })

  it.each([
    ['top-right', '-397.5 0 1987.5 1175'],
    ['center', '-198.75 -117.5 1987.5 1175'],
    ['bottom-left', '0 -235 1987.5 1175']
  ] as const)('shrinks the map toward the %s anchor when scaled down', (position, viewBox) => {
    const { getByTestId } = render(NetworkMap, {
      props: { position, scale: 0.8 }
    })
    expect(getByTestId(TESTID).querySelector('svg')).toHaveAttribute('viewBox', viewBox)
  })

  it('leaves room around the map by default', () => {
    const { getByTestId } = render(NetworkMap)
    expect(getByTestId(TESTID).querySelector('svg')).toHaveAttribute(
      'viewBox',
      '-140.2941176470589 -82.94117647058829 1870.5882352941178 1105.8823529411766'
    )
  })

  it('enlarges the map when scaled above 1', () => {
    const { getByTestId } = render(NetworkMap, { props: { scale: 2 } })
    expect(getByTestId(TESTID).querySelector('svg')).toHaveAttribute('viewBox', '397.5 235 795 470')
  })

  it('falls back to the fitted map when scale is not positive', () => {
    const { getByTestId } = render(NetworkMap, { props: { scale: 0 } })
    expect(getByTestId(TESTID).querySelector('svg')).toHaveAttribute(
      'viewBox',
      NETWORK_MAP_REGIONS.world
    )
  })

  it.each([
    [0.2, -0.2, '-318 188 1590 940'],
    [-0.2, 0.2, '318 -188 1590 940'],
    [0.1, 0, '-159 0 1590 940'],
    [0, -0.1, '0 94 1590 940']
  ] as const)('shifts the map by offsetX %s and offsetY %s', (offsetX, offsetY, viewBox) => {
    const { getByTestId } = render(NetworkMap, { props: { scale: 1, offsetX, offsetY } })
    expect(getByTestId(TESTID).querySelector('svg')).toHaveAttribute('viewBox', viewBox)
  })

  it('applies the offsets on top of the position anchor', () => {
    const { getByTestId } = render(NetworkMap, {
      props: { position: 'top-right', scale: 0.8, offsetX: 0.1, offsetY: -0.1 }
    })
    expect(getByTestId(TESTID).querySelector('svg')).toHaveAttribute(
      'viewBox',
      '-556.5 94 1987.5 1175'
    )
  })

  it('has no axe violations', async () => {
    const { container } = render(NetworkMap, { props: { animated: true, fade: 'vignette' } })
    await expectNoA11yViolations(container)
  })
})
