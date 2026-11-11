import { computed, type ComputedRef, type MaybeRefOrGetter, provide, toValue } from 'vue'

import type {
  Direction,
  MessageKey,
  MessageParams,
  Messages,
  PartialMessages,
  PluralMessage
} from '../../i18n/types'
import {
  cached,
  createMessageHelpers,
  DEFAULT_LOCALE,
  type LocaleContext,
  LocaleInjectionKey,
  useLocaleContext
} from './use-translate'

export { DEFAULT_LOCALE, type LocaleContext, LocaleInjectionKey }

/** The direction a provider asks for; `auto` derives it from the locale. */
export type DirectionSetting = Direction | 'auto'

/** Options accepted by `provideLocale`. */
export interface ProvideLocaleOptions {
  /** BCP 47 locale tag. */
  locale: MaybeRefOrGetter<string>
  /** Partial catalog deep-merged over the built-in one. */
  messages?: MaybeRefOrGetter<PartialMessages | undefined>
  /** Explicit direction, or `auto` to derive it from the locale. */
  dir?: MaybeRefOrGetter<DirectionSetting | undefined>
  /** Catalogs the provider can pick from, keyed by locale tag; English must be one of them. */
  catalogs: MaybeRefOrGetter<Record<string, Messages>>
}

/** Plural forms passed to `plural`; `{count}` in a form is replaced by the formatted count. */
export type PluralForms = PluralMessage

/** Byte units `formatFileSize` steps through. */
export type FileSizeUnit = 'byte' | 'kilobyte' | 'megabyte' | 'gigabyte' | 'terabyte'

/** What `useLocale()` returns. */
export interface UseLocaleReturn {
  /** Active BCP 47 locale tag (`en` with no provider). */
  locale: ComputedRef<string>
  /** Active text direction (`ltr` with no provider). */
  dir: ComputedRef<Direction>
  /** Reads a catalog message and fills its `{name}` placeholders. */
  t: (key: MessageKey, params?: MessageParams) => string
  /** Formats a number with `Intl.NumberFormat`. */
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
  /** Formats a date with `Intl.DateTimeFormat`. */
  formatDate: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => string
  /** Formats a relative time; a `Date` picks the unit from its distance to now. */
  formatRelativeTime: (
    value: number | Date,
    unit?: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions
  ) => string
  /** Joins a list with `Intl.ListFormat`. */
  formatList: (items: string[], options?: Intl.ListFormatOptions) => string
  /** Formats a byte count with the largest whole unit (`1.5 MB`). */
  formatFileSize: (bytes: number, options?: Intl.NumberFormatOptions) => string
  /** Picks the plural form for `count` with `Intl.PluralRules`. */
  plural: (count: number, forms: PluralForms, options?: Intl.PluralRulesOptions) => string
}

const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur'])

export function directionOf(locale: string): Direction {
  const language = locale.toLowerCase().split(/[-_]/)[0] ?? ''
  return RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr'
}

function findCatalog(locale: string, catalogs: Record<string, Messages>): Messages | undefined {
  const tag = locale.toLowerCase()
  const entries = Object.entries(catalogs)
  const exact = entries.find(([key]) => key.toLowerCase() === tag)
  if (exact) return exact[1]
  const language = tag.split(/[-_]/)[0]
  return entries.find(([key]) => key.toLowerCase().split(/[-_]/)[0] === language)?.[1]
}

export function pickCatalog(locale: string, catalogs: Record<string, Messages>): Messages {
  return findCatalog(locale, catalogs) ?? (catalogs[DEFAULT_LOCALE] as Messages)
}

const SHIPPED_LOCALES = ['pt-BR', 'es']
const warnedLocales = new Set<string>()

