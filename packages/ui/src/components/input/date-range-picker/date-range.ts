export type DateRangeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

export type DateRangeValue =
  | { type: 'relative'; amount: number; unit: DateRangeUnit; key?: string; snap?: boolean }
  | { type: 'absolute'; start: string; end: string }
  | { type: 'since'; start: string }

export type RelativeOption = {
  key: string
  amount: number
  unit: DateRangeUnit
  label?: string
  snap?: boolean
}

export type DateRangeRefreshUnit = 'second' | 'minute' | 'hour'

export type DateRangeDuration = { amount: number; unit: DateRangeUnit }

export const DEFAULT_HISTORY_YEARS = 5

export type ResolveDateRangeOptions = { timeZone?: string; weekStart?: number }

export type ResolvedRange = { start: Date; end: Date }

export const DATE_RANGE_UNITS: DateRangeUnit[] = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year'
]

export const REFRESH_UNITS: DateRangeRefreshUnit[] = ['second', 'minute', 'hour']

export const REFRESH_INTERVALS: number[] = [10, 30, 60, 300, 900, 1800, 3600]

export const DEFAULT_RELATIVE_OPTIONS: RelativeOption[] = [
  { key: 'today', amount: 1, unit: 'day', snap: true },
  { key: 'this-week', amount: 1, unit: 'week', snap: true },
  { key: 'last-1-minute', amount: 1, unit: 'minute' },
  { key: 'last-5-minutes', amount: 5, unit: 'minute' },
  { key: 'last-15-minutes', amount: 15, unit: 'minute' },
  { key: 'last-30-minutes', amount: 30, unit: 'minute' },
  { key: 'last-1-hour', amount: 1, unit: 'hour' },
  { key: 'last-24-hours', amount: 24, unit: 'hour' },
  { key: 'last-7-days', amount: 7, unit: 'day' },
  { key: 'last-30-days', amount: 30, unit: 'day' },
  { key: 'last-90-days', amount: 90, unit: 'day' },
  { key: 'last-1-year', amount: 1, unit: 'year' }
]

const UNIT_MS: Record<'second' | 'minute' | 'hour' | 'day' | 'week', number> = {
  second: 1_000,
  minute: 60_000,
  hour: 3_600_000,
  day: 86_400_000,
  week: 604_800_000
}

const zoneOption = (zone: string): string | undefined => zone || undefined

const wallParts = (instant: number, zone: string): number[] => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zoneOption(zone),
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).formatToParts(new Date(instant))
  const read = (type: string): number =>
    Number(parts.find((part) => part.type === type)?.value ?? 0)
  return [
    read('year'),
    read('month') - 1,
    read('day'),
    read('hour') % 24,
    read('minute'),
    read('second')
  ]
}

const zoneOffsetMs = (instant: number, zone: string): number => {
  const [year, month, day, hour, minute, second] = wallParts(instant, zone)
  const asUtc = Date.UTC(year, month, day, hour, minute, second)
  return asUtc - (instant - (((instant % 1000) + 1000) % 1000))
}

export const toWallClock = (instant: Date, zone: string): Date => {
  const [year, month, day, hour, minute, second] = wallParts(instant.getTime(), zone)
  return new Date(year, month, day, hour, minute, second)
}

export const fromWallClock = (wall: Date, zone: string): Date => {
  const guess = Date.UTC(
    wall.getFullYear(),
    wall.getMonth(),
    wall.getDate(),
    wall.getHours(),
    wall.getMinutes(),
    wall.getSeconds()
  )
  const first = guess - zoneOffsetMs(guess, zone)
  const second = guess - zoneOffsetMs(first, zone)
  return new Date(second)
}

export const shiftByUnit = (date: Date, amount: number, unit: DateRangeUnit): Date => {
  if (unit === 'month' || unit === 'year') {
    const next = new Date(date.getTime())
    next.setUTCMonth(next.getUTCMonth() + (unit === 'year' ? amount * 12 : amount))
    return next
  }
  return new Date(date.getTime() + amount * UNIT_MS[unit])
}

