# Tag

> Compact status or category label with severity-based color coding. Supports optional icon, pill shape via `rounded`, and two sizes aligned with the Webkit Figma Tag component set.

- Import: `import Tag from '@aziontech/webkit/tag'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [tag.json](https://github.com/aziontech/webkit/blob/main/.specs/tag.json)

## When to use

- Label or categorize an item with a short descriptive text, optionally with a leading icon or pill shape.
- Show a status/category with severity color via `kind`.

## Do

- Severity comes from `kind`; the optional icon is decorative — keep it `aria-hidden`.
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
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warning' \| 'danger' \| 'accent' \| 'contrast'` | `'primary'` | false | Color style for the tag surface and label; `contrast` uses `var(--bg-contrast)` / `var(--text-contrast)`. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Size token; `medium` is 24px tall, `small` is 20px. |
| `rounded` | `boolean` | `false` | false | Pill shape when true. |
| `icon` | `string` | `undefined` | false | PrimeIcons class for the leading icon. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Main content. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
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
    severity="primary"
    size="medium"
  />
</template>
```

### Types

```vue
<script setup>
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Tag
      label="Label"
      severity="primary"
    />
    <Tag
      label="Label"
      severity="secondary"
    />
    <Tag
      label="Label"
      severity="accent"
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
      severity="contrast"
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
        severity="primary"
        size="medium"
      />
      <Tag
        label="Label"
        severity="primary"
        size="medium"
        rounded
      />
      <Tag
        label="Label"
        severity="primary"
        size="medium"
        icon="pi pi-box"
      />
      <Tag
        label="Label"
        severity="primary"
        size="medium"
        icon="pi pi-box"
        rounded
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Tag
        label="Label"
        severity="primary"
        size="small"
      />
      <Tag
        label="Label"
        severity="primary"
        size="small"
        rounded
      />
      <Tag
        label="Label"
        severity="primary"
        size="small"
        icon="pi pi-box"
      />
      <Tag
        label="Label"
        severity="primary"
        size="small"
        icon="pi pi-box"
        rounded
      />
    </div>
  </div>
</template>
```
