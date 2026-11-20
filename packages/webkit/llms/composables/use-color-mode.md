# useColorMode

Composable `@aziontech/webkit/use-color-mode`. The signatures and option tables below are read from its typed source, [`src/composables/use-color-mode/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/webkit/src/composables/use-color-mode/index.ts).

```ts
import { useColorMode, setColorMode, COLOR_MODE_STORAGE_KEY, colorModeScript } from '@aziontech/webkit/use-color-mode'
import type { UseColorModeReturn, ColorMode, ResolvedColorMode } from '@aziontech/webkit/use-color-mode'
```

## `useColorMode`

```ts
function useColorMode(): UseColorModeReturn
```

## `UseColorModeReturn`

What `useColorMode()` returns.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `mode` | `WritableComputedRef<ColorMode>` | yes | The stored choice; bind it to ThemeSwitcher with v-model. Writing it stores and applies the choice. |
| `resolved` | `Readonly<Ref<ResolvedColorMode>>` | yes | The theme on screen: `mode`, or the operating-system preference when `mode` is `system`. |
| `setMode` | `(next: ColorMode) => void` | yes | Stores the choice and sets `data-theme` on the document element. |

## `setColorMode`

```ts
function setColorMode(next: ColorMode): void
```

## `ColorMode`

A theme choice: follow the operating system, or force light or dark.

```ts
type ColorMode = 'system' | 'light' | 'dark'
```

## `ResolvedColorMode`

The theme that is on screen once `system` is resolved.

```ts
type ResolvedColorMode = 'light' | 'dark'
```

## `COLOR_MODE_STORAGE_KEY`

## `colorModeScript`
