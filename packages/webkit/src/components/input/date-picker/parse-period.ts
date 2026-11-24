import { intlLocale } from '../../../composables/use-translate'
import { endOfDay, startOfDay } from './format'
import type { DatePickerRange } from './injection-key'
import {
  bare,
  type DatePart,
  normalizeText,
  type SpanUnit,
  type Vocabulary,
  vocabularyFor
} from './lib/period-vocabulary'

export interface ParseOptions {
  locale?: string
  separators?: string[]
}

const MS_PER_MINUTE = 60_000
const MS_PER_HOUR = 3_600_000
const MS_PER_DAY = 86_400_000

const UNIT_MS: Partial<Record<SpanUnit, number>> = {
  minute: MS_PER_MINUTE,
  hour: MS_PER_HOUR,
  day: MS_PER_DAY,
  week: MS_PER_DAY * 7
}

export function parsePeriod(
  input: string,
  now: Date = new Date(),
  options: ParseOptions = {}
): DatePickerRange | null {
  const text = normalizeText(input)
  if (!text) return null

  const vocabulary = vocabularyFor(options.locale ?? 'en')

  const keyword = parseKeyword(text, now, vocabulary)
  if (keyword) return keyword

  const relative = parseRelative(text, now, vocabulary)
  if (relative) return relative

  const rangeParts = splitRange(text, options.separators ?? [])
  if (rangeParts) {
    const start = fixedDate(rangeParts[0], now, vocabulary)
    const end = fixedDate(rangeParts[1], now, vocabulary)
    return start && end ? { start: startOfDay(start), end: endOfDay(end) } : null
  }

  const single = fixedDate(text, now, vocabulary)
  return single ? { start: startOfDay(single), end: endOfDay(single) } : null
}

function parseRelative(text: string, now: Date, vocabulary: Vocabulary): DatePickerRange | null {
  const match = text.match(/^(\d+)\s*(\p{L}[\p{L}.\s]*)$/u)
  if (!match) return null

  const amount = Number(match[1])
  const unit = vocabulary.units.get(bare(match[2] ?? ''))
  if (!unit) return null

  const span = UNIT_MS[unit]
  if (span) {
    return { start: new Date(now.getTime() - amount * span), end: new Date(now.getTime()) }
  }

  const start = new Date(now)
  if (unit === 'month') start.setMonth(start.getMonth() - amount)
  else start.setFullYear(start.getFullYear() - amount)
  return { start, end: new Date(now.getTime()) }
}

function parseKeyword(text: string, now: Date, vocabulary: Vocabulary): DatePickerRange | null {
  switch (vocabulary.keywords.get(bare(text))) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) }
    case 'yesterday': {
      const day = new Date(now.getTime() - MS_PER_DAY)
      return { start: startOfDay(day), end: endOfDay(day) }
    }
    case 'lastWeek':
      return { start: new Date(now.getTime() - 7 * MS_PER_DAY), end: new Date(now.getTime()) }
    case 'lastMonth': {
      const start = new Date(now)
      start.setMonth(start.getMonth() - 1)
      return { start, end: new Date(now.getTime()) }
    }
    case 'lastYear': {
      const start = new Date(now)
      start.setFullYear(start.getFullYear() - 1)
      return { start, end: new Date(now.getTime()) }
    }
    case 'thisMonth':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0))
      }
    default:
      return null
  }
}

const escapeWord = (word: string): string => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function splitRange(text: string, separators: string[]): [string, string] | null {
  const words = ['to', ...separators.map(bare)].filter(Boolean).map(escapeWord)
  const pattern = new RegExp(`\\s*[–—]\\s*|\\s+-\\s*|\\s*-\\s+|\\s+(?:${words.join('|')})\\s+`)
  const parts = text.split(pattern)
  if (parts.length === 2 && parts[0] && parts[1]) {
    return [parts[0].trim(), parts[1].trim()]
  }
  return null
}

export function parseFixedDate(
  token: string,
  now: Date = new Date(),
  options: ParseOptions = {}
): Date | null {
  const text = normalizeText(token)
  return text ? fixedDate(text, now, vocabularyFor(options.locale ?? 'en')) : null
}

