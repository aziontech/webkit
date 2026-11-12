import type { FigureRange } from './types'

export const DEFAULT_INTENSITY = 0.5

export function intensity(value: unknown): number {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value
  if (typeof n !== 'number' || !Number.isFinite(n)) return DEFAULT_INTENSITY
  return Math.min(1, Math.max(0, n))
}

export function parameter(range: FigureRange, value: unknown): number {
  const [lo, mid, hi] = range
  const i = intensity(value)
  const v = i <= 0.5 ? lo + (i / 0.5) * (mid - lo) : mid + ((i - 0.5) / 0.5) * (hi - mid)
  return Math.round(v * 1000) / 1000
}
