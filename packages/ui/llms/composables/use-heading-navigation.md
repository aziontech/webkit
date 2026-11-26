# useHeadingNavigation

Composable `@aziontech/webkit/use-heading-navigation`. The signatures and option tables below are read from its typed source, [`src/composables/use-heading-navigation/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/webkit/src/composables/use-heading-navigation/index.ts).

```ts
import { useHeadingNavigation, provideHeadingNavigation, provideHeadingOutline, useHeadingOutline } from '@aziontech/webkit/use-heading-navigation'
import type { HeadingNavigationItem, HeadingNavigate, HeadingOutlineItem, RegisterHeading } from '@aziontech/webkit/use-heading-navigation'
```

## `useHeadingNavigation`

```ts
function useHeadingNavigation(): HeadingNavigate
```

## `provideHeadingNavigation`

```ts
function provideHeadingNavigation(navigate: HeadingNavigate): void
```

## `provideHeadingOutline`

```ts
function provideHeadingOutline(register: RegisterHeading): void
```

## `useHeadingOutline`

```ts
function useHeadingOutline(el: MaybeRefOrGetter<Element | null>, item: MaybeRefOrGetter<HeadingOutlineItem | null>): void
```

## `HeadingNavigationItem`

The subject of a heading activation: the anchor id the reader is headed to.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes |  |

## `HeadingNavigate`

Takes the reader to a heading — (event, item); calls preventDefault when it handles the jump itself.

```ts
type HeadingNavigate = (event: MouseEvent, item: HeadingNavigationItem) => void
```

## `HeadingOutlineItem`

One entry of the layout's outline: the heading's anchor id, its visible text and its level.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes | The heading's anchor id. |
| `text` | `string` | yes | The visible heading text. |
| `depth` | `number` | yes | Heading level; 3 indents under the preceding 2. |

## `RegisterHeading`

Adds a heading to the layout's outline and returns the function that removes it.

```ts
type RegisterHeading = ( el: () => Element | null, item: () => HeadingOutlineItem | null ) => () => void
```