function numericDate(text: string, now: Date, vocabulary: Vocabulary): Date | null {
  const match = text.match(/^(\d{1,4})[./-](\d{1,2})(?:[./-](\d{1,4}))?\.?$/)
  if (!match) return null
  const [first, second, third] = [match[1], match[2], match[3]] as [
    string,
    string,
    string | undefined
  ]
  if (first.length === 4) {
    return third ? validDate(Number(first), Number(second) - 1, Number(third)) : null
  }
  const order = third ? vocabulary.order : vocabulary.order.filter((part) => part !== 'year')
  const values: Partial<Record<DatePart, number>> = {}
  ;[first, second, third].forEach((value, index) => {
    const part = order[index]
    if (part && value !== undefined) values[part] = Number(value)
  })
  if (values.day === undefined || values.month === undefined) return null
  const year = values.year === undefined ? now.getFullYear() : normalizeYear(values.year)
  return validDate(year, values.month - 1, values.day)
}

function wordDate(text: string, now: Date, vocabulary: Vocabulary): Date | null {
  const tokens = text.match(/\p{L}+\.?|\d+/gu) ?? []
  let month: number | undefined
  const numbers: string[] = []
  for (const piece of tokens) {
    if (/^\d+$/.test(piece)) {
      numbers.push(piece)
      continue
    }
    const found = vocabulary.months.get(bare(piece))
    if (found !== undefined) {
      if (month !== undefined) return null
      month = found
    } else if (bare(piece).length > 3) {
      return null
    }
  }
  if (month === undefined || numbers.length < 1 || numbers.length > 2) return null

  const dayIndex = numbers.findIndex((value) => value.length <= 2)
  if (dayIndex < 0) return null
  const day = Number(numbers[dayIndex])
  const yearText = numbers.find((_, index) => index !== dayIndex)
  const year = yearText ? normalizeYear(Number(yearText)) : now.getFullYear()
  return validDate(year, month, day)
}

function fixedDate(text: string, now: Date, vocabulary: Vocabulary): Date | null {
  return numericDate(text, now, vocabulary) ?? wordDate(text, now, vocabulary)
}

function normalizeYear(year: number): number {
  return year < 100 ? 2000 + year : year
}

function validDate(year: number, month: number, day: number): Date | null {
  if (month < 0 || month > 11 || day < 1 || day > 31) return null
  const date = new Date(year, month, day)
  if (date.getMonth() !== month || date.getDate() !== day) return null
  return date
}

const unitLabel = (
  locale: string,
  amount: number,
  unit: SpanUnit,
  unitDisplay: 'long' | 'narrow'
): string =>
  new Intl.NumberFormat(intlLocale(locale), { style: 'unit', unit, unitDisplay }).format(amount)

const keywordLabel = (locale: string, amount: number, unit: Intl.RelativeTimeFormatUnit): string =>
  new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: 'auto' }).format(amount, unit)

export function relativeHints(locale = 'en'): string[] {
  return [
    unitLabel(locale, 45, 'minute', 'narrow'),
    unitLabel(locale, 12, 'hour', 'long'),
    unitLabel(locale, 10, 'day', 'narrow'),
    unitLabel(locale, 2, 'week', 'long'),
    keywordLabel(locale, -1, 'month'),
    keywordLabel(locale, -1, 'day'),
    keywordLabel(locale, 0, 'day')
  ]
}

export function fixedHints(locale = 'en', now: Date = new Date()): string[] {
  const year = now.getFullYear()
  const numeric = new Intl.DateTimeFormat(intlLocale(locale), { month: 'numeric', day: 'numeric' })
  return [
    new Intl.DateTimeFormat(intlLocale(locale), { month: 'short', day: 'numeric' }).format(
      new Date(year, 0, 1)
    ),
    `${numeric.format(new Date(year, 0, 1))} - ${numeric.format(new Date(year, 0, 2))}`,
    unitLabel(locale, 36, 'hour', 'long'),
    unitLabel(locale, 48, 'hour', 'long')
  ]
}

export function parseTime(text: string): { hours: number; minutes: number } | null {
  const match = normalizeText(text).match(/^(\d{1,2})[:h.](\d{2})\s*(?:([ap])\.?\s*m\.?)?$/)
  if (!match) return null
  let hours = Number(match[1])
  const minutes = Number(match[2])
  const meridiem = match[3]
  if (minutes > 59) return null
  if (meridiem) {
    if (hours < 1 || hours > 12) return null
    if (meridiem === 'p' && hours !== 12) hours += 12
    if (meridiem === 'a' && hours === 12) hours = 0
  } else if (hours > 23) {
    return null
  }
  return { hours, minutes }
}
