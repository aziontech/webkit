# Spinner

> Use Spinner only for an inline busy mark in a row, log line or custom control that has no loading prop; buttons use their own `loading`, a loading region with a known shape uses Skeleton, and measurable work uses Progress. A small rotating mark that says work is in progress, for a row, a log line or a custom control that has no loading state of its own. It is decorative by default; with an `aria-label` it becomes a `status` region that announces the work, and it stops rotating under reduced motion.

- Import: `import Spinner from '@aziontech/webkit/spinner'`
- Category: utils · Surface: product · Structure: monolithic
- API as JSON: [spinner.json](https://github.com/aziontech/webkit/blob/main/.specs/spinner.json)

## When to use

- An inline busy mark inside a row, log line or custom control that has no loading state of its own.
- A small in-progress indicator next to text in a toast or status row.

## Do

- Its one prop is `ariaLabel`: size it with a `size-*` class (`size-3`, `size-4`) and color it through the inherited text color (it strokes `currentColor`).
- class` on its tag is its sizing API, not a restyle: the spec is a `style_seam`, so `webkit/no-style-override` accepts `<Spinner class="size-4" />`. Keep the class to a `size-*` and, when it must differ from the surrounding text, a text color token.
- Without `ariaLabel` it is `aria-hidden`: announce the busy state on the surrounding element (`aria-busy`, a live region or visible text). A standalone Spinner that is the only sign of the wait sets `ariaLabel` (`aria-label="Loading"`); it then renders `role="status"` with that name, so the wait is announced. Do not set it inside a control that already announces its own busy state (a `loading` button).
- The spin stops under reduced motion, so pair it with text when the wait matters.

## Don’t

- A button waiting on its action → set `loading` on `button`, `icon-button` or `button-highlight`.
- Content that is still loading → use `skeleton`.
- Progress you can measure → use `progress`.
- A status with a color and a label → use `status-indicator`.
- Built to be personalized (style seam): any class is accepted on the tag.

## Related

- [skeleton](skeleton.md) — reserves the shape of content while it loads.
- [progress](progress.md) — determinate progress.
- [button](button.md) — renders a Spinner itself when `loading` is set.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name; when set the spinner renders role status with this name, otherwise it stays aria-hidden. Size and color come through `class`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: `aria-hidden="true"` by default (decorative, the surrounding element announces the wait); with `ariaLabel` set, `role="status"` and `aria-label` instead. Not focusable.
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
