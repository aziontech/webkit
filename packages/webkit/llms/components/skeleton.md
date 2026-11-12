# Skeleton

> A loading placeholder that reserves the space of content while it loads, gently pulsing to signal activity. Use it in place of text lines, media, or avatars during fetches; unlike `status-indicator` (which communicates a settled state) the skeleton is a transient, decorative stand-in. Two geometries cover the common cases: a rounded rectangular block (`shape`) and a `circle` (for avatars / icons).

- Import: `import Skeleton from '@aziontech/webkit/skeleton'`
- Category: feedback · Surface: product · Structure: monolithic
- API as JSON: [skeleton.json](https://github.com/aziontech/webkit/blob/main/.specs/skeleton.json)

## When to use

- Content is loading and its final layout is known: text lines, cards, media blocks.
- Avatar and icon placeholders, with `kind="circle"`.

## Do

- Size each skeleton like the content it stands in for (`width`, `height`) so nothing shifts when the data arrives.
- For `kind="circle"`, set `width` and `height` to the same value.
- The skeleton is `aria-hidden`. Mark the container you own with `aria-busy="true"` while it loads.
- Keep `animated` on (the default). The shimmer already turns off under reduced motion; use `:animated="false"` only for static captures.

## Don’t

- The duration is unknown and no layout is reserved → use `progress` with `indeterminate`, or `spinner`.
- Rows in a data-driven `table` → use the `table` `loading` prop, which renders aligned skeleton rows.
- Loading finished with no data → use `empty-state`.
- A settled state such as Active or Failed → use `status-indicator`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [progress](progress.md) — measured or indeterminate progress of a task, not a placeholder.
- [spinner](spinner.md) — compact busy glyph for buttons and inline status.
- [empty-state](empty-state.md) — what replaces the skeleton when the request returns nothing.
- [table](table.md) — its `loading` prop renders skeleton rows for you.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `'shape' \| 'circle'` | `'shape'` | false | Geometry: a rounded rectangular block (`shape`) or a circle. |
| `width` | `string` | `'100%'` | false | CSS width (any length). |
| `height` | `string` | `'1rem'` | false | CSS height (any length); for a circle, set equal to `width`. |
| `animated` | `boolean` | `true` | false | Shimmer while loading; suppressed under reduced motion. |

## States

- Visual states: `default` (a single decorative placeholder; no hover/focus/active — it is not interactive)
- `data-kind` mirrors the `kind` prop (`shape` | `circle`)
- `data-animated` is present when `animated` is true (drives the shimmer)

## Accessibility

- The skeleton is decorative: `aria-hidden="true"` so assistive tech skips it. The loading status is conveyed by the surrounding region (e.g. `aria-busy="true"` on the container the consumer owns), not by the placeholder itself.
- Not focusable, not interactive: no keyboard map, no focus ring.
- The shimmer is gated behind `motion-safe:` and `motion-reduce:animate-none` suppresses it for users who prefer reduced motion (static flat fill).

## Examples

### Default

```vue
<script setup>
  import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <Skeleton
    kind="shape"
    width="240px"
    height="100px"
    animated
  />
</template>
```

### Types

```vue
<script setup>
  import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Skeleton
      kind="shape"
      width="240px"
      height="100px"
    />
    <Skeleton
      kind="circle"
      width="100px"
      height="100px"
    />
  </div>
</template>
```

### OnSurfaces

```vue
<script setup>
  import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <div class="grid grid-cols-2 gap-(--spacing-md)">
    <div
      class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) bg-(--bg-canvas) p-(--spacing-md)"
    >
      <span class="text-label-sm text-(--text-muted)">--bg-canvas</span>
      <Skeleton
        kind="shape"
        width="100%"
        height="16px"
      />
      <Skeleton
        kind="shape"
        width="60%"
        height="16px"
      />
    </div>
    <div
      class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) bg-(--bg-surface) p-(--spacing-md)"
    >
      <span class="text-label-sm text-(--text-muted)">--bg-surface</span>
      <Skeleton
        kind="shape"
        width="100%"
        height="16px"
      />
      <Skeleton
        kind="shape"
        width="60%"
        height="16px"
      />
    </div>
    <div
      class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) bg-(--bg-surface-raised) p-(--spacing-md)"
    >
      <span class="text-label-sm text-(--text-muted)">--bg-surface-raised</span>
      <Skeleton
        kind="shape"
        width="100%"
        height="16px"
      />
      <Skeleton
        kind="shape"
        width="60%"
        height="16px"
      />
    </div>
    <div
      class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) bg-(--bg-surface-overlay) p-(--spacing-md)"
    >
      <span class="text-label-sm text-(--text-default)">--bg-surface-overlay</span>
      <Skeleton
        kind="shape"
        width="100%"
        height="16px"
      />
      <Skeleton
        kind="shape"
        width="60%"
        height="16px"
      />
    </div>
  </div>
</template>
```
