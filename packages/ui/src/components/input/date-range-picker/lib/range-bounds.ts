import { startOfDay, withTime } from '../../date-picker/format'
import type { DatePickerRange } from '../../date-picker/injection-key'
import {
  type DateRangeDuration,
  type DateRangeUnit,
  DEFAULT_HISTORY_YEARS,
  fromWallClock,
  resolveDateRange,
  type ResolveDateRangeOptions,
  shiftByUnit,
  shiftWallClock,
  toWallClock
} from '../date-range'

export const minBound = (min: Date | undefined, now: Date, zone: string): Date => {
  if (min) return min
  const today = toWallClock(now, zone)
  return fromWallClock(
    new Date(today.getFullYear() - DEFAULT_HISTORY_YEARS, today.getMonth(), today.getDate()),
    zone
  )
}

export const maxBound = (max: Date | undefined, now: Date, zone: string): Date => {
  if (max) return max
  const today = toWallClock(now, zone)
  return fromWallClock(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999),
    zone
  )
}

export const relativeFits = (
  relative: { amount: number; unit: DateRangeUnit; snap?: boolean },
  now: Date,
  floor: Date,
  limit: DateRangeDuration | undefined,
  options: ResolveDateRangeOptions
): boolean => {
  const { amount, unit, snap = false } = relative
  const range = resolveDateRange({ type: 'relative', amount, unit, snap }, now, options)
  if (!range || range.start.getTime() < floor.getTime()) return false
  return !limit || range.start.getTime() >= shiftByUnit(now, -limit.amount, limit.unit).getTime()
}

export const exceedsDuration = (
  limit: DateRangeDuration | undefined,
  startWall: Date,
  endWall: Date
): boolean => Boolean(limit && endWall > shiftWallClock(startWall, limit.amount, limit.unit))

export const earliestWall = (
  floor: Date,
  limit: DateRangeDuration | undefined,
  anchor: Date | null
): Date => {
  if (!limit || !anchor) return floor
  const reach = shiftWallClock(anchor, -limit.amount, limit.unit)
  return reach > floor ? reach : floor
}

export const latestWall = (
  ceiling: Date,
  limit: DateRangeDuration | undefined,
  start: Date | null
): Date => {
  if (!limit || !start) return ceiling
  const reach = new Date(shiftWallClock(startOfDay(start), limit.amount, limit.unit).getTime() - 1)
  return reach < ceiling ? reach : ceiling
}

export const pickDay = (range: DatePickerRange, date: Date): DatePickerRange => {
  if (!range.start || range.end) return { start: withTime(date, null, false), end: null }
  if (startOfDay(date) < startOfDay(range.start)) {
    return { start: withTime(date, null, false), end: withTime(range.start, range.start, true) }
  }
  return { start: range.start, end: withTime(date, null, true) }
}
