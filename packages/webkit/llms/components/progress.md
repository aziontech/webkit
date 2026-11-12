# Progress

> Communicates the progress of an ongoing task as a horizontal bar. Use it for a determinate value within a range (`value` / `max`) or, when progress can't be measured, as an indeterminate loading indicator. Unlike `skeleton` (placeholder geometry) or `status-indicator` (discrete state), it expresses a continuous quantity.

- Import: `import Progress from '@aziontech/webkit/progress'`
- Category: feedback · Surface: product · Structure: monolithic
- API as JSON: [progress.json](https://github.com/aziontech/webkit/blob/main/.specs/progress.json)

## When to use

- A task with measurable progress: an upload, a build, a multi-step import.
- A bar-shaped busy indicator at the top of a region when progress can't be measured (`indeterminate`).

## Do

- Pass `value` on the scale of `max`, for example `:value="3" :max="5"` for steps. Don't convert it to a percentage yourself.
- Switch to `indeterminate` when progress is unknown. `value` is then ignored and `aria-valuenow` is dropped.
- There is no label prop. Give the bar an accessible name with an `aria-label` or `aria-labelledby` attribute, and show the percentage in text next to it if users need the number.
- The default is the thin `small` bar with `flat` corners. Use `shape="rounded"` and a larger `size` only when the bar stands alone.

## Don’t

- A placeholder for content that is still loading → use `skeleton`.
- A busy state inside a button or another compact control → use `spinner` (or the control's own `loading` prop).
- A discrete state with no quantity, such as Active or Failed → use `status-indicator`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [skeleton](skeleton.md) — reserves the layout of loading content instead of showing task progress.
- [spinner](spinner.md) — compact, always-indeterminate busy glyph.
- [status-indicator](status-indicator.md) — labelled dot for a settled or transitional state.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `number` | `0` | false | Current progress, relative to `max`. |
| `max` | `number` | `100` | false | Upper bound; percentage = `value / max * 100`. |
| `shape` | `'rounded' \| 'flat'` | `'flat'` | false | Track and fill corner-radius variant. |
| `size` | `'small' \| 'medium' \| 'large'` | `'small'` | false | Bar height token. |
| `indeterminate` | `boolean` | `false` | false | Loading state; animates a sliding segment and ignores `value`. |

## States

- Visual states: `default`, `indeterminate`
- `data-shape` mirrors the `shape` prop: `rounded` | `flat`
- `data-size` mirrors the `size` prop: `small` | `medium` | `large`
- `data-indeterminate` is present while `indeterminate` is `true`

## Accessibility

- Non-interactive: the bar is not focusable and takes no keyboard input.
- Name: the bar takes `aria-label` or `aria-labelledby` from the consumer; with neither it is named by the locale catalog (`progress.label`, "Progress"), so a bare bar never fails `aria-progressbar-name`.
- ARIA: root uses `role="progressbar"`. Determinate sets `aria-valuemin="0"`, `aria-valuemax="<max>"`, `aria-valuenow="<value>"`; indeterminate omits `aria-valuenow` and sets `aria-busy="true"`.
- Contrast ≥3:1 between the fill (`var(--primary)`) and the track (`var(--bg-placeholder)`). The track is an alpha overlay, not an opaque surface, so it keeps that contrast on any background the bar is placed over (canvas, surface, raised, overlay).
- `motion-reduce:transition-none` on the determinate width morph and `motion-reduce:animate-none` on the indeterminate animation (it falls back to a static fill under reduced motion).

## Examples

### Default

```vue
<script setup>
  import Progress from '@aziontech/webkit/progress'
</script>

<template>
  <Progress :value="60" />
</template>
```

### Shapes

```vue
<script setup>
  import Progress from '@aziontech/webkit/progress'
</script>

<template>
  <div class="flex w-[320px] flex-col gap-4">
    <Progress
      :value="60"
      shape="rounded"
    />
    <Progress
      :value="60"
      shape="flat"
    />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import Progress from '@aziontech/webkit/progress'
</script>

<template>
  <div class="flex w-[320px] flex-col gap-4">
    <Progress
      :value="60"
      size="small"
    />
    <Progress
      :value="60"
      size="medium"
    />
    <Progress
      :value="60"
      size="large"
    />
  </div>
</template>
```
