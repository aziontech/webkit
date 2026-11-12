# Breadcrumb Item

> Single segment in a breadcrumb trail. Ancestor segments use muted label text and optional leading icon; the current page uses default text. Hover and focus-visible states match the Webkit navigation pattern (ghost overlay + focus ring).

- Import: `import BreadcrumbItem from '@aziontech/webkit/breadcrumb-item'`
- Category: navigation · Surface: product · Structure: monolithic
- API as JSON: [breadcrumb-item.json](https://github.com/aziontech/webkit/blob/main/.specs/breadcrumb-item.json)

## When to use

- Composing a breadcrumb trail by hand inside `Breadcrumb.List`, one segment per ancestor plus the current page.
- A single ancestor or current-page segment that must match the breadcrumb's muted / current styling and focus ring.

## Do

- Set `current` on the last segment only; it renders a `span` with `aria-current="page"`, drops out of the tab order and ignores `href`.
- Always pass a real `href` on ancestors — it defaults to `'#'`, and the segment renders an `a`.
- Use `show-icon` together with `icon` (a PrimeIcons class, default `pi pi-box`); `icon` alone renders nothing.
- disabled` suppresses the `click` emit and removes the segment from the tab order; prefer omitting an unreachable ancestor over disabling it.

## Don’t

- The whole trail is known as data → use `breadcrumb` with `items`, which renders the segments for you.
- It is a standalone text link in content or a page footer → use `link`.
- It is a navigation row in an app menu → use `menu`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [breadcrumb](breadcrumb.md) — the trail root; renders `breadcrumb-item` for each entry of `items` and re-exports it as `Breadcrumb.Item`.
- [link](link.md) — a general-purpose link without the segment's ghost hover and current-page treatment.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `'Page Name'` | false | Visible segment label. |
| `href` | `string` | `'#'` | false | Destination when the segment is a link (ignored when `current` is true). |
| `current` | `boolean` | `false` | false | Marks the current page (last segment); renders as span with `aria-current="page"`. |
| `showIcon` | `boolean` | `false` | false | When true, renders a leading PrimeIcons icon before the label. |
| `icon` | `string` | `'pi pi-box'` | false | PrimeIcons class for the leading icon when `showIcon` is true. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `click` | `(event: MouseEvent, item: { label: string; href: string })` | Fires when the segment's link is activated (the `current` segment renders a non-interactive `span`). `item` carries the segment's `label` and `href`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`
- `data-current` mirrors the `current` prop
- `data-disabled` mirrors the `disabled` prop

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses link segments; `Enter` activates.
- ARIA: current segment uses `aria-current="page"`; disabled segments use `aria-disabled="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on color transitions.
- Touch target ≥40×40 px on interactive segments (padding + min height).

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional glyph passed to `icon` (chevrons, angles, arrows, carets, `sign-in`/`sign-out`, `reply`, `undo`: the list in `utils/directional-icons.ts`) gets `rtl:-scale-x-100`; external-link arrows, media and brand glyphs do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import BreadcrumbItem from '@aziontech/webkit/breadcrumb-item'
</script>

<template>
  <BreadcrumbItem
    label="Page Name"
    href="#"
  />
</template>
```

### Current

```vue
<script setup>
  import BreadcrumbItem from '@aziontech/webkit/breadcrumb-item'
</script>

<template>
  <BreadcrumbItem
    label="Current Page"
    current
  />
</template>
```

### WithIcon

```vue
<script setup>
  import BreadcrumbItem from '@aziontech/webkit/breadcrumb-item'
</script>

<template>
  <BreadcrumbItem
    label="Page Name"
    href="#"
    show-icon
    icon="pi pi-box"
  />
</template>
```
