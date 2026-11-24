/** A whole number of one time unit, the piece a compact duration is built from. */
export interface CountdownDurationPart {
  value: number
  unit: 'day' | 'hour' | 'minute'
}

const MINUTE_MS = 60_000
export const DAY_MINUTES = 1_440

export function roundedMinutes(ms: number): number {
  return Math.max(1, Math.ceil(Math.abs(ms) / MINUTE_MS))
}

export function durationParts(minutes: number): CountdownDurationPart[] {
  const parts: CountdownDurationPart[] = [
    { value: Math.floor(minutes / DAY_MINUTES), unit: 'day' },
    { value: Math.floor((minutes % DAY_MINUTES) / 60), unit: 'hour' },
    { value: minutes % 60, unit: 'minute' }
  ]
  const first = parts.findIndex((part) => part.value > 0)
  return parts.slice(first, first + 2).filter((part) => part.value > 0)
}
