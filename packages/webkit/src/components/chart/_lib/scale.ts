export type LinearScale = (value: number) => number

export function linearScale(
  [d0, d1]: readonly [number, number],
  [r0, r1]: readonly [number, number]
): LinearScale {
  const span = d1 - d0 || 1
  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0)
}

function niceStep(rawStep: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const residual = rawStep / magnitude
  if (residual <= 1) return magnitude
  if (residual <= 2) return 2 * magnitude
  if (residual <= 2.5) return 2.5 * magnitude
  if (residual <= 5) return 5 * magnitude
  return 10 * magnitude
}

function decimalsOf(step: number): number {
  const text = String(step)
  const dot = text.indexOf('.')
  return dot === -1 ? 0 : text.length - dot - 1
}

export interface NiceTicks {
  min: number
  max: number
  ticks: number[]
}

export function niceTicks(min: number, max: number, count = 5): NiceTicks {
  const low = Number.isFinite(min) ? min : 0
  let high = Number.isFinite(max) ? max : low + 1
  if (high <= low) high = low + 1
  const step = niceStep((high - low) / Math.max(1, count))
  const decimals = decimalsOf(step)
  const niceMin = Math.floor(low / step) * step
  const niceMax = Math.ceil(high / step) * step
  const ticks: number[] = []
  for (let value = niceMin; value <= niceMax + step / 2; value += step) {
    ticks.push(Number(value.toFixed(decimals)))
  }
  return { min: niceMin, max: Number(niceMax.toFixed(decimals)), ticks }
}

export interface CategoryLayout {
  count: number
  banded: boolean
  step: number
  bandwidth: number
  position: (index: number) => number
  indexAt: (offset: number) => number
}

export function categoryLayout(
  count: number,
  start: number,
  length: number,
  banded: boolean
): CategoryLayout {
  const safeCount = Math.max(0, count)
  const clamp = (index: number) => Math.min(Math.max(index, 0), Math.max(safeCount - 1, 0))

  if (banded || safeCount <= 1) {
    const step = safeCount ? length / safeCount : length
    return {
      count: safeCount,
      banded: true,
      step,
      bandwidth: step,
      position: (index) => start + step * (index + 0.5),
      indexAt: (offset) => clamp(Math.floor((offset - start) / (step || 1)))
    }
  }

  const step = length / (safeCount - 1)
  return {
    count: safeCount,
    banded: false,
    step,
    bandwidth: step,
    position: (index) => start + step * index,
    indexAt: (offset) => clamp(Math.round((offset - start) / (step || 1)))
  }
}

export function maxOf(values: Iterable<number>, floor = 0): number {
  let max = floor
  for (const value of values) if (value > max) max = value
  return max
}

export function labelValue(label: unknown): number | null {
  if (label instanceof Date) return label.getTime()
  return typeof label === 'number' && Number.isFinite(label) ? label : null
}

export function linearLayout(
  values: ReadonlyArray<number | null>,
  start: number,
  length: number
): CategoryLayout {
  const finite = values.filter((value): value is number => value !== null)
  const low = finite.length ? Math.min(...finite) : 0
  const high = finite.length ? Math.max(...finite) : 1
  const scale = linearScale([low, high === low ? low + 1 : high], [start, start + length])
  const positions = values.map((value, index) =>
    value === null ? start + (length * index) / Math.max(1, values.length - 1) : scale(value)
  )
  const step = values.length > 1 ? length / (values.length - 1) : length
  return {
    count: values.length,
    banded: false,
    step,
    bandwidth: step,
    position: (index) => positions[index] ?? start,
    indexAt: (offset) => {
      let best = 0
      let distance = Number.POSITIVE_INFINITY
      positions.forEach((position, index) => {
        const gap = Math.abs(position - offset)
        if (gap < distance) {
          distance = gap
          best = index
        }
      })
      return best
    }
  }
}

export function mirrorLayout(layout: CategoryLayout, start: number, length: number): CategoryLayout {
  const flip = (offset: number) => start + length - (offset - start)
  return {
    ...layout,
    position: (index) => flip(layout.position(index)),
    indexAt: (offset) => layout.indexAt(flip(offset))
  }
}
