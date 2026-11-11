import {
  computed,
  type ComputedRef,
  inject,
  type InjectionKey,
  type MaybeRefOrGetter,
  provide,
  toValue
} from 'vue'

import type {
  Direction,
  MessageKey,
  MessageParams,
  Messages,
  PartialMessages,
  PluralMessage
} from '../../i18n/types'

/** The direction a provider asks for; `auto` derives it from the locale. */
export type DirectionSetting = Direction | 'auto'

/** What `WebkitProvider` hands down to every component below it. */
export interface LocaleContext {
  /** BCP 47 locale tag. */
  locale: ComputedRef<string>
  /** Resolved text direction. */
  dir: ComputedRef<Direction>
  /** The built-in catalog for the locale with the provider's overrides merged in. */
  messages: ComputedRef<Messages>
}

/** Options accepted by `provideLocale`. */
export interface ProvideLocaleOptions {
  /** BCP 47 locale tag. */
  locale: MaybeRefOrGetter<string>
  /** Partial catalog deep-merged over the built-in one. */
  messages?: MaybeRefOrGetter<PartialMessages | undefined>
  /** Explicit direction, or `auto` to derive it from the locale. */
  dir?: MaybeRefOrGetter<DirectionSetting | undefined>
  /** Built-in catalogs the provider can pick from, keyed by locale tag. */
  catalogs: Record<string, Messages>
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

export const LocaleInjectionKey: InjectionKey<LocaleContext> = Symbol('WebkitLocale')

export const DEFAULT_LOCALE = 'en'

const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur'])

export function directionOf(locale: string): Direction {
  const language = locale.toLowerCase().split(/[-_]/)[0] ?? ''
  return RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr'
}

export function pickCatalog(locale: string, catalogs: Record<string, Messages>): Messages {
  const tag = locale.toLowerCase()
  const entries = Object.entries(catalogs)
  const exact = entries.find(([key]) => key.toLowerCase() === tag)
  if (exact) return exact[1]
  const language = tag.split(/[-_]/)[0]
  const sameLanguage = entries.find(([key]) => key.toLowerCase().split(/[-_]/)[0] === language)
  return sameLanguage ? sameLanguage[1] : (catalogs[DEFAULT_LOCALE] as Messages)
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

function lookup(messages: PartialMessages, key: string): string | PluralMessage | undefined {
  const [group, name] = key.split('.') as [string, string]
  const bucket = (messages as unknown as Record<string, Record<string, unknown>>)[group]
  const value = bucket?.[name]
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'other' in value) return value as PluralMessage
  return undefined
}

const formatters = new Map<string, unknown>()

function cached<T>(kind: string, locale: string, options: object | undefined, make: () => T): T {
  const id = `${kind}|${locale}|${options ? JSON.stringify(options) : ''}`
  let formatter = formatters.get(id) as T | undefined
  if (!formatter) {
    formatter = make()
    formatters.set(id, formatter)
  }
  return formatter
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
  const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string =>
    cached('number', locale(), options, () => new Intl.NumberFormat(locale(), options)).format(
      value
    )

  const fill = (template: string, params?: MessageParams): string =>
    params
      ? template.replace(/\{(\w+)\}/g, (match, name: string) => {
          const value = params[name]
          if (value === undefined) return match
          return typeof value === 'number' ? formatNumber(value) : value
        })
      : template

  const selectForm = (
    count: number,
    forms: PluralForms,
    options?: Intl.PluralRulesOptions
  ): string => {
    const rules = cached('plural', locale(), options, () => new Intl.PluralRules(locale(), options))
    return (count === 0 && forms.zero) || forms[rules.select(count)] || forms.other
  }

  const plural = (count: number, forms: PluralForms, options?: Intl.PluralRulesOptions): string =>
    fill(selectForm(count, forms, options), { count })

  const t = (key: MessageKey, params?: MessageParams): string => {
    const value = lookup(messages(), key) ?? lookup(fallback, key)
    if (value === undefined) return key
    if (typeof value === 'string') return fill(value, params)
    const count = Number(params?.['count'] ?? 0)
    return fill(selectForm(count, value), { ...params, count })
  }

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
  const messages = computed(() =>
    mergeMessages(pickCatalog(locale.value, options.catalogs), toValue(options.messages))
  )
  const context: LocaleContext = { locale, dir, messages }
  provide(LocaleInjectionKey, context)
  return context
}

export function useLocale(fallback: PartialMessages = {}): UseLocaleReturn {
  const context = inject(LocaleInjectionKey, null)
  const locale = computed(() => context?.locale.value ?? DEFAULT_LOCALE)
  const dir = computed<Direction>(() => context?.dir.value ?? 'ltr')
  const helpers = createTranslator(
    () => locale.value,
    () => context?.messages.value ?? fallback,
    fallback
  )
  return { locale, dir, ...helpers }
}
