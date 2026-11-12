# Breadcrumb

> Shows the page hierarchy so users can navigate back to parent views. Composes `BreadcrumbList`, `BreadcrumbItem`, and `BreadcrumbSeparator` (chevron). Accepts an `items` array for the common case or slot composition for custom layouts. Reference: PrimeNG Breadcrumb (adapted to Webkit tokens).

- Import: `import Breadcrumb from '@aziontech/webkit/breadcrumb'`
- Category: navigation · Surface: product · Structure: composition
- API as JSON: [breadcrumb.json](https://github.com/aziontech/webkit/blob/main/.specs/breadcrumb.json)

## When to use

- A page sits two or more levels deep and the reader needs a way back to its parents (resource detail under a list, a settings sub-page).
- The trail is known as data — pass `items` and let the component render the segments, separators and the collapse below `md`.
- The trail needs a custom layout the `items` array cannot express — compose `Breadcrumb.List`, `Breadcrumb.Item` and `Breadcrumb.Separator` in the default slot.

## Do

- Prefer `items`; only `items` mode collapses the middle segments into an overflow menu below `md`. The default slot renders only when `items` is empty, and a hand-composed trail never collapses.
- Let the last entry be the current page — it is treated as current unless its `current` is set to `false`; give every ancestor an `href`.
- Handle routing in `@navigate`, which receives `(event, href)` for ancestor segments; call `event.preventDefault()` when a client-side router takes over.
- In slot mode, wrap each `Breadcrumb.Item` in an `li`: `Breadcrumb.List` is an `ol` and the item renders an `a` / `span`, while `Breadcrumb.Separator` is already an `li`.

## Don’t

- It is the app's primary navigation → use `navigation-menu` or `sidebar` with `menu`.
- It moves between sibling views of the same page → use `tabs`.
- It is the previous / next pair at the end of a docs page → use `doc-pagination`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [breadcrumb-item](breadcrumb-item.md) — the single segment this component renders; use it alone only inside a hand-composed trail.
- [navigation-menu](navigation-menu.md) — top-level navigation with dropdown panels, not a location trail.
- [link](link.md) — a standalone link; a breadcrumb segment is a link with the trail's muted / current styling.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `BreadcrumbItemData[]` | `() => []` | false | Ordered path segments; the last entry is treated as the current page when `current` is omitted on that entry. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `navigate` | `(event: MouseEvent, href: string)` | Fires when an ancestor segment is activated. `event` is the activation event; `href` is the segment's destination. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Custom composition (`BreadcrumbList` + items + separators). Used when `items` is empty. |

## Sub-component imports

- `@aziontech/webkit/breadcrumb-item`

## Sub-components

- `breadcrumb.vue` — Root `<nav>` with `aria-label="Breadcrumb"`.
- `breadcrumb-list.vue` — Ordered list wrapper (`<ol>`) for segments.
- `breadcrumb-item.vue` — Re-exported segment control (same API as `@aziontech/webkit/breadcrumb-item`).
- `breadcrumb-separator.vue` — Decorative chevron between segments (`aria-hidden`).

## States

- Visual states: inherited from `BreadcrumbItem` (default, hover, focus-visible, disabled)
- Last segment in `items` is current when its `current` is not explicitly `false`

#### Responsive contract

- The trail is always a **single row**. A segment wider than the space available shrinks and ellipsizes its label; a trail that still does not fit scrolls horizontally. It never wraps to a second line and never extends past its container.
- **`items` mode** additionally collapses below `md` (768px): first segment, an overflow menu holding the middle segments, then the current segment. The breakpoint is owned by the component's own `use-breadcrumb-collapse` composable.
- **Slot (hand-composed) mode** keeps every segment it was given, since the root cannot know which of the consumer's children are middle segments, so on a narrow screen it degrades through the single-row rules above rather than through a collapse.
- Server render and hydration: the collapse reads the viewport only after mount (`use-breadcrumb-collapse` gates the media query on `useMounted`), so the server HTML and the first client render are the full trail and match; below `md` the collapse applies in the same tick as mount, before paint.

## Accessibility

- Visible focus: on each interactive `BreadcrumbItem` segment.
- Keyboard map: `Tab` moves between ancestor links; current page is not in tab order when rendered as `span`.
- ARIA: root `nav` with `aria-label="Breadcrumb"`; list uses `<ol>` / `<li>`; separators are `aria-hidden`.
- Contrast ≥4.5:1 for labels and chevron.
- `motion-reduce:transition-none` on segment color transitions.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the separator chevron and any directional item `icon` mirror (`rtl:-scale-x-100`), so the trail reads from the start edge.
- Keyboard: no horizontal arrow-key logic.
- User data: item labels are text; page names in another script keep their own direction.

## Examples

### Default

```vue
<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb'

  const items = [
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Current Page', current: true }
  ]
</script>

<template>
  <Breadcrumb
    :items="items"
    class="max-w-[42.5rem]"
  />
</template>
```

### Depths

```vue
<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb'

  const single = [{ label: 'Page Name', current: true }]
  const two = [
    { label: 'Page Name', href: '#' },
    { label: 'Current Page', current: true }
  ]
  const full = [
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Current Page', current: true }
  ]
</script>

<template>
  <div class="flex flex-col gap-4 max-w-[42.5rem]">
    <Breadcrumb :items="single" />
    <Breadcrumb :items="two" />
    <Breadcrumb :items="full" />
  </div>
</template>
```

### LongLabel

```vue
<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb'

  const items = [
    { label: 'Page Name', href: '#' },
    { label: 'production-edge-application-with-a-very-long-configuration-name', current: true }
  ]
</script>

<template>
  <Breadcrumb :items="items" />
</template>
```
