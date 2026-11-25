# Progress

> Use Progress when the work has a measurable amount (value/max), or for a long task with no layout to reserve (indeterminate). A region with a known shape loads with Skeleton, an inline busy mark is a Spinner, and a background file transfer is an UploadProgress. Communicates the progress of an ongoing task as a horizontal bar. Use it for a determinate value within a range (`value` / `max`) or, when progress can't be measured, as an indeterminate loading indicator. Unlike `skeleton` (placeholder geometry) or `status-indicator` (discrete state), it expresses a continuous quantity.

- Import: `import Progress from '@aziontech/webkit/progress'`
- Category: feedback · Surface: app · Structure: monolithic
- API as JSON: [progress.json](progress.json)

## When to use

- A task with measurable progress: an upload, a build, a multi-step import.
- A bar-shaped busy indicator at the top of a region when progress can't be measured (`indeterminate`).

## Do

- Pass `value` on the scale of `max`, for example `:value="3" :max="5"` for steps. Don't convert it to a percentage yourself.
- Switch to `indeterminate` when progress is unknown. `value` is then ignored and `aria-valuenow` is dropped.
- There is no label prop. Give the bar an accessible name with an `aria-label` or `aria-labelledby` attribute, and show the percentage in text next to it if users need the number.
- The default is the `medium` bar with `flat` corners. Set `size="small"` for a thin inline strip (table rows, upload rows, the top of a region); use `variant="rounded"` and a larger `size` only when the bar stands alone.

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
| `variant` | ``ProgressVariant` (`'rounded' \| 'flat'`)` | `'flat'` | false | Track and fill corner-radius variant. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Bar height token. |
| `indeterminate` | `boolean` | `false` | false | Loading state; animates a sliding segment and ignores `value`. |

## States

- Visual states: `default`, `indeterminate`
- `data-variant` mirrors `variant`: `rounded` | `flat`.
- `data-size` mirrors the `size` prop: `small` | `medium` | `large`
- `data-indeterminate` is present while `indeterminate` is `true`

## Accessibility

- Non-interactive: the bar is not focusable and takes no keyboard input.
- Name: the bar takes `aria-label` or `aria-labelledby` from the consumer; with neither it is named by the locale catalog (`progress.label`, "Progress"), so a bare bar never fails `aria-progressbar-name`.
- ARIA: root uses `role="progressbar"`. Determinate sets `aria-valuemin="0"`, `aria-valuemax="<max>"`, `aria-valuenow="<value>"`; indeterminate omits `aria-valuenow` and sets `aria-busy="true"`.
- Contrast ≥3:1 between the fill (`var(--primary)`) and the track (`var(--bg-placeholder)`). The track is an alpha overlay, not an opaque surface, so it keeps that contrast on any background the bar is placed over (canvas, surface, raised, overlay).
- `motion-reduce:transition-none` on the determinate width morph and `motion-reduce:animate-none` on the indeterminate animation (under reduced motion it holds a still segment over the middle third of the track, never a full bar, so an unfinished task never reads as done).

## Examples

### Default

```vue
<script setup>
  import Progress from '@aziontech/webkit/progress'
</script>

<template>
  <Progress
    :value="60"
    aria-label="Uploading site-assets.zip"
  />
</template>
```

### Shapes

```vue
<script setup>
  import Progress from '@aziontech/webkit/progress'
</script>

<template>
  <div class="flex w-(--container-2xs) flex-col gap-(--spacing-md)">
    <Progress
      :value="60"
      variant="rounded"
      aria-label="Uploading site-assets.zip"
    />
    <Progress
      :value="60"
      variant="flat"
      aria-label="Building docs-site"
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
  <div class="flex w-(--container-2xs) flex-col gap-(--spacing-md)">
    <Progress
      :value="60"
      size="small"
      aria-label="Uploading logo.svg"
    />
    <Progress
      :value="60"
      size="medium"
      aria-label="Uploading site-assets.zip"
    />
    <Progress
      :value="60"
      size="large"
      aria-label="Uploading backup.tar.gz"
    />
  </div>
</template>
```
