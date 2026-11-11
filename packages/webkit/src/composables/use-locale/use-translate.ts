import { computed, type ComputedRef, inject, type InjectionKey } from 'vue'

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
}

/** What `useTranslate()` returns. */
export interface UseTranslateReturn {
  /** Active BCP 47 locale tag (`en` with no provider). */
  locale: ComputedRef<string>
  /** Active text direction (`ltr` with no provider). */
  dir: ComputedRef<Direction>
  /** Reads a catalog message and fills its `{name}` placeholders. */
  t: (key: MessageKey, params?: MessageParams) => string
}

export const LocaleInjectionKey: InjectionKey<LocaleContext> = Symbol('WebkitLocale')

export const DEFAULT_LOCALE = 'en'

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

export function useLocaleContext(): {
  context: LocaleContext | null
  locale: ComputedRef<string>
  dir: ComputedRef<Direction>
} {
  const context = inject(LocaleInjectionKey, null)
  return {
    context,
    locale: computed(() => context?.locale.value ?? DEFAULT_LOCALE),
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
