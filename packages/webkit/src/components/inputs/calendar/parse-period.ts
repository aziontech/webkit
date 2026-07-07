import { endOfDay, startOfDay } from './format'
import type { CalendarRange } from './injection-key'

/**
 * Parses a relative or fixed period expression into a `{ start, end }` range, or
 * `null` when it cannot be understood. Pure native-`Date` math, no date library.
 *
 * Accepted forms (case-insensitive):
 *   - relative spans: `45m`, `12 hours`, `10d`, `2 weeks`, `3 months`, `1y` → [now − span, now]
 *   - keywords: `today`, `yesterday`, `last week`, `last month`, `last year`, `this month`
 *   - fixed single dates: `1/1`, `1/1/2026`, `Jan 1`, `Jan 1, 2026` → that whole day
 *   - fixed ranges: `1/1 - 1/2`, `Jan 1 - Jan 2` (separators `-`, `–`, `to`)
 */
export function parsePeriod(input: string, now: Date = new Date()): CalendarRange | null {
  const text = input.trim().toLowerCase()

  if (!text) {
    return null
  }

  const keyword = parseKeyword(text, now)
  if (keyword) {
    return keyword
  }

  const relative = parseRelative(text, now)
  if (relative) {
    return relative
  }

  const rangeParts = splitRange(text)
  if (rangeParts) {
    const start = parseFixedDate(rangeParts[0], now)
    const end = parseFixedDate(rangeParts[1], now)
    if (start && end) {
      return { start: startOfDay(start), end: endOfDay(end) }
    }
    return null
  }

  const single = parseFixedDate(text, now)
  if (single) {
    return { start: startOfDay(single), end: endOfDay(single) }
  }

  return null
}

const MS_PER_MINUTE = 60_000
const MS_PER_HOUR = 3_600_000
const MS_PER_DAY = 86_400_000

const UNIT_MS: Record<string, number> = {
  m: MS_PER_MINUTE,
  min: MS_PER_MINUTE,
  mins: MS_PER_MINUTE,
  minute: MS_PER_MINUTE,
  minutes: MS_PER_MINUTE,
  h: MS_PER_HOUR,
  hr: MS_PER_HOUR,
  hrs: MS_PER_HOUR,
  hour: MS_PER_HOUR,
  hours: MS_PER_HOUR,
  d: MS_PER_DAY,
  day: MS_PER_DAY,
  days: MS_PER_DAY,
  w: MS_PER_DAY * 7,
  wk: MS_PER_DAY * 7,
  week: MS_PER_DAY * 7,
  weeks: MS_PER_DAY * 7
}

const CALENDAR_UNITS: Record<string, 'month' | 'year'> = {
  mo: 'month',
  month: 'month',
  months: 'month',
  y: 'year',
  yr: 'year',
  year: 'year',
  years: 'year'
}

function parseRelative(text: string, now: Date): CalendarRange | null {
  const match = text.match(/^(\d+)\s*([a-z]+)$/)
  if (!match) {
    return null
  }

  const amount = Number(match[1])
  const unit = match[2]

  if (unit in UNIT_MS) {
    return { start: new Date(now.getTime() - amount * UNIT_MS[unit]), end: new Date(now.getTime()) }
  }

  if (unit in CALENDAR_UNITS) {
    const start = new Date(now)
    if (CALENDAR_UNITS[unit] === 'month') {
      start.setMonth(start.getMonth() - amount)
    } else {
      start.setFullYear(start.getFullYear() - amount)
    }
    return { start, end: new Date(now.getTime()) }
  }

  return null
}

function parseKeyword(text: string, now: Date): CalendarRange | null {
  switch (text) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) }
    case 'yesterday': {
      const y = new Date(now.getTime() - MS_PER_DAY)
      return { start: startOfDay(y), end: endOfDay(y) }
    }
    case 'last week':
      return { start: new Date(now.getTime() - 7 * MS_PER_DAY), end: new Date(now.getTime()) }
    case 'last month': {
      const start = new Date(now)
      start.setMonth(start.getMonth() - 1)
      return { start, end: new Date(now.getTime()) }
    }
    case 'last year': {
      const start = new Date(now)
      start.setFullYear(start.getFullYear() - 1)
      return { start, end: new Date(now.getTime()) }
    }
    case 'this month':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0))
      }
    default:
      return null
  }
}

function splitRange(text: string): [string, string] | null {
  const match = text.split(/\s*(?:-|–|to)\s+|\s+(?:-|–|to)\s*/)
  if (match.length === 2 && match[0] && match[1]) {
    return [match[0].trim(), match[1].trim()]
  }
  return null
}

const MONTHS: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11
}

/** Parses a single date token (`M/D`, `M/D/Y`, `Jan 1`, `Jan 1, 2026`) to a Date, or null. */
export function parseFixedDate(token: string, now: Date = new Date()): Date | null {
  const text = token.trim().toLowerCase()
  if (!text) {
    return null
  }

  // M/D or M/D/Y
  const slash = text.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/)
  if (slash) {
    const month = Number(slash[1]) - 1
    const day = Number(slash[2])
    const year = slash[3] ? normalizeYear(Number(slash[3])) : now.getFullYear()
    return validDate(year, month, day)
  }

  // "Jan 1" or "Jan 1, 2026" or "January 1 2026"
  const named = text.match(/^([a-z]+)\.?\s+(\d{1,2})(?:,?\s*(\d{2,4}))?$/)
  if (named && named[1] in MONTHS) {
    const month = MONTHS[named[1]]
    const day = Number(named[2])
    const year = named[3] ? normalizeYear(Number(named[3])) : now.getFullYear()
    return validDate(year, month, day)
  }

  return null
}

function normalizeYear(year: number): number {
  return year < 100 ? 2000 + year : year
}

function validDate(year: number, month: number, day: number): Date | null {
  if (month < 0 || month > 11 || day < 1 || day > 31) {
    return null
  }
  const date = new Date(year, month, day)
  if (date.getMonth() !== month || date.getDate() !== day) {
    return null
  }
  return date
}
