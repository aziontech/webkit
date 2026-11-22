# usePlacement

Composable `@aziontech/webkit/use-placement`. The signatures and option tables below are read from its typed source, [`src/composables/use-placement/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/webkit/src/composables/use-placement/index.ts).

```ts
import { usePlacement, getClippingBoundary, computePlacement } from '@aziontech/webkit/use-placement'
import type { UsePlacementOptions, UsePlacementReturn, Align, CollisionPadding, ComputePlacementInput, ComputePlacementResult, PhysicalSide, Rect, Side, Size } from '@aziontech/webkit/use-placement'
```

## `usePlacement`

```ts
function usePlacement(options: UsePlacementOptions): UsePlacementReturn
```

## `UsePlacementOptions`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `triggerRef` | `MaybeRefOrGetter<globalThis.HTMLElement \| null>` | yes |  |
| `panelRef` | `MaybeRefOrGetter<globalThis.HTMLElement \| null>` | yes |  |
| `isOpen` | `MaybeRefOrGetter<boolean>` | yes |  |
| `side` | `MaybeRefOrGetter<Side \| 'auto'>` | yes |  |
| `align` | `MaybeRefOrGetter<Align>` | no | Alignment along the anchor edge. Defaults to `'center'`. |
| `sideOffset` | `MaybeRefOrGetter<number>` | no | Gap between trigger and panel, in px. Defaults to 4. |
| `alignOffset` | `MaybeRefOrGetter<number>` | no | Shift along the alignment axis, in px. Defaults to 0. |
| `collisionPadding` | `CollisionPadding` | no | Distance kept from the boundary edges, in px. Defaults to 8. |
| `flip` | `boolean` | no | Flip to the opposite side when the panel does not fit. Defaults to true. |
| `autoSides` | `Side[]` | no |  |
| `dir` | `MaybeRefOrGetter<Direction \| undefined>` | no | Text direction that resolves `start`/`end`; read from the trigger's nearest `dir` when omitted. |
| `zIndex` | `number` | no | Stacking order of the panel. Defaults to 1100. |
| `onDismiss` | `() => void` | no | When provided, a scroll that moves the trigger dismisses the panel through this callback (the panel is anchored once and does not follow the page): the scrolled node must be the document or an ancestor of the trigger, and the trigger must have moved more than 1px from where the panel was last anchored. Scrolls inside the panel, of unrelated scrollers, and scroll events that leave the trigger in place are ignored. When omitted, a scroll repositions the panel. Resize always repositions. |
| `matchTriggerWidth` | `boolean` | no | Lock the panel width to the trigger width (list boxes anchored under a field). Defaults to false. |

## `UsePlacementReturn`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `resolvedSide` | `Readonly<Ref<Side>>` | yes | Side the panel landed on, after flipping. |
| `resolvedAlign` | `Readonly<Ref<Align>>` | yes | Alignment the panel landed on. |
| `panelStyle` | `Readonly<Ref<Record<string, string>>>` | yes |  |
| `anchored` | `Readonly<Ref<boolean>>` | yes | True one frame after the opening placements landed, so only re-anchors transition. |
| `updatePosition` | `() => void` | yes |  |

## `getClippingBoundary`

```ts
function getClippingBoundary(trigger: globalThis.Element, viewport: Size): Rect
```

## `computePlacement`

```ts
function computePlacement(input: ComputePlacementInput): ComputePlacementResult
```

## `Align`

Alignment of the panel along the anchor edge; `start` and `end` follow the text direction on `top`/`bottom`.

```ts
type Align = 'start' | 'center' | 'end'
```

## `CollisionPadding`

Distance kept from the boundary edges: both axes, or one inset per axis.

```ts
type CollisionPadding = number | { x: number; y: number }
```

## `ComputePlacementInput`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `triggerRect` | `Rect` | yes | The anchor, in viewport pixels. |
| `panelSize` | `Size` | yes | The panel's natural (unconstrained) size, in viewport pixels. |
| `boundary` | `Rect` | yes | The area the panel must stay inside: the clipping ancestors intersected with the viewport. |
| `side` | `Side \| 'auto'` | yes | Preferred side, or `'auto'` for the first of `autoSides` that fits. |
| `align` | `Align` | no | Alignment along the anchor edge. Defaults to `'center'`. |
| `dir` | `Direction` | no | Text direction that resolves `start`/`end`. Defaults to `'ltr'`. |
| `autoSides` | `Side[]` | no | Candidates tried in order when `side === 'auto'`. |
| `flip` | `boolean` | yes | Flip an explicit side to the opposite one when it does not fit. |
| `sideOffset` | `number` | yes | Gap between trigger and panel along the main axis. |
| `collisionPadding` | `CollisionPadding` | yes | Minimum distance kept from the boundary edges, together or per axis. |
| `alignOffset` | `number` | no | Shift along the alignment axis, in px, away from the aligned edge (towards the inline end for `center`). |
| `matchTriggerWidth` | `boolean` | no | Vertical sides only: the panel spans exactly the trigger, so it is never shifted or capped across. |

## `ComputePlacementResult`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `side` | `Side` | yes | Resolved side after flipping, in the logical vocabulary. |
| `align` | `Align` | yes | Resolved alignment, in the logical vocabulary. |
| `physicalSide` | `PhysicalSide` | yes | The screen side the panel landed on. |
| `origin` | `string` | yes | CSS transform origin facing the anchor. |
| `top` | `number` | yes |  |
| `left` | `number` | yes |  |
| `width` | `number` | yes | Final panel size after shrinking; equals the natural size when nothing was capped. |
| `height` | `number` | yes |  |
| `maxWidth` | `number \| null` | yes | Cap to apply on the panel, or `null` when the natural size fits. |
| `maxHeight` | `number \| null` | yes |  |

## `PhysicalSide`

A screen side, after `start`/`end` resolved against the text direction.

```ts
type PhysicalSide = 'top' | 'right' | 'bottom' | 'left'
```

## `Rect`

Viewport-space rectangle (the shape `getBoundingClientRect()` returns).

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `top` | `number` | yes |  |
| `left` | `number` | yes |  |
| `right` | `number` | yes |  |
| `bottom` | `number` | yes |  |
| `width` | `number` | yes |  |
| `height` | `number` | yes |  |

## `Side`

Side of the anchor the panel opens on; `start` and `end` follow the text direction.

```ts
type Side = 'top' | 'bottom' | 'start' | 'end'
```

## `Size`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `width` | `number` | yes |  |
| `height` | `number` | yes |  |
