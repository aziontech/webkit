# Spinner

> Shared visual utility used by other components. Lives at `packages/webkit/src/components/utils/spinner/`.

- Import: `import Spinner from '@aziontech/webkit/spinner'`
- Category: utils · Surface: product · Structure: monolithic
- API as JSON: [spinner.json](https://github.com/aziontech/webkit/blob/main/.specs/spinner.json)

## When to use

- An inline busy mark inside a row, log line or custom control that has no loading state of its own.
- A small in-progress indicator next to text in a toast or status row.

## Do

- It has no props: size it with a `size-*` class (`size-3`, `size-4`) and color it through the inherited text color (it strokes `currentColor`).
- It is `aria-hidden`; announce the busy state on the surrounding element (`aria-busy`, a live region or visible text).
- The spin stops under reduced motion, so pair it with text when the wait matters.

## Don’t

- A button waiting on its action → set `loading` on `button`, `icon-button` or `button-highlight`.
- Content that is still loading → use `skeleton`.
- Progress you can measure → use `progress`.
- A status with a color and a label → use `status-indicator`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [skeleton](skeleton.md) — reserves the shape of content while it loads.
- [progress](progress.md) — determinate progress.
- [button](button.md) — renders a Spinner itself when `loading` is set.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Examples

### Default

```vue
<script setup>
  import Spinner from '@aziontech/webkit/spinner'
</script>

<template>
  <Spinner class="size-4 text-(--text-default)" />
</template>
```

### Sizes

```vue
<script setup>
  import Spinner from '@aziontech/webkit/spinner'
</script>

<template>
  <div class="flex items-center gap-4 text-(--text-default)">
    <Spinner class="size-3" />
    <Spinner class="size-4" />
    <Spinner class="size-6" />
    <Spinner class="size-8" />
  </div>
</template>
```
