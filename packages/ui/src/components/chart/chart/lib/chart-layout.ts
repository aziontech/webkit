import {
  type CategoryLayout,
  categoryLayout,
  type ChartLabel,
  type ChartLabelScale,
  type ChartPoint,
  type ChartRange,
  isFiniteNumber,
  labelValue,
  linearLayout,
  type LinearScale,
  linearScale,
  maxOf,
  mirrorLayout,
  type NormalizedSeries,
  stackedMax
} from '../../lib'
import type { ChartMarkRegistration, ChartPlotBox } from '../injection-key'

const LABEL_CHAR_WIDTH = 7
const LABEL_GUTTER = 12
const CATEGORY_LABEL_LIMIT = 160
const TWIN_ROW_LIMIT = 1000

export interface ChartInsetInput {
  hasX: boolean
  hasY: boolean
  vertical: boolean
  rtl: boolean
  labeled: boolean
  valueChars: number
  categoryChars: number
}

export function twinRowsOf(labels: ChartLabel[]): { label: ChartLabel; index: number }[] {
  const total = labels.length
  if (total <= TWIN_ROW_LIMIT) return labels.map((label, index) => ({ label, index }))
  const step = (total - 1) / (TWIN_ROW_LIMIT - 1)
  return Array.from({ length: TWIN_ROW_LIMIT }, (_, row) => Math.round(row * step)).flatMap(
    (index) => {
      const label = labels[index]
      return label === undefined ? [] : [{ label, index }]
    }
  )
}

export function dataMaxOf(
  marks: ChartMarkRegistration[],
  resolve: (ids: readonly string[]) => NormalizedSeries[],
  count: number
): number {
  const finite = (ids: readonly string[]) =>
    resolve(ids).flatMap((entry) => entry.values.filter(isFiniteNumber))
  if (!marks.length) return maxOf(finite([]))
  return marks.reduce((max, mark) => {
    const value = mark.stacked
      ? stackedMax(
          resolve(mark.ids).map((entry) => entry.values),
          count
        )
      : maxOf(finite(mark.ids))
    return Math.max(max, value)
  }, 0)
}

export function plotInsets(input: ChartInsetInput): {
  top: number
  right: number
  bottom: number
  left: number
} {
  const valueWidth = input.valueChars * LABEL_CHAR_WIDTH + LABEL_GUTTER
  const categoryWidth = Math.min(
    CATEGORY_LABEL_LIMIT,
    input.categoryChars * LABEL_CHAR_WIDTH + LABEL_GUTTER
  )
  const far = input.vertical ? 8 : input.labeled ? 56 : 16
  const near = input.hasY ? (input.vertical ? valueWidth : categoryWidth) : 8
  return {
    top: 8,
    right: input.rtl ? near : far,
    bottom: input.hasX ? 28 : 8,
    left: input.rtl ? far : near
  }
}

export function valueScaleFor(
  vertical: boolean,
  rtl: boolean,
  domain: [number, number],
  plot: ChartPlotBox
): LinearScale {
  if (vertical) return linearScale(domain, [plot.top + plot.height, plot.top])
  return linearScale(
    domain,
    rtl ? [plot.left + plot.width, plot.left] : [plot.left, plot.left + plot.width]
  )
}

export function categoryFor(
  vertical: boolean,
  rtl: boolean,
  scale: ChartLabelScale,
  labels: ChartLabel[],
  banded: boolean,
  plot: ChartPlotBox
): CategoryLayout {
  const start = vertical ? plot.left : plot.top
  const length = vertical ? plot.width : plot.height
  const layout =
    scale === 'linear'
      ? linearLayout(labels.map(labelValue), start, length)
      : categoryLayout(labels.length, start, length, vertical ? banded : true)
  return vertical && rtl ? mirrorLayout(layout, start, length) : layout
}

export function clampRange(current: ChartRange | null, count: number): ChartRange | null {
  if (!current) return null
  const from = Math.max(0, Math.min(current[0], current[1]))
  const to = Math.min(count - 1, Math.max(current[0], current[1]))
  return from <= to ? [from, to] : null
}

export function plotBox(
  insets: { top: number; right: number; bottom: number; left: number },
  size: { width: number; height: number }
): ChartPlotBox {
  return {
    left: insets.left,
    top: insets.top,
    width: Math.max(0, size.width - insets.left - insets.right),
    height: Math.max(0, size.height - insets.top - insets.bottom)
  }
}

export function chartPoint(
  labels: ChartLabel[],
  series: NormalizedSeries[],
  index: number
): ChartPoint {
  return {
    index,
    label: labels[index] ?? String(index + 1),
    values: Object.fromEntries(series.map((entry) => [entry.id, entry.values[index] ?? null]))
  }
}
