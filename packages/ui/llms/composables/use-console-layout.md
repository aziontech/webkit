# useConsoleLayout

Composable `@aziontech/ui/use-console-layout`. The signatures and option tables below are read from its typed source, [`src/components/layout/console-layout/composables/use-console-layout.ts`](https://github.com/aziontech/webkit/blob/main/packages/ui/src/components/layout/console-layout/composables/use-console-layout.ts).

```ts
import { useConsoleLayout } from '@aziontech/ui/use-console-layout'
import type { UseConsoleLayoutOptions, UseConsoleLayoutReturn } from '@aziontech/ui/use-console-layout'
```

## `useConsoleLayout`

```ts
function useConsoleLayout<Optional extends boolean = false>(options: UseConsoleLayoutOptions<Optional> = {}): UseConsoleLayoutReturn<Optional>
```

## `UseConsoleLayoutOptions<Optional extends boolean = boolean>`

Options of `useConsoleLayout`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `optional` | `Optional` | no | Returns null outside a ConsoleLayout instead of throwing, for a page body that also renders standalone. |

## `UseConsoleLayoutReturn<Optional extends boolean = false>`

The context, or null when `optional` is true and no ConsoleLayout is above the caller.

```ts
type UseConsoleLayoutReturn<Optional extends boolean = false> = Optional extends true ? ConsoleLayoutContext | null : ConsoleLayoutContext
```
