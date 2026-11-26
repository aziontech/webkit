# useDirection

Composable `@aziontech/ui/use-direction`. The signatures and option tables below are read from its typed source, [`src/composables/use-direction/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/ui/src/composables/use-direction/index.ts).

```ts
import { useDirection, resolveDirection, eventDirection, logicalArrowKey } from '@aziontech/ui/use-direction'
import type { Direction } from '@aziontech/ui/use-direction'
```

## `useDirection`

```ts
function useDirection(target?: MaybeRefOrGetter<Target>): Readonly<Ref<Direction>>
```

## `resolveDirection`

```ts
function resolveDirection(el?: Element | null): Direction
```

## `eventDirection`

```ts
function eventDirection(event: Event): Direction
```

## `logicalArrowKey`

```ts
function logicalArrowKey(key: string, dir: Direction): string
```

## `Direction`

```ts
type Direction = 'ltr' | 'rtl'
```
