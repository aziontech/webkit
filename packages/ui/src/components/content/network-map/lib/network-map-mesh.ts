/** One traffic link between two lit data centers, drawn as a bowed path a packet crosses. */
export interface NetworkMapMeshRay {
  /** Stable key for the list. */
  key: string
  /** SVG path of the link. */
  d: string
  /** Milliseconds one packet cycle takes. */
  duration: number
  /** Milliseconds the first packet waits. */
  delay: number
}

interface Point {
  x: number
  y: number
}

interface Range {
  min: number
  max: number
}

const MESH_SEED = 20260902
const MESH_PARTICIPANTS = 14
const MESH_DEGREE = { min: 2, max: 3 }
const MESH_MIN_CHORD = 60
const MESH_BOW = { min: 0.1, max: 0.18 }
const MESH_CYCLE = { min: 3400, max: 6200 }

const spread = (points: Point[], gap: (a: number, b: number) => number, next: () => number) => {
  const chosen = [Math.floor(next() * points.length)]
  while (chosen.length < Math.min(MESH_PARTICIPANTS, points.length)) {
    let best = -1
    let bestGap = -1
    points.forEach((_, index) => {
      if (chosen.includes(index)) return
      const nearest = Math.min(...chosen.map((other) => gap(index, other)))
      if (nearest > bestGap) {
        bestGap = nearest
        best = index
      }
    })
    if (best < 0) break
    chosen.push(best)
  }
  return chosen
}

const link = (chosen: number[], gap: (a: number, b: number) => number) => {
  const degree = new Map(chosen.map((index) => [index, 0]))
  const edges: [number, number][] = []
  const linked = (a: number, b: number) =>
    edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a))
  for (const node of chosen) {
    const candidates = chosen
      .filter((other) => other !== node && gap(node, other) >= MESH_MIN_CHORD)
      .sort((a, b) => gap(node, a) - gap(node, b))
    for (const other of candidates) {
      if ((degree.get(node) ?? 0) >= MESH_DEGREE.min) break
      if ((degree.get(other) ?? 0) >= MESH_DEGREE.max || linked(node, other)) continue
      edges.push([node, other])
      degree.set(node, (degree.get(node) ?? 0) + 1)
      degree.set(other, (degree.get(other) ?? 0) + 1)
    }
  }
  return edges
}

export function networkMapMesh(points: Point[]): NetworkMapMeshRay[] {
  if (points.length < 3) return []
  let seed = MESH_SEED
  const next = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648
  const between = (range: Range) => range.min + next() * (range.max - range.min)
  const gap = (a: number, b: number) =>
    Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y)

  return link(spread(points, gap, next), gap).map(([a, b], index) => {
    const from = points[a]
    const to = points[b]
    const length = gap(a, b)
    const bow = between(MESH_BOW) * (next() < 0.5 ? -1 : 1)
    const cx = (from.x + to.x) / 2 - ((to.y - from.y) / length) * length * bow
    const cy = (from.y + to.y) / 2 + ((to.x - from.x) / length) * length * bow
    const duration = Math.round(between(MESH_CYCLE))
    return {
      key: `ray-${index}`,
      d: `M${from.x} ${from.y}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x} ${to.y}`,
      duration,
      delay: Math.round(next() * duration)
    }
  })
}
