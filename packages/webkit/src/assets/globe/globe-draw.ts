import type { NetworkMapPosition } from '../../components/content/network-map/network-map.vue'
import { GLOBE_CELL_DEGREES, GLOBE_LAND, type GlobeNode, type GlobePoint } from './globe-data'

/** What a frame of the globe depends on besides the canvas. */
export interface GlobeView {
  /** Where the globe parks in the canvas. */
  position: NetworkMapPosition
  /** Size relative to the canvas. */
  scale: number
  /** Horizontal shift as a fraction of the globe width. */
  offsetX: number
  /** Vertical shift as a fraction of the globe height. */
  offsetY: number
  /** Degrees the north pole leans toward the viewer. */
  tilt: number
  /** Longitude, in degrees, facing the viewer before the turn. */
  longitude: number
  /** Opacity of the landmass dots. */
  opacity: number
  /** Radians turned since the first frame. */
  turn: number
}

type Projector = (lon: number, lat: number) => [number, number, number]

interface GlobeGeometry {
  centerX: number
  centerY: number
  radius: number
  unit: number
  project: Projector
}

const ANCHOR: Record<NetworkMapPosition, [number, number]> = {
  center: [0.5, 0.5],
  top: [0.5, 0],
  bottom: [0.5, 1],
  left: [0, 0.5],
  right: [1, 0.5],
  'top-left': [0, 0],
  'top-right': [1, 0],
  'bottom-left': [0, 1],
  'bottom-right': [1, 1]
}

const GRID_STEP = Math.PI / 12
const SAMPLE_STEP = Math.PI / 60
const CELL_ARC = (GLOBE_CELL_DEGREES * Math.PI) / 180 / 2

const geometry = (el: HTMLCanvasElement, view: GlobeView): GlobeGeometry => {
  const diameter = Math.min(el.width, el.height) * (view.scale > 0 ? view.scale : 1)
  const radius = diameter / 2 - 1
  const [anchorX, anchorY] = ANCHOR[view.position]
  const centerX = (el.width - diameter) * anchorX + diameter / 2 + view.offsetX * diameter
  const centerY = (el.height - diameter) * anchorY + diameter / 2 + view.offsetY * diameter
  const lean = (view.tilt * Math.PI) / 180
  const sinLean = Math.sin(lean)
  const cosLean = Math.cos(lean)
  const facing = (view.longitude * Math.PI) / 180 - view.turn

  const project: Projector = (lon, lat) => {
    const x = Math.cos(lat) * Math.sin(lon - facing)
    const y = Math.sin(lat)
    const z = Math.cos(lat) * Math.cos(lon - facing)
    return [
      centerX + radius * x,
      centerY - radius * (y * cosLean - z * sinLean),
      y * sinLean + z * cosLean
    ]
  }

  return { centerX, centerY, radius, unit: radius / 302, project }
}

const trace = (
  context: CanvasRenderingContext2D,
  project: Projector,
  points: Array<[number, number]>
) => {
  let pen = false
  for (const [lon, lat] of points) {
    const [x, y, depth] = project(lon, lat)
    if (depth < 0) {
      pen = false
      continue
    }
    if (pen) context.lineTo(x, y)
    else context.moveTo(x, y)
    pen = true
  }
}

const traceGraticule = (context: CanvasRenderingContext2D, project: Projector) => {
  for (let lon = 0; lon < Math.PI * 2; lon += GRID_STEP) {
    const meridian: Array<[number, number]> = []
    for (let lat = -Math.PI / 2; lat <= Math.PI / 2 + 1e-9; lat += SAMPLE_STEP)
      meridian.push([lon, lat])
    trace(context, project, meridian)
  }
  for (let lat = -Math.PI / 2 + GRID_STEP; lat < Math.PI / 2 - 1e-9; lat += GRID_STEP) {
    const parallel: Array<[number, number]> = []
    for (let lon = 0; lon <= Math.PI * 2 + 1e-9; lon += SAMPLE_STEP) parallel.push([lon, lat])
    trace(context, project, parallel)
  }
}

const traceCells = (
  context: CanvasRenderingContext2D,
  project: Projector,
  points: readonly GlobePoint[],
  cell: number
) => {
  context.beginPath()
  for (const [lon, lat] of points) {
    const [x, y, depth] = project(lon, lat)
    if (depth <= 0) continue
    context.rect(x - cell / 2, y - cell / 2, cell, cell)
  }
}

export const drawGlobe = (
  el: HTMLCanvasElement,
  view: GlobeView,
  nodes: readonly GlobeNode[]
): void => {
  const context = el.getContext('2d')
  if (!context || !el.width || !el.height) return

  const style = getComputedStyle(el)
  const { centerX, centerY, radius, unit, project } = geometry(el, view)

  context.clearRect(0, 0, el.width, el.height)
  context.lineWidth = Math.max(0.74 * unit, 0.5)
  context.strokeStyle = style.getPropertyValue('--globe-grid')

  context.beginPath()
  context.arc(centerX, centerY, radius, 0, Math.PI * 2)
  context.fillStyle = style.getPropertyValue('--globe-ground')
  context.fill()
  context.stroke()

  context.beginPath()
  traceGraticule(context, project)
  context.stroke()

  const cell = Math.max(radius * CELL_ARC, 1)
  traceCells(context, project, GLOBE_LAND, cell)
  context.globalAlpha = Math.min(Math.max(view.opacity, 0), 1)
  context.fillStyle = style.color
  context.fill()
  context.globalAlpha = 1

  traceCells(
    context,
    project,
    nodes.map(({ point }) => point),
    cell
  )
  context.fillStyle = style.getPropertyValue('--globe-node')
  context.fill()
}
