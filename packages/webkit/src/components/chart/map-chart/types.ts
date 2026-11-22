import type { ChartColor } from '../lib'

export type MapChartView =
  | 'world'
  | 'americas'
  | 'north-america'
  | 'south-america'
  | 'europe'
  | 'africa'
  | 'asia'
  | 'oceania'

export interface MapChartRegion {
  /** ISO 3166-1 alpha-2 country code, such as `BR`. */
  id: string
  /** Reading for the country; null leaves it unshaded. */
  value: number | null
  /** Display name; empty uses the locale's country name. */
  name?: string
}

export interface MapChartPoint {
  /** Stable id of the location. */
  id: string
  /** Display name, such as a city or a data center. */
  name: string
  /** Latitude in degrees. */
  lat: number
  /** Longitude in degrees. */
  lon: number
  /** Reading for the location; the bubble area follows it. */
  value: number
  /** Series slot, status or severity color of the bubble. */
  color?: ChartColor
}