function warnMissingCatalog(locale: string): void {
  if ((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV !== true) return
  const language = locale.toLowerCase().split(/[-_]/)[0]
  const shipped = SHIPPED_LOCALES.find((tag) => tag.toLowerCase().split('-')[0] === language)
  if (!shipped || warnedLocales.has(locale)) return
  warnedLocales.add(locale)
  console.warn(
    `[webkit] <WebkitProvider>: locale "${locale}" has no registered catalog, so built-in strings fall back to English. Import it from "@aziontech/webkit/locales/${shipped}" and pass it through \`catalogs\`.`
  )
}

export function mergeMessages(base: Messages, overrides?: PartialMessages): Messages {
  if (!overrides) return base
  const merged: Record<string, unknown> = { ...base }
  for (const [group, values] of Object.entries(overrides)) {
    if (!values) continue
    const current = (merged[group] ?? {}) as Record<string, unknown>
    merged[group] = { ...current, ...values }
  }
  return merged as Messages
}

const RELATIVE_STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['second', 60],
  ['minute', 60],
  ['hour', 24],
  ['day', 7],
  ['week', 4.34524],
  ['month', 12],
  ['year', Number.POSITIVE_INFINITY]
]

const FILE_SIZE_UNITS: FileSizeUnit[] = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte']

export function createTranslator(
  locale: () => string,
  messages: () => PartialMessages,
  fallback: PartialMessages = {}
): Omit<UseLocaleReturn, 'locale' | 'dir'> {
  const { t, fill, selectForm, formatNumber } = createMessageHelpers(locale, messages, fallback)

  const plural = (count: number, forms: PluralForms, options?: Intl.PluralRulesOptions): string =>
    fill(selectForm(count, forms, options), { count })

  const formatDate = (
    value: Date | number | string,
    options?: Intl.DateTimeFormatOptions
  ): string =>
    cached('date', locale(), options, () => new Intl.DateTimeFormat(locale(), options)).format(
      value instanceof Date ? value : new Date(value)
    )

  const formatRelativeTime = (
    value: number | Date,
    unit: Intl.RelativeTimeFormatUnit = 'second',
    options: Intl.RelativeTimeFormatOptions = { numeric: 'auto' }
  ): string => {
    const format = cached(
      'relative',
      locale(),
      options,
      () => new Intl.RelativeTimeFormat(locale(), options)
    )
    if (!(value instanceof Date)) return format.format(value, unit)
    let amount = (value.getTime() - Date.now()) / 1000
    for (const [step, size] of RELATIVE_STEPS) {
      if (Math.abs(amount) < size) return format.format(Math.round(amount), step)
      amount /= size
    }
    return format.format(Math.round(amount), 'year')
  }

  const formatList = (items: string[], options?: Intl.ListFormatOptions): string =>
    cached('list', locale(), options, () => new Intl.ListFormat(locale(), options)).format(items)

  const formatFileSize = (bytes: number, options?: Intl.NumberFormatOptions): string => {
    let value = Math.max(0, bytes)
    let index = 0
    while (value >= 1024 && index < FILE_SIZE_UNITS.length - 1) {
      value /= 1024
      index += 1
    }
    return formatNumber(value, {
      style: 'unit',
      unit: FILE_SIZE_UNITS[index],
      unitDisplay: 'short',
      maximumFractionDigits: index === 0 ? 0 : 1,
      ...options
    })
  }

  return { t, formatNumber, formatDate, formatRelativeTime, formatList, formatFileSize, plural }
}

export function provideLocale(options: ProvideLocaleOptions): LocaleContext {
  const locale = computed(() => toValue(options.locale) || DEFAULT_LOCALE)
  const dir = computed<Direction>(() => {
    const requested = toValue(options.dir) ?? 'auto'
    return requested === 'auto' ? directionOf(locale.value) : requested
  })
  const messages = computed(() => {
    const catalogs = toValue(options.catalogs)
    const found = findCatalog(locale.value, catalogs)
    if (!found) warnMissingCatalog(locale.value)
    return mergeMessages(found ?? (catalogs[DEFAULT_LOCALE] as Messages), toValue(options.messages))
  })
  const context: LocaleContext = { locale, dir, messages }
  provide(LocaleInjectionKey, context)
  return context
}

export function useLocale(fallback: PartialMessages = {}): UseLocaleReturn {
  const { context, locale, dir } = useLocaleContext()
  const helpers = createTranslator(
    () => locale.value,
    () => context?.messages.value ?? fallback,
    fallback
  )
  return { locale, dir, ...helpers }
}
