# usePinnedRow

Composable `@aziontech/ui/use-pinned-row`. The signatures and option tables below are read from its typed source, [`src/composables/use-pinned-row/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/ui/src/composables/use-pinned-row/index.ts).

```ts
import { usePinnedRow } from '@aziontech/ui/use-pinned-row'
import type { UsePinnedRowReturn, PinnedRowElements } from '@aziontech/ui/use-pinned-row'
```

## `usePinnedRow`

```ts
function usePinnedRow(elements: PinnedRowElements, enabled: MaybeRefOrGetter<boolean>): UsePinnedRowReturn
```

## `UsePinnedRowReturn`

What a pinned row exposes to its band.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `runwayHeight` | `Readonly<Ref<string>>` | yes | Height the runway takes so the page scroll covers the row's overflow; empty when not pinned. |
| `shift` | `ComputedRef<string \| undefined>` | yes | The row's `translate` value for the current scroll; undefined at rest. |

## `PinnedRowElements`

The elements a pinned row is measured from.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `runway` | `MaybeRefOrGetter<HTMLElement \| null>` | yes | The tall box the page scrolls through while the band stays pinned. |
| `pinned` | `MaybeRefOrGetter<HTMLElement \| null>` | yes | The band that sticks under the header. |
| `viewport` | `MaybeRefOrGetter<HTMLElement \| null>` | yes | The clipping window of the row. |
| `track` | `MaybeRefOrGetter<HTMLElement \| null>` | yes | The row that slides sideways. |
