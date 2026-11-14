/** A value Timestamp and Table.CellTime accept as a moment. */
export type TimestampValue = string | number | Date | null | undefined

/** Formats a relative time in whole units, like `useLocale().formatRelativeTime`. */
export type RelativeFormatter = (value: number | Date, unit?: Intl.RelativeTimeFormatUnit) => string

const MICROSECONDS_FROM = 1e14
const JUST_NOW_MS = 45_000
const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS

export function toDate(value: TimestampValue): Date | null {
  if (value === undefined || value === null || value === '') return null
  let input: string | number | Date = value
  if (typeof input === 'string' && /^-?\d+$/.test(input.trim())) input = Number(input.trim())
  if (typeof input === 'number' && Math.abs(input) >= MICROSECONDS_FROM) input = input / 1000
  const parsed = input instanceof Date ? input : new Date(input)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function relativeText(
  date: Date,
  now: number,
  justNow: string,
  format: RelativeFormatter
): string {
  const diff = date.getTime() - now
  if (Math.abs(diff) < JUST_NOW_MS) return justNow
  if (Math.abs(diff) < HOUR_MS) return format(Math.round(diff / MINUTE_MS), 'minute')
  return format(date)
}
