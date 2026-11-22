import { colorToken, isFiniteNumber, maxOf, minOf } from '../../lib'
import type { MapChartPoint, MapChartRegion } from '../types'

const X0 = 741
const KX = 4.83
const Y0 = 605
const RY = 276.7
const CELL = /M(\d+) (\d+)h(\d+)/g

export const BINS = 5

export interface MapBox {
  x: number
  y: number
  width: number
  height: number
}

export interface MapItem<R, P> {
  kind: 'region' | 'point'
  id: string
  name: string
  value: number
  anchor: [number, number] | null
  region?: R
  point?: P
}

function project(lat: number, lon: number): [number, number] {
  const clamped = (Math.max(-80, Math.min(84, lat)) * Math.PI) / 180
  return [X0 + KX * lon, Y0 - RY * Math.log(Math.tan(Math.PI / 4 + clamped / 2))]
}

export function parseBox(region: string): MapBox {
  const [x, y, width, height] = region.split(' ').map(Number)
  return { x: x ?? 0, y: y ?? 0, width: width ?? 1590, height: height ?? 940 }
}

function binOf(value: number, min: number, max: number): number {
  if (max <= min) return BINS - 1
  return Math.min(BINS - 1, Math.floor(((value - min) / (max - min)) * BINS))
}

export const binColor = (bin: number): string => `var(--chart-sequential-${bin + 3})`

function anchorOf(cells: string): [number, number] | null {
  let sumX = 0
  let sumY = 0
  let count = 0
  for (const match of cells.matchAll(CELL)) {
    const width = Number(match[3])
    sumX += (Number(match[1]) + width / 2) * width
    sumY += (Number(match[2]) + 2.5) * width
    count += width
  }
  return count ? [sumX / count, sumY / count] : null
}

export function mapBubbles<P extends MapChartPoint>(points: readonly P[]) {
  const valued = points.filter((point) => isFiniteNumber(point.value))
  const max = maxOf(valued.map((p) => p.value))
  return valued
    .map((point) => {
      const [x, y] = project(point.lat, point.lon)
      const ratio = max > 0 ? Math.sqrt(Math.max(0, point.value) / max) : 0
      return {
        id: point.id,
        x,
        y,
        r: 8 + 24 * ratio,
        color: colorToken(point.color ?? 1),
        source: point
      }
    })
    .sort((a, b) => b.r - a.r)
}

export function mapItems<R extends MapChartRegion & { value: number }, P extends MapChartPoint>(
  shaded: readonly R[],
  points: readonly P[],
  cells: Readonly<Record<string, string>> | null,
  nameOf: (region: R) => string
): MapItem<R, P>[] {
  const regionItems = [...shaded]
    .sort((a, b) => b.value - a.value)
    .map<MapItem<R, P>>((region) => {
      const d = cells?.[region.id.toUpperCase()]
      return {
        kind: 'region',
        id: region.id,
        name: nameOf(region),
        value: region.value,
        anchor: d ? anchorOf(d) : null,
        region
      }
    })
  const pointItems = points
    .filter((point) => isFiniteNumber(point.value))
    .sort((a, b) => b.value - a.value)
    .map<MapItem<R, P>>((point) => ({
      kind: 'point',
      id: point.id,
      name: point.name,
      value: point.value,
      anchor: project(point.lat, point.lon),
      point
    }))
  return [...regionItems, ...pointItems]
}

export function stagePosition(
  anchor: [number, number],
  box: MapBox,
  width: number,
  height: number
): { x: number; y: number } {
  const scale = Math.min(width / box.width, height / box.height || Number.POSITIVE_INFINITY)
  const offsetX = (width - box.width * scale) / 2
  const offsetY = (height - box.height * scale) / 2
  return { x: offsetX + (anchor[0] - box.x) * scale, y: offsetY + (anchor[1] - box.y) * scale }
}

export function valueDomain(values: number[]): { min: number; max: number } {
  return values.length
    ? { min: minOf(values, Infinity), max: maxOf(values, -Infinity) }
    : { min: 0, max: 0 }
}

export function mapShapes(
  shaded: readonly (MapChartRegion & { value: number })[],
  cells: Readonly<Record<string, string>> | null,
  domain: { min: number; max: number }
): { id: string; d: string; bin: number }[] {
  if (!cells) return []
  return shaded.flatMap((region) => {
    const d = cells[region.id.toUpperCase()]
    return d ? [{ id: region.id, d, bin: binOf(region.value, domain.min, domain.max) }] : []
  })
}

export function regionNamer(locale: string): (region: MapChartRegion) => string {
  let names: Intl.DisplayNames | null = null
  try {
    names = new Intl.DisplayNames([locale], { type: 'region' })
  } catch {
    names = null
  }
  return (region) => {
    if (region.name) return region.name
    try {
      return names?.of(region.id.toUpperCase()) ?? region.id
    } catch {
      return region.id
    }
  }
}

export function markId(target: EventTarget | null): string | null | undefined {
  const mark = target instanceof Element ? target.closest('[data-region], [data-point]') : null
  return mark?.getAttribute('data-region') ?? mark?.getAttribute('data-point')
}

export const sumOf = (items: readonly { value: number }[]): number =>
  items.reduce((sum, item) => sum + item.value, 0)
