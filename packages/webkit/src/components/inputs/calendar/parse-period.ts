import { endOfDay, startOfDay } from './format'
import type { CalendarRange } from './injection-key'

export interface ParseOptions {
  locale?: string
  separators?: string[]
}

type SpanUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
type Keyword = 'today' | 'yesterday' | 'lastWeek' | 'lastMonth' | 'lastYear' | 'thisMonth'
type DatePart = 'day' | 'month' | 'year'

interface Vocabulary {
  units: Map<string, SpanUnit>
  keywords: Map<string, Keyword>
  months: Map<string, number>
  order: DatePart[]
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

const SPAN_UNITS: SpanUnit[] = ['minute', 'hour', 'day', 'week', 'month', 'year']

const ENGLISH_UNITS: [string, SpanUnit][] = [
  ['m', 'minute'],
  ['min', 'minute'],
  ['mins', 'minute'],
  ['minute', 'minute'],
  ['minutes', 'minute'],
  ['h', 'hour'],
  ['hr', 'hour'],
  ['hrs', 'hour'],
  ['hour', 'hour'],
  ['hours', 'hour'],
  ['d', 'day'],
  ['day', 'day'],
  ['days', 'day'],
  ['w', 'week'],
  ['wk', 'week'],
  ['wks', 'week'],
  ['week', 'week'],
  ['weeks', 'week'],
  ['mo', 'month'],
  ['mth', 'month'],
  ['mths', 'month'],
  ['month', 'month'],
  ['months', 'month'],
  ['y', 'year'],
  ['yr', 'year'],
  ['yrs', 'year'],
  ['year', 'year'],
  ['years', 'year']
]

const KEYWORDS: [Keyword, number, Intl.RelativeTimeFormatUnit][] = [
  ['today', 0, 'day'],
  ['yesterday', -1, 'day'],
  ['lastWeek', -1, 'week'],
  ['lastMonth', -1, 'month'],
  ['lastYear', -1, 'year'],
  ['thisMonth', 0, 'month']
]

const NATIVE_DIGITS = /[٠-٩۰-۹]/g

export function normalizeText(text: string): string {
  return text
    .replace(NATIVE_DIGITS, (digit) => String(digit.charCodeAt(0) & 0xf))
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[‎‏؜]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

const bare = (text: string): string => normalizeText(text).replace(/\./g, '').trim()

const vocabularies = new Map<string, Vocabulary>()

function addAll<T>(map: Map<string, T>, key: string, value: T) {
  const word = bare(key)
  if (word && !map.has(word)) map.set(word, value)
}

function collect(vocabulary: Vocabulary, locale: string) {
  for (const unit of SPAN_UNITS) {
    for (const unitDisplay of ['long', 'short', 'narrow'] as const) {
      for (const count of [1, 2, 5]) {
        const parts = new Intl.NumberFormat(locale, {
          style: 'unit',
          unit,
          unitDisplay
        }).formatToParts(count)
        const word = parts
          .filter((part) => part.type === 'unit')
          .map((part) => part.value)
          .join('')
        addAll(vocabulary.units, word, unit)
      }
    }
  }

  const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  for (const [keyword, amount, unit] of KEYWORDS) {
    addAll(vocabulary.keywords, relative.format(amount, unit), keyword)
  }

  for (let month = 0; month < 12; month += 1) {
    const date = new Date(2024, month, 15)
    for (const style of ['long', 'short'] as const) {
      for (const options of [{ month: style }, { month: style, day: 'numeric' as const }]) {
        const name = new Intl.DateTimeFormat(locale, options)
          .formatToParts(date)
          .find((part) => part.type === 'month')?.value
        if (name) addAll(vocabulary.months, name, month)
      }
    }
  }
}

function vocabularyFor(locale: string): Vocabulary {
  const cachedVocabulary = vocabularies.get(locale)
  if (cachedVocabulary) return cachedVocabulary

  const vocabulary: Vocabulary = {
    units: new Map(),
    keywords: new Map(),
    months: new Map(),
    order: ['month', 'day', 'year']
  }
  for (const [word, unit] of ENGLISH_UNITS) addAll(vocabulary.units, word, unit)
  addAll(vocabulary.months, 'sept', 8)
  collect(vocabulary, 'en')
  if (locale !== 'en') collect(vocabulary, locale)

  const order = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
    .formatToParts(new Date(2024, 0, 15))
    .map((part) => part.type)
    .filter((type): type is DatePart => type === 'day' || type === 'month' || type === 'year')
  if (order.length === 3) vocabulary.order = order

  vocabularies.set(locale, vocabulary)
  return vocabulary
}

export function parsePeriod(
  input: string,
  now: Date = new Date(),
  options: ParseOptions = {}
): CalendarRange | null {
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

function parseRelative(text: string, now: Date, vocabulary: Vocabulary): CalendarRange | null {
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

function parseKeyword(text: string, now: Date, vocabulary: Vocabulary): CalendarRange | null {
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

function fixedDate(text: string, now: Date, vocabulary: Vocabulary): Date | null {
  const numeric = text.match(/^(\d{1,4})[./-](\d{1,2})(?:[./-](\d{1,4}))?\.?$/)
  if (numeric) {
    const [first, second, third] = [numeric[1], numeric[2], numeric[3]] as [
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
): string => new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay }).format(amount)

const keywordLabel = (locale: string, amount: number, unit: Intl.RelativeTimeFormatUnit): string =>
  new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(amount, unit)

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
  const numeric = new Intl.DateTimeFormat(locale, { month: 'numeric', day: 'numeric' })
  return [
    new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(
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