export const shiftWallClock = (wall: Date, amount: number, unit: DateRangeUnit): Date => {
  const next = new Date(wall.getTime())
  if (unit === 'year') next.setFullYear(next.getFullYear() + amount)
  else if (unit === 'month') next.setMonth(next.getMonth() + amount)
  else if (unit === 'week') next.setDate(next.getDate() + amount * 7)
  else if (unit === 'day') next.setDate(next.getDate() + amount)
  else return new Date(wall.getTime() + amount * UNIT_MS[unit])
  return next
}

const startOfUnit = (instant: Date, unit: DateRangeUnit, zone = 'UTC', weekStart = 0): Date => {
  const wall = toWallClock(instant, zone)
  const parts = [
    wall.getFullYear(),
    wall.getMonth(),
    wall.getDate(),
    wall.getHours(),
    wall.getMinutes(),
    wall.getSeconds()
  ]
  const depth = { year: 1, month: 2, week: 3, day: 3, hour: 4, minute: 5, second: 6 }[unit]
  const kept = parts.map((part, index) => (index < depth ? part : index === 2 ? 1 : 0))
  const start = new Date(kept[0], kept[1], kept[2], kept[3], kept[4], kept[5])
  if (unit === 'week') start.setDate(start.getDate() - ((start.getDay() - weekStart + 7) % 7))
  return fromWallClock(start, zone)
}

export const resolveDateRange = (
  value: DateRangeValue | null | undefined,
  now: Date = new Date(),
  options: ResolveDateRangeOptions = {}
): ResolvedRange | null => {
  if (!value) return null
  if (value.type === 'relative') {
    if (value.snap) {
      const current = startOfUnit(
        now,
        value.unit,
        options.timeZone || 'UTC',
        options.weekStart ?? 0
      )
      return {
        start: shiftByUnit(current, 1 - value.amount, value.unit),
        end: new Date(now.getTime())
      }
    }
    return { start: shiftByUnit(now, -value.amount, value.unit), end: new Date(now.getTime()) }
  }
  if (value.type === 'since') {
    const since = new Date(value.start)
    return Number.isNaN(since.getTime()) ? null : { start: since, end: new Date(now.getTime()) }
  }
  const start = new Date(value.start)
  const end = new Date(value.end)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null
  return { start, end }
}

export const stepDateRange = (
  value: DateRangeValue | null | undefined,
  direction: -1 | 1,
  now: Date = new Date(),
  options: ResolveDateRangeOptions = {}
): DateRangeValue | null => {
  const range = resolveDateRange(value, now, options)
  if (!range) return null
  const span = range.end.getTime() - range.start.getTime()
  return {
    type: 'absolute',
    start: new Date(range.start.getTime() + direction * span).toISOString(),
    end: new Date(range.end.getTime() + direction * span).toISOString()
  }
}

export const zoneOffsetLabel = (zone: string, instant: Date): string => {
  const minutes = Math.round(zoneOffsetMs(instant.getTime(), zone) / 60_000)
  const sign = minutes < 0 ? '−' : '+'
  const absolute = Math.abs(minutes)
  const hours = String(Math.floor(absolute / 60)).padStart(2, '0')
  const rest = String(absolute % 60).padStart(2, '0')
  return `UTC${sign}${hours}:${rest}`
}

export const sameRelative = (
  value: DateRangeValue | null | undefined,
  option: RelativeOption
): boolean =>
  value?.type === 'relative' &&
  (value.key
    ? value.key === option.key
    : value.amount === option.amount &&
      value.unit === option.unit &&
      Boolean(value.snap) === Boolean(option.snap))

export const endsNow = (value: DateRangeValue | null | undefined): boolean =>
  value?.type === 'relative' || value?.type === 'since'
