import { isFiniteNumber } from './series'

export interface StackLayer {
  lower: number[]
  upper: number[]
}

export function stackValues(
  layers: ReadonlyArray<ReadonlyArray<number | null>>,
  count: number
): StackLayer[] {
  const running = Array.from({ length: count }, () => 0)
  return layers.map((values) => {
    const lower = running.slice()
    for (let index = 0; index < count; index += 1) {
      const value = values[index]
      running[index] = (running[index] ?? 0) + (isFiniteNumber(value) ? value : 0)
    }
    return { lower, upper: running.slice() }
  })
}

export function stackedMax(
  layers: ReadonlyArray<ReadonlyArray<number | null>>,
  count: number
): number {
  const stacked = stackValues(layers, count)
  const top = stacked[stacked.length - 1]
  return top ? Math.max(0, ...top.upper) : 0
}
