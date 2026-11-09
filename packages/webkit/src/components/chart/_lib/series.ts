import type { ChartColor, ChartSeries, ChartSlot, NormalizedSeries } from './types'

export const OTHER_SERIES_ID = '__other'

const MAX_SLOTS = 6

export function colorToken(color: ChartColor): string {
  if (color === 'other') return 'var(--chart-series-other)'
  if (typeof color === 'number') return `var(--chart-series-${color})`
  return `var(--chart-status-${color})`
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function seriesTotal(values: ReadonlyArray<number | null>): number {
  return values.reduce<number>((sum, value) => sum + (isFiniteNumber(value) ? value : 0), 0)
}

function cleanValues(values: ReadonlyArray<number | null>): Array<number | null> {
  return values.map((value) => (isFiniteNumber(value) ? value : null))
}

function foldValues(series: readonly ChartSeries[]): Array<number | null> {
  const length = Math.max(0, ...series.map((entry) => entry.values.length))
  return Array.from({ length }, (_, index) => {
    let sum: number | null = null
    for (const entry of series) {
      const value = entry.values[index]
      if (isFiniteNumber(value)) sum = (sum ?? 0) + value
    }
    return sum
  })
}

export interface NormalizeOptions {
  cap?: number
  otherLabel?: string
}

export function normalizeSeries(
  series: readonly ChartSeries[],
  { cap = MAX_SLOTS, otherLabel = 'Other' }: NormalizeOptions = {}
): NormalizedSeries[] {
  const keep = Math.max(1, Math.min(Math.floor(cap), MAX_SLOTS))
  const kept = series.length > keep ? series.slice(0, keep) : series
  const folded = series.length > keep ? series.slice(keep) : []

  const normalized = kept.map<NormalizedSeries>((entry, index) => {
    const slot: ChartColor = entry.color ?? ((index + 1) as ChartSlot)
    const values = cleanValues(entry.values)
    return {
      id: entry.id,
      name: entry.name,
      values,
      slot,
      color: colorToken(slot),
      total: seriesTotal(values),
      source: entry
    }
  })

  if (folded.length) {
    const values = foldValues(folded)
    const source: ChartSeries = { id: OTHER_SERIES_ID, name: otherLabel, values, color: 'other' }
    normalized.push({
      id: OTHER_SERIES_ID,
      name: otherLabel,
      values,
      slot: 'other',
      color: colorToken('other'),
      total: seriesTotal(values),
      source
    })
  }

  return normalized
}

export function hasAnyValue(series: readonly NormalizedSeries[]): boolean {
  return series.some((entry) => entry.values.some((value) => isFiniteNumber(value)))
}
