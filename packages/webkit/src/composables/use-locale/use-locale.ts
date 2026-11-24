import { computed, type ComputedRef, inject, type MaybeRefOrGetter, provide, toValue } from 'vue'

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
  intlLocale,
  type LocaleContext,
  LocaleInjectionKey,
  useDeviceLocale,
  useLocaleContext
} from '../use-translate'

export { DEFAULT_LOCALE, type LocaleContext, LocaleInjectionKey }

/** The direction a provider asks for; `auto` derives it from the locale. */
export type DirectionSetting = Direction | 'auto'

/** Options accepted by `provideLocale`; every option left empty comes from the provider above, and at the root from the device and the page. */
export interface ProvideLocaleOptions {
  /** BCP 47 locale tag; empty inherits the parent provider's, at the root the device locale (`en-US` until mount). */
  locale: MaybeRefOrGetter<string>
  /** Partial catalog deep-merged over the built-in one and over the parent provider's overrides. */
  messages?: MaybeRefOrGetter<PartialMessages | undefined>
  /** Explicit direction, or `auto` to derive it from the locale and otherwise inherit it. */
  dir?: MaybeRefOrGetter<DirectionSetting | undefined>
  /** Catalogs the provider can pick from, keyed by locale tag, added to the parent provider's; English must be one of them at the root. */
  catalogs: MaybeRefOrGetter<Record<string, Messages>>
  /** Reference time for relative times below the provider; undefined inherits the parent provider's, at the root the real clock. */
  now?: MaybeRefOrGetter<string | number | Date | undefined>
  /** IANA time zone for absolute times below the provider; empty inherits the parent provider's, at the root the browser's zone. */
  timeZone?: MaybeRefOrGetter<string | undefined>
  /** Direction of the page around a root provider that sets none of its own; undefined reads `ltr` (the server render and hydration). */
  pageDir?: MaybeRefOrGetter<Direction | undefined>
}

/** Plural forms passed to `plural`; `{count}` in a form is replaced by the formatted count. */
export type PluralForms = PluralMessage

/** Byte units `formatFileSize` steps through. */
export type FileSizeUnit = 'byte' | 'kilobyte' | 'megabyte' | 'gigabyte' | 'terabyte'

/** What `useLocale()` returns. */
export interface UseLocaleReturn {
  /** Active BCP 47 locale tag (the device locale with no provider, `en-US` until mount). */
  locale: ComputedRef<string>
  /** Active text direction (`ltr` with no provider). */
  dir: ComputedRef<Direction>
  /** Reads a catalog message and fills its `{name}` placeholders. */
  t: (key: MessageKey, params?: MessageParams) => string
  /** Formats a number with `Intl.NumberFormat`. */
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
  /** Formats a date with `Intl.DateTimeFormat`. */
  formatDate: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => string
  /** Formats a relative time; a `Date` picks the unit from its distance to now (the provider's `now`, else the real clock). */
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
  const language = tag.split(/[-_]/)[0]
  const entries = Object.entries(catalogs)
  const find = (test: (key: string) => boolean) =>
    entries.find(([key]) => test(key.toLowerCase()))?.[1]
  return (
    find((key) => key === tag) ??
    find((key) => key === language) ??
    find((key) => key.split(/[-_]/)[0] === language)
  )
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
    `[webkit] <ConfigProvider>: locale "${locale}" has no registered catalog, so built-in ` +
      `strings fall back to English. Import it from "@aziontech/webkit/locales/${shipped}" and ` +
      `pass it through \`catalogs\`.`
  )
}

