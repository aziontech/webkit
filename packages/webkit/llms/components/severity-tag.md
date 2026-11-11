# Severity Tag

> SeverityTag labels an item with its place on an ordered severity scale: critical, high, medium, low or info. The level reads from a four-bar glyph, where the filled bars count the level, and from the label, so two levels never depend on colour alone to differ. It differs from `tag`, whose `severity` prop is a colour tone (success, warning, danger) with no order between values.

- Import: `import SeverityTag from '@aziontech/webkit/severity-tag'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [severity-tag.json](https://github.com/aziontech/webkit/blob/main/.specs/severity-tag.json)

## When to use

- Show how severe an alert, finding, detection, incident or vulnerability is, in a table cell, a list row or a detail header.
- Rank items on a fixed five-step scale where critical and high must stay visibly distinct.

## Do

- Keep the default label (the level name from the locale catalog, translated under `WebkitProvider`) so the text always names the level; override `label` only when the product glossary names the level differently.
- Use one SeverityTag per row, in its own column, so the glyphs line up and the scale reads down the column.
- Do not pair the tag with a toned `tag` for the same level; the glyph and the ramp already carry it.

## Don’t

- The value is an outcome or a status with no order (allowed, blocked, healthy) → use `tag`.
- The value is a count or a one-word indicator on an icon or avatar → use `badge`.
- The user can select or remove the value (a severity filter) → use `chip`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tag](tag.md) — a toned status or category label; use it for outcomes and states, not for an ordered level.
- [badge](badge.md) — a dense count or short-label indicator.
- [chip](chip.md) — an interactive or removable token, for severity filters.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `severity` | `'critical' \| 'high' \| 'medium' \| 'low' \| 'info'` | `'info'` | false | Severity level; sets how many glyph bars fill, their colour and the default label. |
| `label` | `string` | `''` | false | Text of the tag. Empty uses the locale catalog (`Critical`, `High`, `Medium`, `Low`, `Info`). |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Size token; `medium` is 24px tall, `small` is 20px. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Replaces the label text. |

## States

- Visual states: `default` (static, non-interactive)
- `data-severity` mirrors the `severity` prop: `critical` | `high` | `medium` | `low` | `info`
- `data-size` mirrors the `size` prop: `small` | `medium`
- Filled bars per level: critical 4, high 3, medium 2, low 1, info 0

## Accessibility

- Visible focus: not focusable; the tag is static text and takes no `tabindex`.
- Keyboard map: none; the tag has no interaction.
- ARIA: the glyph is `aria-hidden="true"`; the visible text names the level, so the tag needs no `role` or `aria-label`.
- Contrast ≥4.5:1 for the label (`var(--text-default)` on `var(--bg-canvas)`) and ≥3:1 for every filled bar on `var(--bg-canvas)` in both themes.
- No motion, so no `motion-reduce:*` fallback is needed.
- Touch target: not applicable; the tag is not interactive.

## Examples

### Default

```vue
<script setup>
  import SeverityTag from '@aziontech/webkit/severity-tag'
</script>

<template>
  <SeverityTag
    severity="info"
    size="medium"
  />
</template>
```

### Levels

```vue
<script setup>
  import SeverityTag from '@aziontech/webkit/severity-tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <SeverityTag severity="critical" />
    <SeverityTag severity="high" />
    <SeverityTag severity="medium" />
    <SeverityTag severity="low" />
    <SeverityTag severity="info" />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import SeverityTag from '@aziontech/webkit/severity-tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <SeverityTag
      severity="high"
      size="small"
    />
    <SeverityTag
      severity="high"
      size="medium"
    />
  </div>
</template>
```
