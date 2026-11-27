import { duration } from '@aziontech/theme/animations'

import {
  barPath,
  type CategoryLayout,
  isFiniteNumber,
  type LinearScale,
  type NormalizedSeries,
  stackValues
} from '../../../lib'

const MAX_THICKNESS = 24
const GAP = 2
const RADIUS = 4
const LABEL_OFFSET = 6

export interface BarMark {
  key: string
  id: string
  index: number
  d: string
  color: string
  delay: string
}

export interface BarLabel {
  key: number
  x: number
  y: number
  text: string
}

export interface BarLayoutInput {
  category: CategoryLayout
  scale: LinearScale
  baseline: number
  series: NormalizedSeries[]
  count: number
  vertical: boolean
  rtl: boolean
  histogram: boolean
  showLabels: boolean
  formatValue: (value: number) => string
}

export interface BarLayout {
  bars: BarMark[]
  labels: BarLabel[]
}

const delayOf = (index: number): string =>
  `calc(${duration['fast-01']} * ${Math.min(index, 12) / 2})`

function roundedBar(
  input: BarLayoutInput,
  start: number,
  thickness: number,
  from: number,
  to: number
): string {
  const radius = input.histogram ? 0 : RADIUS
  const low = Math.min(from, to)
  const length = Math.abs(to - from)
  return input.vertical
    ? barPath(start, low, thickness, length, radius, 'top')
    : barPath(low, start, length, thickness, radius, input.rtl ? 'left' : 'right')
}

function squareBar(
  vertical: boolean,
  start: number,
  thickness: number,
  from: number,
  to: number
): string {
  const low = Math.min(from, to)
  const length = Math.abs(to - from)
  return vertical
    ? `M${start},${low}h${thickness}v${length}h${-thickness}Z`
    : `M${low},${start}h${length}v${thickness}h${-length}Z`
}

function labelAt(
  input: BarLayoutInput,
  index: number,
  center: number,
  end: number,
  value: number
): BarLabel {
  const text = input.formatValue(value)
  if (input.vertical) return { key: index, x: center, y: end - LABEL_OFFSET, text }
  return { key: index, x: input.rtl ? end - LABEL_OFFSET : end + LABEL_OFFSET, y: center, text }
}

function barMark(entry: NormalizedSeries, index: number, d: string): BarMark {
  return {
    key: `${entry.id}-${index}`,
    id: entry.id,
    index,
    d,
    color: entry.color,
    delay: delayOf(index)
  }
}

function solidThickness(input: BarLayoutInput): number {
  return Math.max(1, input.category.bandwidth - 1)
}

function stackedLayout(input: BarLayoutInput): BarLayout {
  const { category, scale, series: list, count, vertical } = input
  const bars: BarMark[] = []
  const labels: BarLabel[] = []
  const segmentGap = input.histogram ? 0 : GAP
  const thickness = input.histogram
    ? solidThickness(input)
    : Math.max(2, Math.min(MAX_THICKNESS, category.bandwidth * 0.6))
  const layers = stackValues(
    list.map((entry) => entry.values),
    count
  )
  for (let index = 0; index < count; index += 1) {
    const center = category.position(index)
    const start = center - thickness / 2
    let top = -1
    layers.forEach((layer, order) => {
      if ((layer.upper[index] ?? 0) > (layer.lower[index] ?? 0)) top = order
    })
    layers.forEach((layer, order) => {
      const lower = layer.lower[index] ?? 0
      const upper = layer.upper[index] ?? 0
      const entry = list[order]
      if (upper <= lower || !entry) return
      const gap = lower > 0 ? segmentGap : 0
      const from = vertical ? scale(lower) - gap : scale(lower) + gap
      const to = scale(upper)
      if (Math.abs(to - from) <= 0) return
      const d =
        order === top
          ? roundedBar(input, start, thickness, from, to)
          : squareBar(vertical, start, thickness, from, to)
      bars.push(barMark(entry, index, d))
    })
    const total = layers[layers.length - 1]?.upper[index] ?? 0
    if (input.showLabels && total > 0)
      labels.push(labelAt(input, index, center, scale(total), total))
  }
  return { bars, labels }
}

function groupedLayout(input: BarLayoutInput): BarLayout {
  const { category, scale, series: list, count } = input
  const bars: BarMark[] = []
  const labels: BarLabel[] = []
  const series = Math.max(1, list.length)
  const thickness = input.histogram
    ? Math.max(1, (solidThickness(input) - (series - 1) * GAP) / series)
    : Math.max(
        2,
        Math.min(MAX_THICKNESS, (category.bandwidth * 0.72 - (series - 1) * GAP) / series)
      )
  const group = series * thickness + (series - 1) * GAP
  for (let index = 0; index < count; index += 1) {
    const center = category.position(index)
    list.forEach((entry, order) => {
      const value = entry.values[index]
      if (!isFiniteNumber(value)) return
      const offset = -group / 2 + order * (thickness + GAP)
      const end = scale(value)
      const d = roundedBar(input, center + offset, thickness, input.baseline, end)
      if (!d) return
      bars.push(barMark(entry, index, d))
      if (input.showLabels && series === 1) labels.push(labelAt(input, index, center, end, value))
    })
  }
  return { bars, labels }
}

export function barLayout(input: BarLayoutInput, stacked: boolean): BarLayout {
  return stacked ? stackedLayout(input) : groupedLayout(input)
}
