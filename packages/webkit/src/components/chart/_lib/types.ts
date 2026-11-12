export type ChartLabel = string | number | Date

export type ChartSlot = 1 | 2 | 3 | 4 | 5 | 6

export type ChartStatus = 'success' | 'warning' | 'danger' | 'info'

export type ChartSeverity =
  'severity-critical' | 'severity-high' | 'severity-medium' | 'severity-low' | 'severity-info'

export type ChartColor = ChartSlot | 'other' | ChartStatus | ChartSeverity

export type ChartMarkKind = 'line' | 'area' | 'bar' | 'scatter'

export type ChartLabelScale = 'category' | 'linear'

export type ChartRange = readonly [number, number]

export type ChartCurve = 'linear' | 'monotone'

export interface ChartSeries {
  id: string
  name: string
  values: ReadonlyArray<number | null>
  color?: ChartColor
}

export interface ChartPoint {
  index: number
  label: ChartLabel
  values: Record<string, number | null>
}

export interface NormalizedSeries {
  id: string
  name: string
  values: Array<number | null>
  slot: ChartColor
  color: string
  total: number
  source: ChartSeries
}

export type ChartPosition = readonly [number, number]
