# Toggle Group

> ToggleGroup is a connected group of buttons that picks exactly one value out of a small set of related options, with a selection indicator that slides to the active segment. It renders as a `radiogroup` whose segments are `radio` buttons, is driven by an `options` array plus `v-model`, and works uncontrolled through `defaultValue`. It differs from `tabs`, which switches between content panels it owns: a segmented button only holds the chosen value and leaves rendering what that value means to the consumer.

- Import: `import ToggleGroup from '@aziontech/webkit/toggle-group'`
- Category: action · Surface: app · Structure: monolithic
- API as JSON: [toggle-group.json](toggle-group.json)

## When to use

- Use ToggleGroup (segmented control) to switch a view or mode in place (Table/Chart, 1h/24h), with two to five short segments; it is not a form field. For one choice in a form use RadioGroup; for an on/off setting use Switch; for the theme in app chrome use ThemeSwitcher.
- Switch in place between two to five related modes, views or ranges (a time range, a list/grid view, a filter scope) where exactly one is always active.
- Offer a compact single choice in a toolbar or a card header where a radio list would take too much room.
- Show a choice that is currently unavailable as a disabled segment instead of hiding it; mark it `locked` when it is unavailable because of a plan or a permission.

## Do

- Keep labels to one or two words. When the options do not fit their container they flow onto another row, and a label breaks across lines only when one option alone is wider than the group; a label is never cut off.
- Give every option a unique `value`; values are coerced to strings and used as the list key and the selection identity, so duplicates collide.
- Pass `ariaLabel` whenever no visible label names the group.
- Use `fluid` to make the group fill a narrow container and share its width across segments, instead of styling the width at the call site.
- Bind `v-model` when the selection lives in the parent; use `defaultValue` only to seed an uncontrolled group.

## Don’t

- The choice switches between content panels that belong to the control → use `tabs`.
- The choice is a form field with a label, helper text or validation → use `radio-group` (`variant="card"` when each option needs a description).
- The value is a binary on/off setting → use `switch` (in a horizontal `field` inside a form).
- The user can pick more than one option → use `checkbox` (in a horizontal `field`).
- The control triggers an action instead of holding a value → use `button` or `split-button`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tabs](tabs.md) — tabs that own their panels; reach for it when each option reveals its own content region.
- [radio-group](radio-group.md) — the form-field single choice; `variant="card"` when each option carries a description.
- [theme-switcher](theme-switcher.md) — the system / light / dark choice in app chrome.
- [switch](switch.md) — a single boolean toggle.
- [button](button.md) — a lone action; the segments here hold a value instead of firing one.
- Naming: Radix and shadcn `ToggleGroup` is a group of `aria-pressed` toggles with `type="single" | "multiple"`. This component is the single-select segmented control (Cloudscape and Geist call it a segmented control): one value is always selected and the segments are radios. There is no multiple mode; for several independent toggles use `checkbox`es or `ButtonGroup` toggles.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options` | ``ToggleGroupOption[]` (`{ label?: string \| number; value?: string \| number; disabled?: boolean; locked?: boolean }`)` | `[]` | false | Segmented choices shown as a mutually exclusive group. |
| `ariaLabel` | `string` | `''` | false | Accessible name when no visible group label is associated. |
| `defaultValue` | `string` | `undefined` | false | Initial selection when `v-model` is not set. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token, on the same 28 / 32 / 40 rhythm every other control uses. |
| `fluid` | `boolean` | `false` | false | Stretches the group to its container and lets the options share that width. |
| `disabled` | `boolean` | `false` | false | Disables every option of the group. |
| `name` | `string` | `''` | false | Form field name. Set, a hidden input carries the selected value so a native `form` submits it; `disabled` leaves it out. |
| `modelValue` | `TValue \| undefined` | `undefined` | false | Two-way value (`v-model`). |

## v-model

| Model     | Type                  | Default     | Emits               | Notes                                                                                                                                                                                                                                                                     |
| --------- | --------------------- | ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `TValue \| undefined` | `undefined` | `update:modelValue` | Selected option value via `defineModel`. While unbound (`undefined`) the group is uncontrolled: it starts at `defaultValue`, else the first non-disabled option. Emits only when the selection changes to a different value, always as the string-coerced option `value`. |

**Generic.** The component is generic over `TValue extends string` (default `string`), inferred from the bound `v-model`: on a `Ref<'day' | 'week'>`, `update:modelValue` sends `'day' | 'week' | undefined` (the `undefined` of an unbound model), so `v-model` binds the union with no cast. `ToggleGroupOption<TOptionValue = string | number>` types a list against the same union (`ToggleGroupOption<'day' | 'week'>[]`); the `options` prop itself stays `ToggleGroupOption[]`, so a list typed `{ label: string; value: string }[]` still binds. `ToggleGroupOption` and `ToggleGroupSize` are exported by `@aziontech/webkit/toggle-group`.

## States

- Visual states per segment: `default`, `focus-visible`, `selected`, `disabled`.
- Root: `role="radiogroup"`; consumer attributes (`id`, `aria-labelledby`, `aria-describedby`, …) land on it; `data-disabled` when `disabled`; `data-size` mirrors `size` (`small` | `medium` | `large`); `data-fluid` is present only when `fluid` is set.
- Segment: `role="radio"` with `aria-checked`; `data-state="active"` on the selected segment and `"inactive"` on the others; `data-disabled` and the native `disabled` attribute on a disabled option (or every option when the root is `disabled`); a trailing lock icon (`az az-lock`) and `data-locked` on a locked option (see Locked options). Each segment carries a touch-target span that grows its hit area to 44px under `pointer-coarse`.
- Indicator: an `aria-hidden` span positioned under the selected segment from its measured size and offset; hidden when nothing is selected or the selected segment is not rendered. It re-measures on option, selection and size changes (`ResizeObserver`).
- Option normalization: a missing `label` falls back to `value`, then to `Option <n>`; a missing `value` falls back to `label`, then to the index.
- Test ids: root `toggle-group` (consumer `data-testid` wins), `<testId>__indicator`, `<testId>__option`, `<testId>__option-lock`.
- Reflow: the root is capped at the width of its container (`max-w-full`, `min-w-0`) and wraps (`flex-wrap`): options that do not fit move to another row, the selected-option indicator follows them, and a label wraps inside its option only when that option alone is wider than the group. Heights are minimums (28 / 32 / 40 px for one row), so a wrapped group grows instead of clipping.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` with `focus-visible:outline-none` on each segment.
- Keyboard map: the group is one tab stop (roving `tabindex`): `Tab` lands on the selected segment, or on the first enabled one when nothing is selected, and the next `Tab` leaves the group; `Enter` / `Space` select the focused segment; `ArrowRight` / `ArrowDown` and `ArrowLeft` / `ArrowUp` move the selection to the next / previous enabled segment, wrapping at the ends, and `Home` / `End` to the first / last enabled one (the APG radio group map), and focus moves with it so the newly checked radio is announced.
- ARIA: root `role="radiogroup"` named by `ariaLabel` (`aria-label` is omitted when it is empty) or by a consumer `aria-labelledby` pointing at a visible label; each segment `role="radio"` with `aria-checked`; the indicator and the lock icon are `aria-hidden="true"`.
- Disabled options use the native `disabled` attribute, so they are skipped by arrow navigation, never take the tab stop and cannot be clicked.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons): selected text uses `var(--text-default)` on `var(--bg-selected)`, unselected text `var(--text-muted)` on `var(--bg-surface)`.
- `motion-reduce:transition-none` on the segment color transition and on the indicator slide.
- Touch target: segments fill the group height minus its padding (40px group at `size="large"`); under `pointer-coarse` a touch-target span extends each segment's hit area to 44px.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: item icons are the consumer's and do not mirror.
- Keyboard: `ArrowRight`/`ArrowLeft` move to the next/previous item, swapped under `dir="rtl"` (`useDirection(rootEl)` + `logicalArrowKey`): `ArrowLeft` moves forward.
- Indicator: the selection pill is anchored with a physical `left: 0` and moved by the measured `offsetLeft`, which is already a physical distance, so it lands on the selected item in both directions.
- User data: none.