export function mergeMessages<T extends PartialMessages = Messages>(
  base: T,
  overrides?: PartialMessages
): T {
  if (!overrides) return base
  const merged: Record<string, unknown> = { ...base }
  for (const [group, values] of Object.entries(overrides)) {
    if (!values) continue
    const current = (merged[group] ?? {}) as Record<string, unknown>
    merged[group] = { ...current, ...values }
  }
  return merged as T
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
  fallback: PartialMessages = {},
  now: () => number = () => Date.now()
): Omit<UseLocaleReturn, 'locale' | 'dir'> {
  const { t, fill, selectForm, formatNumber } = createMessageHelpers(locale, messages, fallback)

  const plural = (count: number, forms: PluralForms, options?: Intl.PluralRulesOptions): string =>
    fill(selectForm(count, forms, options), { count })

  const formatDate = (
    value: Date | number | string,
    options?: Intl.DateTimeFormatOptions
  ): string =>
    cached(
      'date',
      locale(),
      options,
      () => new Intl.DateTimeFormat(intlLocale(locale()), options)
    ).format(value instanceof Date ? value : new Date(value))

  const formatRelativeTime = (
    value: number | Date,
    unit: Intl.RelativeTimeFormatUnit = 'second',
    options: Intl.RelativeTimeFormatOptions = { numeric: 'auto' }
  ): string => {
    const format = cached(
      'relative',
      locale(),
      options,
      () => new Intl.RelativeTimeFormat(intlLocale(locale()), options)
    )
    if (!(value instanceof Date)) return format.format(value, unit)
    let amount = (value.getTime() - now()) / 1000
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
    if (index === 0 && !options?.unitDisplay)
      return `${formatNumber(value, { maximumFractionDigits: 0, ...options })} B`
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

function epochOf(value: string | number | Date | undefined | null): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime()
  return Number.isNaN(time) ? undefined : time
}

/** What `provideLocale` returns: the provided context, plus the direction the provider sets itself. */
export interface ProvidedLocale extends LocaleContext {
  /** Direction from an explicit `dir` or `locale`; undefined when the provider inherits the direction around it. */
  ownDir: ComputedRef<Direction | undefined>
}

interface ProviderDirection {
  ownDir: ComputedRef<Direction | undefined>
  declaredDir: ComputedRef<Direction | undefined>
  dir: ComputedRef<Direction>
}

function useProviderDirection(
  options: ProvideLocaleOptions,
  parent: LocaleContext | null,
  explicit: ComputedRef<string>,
  rtlDevice: () => boolean
): ProviderDirection {
  const ownDir = computed<Direction | undefined>(() => {
    const requested = toValue(options.dir) ?? 'auto'
    if (requested !== 'auto') return requested
    return explicit.value ? directionOf(explicit.value) : undefined
  })
  const declaredDir = computed<Direction | undefined>(() => {
    if (ownDir.value) return ownDir.value
    if (parent) return parent.declaredDir ? parent.declaredDir.value : parent.dir.value
    return rtlDevice() ? 'rtl' : undefined
  })
  const dir = computed<Direction>(() => {
    if (declaredDir.value) return declaredDir.value
    if (parent) return parent.dir.value
    return toValue(options.pageDir) ?? 'ltr'
  })
  return { ownDir, declaredDir, dir }
}

export function provideLocale(options: ProvideLocaleOptions): ProvidedLocale {
  const parent = inject(LocaleInjectionKey, null)
  const device = useDeviceLocale()
  const explicit = computed(() => toValue(options.locale) || '')
  const locale = computed(() => explicit.value || parent?.locale.value || device.value)
  const catalogs = computed<Record<string, Messages>>(() => ({
    ...parent?.catalogs?.value,
    ...toValue(options.catalogs)
  }))
  const overrides = computed<PartialMessages | undefined>(() => {
    const inherited = parent?.overrides?.value
    const own = toValue(options.messages)
    return inherited ? mergeMessages(inherited, own) : own
  })
  const { ownDir, declaredDir, dir } = useProviderDirection(
    options,
    parent,
    explicit,
    () => directionOf(locale.value) === 'rtl' && !!findCatalog(locale.value, catalogs.value)
  )
  const messages = computed(() => {
    if (explicit.value && !findCatalog(locale.value, catalogs.value)) {
      warnMissingCatalog(locale.value)
    }
    return mergeMessages(pickCatalog(locale.value, catalogs.value), overrides.value)
  })
  const now = computed(() => epochOf(toValue(options.now)) ?? parent?.now?.value)
  const timeZone = computed(() => toValue(options.timeZone) || parent?.timeZone?.value || undefined)
  const portal = computed(() => ({ dir: declaredDir.value, lang: locale.value }))
  const context: LocaleContext = {
    locale,
    dir,
    messages,
    now,
    timeZone,
    declaredDir,
    portal,
    catalogs,
    overrides
  }
  provide(LocaleInjectionKey, context)
  return { ...context, ownDir }
}

export function useLocale(fallback: PartialMessages = {}): UseLocaleReturn {
  const { context, locale, dir } = useLocaleContext()
  const helpers = createTranslator(
    () => locale.value,
    () => context?.messages.value ?? fallback,
    fallback,
    () => context?.now?.value ?? Date.now()
  )
  return { locale, dir, ...helpers }
}
