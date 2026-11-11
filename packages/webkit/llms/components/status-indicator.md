# Status Indicator

> Communicates status, alerts, or progress to the user. Lives at `packages/webkit/src/components/feedback/status-indicator/`.

- Import: `import StatusIndicator from '@aziontech/webkit/status-indicator'`
- Category: feedback · Surface: product · Structure: monolithic
- API as JSON: [status-indicator.json](https://github.com/aziontech/webkit/blob/main/.specs/status-indicator.json)

## When to use

- The state of a resource in a table cell, a list row or a detail header: Active, Failed, Paused.
- A transitional state such as Deploying or Propagating, with `loading`.

## Do

- Always pass `label`. The default is the literal `'Status'`, and the color alone does not carry the meaning.
- Map `severity` to meaning and keep it consistent across the app: `success`, `info`, `warning` and `danger` follow their tokens, `neutral` is muted, and `alt` uses the primary color.
- With `loading`, pass the bare verb (`"Deploying"`). The component appends the ellipsis character (`…`, not three periods) and swaps the dot for a spinner.
- It is a non-interactive `role="status"` element with no click or keyboard behavior. Don't attach handlers to it.

## Don’t

- A count or a very short label attached to another element → use `badge`.
- A category or status chip with an optional icon → use `tag`.
- A page or section notice with copy and actions → use `message`.
- Measurable progress → use `progress`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [badge](badge.md) — filled count indicator, usually overlaid on an icon or avatar.
- [tag](tag.md) — labelled chip for categories and statuses.
- [spinner](spinner.md) — replaces the dot while `loading` is true.
- [progress](progress.md) — continuous progress instead of a discrete state.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `severity` | `'success' \| 'info' \| 'neutral' \| 'warning' \| 'alt' \| 'danger'` | `'success'` | false | Severity token driving the status dot color. |
| `loading` | `boolean` | `false` | false | Shows loading state and disables activation. |
| `label` | `string` | `''` | false | Visible label text. Empty uses the locale catalog (`Status`). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.
- Forced colors: the dot opts out of forced colour adjustment and paints `CanvasText`, so it stays visible when backgrounds are forced to `Canvas`; the severity is still carried by the label text, never by the dot's colour alone. Tests: `src/test/forced-colors.test.ts`.

## Examples

### Default

```vue
<script setup>
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <StatusIndicator
    severity="success"
    label="Status"
  />
</template>
```

### Status

```vue
<script setup>
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-3)">
    <StatusIndicator
      severity="success"
      label="Status"
    />
    <StatusIndicator
      severity="info"
      label="Status"
    />
    <StatusIndicator
      severity="neutral"
      label="Status"
    />
    <StatusIndicator
      severity="warning"
      label="Status"
    />
    <StatusIndicator
      severity="alt"
      label="Status"
    />
    <StatusIndicator
      severity="danger"
      label="Status"
    />
  </div>
</template>
```

### Loading

```vue
<script setup>
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <StatusIndicator
    severity="success"
    label="Status"
    loading
  />
</template>
```
