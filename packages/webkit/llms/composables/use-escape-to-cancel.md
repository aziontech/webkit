# useEscapeToCancel

Composable `@aziontech/webkit/use-escape-to-cancel`. The signatures and option tables below are read from its typed source, [`src/composables/use-escape-to-cancel/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/webkit/src/composables/use-escape-to-cancel/index.ts).

```ts
import { useEscapeToCancel } from '@aziontech/webkit/use-escape-to-cancel'
import type { UseEscapeToCancelOptions } from '@aziontech/webkit/use-escape-to-cancel'
```

## `useEscapeToCancel`

```ts
function useEscapeToCancel(onEscape: (event: globalThis.KeyboardEvent) => void, options: UseEscapeToCancelOptions = {}): void
```

## `UseEscapeToCancelOptions`

Options of `useEscapeToCancel`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | `MaybeRefOrGetter<boolean>` | no | Turns the shortcut off (for example while the create request is in flight). |
