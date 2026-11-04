import {
  NETWORK_MAP_LAND,
  NETWORK_MAP_TIERS
} from '../../components/content/network-map/network-map-data'

/** A point on the globe as longitude and latitude, in radians. */
export type GlobePoint = readonly [longitude: number, latitude: number]

/** A PoP: where it sits on the globe, and its cell on the flat map. */
export interface GlobeNode {
  /** Longitude and latitude, in radians. */
  point: GlobePoint
  /** Horizontal map coordinate, in NetworkMap units. */
  x: number
  /** Vertical map coordinate, in NetworkMap units. */
  y: number
}

const PITCH = 10
const LON_ORIGIN = -157.11
const ROW_AT_EQUATOR = 57.08
const ROWS_PER_MILLER = -33.913
const RUN = /M(\d+) (\d+)h(\d+)/g

export const GLOBE_CELL_DEGREES = 2.1266

const longitudeOf = (column: number) => ((LON_ORIGIN + column * GLOBE_CELL_DEGREES) * Math.PI) / 180

const latitudeOf = (row: number) =>
  2.5 * (Math.atan(Math.exp((row - ROW_AT_EQUATOR) / ROWS_PER_MILLER / 1.25)) - Math.PI / 4)

const pointOf = (x: number, y: number): GlobePoint => [
  longitudeOf(x / PITCH),
  latitudeOf(y / PITCH)
]

export const GLOBE_LAND: readonly GlobePoint[] = Array.from(NETWORK_MAP_LAND.matchAll(RUN)).flatMap(
  ([, x, y, width]) =>
    Array.from({ length: Math.max(1, Math.floor(Number(width) / PITCH)) }, (_, step) =>
      pointOf(Number(x) + step * PITCH, Number(y))
    )
)

const nodesOf = (paths: readonly string[]): GlobeNode[] =>
  paths.flatMap((path) =>
    Array.from(path.matchAll(RUN)).map(([, x, y]) => ({
      point: pointOf(Number(x), Number(y)),
      x: Number(x),
      y: Number(y)
    }))
  )

export const GLOBE_NODE_TIERS: Record<keyof typeof NETWORK_MAP_TIERS, readonly GlobeNode[]> = {
  core: nodesOf(NETWORK_MAP_TIERS.core),
  satellite: nodesOf(NETWORK_MAP_TIERS.satellite),
  extra: nodesOf(NETWORK_MAP_TIERS.extra)
}
