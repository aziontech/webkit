import type { ChartCurve, ChartPosition } from './types'

interface Segment {
  c1: ChartPosition
  c2: ChartPosition
  end: ChartPosition
}

const round = (value: number) => Math.round(value * 100) / 100

const point = ([x, y]: ChartPosition) => `${round(x)},${round(y)}`

function runsOf(points: ReadonlyArray<ChartPosition | null>): ChartPosition[][] {
  const runs: ChartPosition[][] = []
  let current: ChartPosition[] = []
  for (const entry of points) {
    if (entry) {
      current.push(entry)
    } else if (current.length) {
      runs.push(current)
      current = []
    }
  }
  if (current.length) runs.push(current)
  return runs
}

function tangents(run: readonly ChartPosition[]): number[] {
  const count = run.length
  const slopes: number[] = []
  for (let index = 0; index < count - 1; index += 1) {
    const [x0, y0] = run[index] as ChartPosition
    const [x1, y1] = run[index + 1] as ChartPosition
    slopes.push((y1 - y0) / (x1 - x0 || 1))
  }
  const result = run.map((_, index) => {
    if (index === 0) return slopes[0] ?? 0
    if (index === count - 1) return slopes[count - 2] ?? 0
    const before = slopes[index - 1] ?? 0
    const after = slopes[index] ?? 0
    return before * after <= 0 ? 0 : (before + after) / 2
  })
  for (let index = 0; index < slopes.length; index += 1) {
    const slope = slopes[index] ?? 0
    if (slope === 0) {
      result[index] = 0
      result[index + 1] = 0
      continue
    }
    const a = (result[index] ?? 0) / slope
    const b = (result[index + 1] ?? 0) / slope
    const sum = a * a + b * b
    if (sum > 9) {
      const tau = 3 / Math.sqrt(sum)
      result[index] = tau * a * slope
      result[index + 1] = tau * b * slope
    }
  }
  return result
}

function segmentsOf(run: readonly ChartPosition[], curve: ChartCurve): Segment[] {
  const slopes = curve === 'monotone' ? tangents(run) : []
  const segments: Segment[] = []
  for (let index = 0; index < run.length - 1; index += 1) {
    const start = run[index] as ChartPosition
    const end = run[index + 1] as ChartPosition
    if (curve === 'linear') {
      segments.push({ c1: start, c2: end, end })
      continue
    }
    const dx = (end[0] - start[0]) / 3
    const t0 = slopes[index] ?? 0
    const t1 = slopes[index + 1] ?? 0
    segments.push({
      c1: [start[0] + dx, start[1] + t0 * dx],
      c2: [end[0] - dx, end[1] - t1 * dx],
      end
    })
  }
  return segments
}

function drawSegments(segments: readonly Segment[], curve: ChartCurve): string {
  return segments
    .map((segment) =>
      curve === 'linear'
        ? `L${point(segment.end)}`
        : `C${point(segment.c1)} ${point(segment.c2)} ${point(segment.end)}`
    )
    .join('')
}

export function linePath(
  points: ReadonlyArray<ChartPosition | null>,
  curve: ChartCurve = 'monotone'
): string {
  return runsOf(points)
    .map((run) => {
      const first = run[0] as ChartPosition
      if (run.length === 1) return `M${point(first)}h0`
      return `M${point(first)}${drawSegments(segmentsOf(run, curve), curve)}`
    })
    .join('')
}

export function areaPath(
  upper: ReadonlyArray<ChartPosition | null>,
  lower: ReadonlyArray<ChartPosition | null>,
  curve: ChartCurve = 'monotone'
): string {
  const paired = upper.map((top, index) => {
    const bottom = lower[index]
    return top && bottom ? index : null
  })
  const runs: number[][] = []
  let current: number[] = []
  for (const index of paired) {
    if (index === null) {
      if (current.length) runs.push(current)
      current = []
    } else {
      current.push(index)
    }
  }
  if (current.length) runs.push(current)

  return runs
    .map((indexes) => {
      const top = indexes.map((index) => upper[index] as ChartPosition)
      const bottom = indexes.map((index) => lower[index] as ChartPosition).reverse()
      const first = top[0] as ChartPosition
      const last = bottom[0] as ChartPosition
      const topPath = drawSegments(segmentsOf(top, curve), curve)
      const bottomPath = drawSegments(segmentsOf(bottom, curve), curve)
      return `M${point(first)}${topPath}L${point(last)}${bottomPath}Z`
    })
    .join('')
}

export type BarEnd = 'top' | 'right'

export function barPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  end: BarEnd = 'top'
): string {
  if (width <= 0 || height <= 0) return ''
  const r = Math.max(
    0,
    Math.min(radius, end === 'top' ? width / 2 : height / 2, end === 'top' ? height : width)
  )
  const x0 = round(x)
  const y0 = round(y)
  const x1 = round(x + width)
  const y1 = round(y + height)
  if (end === 'top') {
    return `M${x0},${y1}L${x0},${round(y + r)}Q${x0},${y0} ${round(x + r)},${y0}L${round(x1 - r)},${y0}Q${x1},${y0} ${x1},${round(y + r)}L${x1},${y1}Z`
  }
  return `M${x0},${y0}L${round(x1 - r)},${y0}Q${x1},${y0} ${x1},${round(y + r)}L${x1},${round(y1 - r)}Q${x1},${y1} ${round(x1 - r)},${y1}L${x0},${y1}Z`
}
