import type { en } from './messages/en'

/** One message per CLDR plural category; `other` is required, the rest are optional. */
export interface PluralMessage {
  zero?: string
  one?: string
  two?: string
  few?: string
  many?: string
  other: string
}

type PluralCategory = keyof PluralMessage

type IsPlural<T> = T extends { other: string }
  ? Exclude<keyof T, PluralCategory> extends never
    ? true
    : false
  : false

type Widen<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : IsPlural<T[K]> extends true
      ? PluralMessage
      : Widen<T[K]>
}

/** The shape every locale catalog implements: the keys of the English catalog. */
export type Messages = Widen<typeof en>

/** A partial catalog, deep-merged over a built-in locale by `WebkitProvider`. */
export type PartialMessages = {
  [G in keyof Messages]?: Partial<Messages[G]>
}

type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${P}${K}`
    : IsPlural<T[K]> extends true
      ? `${P}${K}`
      : Leaves<T[K], `${P}${K}.`>
}[keyof T & string]

/** A dotted catalog key, e.g. `pagination.previous`. */
export type MessageKey = Leaves<Messages>

/** Values substituted into `{name}` placeholders; numbers are formatted for the locale. */
export type MessageParams = Record<string, string | number>

/** Text direction of the provider's subtree. */
export type Direction = 'ltr' | 'rtl'
