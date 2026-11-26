# Tag

> Use Tag for a read-only category or outcome word on an item (Production, Beta, Allowed) that is not a lifecycle state. The state of a resource is a StatusIndicator, a number is a Badge, a removable or selectable token is a Chip, and a level on the critical → info scale is a SeverityTag. A compact, read-only word on an item, colored by its brand look `variant` or its status colour `severity` so the category or outcome reads at a glance (Production in `variant="primary"`, Blocked in `severity="danger"`). It takes an optional leading icon and two sizes, and has one shape; it is never interactive and never counts.

- Import: `import Tag from '@aziontech/webkit/tag'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [tag.json](tag.json)

## When to use

- Label or categorize an item with a short descriptive text, optionally with a leading icon.
- Pick the colour from one of two sets, never both on one tag: `severity` when the word is an outcome or a status (`neutral`, `info`, `success`, `warning`, `danger`), `variant` when it is a category that needs emphasis (`primary`, `accent`, `contrast`). `severity` wins when both are set.
- The logo orange (`variant="primary"`) marks **one** value per list or card. When several values need emphasis, use `severity` or `accent`.

## Do

- Colour comes from `variant` or `severity`; the optional icon is decorative — keep it `aria-hidden`.
- Pick the colour by meaning with the table in When to use. Do not use `danger` for a state that is only off (Inactive): it reads as an error.
- Do not restyle a Tag with colour classes to get a tint; every tint is a `variant` or a `severity`.
- Do not round a Tag into a pill with a class: every Tag has the one control shape, so tags in a row line up.

## Don’t

- It is purely a count or one-glance status label → use `badge`.
- The user can select or remove it (filters, multi-select values) → use `chip`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [badge](badge.md) — denser count/short-label indicator with no icon affordance.
- [chip](chip.md) — interactive/removable token.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Fallback text when the default slot is empty. |
| `variant` | `'primary' \| 'accent' \| 'contrast'` | `'primary'` | false | Emphasis look of the tag surface and label, used when `severity` is not set: `primary` (the logo orange, one value per list), `accent` and `contrast` (`var(--bg-contrast)` / `var(--text-contrast)`). |
| `severity` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `—` | false | Status colour of the tag surface and label, the shared `Severity` scale exported from this component; wins over `variant` when set. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Size token; `medium` is 24px tall, `small` is 20px. |
| `icon` | `string` | `''` | false | Azion icon class for the leading icon. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Main content. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## States

- Visual states: `default`. A tag is static text: it takes no focus and has no hover or active state.
- `data-severity` mirrors `severity` when it is set; otherwise `data-variant` mirrors `variant`.

## Accessibility

- Visible focus: none; the tag is not focusable. A focusable control that holds a tag draws its own ring.
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state; the `primary` label is `--primary-foreground` on the logo orange fill (6.7:1).
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional `icon` is the consumer's choice and does not mirror.
- Keyboard: no horizontal arrow-key logic.
- Isolation: the label renders `dir="auto"`, so a value in another script (a domain, an ID) keeps its own direction inside right-to-left UI; a label with no letter (a count, `+10.5%`, `#1024`) renders `dir="ltr"`, so its sign and unit stay in order in every engine.

## Examples

### Default

```vue
<script setup>
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <Tag
    label="Label"
    variant="primary"
    size="medium"
  />
</template>
```

### Severities

```vue
<script setup>
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Tag
      label="Inactive"
      severity="neutral"
    />
    <Tag
      label="Admin"
      severity="info"
    />
    <Tag
      label="Active"
      severity="success"
    />
    <Tag
      label="Pending"
      severity="warning"
    />
    <Tag
      label="Blocked"
      severity="danger"
    />
  </div>
</template>
```

### Variants

```vue
<script setup>
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Tag
      label="Owner"
      variant="primary"
    />
    <Tag
      label="Organization"
      variant="accent"
    />
    <Tag
      label="Beta"
      variant="contrast"
    />
  </div>
</template>
```
