# Slider

> Bare range control `Slider`: one thumb on a horizontal track that picks a single number between `min` and `max` in `step` increments, with the portion from `min` to the value filled. It is built on a native `<input type="range">`, so the keyboard model, the `slider` role and the value announcements come from the platform; the component only styles the track, fill and thumb with tokens and adds optional tick marks and labelled reference values under the track. It renders no label, value readout or helper text — a field composes it with `Label` and `HelperText`, the same way `switch` and `number-input` are composed.

- Import: `import Slider from '@aziontech/webkit/slider'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [slider.json](https://github.com/aziontech/webkit/blob/main/.specs/slider.json)

## When to use

- Picking an approximate value inside a known, bounded range where the position matters more than the exact digit (a spend or usage limit, a percentage threshold, a sampling rate).
- A plan or capacity selector whose stops are evenly spaced and few enough to read as tick marks.
- A bounded value the user adjusts by feel and then commits (listen to `change` to persist on release instead of on every drag frame).

## Do

- Always give the slider an accessible name: `aria-label`, or a `Label` whose `for` matches the slider's `id`.
- Keep the value inside `[min, max]` and on a `step` multiple; the component clamps the displayed fill but never rewrites the bound value on its own.
- Turn on `ticks` only when every step is meaningful and the range has at most 21 positions; above that the ticks are not rendered.
- Use `referenceValues` for a few landmarks (`[0, 50, 100]`), not for every step — labels need horizontal room.
- Set `unit` when the number alone is ambiguous; it is appended verbatim to the reference labels and to the announced value, so include a leading space for word units (`' GB'`) and none for symbols (`'%'`).
- Listen to `change` for expensive side effects (saving a limit to the API); `v-model` updates on every movement.
- Use `readonly` to show a value the current user may not change but should still be able to focus and hear; use `disabled` when the control does not apply at all.

## Don’t

- The user must type an exact number, or the range is unbounded → use `number-input`.
- The choice is between a handful of named options (1h / 24h / 7d) → use `toggle-group`.
- An on/off setting → use `switch`.
- Showing progress or a read-only quantity the user cannot change → use `progress`.
- Selecting a range with two thumbs (from–to) — not supported by this component.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [number-input](number-input.md) — exact numeric entry; pair it next to a slider when the user needs both coarse dragging and an exact value.
- [label](label.md) — names the slider; point its `for` at the slider's `id` (the `id` attribute lands on the native input).
- [helper-text](helper-text.md) — description or error message under the slider in a field layout.
- [toggle-group](toggle-group.md) — a few discrete, named choices instead of a continuous range.
- [progress](progress.md) — displays a fraction; it is not interactive.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `min` | `number` | `0` | false | Lowest selectable value; the left end of the track. |
| `max` | `number` | `100` | false | Highest selectable value; the right end of the track. |
| `step` | `number` | `1` | false | Increment between selectable values, used by dragging and the arrow keys. |
| `disabled` | `boolean` | `false` | false | Disables interaction, removes the control from the tab order and applies the disabled tokens. |
| `readonly` | `boolean` | `false` | false | Keeps the control focusable but prevents the value from changing. |
| `invalid` | `boolean` | `false` | false | Applies the danger tokens and sets aria-invalid. |
| `ariaLabel` | `string` | `''` | false | Accessible name when no visible label is associated with the slider. |
| `ticks` | `boolean` | `false` | false | Shows a tick mark at every step when the range has at most 21 positions. |
| `referenceValues` | `number[]` | `[]` | false | Values marked and labelled under the track; entries outside min and max are ignored. |
| `unit` | `string` | `''` | false | Text appended verbatim to the reference labels and to the announced value. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `change` | `number` | Commit signal: emitted from the native `change` event — on pointer release after a drag, and after each keyboard step — with the committed value. Lets the consumer persist once per interaction instead of once per drag frame (`update:modelValue` fires continuously). A value event, so no DOM event in the payload (see `.claude/rules/event-payloads.md`). Not emitted while `disabled` or `readonly`. |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                                                                                                                      |
| --------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model` | `number` | `0`     | `update:modelValue` | Current value via `defineModel<number>({ default: 0 })`. Emitted on every native `input` event (drag frame or key press) as `valueAsNumber`. Never emitted while `disabled` or `readonly`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active` (dragging), `disabled`, `readonly`, `invalid`
- `data-disabled` mirrors the `disabled` prop; the native input is also `disabled`, so it leaves the tab order and ignores pointer and keys.
- `data-readonly` mirrors the `readonly` prop. A native range input ignores the HTML `readonly` attribute, so the component owns the behaviour: the input stays focusable, `aria-readonly="true"` is set, the navigation keys (arrows, `PageUp`/`PageDown`, `Home`/`End`) are prevented, pointer dragging is prevented, and any native `input` that still slips through writes the current model back to the element without emitting. Visual: fill and thumb border switch to the muted token and the cursor is `default`.
- `data-invalid` mirrors the `invalid` prop: the fill and the thumb border switch to the danger tokens; `aria-invalid="true"` is set on the input.
- Fill: the root sets the custom property `--slider-fill` (the clamped value as a percentage of `max - min`; `0%` when `max <= min`) through an inline `style` binding, the same way `tracker` and `chart` set their custom properties. The WebKit/Blink track paints the fill with a bracketed gradient (`[&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--accent)_var(--slider-fill),var(--bg-surface)_var(--slider-fill))]`); Firefox paints it natively with `[&::-moz-range-progress]:bg-(--accent)`. Expression values and custom-property declarations stay in brackets per `.claude/rules/styling.md`.
- Track and thumb are styled only through arbitrary pseudo-element variants on the native input (`appearance-none`, `[&::-webkit-slider-runnable-track]:…`, `[&::-webkit-slider-thumb]:appearance-none …`, `[&::-moz-range-track]:…`, `[&::-moz-range-thumb]:…`) — no extra track/thumb elements, no `<style>` block.
- Geometry: the native input is 40 px tall (`h-10`, the hit area) and full width; the track is 4 px tall and centred; the thumb is 16×16 px.
- Ticks (`ticks`) and reference marks (`referenceValues`) render in an `aria-hidden` row under the track. Each mark is positioned at the thumb-centre position for its value — `thumb/2 + (100% - thumb) × fraction` — so marks line up with the thumb at both ends; the fraction is passed per mark through an inline custom property. Every reference value also draws a tick. Reference labels read `{value}{unit}`; the first label is start-aligned, the last end-aligned, the rest centred on their mark.
- Attribute routing (as in `number-input`): consumer `class` merges onto the root wrapper; every other attribute (`id`, `name`, `aria-labelledby`, `aria-describedby`, …) is forwarded to the native input so a `Label for` and a `HelperText` association reach the focusable element. `data-testid` is read from attrs and applied to the root.
- `data-testid`: root fallback `input-slider`; native input `${testId}__input`; each reference label `${testId}__reference`.

## Accessibility

- Visible focus: the ring is drawn on the thumb, not the 40 px input box — `focus-visible:outline-none` on the input plus `focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-(--ring-color) focus-visible:[&::-webkit-slider-thumb]:ring-offset-2 focus-visible:[&::-webkit-slider-thumb]:ring-offset-(--bg-canvas)` and the same set for `[&::-moz-range-thumb]`.
- Keyboard map (native): `Tab` focuses; `ArrowRight`/`ArrowUp` +`step`; `ArrowLeft`/`ArrowDown` −`step`; `PageUp`/`PageDown` move by a larger browser-defined increment; `Home` → `min`; `End` → `max`. Under `dir="rtl"` the track runs right to left, so `ArrowLeft` adds `step` and `ArrowRight` subtracts it (handled by the component through `useDirection`, so every browser agrees). When `readonly`, `Tab` still focuses and every value key is inert. When `disabled`, the control is skipped by `Tab`.
- ARIA: the native `<input type="range">` provides `role="slider"` and the implicit `aria-valuemin` / `aria-valuemax` / `aria-valuenow` from `min` / `max` / the value. `aria-label` comes from `ariaLabel` (omitted when empty, so an associated `Label` wins). `aria-valuetext="{value}{unit}"` is set only when `unit` is non-empty. `aria-readonly="true"` when `readonly`; `aria-invalid="true"` when `invalid`. The ticks and reference-label row is `aria-hidden="true"`.
- Contrast: thumb border and fill against the track ≥3:1 (non-text UI), reference labels ≥4.5:1, including the disabled state per the disabled tokens.
- `motion-reduce:transition-none` on every transitioned pseudo-element class.
- Touch target: the native input is 40 px tall and full width, so the whole track row is the hit area (≥40×40); the 16 px thumb is a visual, not the target.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none.
- Keyboard: the track runs right to left under `dir="rtl"`; `ArrowLeft` adds `step` and `ArrowRight` subtracts it (`useDirection`); tick marks and labels are placed with `start-[…]`.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import Slider from '@aziontech/webkit/slider'
  import { ref } from 'vue'

  const value = ref(40)
</script>

<template>
  <div class="w-full max-w-(--container-xs)">
    <Slider
      v-model="value"
      :min="0"
      :max="100"
      :step="1"
      aria-label="Alert threshold"
    />
  </div>
</template>
```

### Ticks

```vue
<script setup>
  import Slider from '@aziontech/webkit/slider'
  import { ref } from 'vue'

  const value = ref(40)
</script>

<template>
  <div class="w-full max-w-(--container-xs)">
    <Slider
      v-model="value"
      :min="0"
      :max="100"
      :step="10"
      ticks
      aria-label="Alert threshold"
    />
  </div>
</template>
```

### ReferenceValues

```vue
<script setup>
  import Slider from '@aziontech/webkit/slider'
  import { ref } from 'vue'

  const value = ref(40)
</script>

<template>
  <div class="w-full max-w-(--container-xs)">
    <Slider
      v-model="value"
      :min="0"
      :max="100"
      :step="1"
      :reference-values="[0, 25, 50, 75, 100]"
      unit="%"
      aria-label="Alert threshold"
    />
  </div>
</template>
```
