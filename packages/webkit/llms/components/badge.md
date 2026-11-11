# Badge

> Badge is a compact, non-interactive indicator that surfaces a numeric count or a very short status label with severity-based color coding. Use it to draw attention to a small piece of state — an unread count, a quantity, a short status word — and it is commonly overlaid on icons, avatars, or buttons. It differs from its sibling `tag`: `tag` is a labelled status/category chip (optional leading icon, optional pill shape, masked surfaces), whereas `badge` is a denser count/short-label indicator with fully filled severity surfaces and no icon affordance.

- Import: `import Badge from '@aziontech/webkit/badge'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [badge.json](https://github.com/aziontech/webkit/blob/main/.specs/badge.json)

## When to use

- Surface a numeric count or a very short status label attached to another element (a bell with unread count, a status dot with a label).
- Convey severity through `kind` (neutral / success / danger / …) with a fully filled surface.

## Do

- Keep the content to a count or a 1–2 word label; longer text belongs in `tag`.
- Drive color from `kind`, never a hardcoded color or a raw palette class.

## Don’t

- The label is user-removable or selectable → use `chip`.
- It is a labelled category/status with an optional leading icon or pill shape → use `tag`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tag](tag.md) — labelled status/category chip with optional icon and pill shape; use when the label is descriptive, not a count.
- [chip](chip.md) — interactive/removable token; use when the user can select or dismiss it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Fallback text when the default slot is empty. |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'default'` | `'primary'` | false | Color style for the badge surface and label; `default` uses the neutral `var(--bg-surface)` / `var(--text-default)` surface. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; `small` is 20px tall, `medium` is 24px, `large` is 30px. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Main content; falls back to `label` when empty. |

## States

Badge is non-interactive: it has no hover, focus, active, or disabled states and emits no events. Variants are exposed verbatim as `data-*` attributes on the root for Tailwind variant styling and for test/Code-Connect hooks:

- `data-severity` mirrors the `severity` prop (`primary` | `secondary` | `success` | `warning` | `danger` | `default`).
- `data-size` mirrors the `size` prop (`small` | `medium` | `large`).

## Accessibility

- Visible focus: not applicable — Badge is non-interactive (no focus, no keyboard, no tab stop).
- Keyboard map: none — Badge is not focusable and exposes no interactive affordance.
- ARIA: the root is a presentational `<span>`; consumers that use the badge as a live count should label the host control (e.g. `aria-label="3 unread"`) since the visual label alone is not announced as status.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): every severity pairs a surface token with its matching `-contrast` (or `--text-default` for `default`), which the theme guarantees in both light and dark.
- `motion-reduce:*`: not applicable — Badge is static (no motion).
- Touch target: not applicable — Badge is non-interactive.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: no horizontal arrow-key logic.
- Isolation: the label renders `dir="auto"`, so a count or value in another script keeps its own direction.

## Examples

### Default

```vue
<script setup>
  import Badge from '@aziontech/webkit/badge'
</script>

<template>
  <Badge
    label="99"
    severity="primary"
    size="medium"
  />
</template>
```

### Types

```vue
<script setup>
  import Badge from '@aziontech/webkit/badge'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Badge
      label="99"
      severity="primary"
    />
    <Badge
      label="99"
      severity="secondary"
    />
    <Badge
      label="99"
      severity="success"
    />
    <Badge
      label="99"
      severity="warning"
    />
    <Badge
      label="99"
      severity="danger"
    />
    <Badge
      label="99"
      severity="default"
    />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import Badge from '@aziontech/webkit/badge'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Badge
      label="99"
      size="small"
    />
    <Badge
      label="99"
      size="medium"
    />
    <Badge
      label="99"
      size="large"
    />
  </div>
</template>
```
