export type ChartLabel = string | number | Date

export type ChartSlot = 1 | 2 | 3 | 4 | 5 | 6

export type ChartStatus = 'success' | 'warning' | 'danger' | 'info'

export type ChartColor = ChartSlot | 'other' | ChartStatus

export type ChartMarkKind = 'line' | 'area' | 'bar'

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
