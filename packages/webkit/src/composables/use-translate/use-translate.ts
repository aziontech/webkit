import {
  computed,
  type ComputedRef,
  getCurrentInstance,
  inject,
  type InjectionKey,
  onMounted,
  type Ref,
  ref
} from 'vue'

import type {
  Direction,
  MessageKey,
  MessageParams,
  Messages,
  PartialMessages,
  PluralMessage
} from '../../i18n/types'

/** What `ConfigProvider` hands down to every component below it. */
export interface LocaleContext {
  /** BCP 47 locale tag. */
  locale: ComputedRef<string>
  /** Resolved text direction. */
  dir: ComputedRef<Direction>
  /** The built-in catalog for the locale with the provider's overrides merged in. */
  messages: ComputedRef<Messages>
  /** Reference time in epoch milliseconds for relative times; undefined reads the real clock. */
  now?: ComputedRef<number | undefined>
  /** IANA time zone that absolute times below the provider read in (`Timestamp`); undefined reads the browser's zone. */
  timeZone?: ComputedRef<string | undefined>
  /** Every catalog the provider picks from, inherited ones included, so a nested provider can switch locale. */
  catalogs?: ComputedRef<Record<string, Messages>>
  /** The partial overrides in effect, outermost first, merged in order over whichever catalog a nested provider picks. */
  overrides?: ComputedRef<PartialMessages[]>
}

/** What `useTranslate()` returns. */
export interface UseTranslateReturn {
  /** Active BCP 47 locale tag (the device locale with no provider, `en-US` until mount). */
  locale: ComputedRef<string>
  /** Active text direction (`ltr` with no provider). */
  dir: ComputedRef<Direction>
  /** Reads a catalog message and fills its `{name}` placeholders. */
  t: (key: MessageKey, params?: MessageParams) => string
}

export const LocaleInjectionKey: InjectionKey<LocaleContext> = Symbol('Locale')

export const DEFAULT_LOCALE = 'en'

const SERVER_LOCALE = 'en-US'

const deviceTag = ref(SERVER_LOCALE)

const readDevice = () => {
  try {
    deviceTag.value =
      Intl.getCanonicalLocales(navigator.language || SERVER_LOCALE)[0] ?? SERVER_LOCALE
  } catch {
    deviceTag.value = SERVER_LOCALE
  }
}

export function useDeviceLocale(): Readonly<Ref<string>> {
  const mounted = ref(false)
  const start = () => {
    if (typeof window === 'undefined') return
    readDevice()
    mounted.value = true
  }
  if (getCurrentInstance()) onMounted(start)
  else start()
  return computed(() => (mounted.value ? deviceTag.value : SERVER_LOCALE))
}

export const intlLocale = (tag: string): string =>
  !tag || /-u-(\w+-)*nu-/.test(tag) ? tag : tag.replace(/-u-|$/, (u) => `-u-nu-latn${u && '-'}`)

const formatters = new Map<string, unknown>()

export function cached<T>(
  kind: string,
  locale: string,
  options: object | undefined,
  make: () => T
): T {
  const id = `${kind}|${locale}|${options ? JSON.stringify(options) : ''}`
  let formatter = formatters.get(id) as T | undefined
  if (!formatter) {
    formatter = make()
    formatters.set(id, formatter)
  }
  return formatter
}

type MessageCatalog = Readonly<Record<string, Readonly<Record<string, unknown>> | undefined>>

function lookup(messages: MessageCatalog, key: string): string | PluralMessage | undefined {
  const [group, name] = key.split('.') as [string, string]
  const value = messages[group]?.[name]
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'other' in value) return value as PluralMessage
  return undefined
}

export interface MessageHelpers {
  t: (key: MessageKey, params?: MessageParams) => string
  fill: (template: string, params?: MessageParams) => string
  selectForm: (count: number, forms: PluralMessage, options?: Intl.PluralRulesOptions) => string
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
}

export function createMessageHelpers(
  locale: () => string,
  messages: () => PartialMessages,
  fallback: PartialMessages = {}
): MessageHelpers {
  const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string =>
    cached(
      'number',
      locale(),
      options,
      () => new Intl.NumberFormat(intlLocale(locale()), options)
    ).format(value)

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
    forms: PluralMessage,
    options?: Intl.PluralRulesOptions
  ): string => {
    const rules = cached('plural', locale(), options, () => new Intl.PluralRules(locale(), options))
    return (count === 0 && forms.zero) || forms[rules.select(count)] || forms.other
  }

  const t = (key: MessageKey, params?: MessageParams): string => {
    const value = lookup(messages(), key) ?? lookup(fallback, key)
    if (value === undefined) return key
    if (typeof value === 'string') return fill(value, params)
    const count = Number(params?.['count'] ?? 0)
    return fill(selectForm(count, value), { ...params, count })
  }

  return { t, fill, selectForm, formatNumber }
}

/** What `useLocaleContext()` returns; `context` is null when no `ConfigProvider` is above the caller. */
export interface UseLocaleContextReturn {
  /** The provider's context, or null with no provider. */
  context: LocaleContext | null
  /** Active BCP 47 locale tag (the device locale with no provider, `en-US` until mount). */
  locale: ComputedRef<string>
  /** Active text direction (`ltr` with no provider). */
  dir: ComputedRef<Direction>
}

export function useLocaleContext(): UseLocaleContextReturn {
  const context = inject(LocaleInjectionKey, null)
  const device = context ? null : useDeviceLocale()
  return {
    context,
    locale: computed(() => context?.locale.value ?? device?.value ?? SERVER_LOCALE),
    dir: computed<Direction>(() => context?.dir.value ?? 'ltr')
  }
}

export function useTranslate(fallback: PartialMessages = {}): UseTranslateReturn {
  const { context, locale, dir } = useLocaleContext()
  const { t } = createMessageHelpers(
    () => locale.value,
    () => context?.messages.value ?? fallback,
    fallback
  )
  return { locale, dir, t }
}

/** `dir` and `lang` of the nearest `ConfigProvider`, for an element teleported out of it (empty with no provider). */
export interface PortalLocaleAttrs {
  dir?: Direction
  lang?: string
}

export function usePortalLocale(): ComputedRef<PortalLocaleAttrs> {
  const context = inject(LocaleInjectionKey, null)
  return computed<PortalLocaleAttrs>(() =>
    context ? { dir: context.dir.value, lang: context.locale.value } : {}
  )
}
