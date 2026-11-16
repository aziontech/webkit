# Tag

> Use Tag for a read-only category or outcome word on an item (Production, Beta, Allowed) that is not a lifecycle state. The state of a resource is a StatusIndicator, a number is a Badge, a removable or selectable token is a Chip, and a level on the critical → info scale is a SeverityTag. A compact, read-only word on an item, colored by its brand look `variant` or its status colour `severity` so the category or outcome reads at a glance (Production in `variant="primary"`, Blocked in `severity="danger"`). It takes an optional leading icon, a pill shape with `rounded`, and two sizes; it is never interactive and never counts.

- Import: `import Tag from '@aziontech/webkit/tag'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [tag.json](tag.json)

## When to use

- Label or categorize an item with a short descriptive text, optionally with a leading icon or pill shape.
- Show a status with its colour via `severity` (`neutral`, `info`, `success`, `warning`, `danger`), or a category with a brand look via `variant` (`primary`, `accent`, `contrast`, `highlight`); `severity` wins when both are set.
- Mark the one value a list highlights (the Owner role in a users table) with `variant="highlight"`: the brand orange as a tint, orange text on `--primary-mask`, like the success, info and warning tints.

## Do

- Colour comes from `variant` or `severity`; the optional icon is decorative — keep it `aria-hidden`.
- Pick the severity by meaning: `success` Active, `warning` Pending, `neutral` Inactive or a neutral category (Developer, Viewer), `info` a second role (Admin), `variant="highlight"` the one value to single out (Owner), `primary` a solid brand label. Do not use `danger` for a state that is only off (Inactive): it reads as an error.
- Do not restyle a Tag with colour classes to get a tint; every tint is a `variant` or a `severity`.
- Use `rounded` for the pill shape rather than a custom radius.

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
| `variant` | `'primary' \| 'accent' \| 'contrast' \| 'highlight'` | `'primary'` | false | Brand look of the tag surface and label, used when `severity` is not set: `primary` (solid brand orange), `accent`, `highlight` (the brand orange as a tint) and `contrast` (`var(--bg-contrast)` / `var(--text-contrast)`). |
| `severity` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `—` | false | Status colour of the tag surface and label, the shared `Severity` scale exported from this component; wins over `variant` when set. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Size token; `medium` is 24px tall, `small` is 20px. |
| `rounded` | `boolean` | `false` | false | Pill shape when true. |
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
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional `icon` is the consumer's choice and does not mirror.
- Keyboard: no horizontal arrow-key logic.
- Isolation: the label renders `dir="auto"`, so a value in another script (a domain, an ID) keeps its own direction inside right-to-left UI.

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
      label="Label"
      severity="neutral"
    />
    <Tag
      label="Label"
      variant="primary"
    />
    <Tag
      label="Label"
      variant="accent"
    />
    <Tag
      label="Label"
      severity="success"
    />
    <Tag
      label="Label"
      severity="warning"
    />
    <Tag
      label="Label"
      severity="danger"
    />
    <Tag
      label="Label"
      severity="info"
    />
    <Tag
      label="Label"
      variant="contrast"
    />
    <Tag
      label="Label"
      variant="highlight"
    />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <Tag
        label="Label"
        variant="primary"
        size="medium"
      />
      <Tag
        label="Label"
        variant="primary"
        size="medium"
        rounded
      />
      <Tag
        label="Label"
        variant="primary"
        size="medium"
        icon="ai ai-box"
      />
      <Tag
        label="Label"
        variant="primary"
        size="medium"
        icon="ai ai-box"
        rounded
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Tag
        label="Label"
        variant="primary"
        size="small"
      />
      <Tag
        label="Label"
        variant="primary"
        size="small"
        rounded
      />
      <Tag
        label="Label"
        variant="primary"
        size="small"
        icon="ai ai-box"
      />
      <Tag
        label="Label"
        variant="primary"
        size="small"
        icon="ai ai-box"
        rounded
      />
    </div>
  </div>
</template>
```
