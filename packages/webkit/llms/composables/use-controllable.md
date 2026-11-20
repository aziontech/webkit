# useControllable

Composable `@aziontech/webkit/use-controllable`. The signatures and option tables below are read from its typed source, [`src/composables/use-controllable/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/webkit/src/composables/use-controllable/index.ts).

```ts
import { useControllable } from '@aziontech/webkit/use-controllable'
import type { UseControllableOptions, UseControllableReturn } from '@aziontech/webkit/use-controllable'
```

## `useControllable`

```ts
function useControllable<T>({ prop, defaultProp, onChange }: UseControllableOptions<T>): UseControllableReturn<T>
```

## `UseControllableOptions<T>`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `prop` | `MaybeRefOrGetter<T \| undefined>` | yes |  |
| `defaultProp` | `T` | yes |  |
| `onChange` | `(next: T) => void` | yes |  |

## `UseControllableReturn<T>`

```ts
type UseControllableReturn<T> = ComputedRef<T> & { set: (next: T) => void }
```
