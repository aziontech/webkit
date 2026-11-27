import { intlLocale } from '../../../../composables/use-translate'

export type SpanUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
type Keyword = 'today' | 'yesterday' | 'lastWeek' | 'lastMonth' | 'lastYear' | 'thisMonth'
export type DatePart = 'day' | 'month' | 'year'

export interface Vocabulary {
  units: Map<string, SpanUnit>
  keywords: Map<string, Keyword>
  months: Map<string, number>
  order: DatePart[]
}

const SPAN_UNITS: SpanUnit[] = ['minute', 'hour', 'day', 'week', 'month', 'year']

const ENGLISH_UNITS: Record<SpanUnit, string> = {
  minute: 'm min mins minute minutes',
  hour: 'h hr hrs hour hours',
  day: 'd day days',
  week: 'w wk wks week weeks',
  month: 'mo mth mths month months',
  year: 'y yr yrs year years'
}

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

export const bare = (text: string): string => normalizeText(text).replace(/\./g, '').trim()

const vocabularies = new Map<string, Vocabulary>()

function addAll<T>(map: Map<string, T>, key: string, value: T) {
  const word = bare(key)
  if (word && !map.has(word)) map.set(word, value)
}

function collect(vocabulary: Vocabulary, locale: string) {
  for (const unit of SPAN_UNITS) {
    for (const unitDisplay of ['long', 'short', 'narrow'] as const) {
      for (const count of [1, 2, 5]) {
        const parts = new Intl.NumberFormat(intlLocale(locale), {
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

  const relative = new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: 'auto' })
  for (const [keyword, amount, unit] of KEYWORDS) {
    addAll(vocabulary.keywords, relative.format(amount, unit), keyword)
  }

  for (let month = 0; month < 12; month += 1) {
    const date = new Date(2024, month, 15)
    for (const style of ['long', 'short'] as const) {
      for (const options of [{ month: style }, { month: style, day: 'numeric' as const }]) {
        const name = new Intl.DateTimeFormat(intlLocale(locale), options)
          .formatToParts(date)
          .find((part) => part.type === 'month')?.value
        if (name) addAll(vocabulary.months, name, month)
      }
    }
  }
}

export function vocabularyFor(locale: string): Vocabulary {
  const cachedVocabulary = vocabularies.get(locale)
  if (cachedVocabulary) return cachedVocabulary

  const vocabulary: Vocabulary = {
    units: new Map(),
    keywords: new Map(),
    months: new Map(),
    order: ['month', 'day', 'year']
  }
  for (const unit of SPAN_UNITS) {
    for (const word of ENGLISH_UNITS[unit].split(' ')) addAll(vocabulary.units, word, unit)
  }
  addAll(vocabulary.months, 'sept', 8)
  collect(vocabulary, 'en')
  if (locale !== 'en') collect(vocabulary, locale)

  const order = new Intl.DateTimeFormat(intlLocale(locale), {
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
