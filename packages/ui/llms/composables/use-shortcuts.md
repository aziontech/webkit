# useShortcuts

Composable `@aziontech/webkit/use-shortcuts`. The signatures and option tables below are read from its typed source, [`src/composables/use-shortcuts/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/webkit/src/composables/use-shortcuts/index.ts).

```ts
import { useShortcuts, matchesShortcut, parseShortcutKeys, shortcutKeyList, toAriaKeyshortcuts, isTypingTarget, createShortcutRegistry, provideShortcuts, useShortcutList, ShortcutsInjectionKey } from '@aziontech/webkit/use-shortcuts'
import type { UseShortcutsReturn, ShortcutCombination, Shortcut, ShortcutListGroup, ShortcutListItem, ShortcutRegistry, ShortcutRegistryEntry, UseShortcutListReturn } from '@aziontech/webkit/use-shortcuts'
```

## `useShortcuts`

```ts
function useShortcuts(shortcuts: Shortcut | Shortcut[]): UseShortcutsReturn
```

## `UseShortcutsReturn`

What `useShortcuts` returns.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `stop` | `() => void` | yes | Removes the shortcuts before the scope ends. |

## `matchesShortcut`

```ts
function matchesShortcut(event: KeyboardEvent, combination: ShortcutCombination): boolean
```

## `parseShortcutKeys`

```ts
function parseShortcutKeys(keys: string): ShortcutCombination | null
```

## `shortcutKeyList`

```ts
function shortcutKeyList(keys: string): string[]
```

## `toAriaKeyshortcuts`

```ts
function toAriaKeyshortcuts(keys: string): string
```

## `isTypingTarget`

```ts
function isTypingTarget(target: Element | null): boolean
```

## `createShortcutRegistry`

```ts
function createShortcutRegistry(): ShortcutRegistry
```

## `provideShortcuts`

```ts
function provideShortcuts(): ShortcutRegistry
```

## `useShortcutList`

```ts
function useShortcutList(): UseShortcutListReturn
```

## `ShortcutCombination`

A parsed key combination.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `meta` | `boolean` | yes | Command on Apple platforms, Control elsewhere. |
| `ctrl` | `boolean` | yes | Control on every platform. |
| `shift` | `boolean` | yes | Shift. |
| `alt` | `boolean` | yes | Alt, Option on Apple platforms. |
| `key` | `string` | yes | The key, lowercase, as `KeyboardEvent.key` names it (`s`, `enter`, `/`). |

## `Shortcut`

One keyboard shortcut a screen offers.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `keys` | `MaybeRefOrGetter<string>` | yes | Keys joined with `+`: `meta+s`, `meta+enter`, `/`, `?`. `meta` is Command on Apple platforms and Control elsewhere; `ctrl` is always Control. |
| `label` | `MaybeRefOrGetter<string>` | no | What the shortcut does, as the shortcuts list shows it. Empty keeps it out of the list. |
| `group` | `MaybeRefOrGetter<string>` | no | Heading the list files it under. Empty files it under the general group. |
| `handler` | `(event: KeyboardEvent) => void` | no | Runs on the key press, after the browser default is prevented. Omitted, the shortcut is only listed: another part (Command, a field) binds it. |
| `when` | `MaybeRefOrGetter<boolean>` | no | The shortcut works and is listed only while this is true. |
| `element` | `MaybeRefOrGetter<HTMLElement \| null \| undefined>` | no | The element the shortcut belongs to. While a modal layer is open, only shortcuts whose element sits inside that layer fire. |

## `ShortcutListGroup`

One group of the shortcuts list.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `group` | `string` | yes | The group heading; empty for the general group. |
| `items` | `ShortcutListItem[]` | yes | The shortcuts in the group, in registration order. |

## `ShortcutListItem`

One row of the shortcuts list.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes | Stable id of the row. |
| `keys` | `string` | yes | The keys as registered (`meta+s`). |
| `keyList` | `string[]` | yes | Each key on its own, for `Kbd` (`['meta', 's']`). |
| `label` | `string` | yes | What the shortcut does. |

## `ShortcutRegistry`

The shortcuts of one app: provided by `provideShortcuts`, or the page-wide default.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `entries` | `readonly ShortcutRegistryEntry[]` | yes | Registered shortcuts, in registration order. |
| `register` | `(shortcut: Shortcut) => () => void` | yes | Adds a shortcut and returns its remover. |

## `ShortcutRegistryEntry`

A shortcut as the registry holds it.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `number` | yes | Registration order. |
| `shortcut` | `Shortcut` | yes | The shortcut as registered. |

## `UseShortcutListReturn`

What `useShortcutList` returns.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `groups` | `ComputedRef<ShortcutListGroup[]>` | yes | Every listed shortcut that is enabled now, grouped in first-registration order. |

## `ShortcutsInjectionKey`

```ts
const ShortcutsInjectionKey: InjectionKey<ShortcutRegistry>
```
