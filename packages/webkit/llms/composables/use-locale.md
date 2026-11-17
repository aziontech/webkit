# useLocale

Composable `@aziontech/webkit/use-locale`. The signatures and option tables below are read from its typed source, [`src/composables/use-locale/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/webkit/src/composables/use-locale/index.ts).

```ts
import { useLocale, usePortalLocale, createTranslator, directionOf, mergeMessages, pickCatalog, provideLocale, BUILT_IN_CATALOGS } from '@aziontech/webkit/use-locale'
import type { UseLocaleReturn, Direction, MessageKey, MessageParams, Messages, PartialMessages, PluralMessage, PortalLocaleAttrs, DirectionSetting, FileSizeUnit, PluralForms, ProvideLocaleOptions } from '@aziontech/webkit/use-locale'
```

## `useLocale`

```ts
function useLocale(fallback: PartialMessages = {}): UseLocaleReturn
```

## `UseLocaleReturn`

What `useLocale()` returns.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `locale` | `ComputedRef<string>` | yes | Active BCP 47 locale tag (the device locale with no provider, `en-US` until mount). |
| `dir` | `ComputedRef<Direction>` | yes | Active text direction (`ltr` with no provider). |
| `t` | `(key: MessageKey, params?: MessageParams) => string` | yes | Reads a catalog message and fills its `{name}` placeholders. |
| `formatNumber` | `(value: number, options?: Intl.NumberFormatOptions) => string` | yes | Formats a number with `Intl.NumberFormat`. |
| `formatDate` | `(value: Date \| number \| string, options?: Intl.DateTimeFormatOptions) => string` | yes | Formats a date with `Intl.DateTimeFormat`. |
| `formatRelativeTime` | `( value: number \| Date, unit?: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions ) => string` | yes | Formats a relative time; a `Date` picks the unit from its distance to now (the provider's `now`, else the real clock). |
| `formatList` | `(items: string[], options?: Intl.ListFormatOptions) => string` | yes | Joins a list with `Intl.ListFormat`. |
| `formatFileSize` | `(bytes: number, options?: Intl.NumberFormatOptions) => string` | yes | Formats a byte count with the largest whole unit (`1.5 MB`). |
| `plural` | `(count: number, forms: PluralForms, options?: Intl.PluralRulesOptions) => string` | yes | Picks the plural form for `count` with `Intl.PluralRules`. |

## `usePortalLocale`

```ts
function usePortalLocale(): ComputedRef<PortalLocaleAttrs>
```

## `createTranslator`

```ts
function createTranslator(locale: () => string, messages: () => PartialMessages, fallback: PartialMessages = {}, now: () => number = () => Date.now()): Omit<UseLocaleReturn, 'locale' | 'dir'>
```

## `directionOf`

```ts
function directionOf(locale: string): Direction
```

## `mergeMessages`

```ts
function mergeMessages(base: Messages, overrides?: PartialMessages): Messages
```

## `pickCatalog`

```ts
function pickCatalog(locale: string, catalogs: Record<string, Messages>): Messages
```

## `provideLocale`

```ts
function provideLocale(options: ProvideLocaleOptions): LocaleContext
```

## `BUILT_IN_CATALOGS`

```ts
const BUILT_IN_CATALOGS: Record<string, Messages>
```

## `Direction`

Text direction of the provider's subtree.

```ts
type Direction = 'ltr' | 'rtl'
```

## `MessageKey`

A dotted catalog key, e.g. `pagination.previous`.

```ts
type MessageKey = Leaves<Messages>
```

## `MessageParams`

Values substituted into `{name}` placeholders; numbers are formatted for the locale.

```ts
type MessageParams = Record<string, string | number>
```

## `Messages`

The shape every locale catalog implements: the keys of the English catalog.

```ts
type Messages = Widen<typeof en>
```

## `PartialMessages`

A partial catalog, deep-merged over a built-in locale by `ConfigProvider`.

```ts
type PartialMessages = { [G in keyof Messages]?: Partial<Messages[G]> }
```

## `PluralMessage`

One message per CLDR plural category; `other` is required, the rest are optional.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `zero` | `string` | no |  |
| `one` | `string` | no |  |
| `two` | `string` | no |  |
| `few` | `string` | no |  |
| `many` | `string` | no |  |
| `other` | `string` | yes |  |

## `PortalLocaleAttrs`

`dir` and `lang` of the nearest `ConfigProvider`, for an element teleported out of it (empty with no provider).

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `dir` | `Direction` | no |  |
| `lang` | `string` | no |  |

## `DirectionSetting`

The direction a provider asks for; `auto` derives it from the locale.

```ts
type DirectionSetting = Direction | 'auto'
```

## `FileSizeUnit`

Byte units `formatFileSize` steps through.

```ts
type FileSizeUnit = 'byte' | 'kilobyte' | 'megabyte' | 'gigabyte' | 'terabyte'
```

## `PluralForms`

Plural forms passed to `plural`; `{count}` in a form is replaced by the formatted count.

```ts
type PluralForms = PluralMessage
```

## `ProvideLocaleOptions`

Options accepted by `provideLocale`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `locale` | `MaybeRefOrGetter<string>` | yes | BCP 47 locale tag; empty follows the device locale (`en-US` until mount). |
| `messages` | `MaybeRefOrGetter<PartialMessages \| undefined>` | no | Partial catalog deep-merged over the built-in one. |
| `dir` | `MaybeRefOrGetter<DirectionSetting \| undefined>` | no | Explicit direction, or `auto` to derive it from the locale. |
| `catalogs` | `MaybeRefOrGetter<Record<string, Messages>>` | yes | Catalogs the provider can pick from, keyed by locale tag; English must be one of them. |
| `now` | `MaybeRefOrGetter<string \| number \| Date \| undefined>` | no | Reference time for relative times below the provider; undefined reads the real clock. |
| `timeZone` | `MaybeRefOrGetter<string \| undefined>` | no | IANA time zone for absolute times below the provider; empty or undefined reads the browser's zone. |