## Internationalization

| Key                  | English source   | Override prop                  |
| -------------------- | ---------------- | ------------------------------ |
| `toggleGroup.option` | `Option {index}` | an option `label` (or `value`) |

- Option labels are consumer copy; the catalog string is only the fallback for an option with neither `label` nor `value`.

## Responsive

- The root is capped at its container (`max-w-full`, `min-w-0`); options that do not fit flow onto another row instead of truncating, and `fluid` makes the options in each row share its full width.
- Touch: a touch-target span grows each segment to 44px under `pointer-coarse`; prefer `size="large"` on touch-first surfaces.
- No hover-only affordance: selection, focus and disabled states are all visible without hover.

## Examples

### Default

```vue
<script setup>
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  const options = [
    { label: 'Label', value: 'option-1' },
    { label: 'Label', value: 'option-2' },
    { label: 'Label', value: 'option-3' },
    { label: 'Label', value: 'option-4' },
    { label: 'Label', value: 'option-5' }
  ]

  const selected = ref('option-1')
</script>

<template>
  <ToggleGroup
    v-model="selected"
    :options="options"
    aria-label="Segmented options"
  />
</template>
```

### WithDisabledOption

```vue
<script setup>
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  const options = [
    { label: 'Label', value: 'option-1' },
    { label: 'Label', value: 'option-2', disabled: true },
    { label: 'Label', value: 'option-3' },
    { label: 'Label', value: 'option-4' }
  ]

  const selected = ref('option-1')
</script>

<template>
  <ToggleGroup
    v-model="selected"
    :options="options"
    aria-label="Segmented options"
  />
</template>
```

### Sizes

```vue
<script setup>
  import ToggleGroup from '@aziontech/webkit/toggle-group'

  const options = [
    { label: 'Label', value: 'option-1' },
    { label: 'Label', value: 'option-2' },
    { label: 'Label', value: 'option-3' }
  ]
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <ToggleGroup
      :options="options"
      default-value="option-1"
      size="small"
      aria-label="Small"
    />
    <ToggleGroup
      :options="options"
      default-value="option-1"
      size="medium"
      aria-label="Medium"
    />
    <ToggleGroup
      :options="options"
      default-value="option-1"
      size="large"
      aria-label="Large"
    />
  </div>
</template>
```
