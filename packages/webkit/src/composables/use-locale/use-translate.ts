import {
  computed,
  type ComputedRef,
  getCurrentInstance,
  getCurrentScope,
  inject,
  type InjectionKey,
  onMounted,
  onScopeDispose,
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

/** What `WebkitProvider` hands down to every component below it. */
export interface LocaleContext {
  /** BCP 47 locale tag. */
  locale: ComputedRef<string>
  /** Resolved text direction. */
  dir: ComputedRef<Direction>
  /** The built-in catalog for the locale with the provider's overrides merged in. */
  messages: ComputedRef<Messages>
  /** Reference time in epoch milliseconds for relative times; undefined reads the real clock. */
  now?: ComputedRef<number | undefined>
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

export const LocaleInjectionKey: InjectionKey<LocaleContext> = Symbol('WebkitLocale')

export const DEFAULT_LOCALE = 'en'

export const SERVER_LOCALE = 'en-US'

export function readDeviceLocale(): string {
  const nav = globalThis.navigator as Navigator | undefined
  const tag = nav?.languages?.[0] || nav?.language
  if (!tag) return SERVER_LOCALE
  try {
    return Intl.getCanonicalLocales(tag)[0] ?? SERVER_LOCALE
  } catch {
    return SERVER_LOCALE
  }
}

const deviceTag = ref(SERVER_LOCALE)
let deviceUsers = 0

const readDevice = () => {
  deviceTag.value = readDeviceLocale()
}

const watchDevice = () => {
  deviceUsers += 1
  if (deviceUsers > 1) return
  readDevice()
  window.addEventListener('languagechange', readDevice)
}

const unwatchDevice = () => {
  deviceUsers = Math.max(0, deviceUsers - 1)
  if (deviceUsers === 0) window.removeEventListener('languagechange', readDevice)
}

export function useDeviceLocale(): Readonly<Ref<string>> {
  const mounted = ref(false)
  const start = () => {
    if (mounted.value || typeof window === 'undefined') return
    watchDevice()
    mounted.value = true
  }
  if (getCurrentInstance()) onMounted(start)
  else start()
  if (getCurrentScope()) {
    onScopeDispose(() => {
      if (mounted.value) unwatchDevice()
    })
  }
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

function lookup(messages: PartialMessages, key: string): string | PluralMessage | undefined {
  const [group, name] = key.split('.') as [string, string]
  const value = (messages as unknown as Record<string, Record<string, unknown>>)[group]?.[name]
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

/** What `useLocaleContext()` returns; `context` is null when no `WebkitProvider` is above the caller. */
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

/** `dir` and `lang` of the nearest `WebkitProvider`, for an element teleported out of it (empty with no provider). */
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
