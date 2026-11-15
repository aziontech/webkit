import type { Severity } from '../../../utils/severity'

export type ChartLabel = string | number | Date

export type ChartSlot = 1 | 2 | 3 | 4 | 5 | 6

export type ChartStatus = Exclude<Severity, 'neutral'>

export type ChartSeverity =
  'severity-critical' | 'severity-high' | 'severity-medium' | 'severity-low' | 'severity-info'

export type ChartColor = ChartSlot | 'other' | ChartStatus | ChartSeverity

/** Tone of a threshold: neutral, the status that reaching it means, or a level on the findings scale. */
export type ChartThresholdSeverity = 'neutral' | ChartStatus | ChartSeverity

/** One threshold, shared by GaugeChart bands and Chart.Reference lines. */
export interface ChartThreshold {
  /** The value the threshold sits at; a GaugeChart band applies from here up to the next one. */
  value: number
  /** Tone of the threshold. */
  severity: ChartThresholdSeverity
  /** Name of the threshold, read after the value (for example `Critical`). */
  label?: string
}

export type ChartMarkType = 'line' | 'area' | 'bar' | 'scatter'

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
