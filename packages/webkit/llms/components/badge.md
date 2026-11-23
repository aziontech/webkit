# Badge

> Use Badge only for a number attached to something else (unread count, 12, 99+). For the state of a resource use StatusIndicator, for a category or outcome word use Tag, for a removable or selectable token use Chip, and for the "+N" of a truncated list use OverflowCount. Badge is a compact, non-interactive count with severity-based color coding, commonly overlaid on icons, avatars or buttons, or set beside a heading. It differs from its sibling `tag`: `tag` carries words (optional leading icon, optional pill shape, masked surfaces), whereas `badge` carries a number on a fully filled surface with no icon affordance.

- Import: `import Badge from '@aziontech/webkit/badge'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [badge.json](badge.json)

## When to use

- A number attached to another element: a bell with its unread count, a section heading with how many items it holds.
- Color the count through `variant` (the brand look: `primary`, `secondary`) or `severity` (neutral / info / success / warning / danger) with a fully filled surface; `severity` wins when both are set.

## Do

- Keep the content to a number (`12`, `99+`); words belong in `tag` or `status-indicator`.
- Drive color from `variant` or `severity`, never a hardcoded color or a raw palette class.

## Don’t

- A status word (Active, Failed, Deploying) → use `status-indicator`.
- A category or outcome word (Production, Beta, Allowed) → use `tag`.
- The label is user-removable or selectable → use `chip`.
- The "+N" that opens the hidden items of a truncated list → use `overflow-count`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tag](tag.md) — labelled status/category chip with optional icon and pill shape; use when the label is descriptive, not a count.
- [chip](chip.md) — interactive/removable token; use when the user can select or dismiss it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Fallback text when the default slot is empty. |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | false | Brand look of the badge surface and label, used when `severity` is not set. |
| `severity` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `—` | false | Status colour of the badge surface and label; wins over `variant` when set. `neutral` uses the `var(--bg-surface)` / `var(--text-default)` surface. The values are the shared `Severity` scale (exported from this component). |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; `small` is 20px tall, `medium` is 24px, `large` is 30px. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Main content; falls back to `label` when empty. |

## States

Badge is non-interactive: it has no hover, focus, active, or disabled states and emits no events. Variants are exposed verbatim as `data-*` attributes on the root for Tailwind variant styling and for test/Code-Connect hooks:

- `data-severity` mirrors the `severity` prop when it is set (`neutral` | `info` | `success` | `warning` | `danger`).
- `data-variant` mirrors the `variant` prop when `severity` is not set (`primary` | `secondary`).
- `data-size` mirrors the `size` prop (`small` | `medium` | `large`).

## Accessibility

- Visible focus: not applicable — Badge is non-interactive (no focus, no keyboard, no tab stop).
- Keyboard map: none — Badge is not focusable and exposes no interactive affordance.
- ARIA: the root is a presentational `<span>`; consumers that use the badge as a live count should label the host control (e.g. `aria-label="3 unread"`) since the visual label alone is not announced as status.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): every severity pairs a surface token with its matching `-foreground` (or `--text-default` for `neutral`), which the theme guarantees in both light and dark.
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
    variant="primary"
    size="medium"
  />
</template>
```

### Severities

```vue
<script setup>
  import Badge from '@aziontech/webkit/badge'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Unread
      <Badge
        label="12"
        variant="primary"
      />
    </span>
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Drafts
      <Badge
        label="4"
        variant="secondary"
      />
    </span>
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Passed
      <Badge
        label="99"
        severity="success"
      />
    </span>
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Updates
      <Badge
        label="7"
        severity="info"
      />
    </span>
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Warnings
      <Badge
        label="3"
        severity="warning"
      />
    </span>
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Errors
      <Badge
        label="2"
        severity="danger"
      />
    </span>
    <span class="inline-flex items-center gap-2 text-body-sm text-(--text-default)">
      Archived
      <Badge
        label="18"
        severity="neutral"
      />
    </span>
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
