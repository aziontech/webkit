# Calendar

> Date-range picker. A trigger button opens a popover that holds a month grid, Start/End date + time fields (suppressible with `show-fields`), an optional timezone selector, and an Apply action; it also offers a "Select Period" mode whose hint chips and typed text are read in the active locale (`45m`, `12 hours` / `12 horas`, `last month` / `mês passado`, `yesterday` / `ontem`, `1/1 - 1/2`). When consumer-provided `presets` are supplied, the trigger splits into two side-by-side segments — a preset dropdown (left, `🕐 <label> ⌄`) that applies a preset range in one click, and the calendar (right, `📅 <range>`) that opens the grid for fine-tuning. Selection is staged in a draft inside the popover and committed to `v-model` only on Apply (or immediately when `show-apply` is false); a preset commits immediately. In period mode, once a span is applied the trigger shows the same two-segment shape — the relative token (e.g. `45m`) beside the concrete window it resolves to (e.g. `14:44 – 23:59`) — since a period selects a time interval rather than whole days. Date math uses the native `Date` API only — no date library; timezone is a selectable IANA label used for display formatting via `Intl` (the picker does not re-interpret `Date` objects across zones).

- Import: `import CalendarRoot from '@aziontech/webkit/calendar-root'`
- Compound import (dot notation, not tree-shakeable): `import Calendar from '@aziontech/webkit/calendar'`
- Category: inputs · Surface: product · Structure: composition
- API as JSON: [calendar.json](https://github.com/aziontech/webkit/blob/main/.specs/calendar.json)

## When to use

- Picking a date range for analytics, logs, or billing windows, optionally with times and a timezone.
- Offering one-click ranges ("Last 7 days") next to the grid through `presets`.
- Relative time windows typed as text (`45m`, `last month`) with `period`.
- A single date with `mode="single"`.

## Do

- modelValue` is committed only on Apply; read the final value from `update:modelValue` or `apply`, and set `:show-apply="false"` when every edit should commit at once.
- Bind a `{ start, end }` object in range mode and a `Date` or `null` with `mode="single"`.
- Bound the selectable days with `min` and `max` instead of validating after commit.
- Pair `show-timezone` with `v-model:timezone`; the timezone changes display formatting only, not the `Date` values.
- Prefer the `presets` prop; use the `presets` slot with `Calendar.Preset` only when preset content needs custom markup.

## Don’t

- Only a fixed list of named windows, with no custom range → use `select`.
- A duration or count (retention days, TTL) rather than a date → use `number-input`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [select](select.md) — a fixed list of named periods without a grid.
- [input](input.md) — the trigger and the Start/End fields share its heights, hover, and disabled treatment, so they align side by side.
- [number-input](number-input.md) — numeric durations instead of dates.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `Date \| null \| CalendarRange` | `null` | false | Committed selection for v-model. A `Date` (or null) in single mode; a `{ start, end }` range in range mode. Only updated on Apply (or immediately when `showApply` is false). |
| `mode` | `'single' \| 'range'` | `'range'` | false | Selection mode. Single picks one date; range picks a start and end date. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; affects the trigger, day-cell hit-area, and typography. |
| `min` | `Date \| undefined` | `undefined` | false | Earliest selectable date; earlier days render disabled. |
| `max` | `Date \| undefined` | `undefined` | false | Latest selectable date; later days render disabled. |
| `disabled` | `boolean` | `false` | false | Disables the trigger, grid, and all controls, applying disabled tokens. |
| `open` | `boolean \| undefined` | `undefined` | false | Controlled open state of the popover. Use with v-model:open; omit for uncontrolled. |
| `placeholder` | `string` | `''` | false | Trigger text shown when there is no selection. Empty uses the locale catalog (`Select a date range`). |
| `presets` | `CalendarPresetItem[]` | `[]` | false | Consumer-provided shortcuts; each is `{ label, value }` where value is a `Date` or range. When present, the trigger becomes a two-part control whose left segment opens a dropdown of these presets. |
| `showFields` | `boolean` | `true` | false | Shows the Start/End date fields in the panel. Set false when the shortcuts and the grid are the whole interaction and typing a boundary by hand is not offered. |
| `showTime` | `boolean` | `false` | false | Shows Start/End time fields alongside the date fields. |
| `showTimezone` | `boolean` | `false` | false | Shows the timezone selector below the fields. |
| `timezone` | `string` | `''` | false | Selected IANA timezone for display formatting (v-model:timezone). Empty resolves to the local zone. |
| `timezones` | `string[]` | `[]` | false | Timezone options for the selector; empty falls back to a curated list derived from `Intl`. |
| `horizontal` | `boolean` | `false` | false | Lays the fields/apply column beside the calendar instead of below it. |
| `clearable` | `boolean` | `false` | false | Shows a clear control on the trigger that empties the committed selection. |
| `showApply` | `boolean` | `true` | false | Stages edits in a draft and requires Apply to commit; when false, every edit commits immediately. |
| `period` | `boolean` | `false` | false | Enables the "Select period" relative-time mode: a relative-preset list plus a text input that parses spans like `45m` or `last month`. |
| `split` | `boolean` | `false` | false | Renders the trigger as a split control with a separate chevron affordance. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `Date \| null \| CalendarRange` | v-model. The committed `Date` (single) or `{ start, end }` (range); empty value on clear. |
| `update:open` | `boolean` | v-model:open. Emitted when the popover opens or closes. |
| `update:timezone` | `string` | v-model:timezone. Emitted when the timezone selection changes. |
| `month-change` | `CalendarMonth` | Emitted when the first visible month changes via navigation or keyboard paging. Payload is `{ year, month }` (month is 0-indexed). |
| `apply` | `Date \| null \| CalendarRange` | Emitted when the draft selection is committed via Apply. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `trigger` | { open, value, displayValue } | Replaces the default trigger button; scope exposes the open state, raw value, and formatted label. |
| `presets` | — | Custom preset dropdown content (e.g. `<Calendar.Preset>`); overrides the `presets` prop rendering. |
| `footer` | — | Custom footer/action-bar content (e.g. `<Calendar.Clear>`) alongside Apply. |

## Sub-component imports

- `@aziontech/webkit/calendar-preset`
- `@aziontech/webkit/calendar-clear`

## Sub-components

- `calendar-preset/calendar-preset.vue` — context-aware shortcut button; applies its `value` (a `Date` in single mode or a `{ start, end }` range) to the popover's draft selection through injected context and reflects a `data-selected` state when its value matches. Placed in the `presets` slot (the preset dropdown).
- `calendar-clear/calendar-clear.vue` — context-aware button that clears the draft selection through injected context; disabled when there is no selection. Placed in the `footer` slot.

## States

- Visual states: `default`, `hover`, `focus-visible`, `selected`, `in-range`, `disabled`, `today`, `outside` (adjacent-month), popover `open` / `closed`
- **Field contract parity.** Every field-shaped surface — the trigger, the Start/End date+time fields, and the timezone selector — follows the shared `inputs` field contract used by `input`, `number-input`, `select-trigger` and `textarea`, so a Calendar reads identically to a text field placed beside it: heights are `small=28px` / `medium=32px` / `large=40px`, the value renders at `.text-label-sm`, and `disabled` applies `var(--bg-disabled)` + `var(--text-disabled)` + `cursor-not-allowed` rather than an opacity wash.
- **Hover is identical to `input`.** The whole trigger is one field with one border, so hover raises **only** that border to `var(--border-strong)` — no background wash on any segment. It is suppressed while the control is focused (the focus ring is the active affordance) and while `disabled`, via the same selector `input` uses: `[&:not(:focus-within):not([data-disabled])]:hover:border-(--border-strong)` (the timezone `<select>` is focusable itself, so it uses the `:not(:focus):not(:disabled)` form). Because the border lives on the trigger shell, hovering any segment — preset, calendar, clear, or split — raises the single shared border, exactly as hovering a text field's icon slot does. `hover:bg-(--bg-hover)` survives only on the preset **dropdown menu rows**, which are menu items inside the popover, not field surfaces, and have no `input` counterpart.
- `data-state` on the root and trigger mirrors the popover open state (`open` | `closed`)
- `data-size` mirrors the `size` prop on the root, trigger, and each day cell (`small` | `medium` | `large`)
- `data-selected` mirrors a fully-selected day cell (single value, or a range endpoint) and an active preset
- `data-band` on each day cell drives the connected range highlight: `none` | `single` | `start` | `middle` | `end`
- `data-today` marks the current date; `data-outside` marks an adjacent-month day cell
- `data-disabled` mirrors the `disabled` prop on the root, unselectable day cells, and the clear control when there is no selection
- When `presets` are supplied, the trigger is a two-part control: a left preset button (`aria-haspopup="menu"`, clock glyph, `data-testid` `…__presets-trigger`) opening the preset dropdown, and a right calendar button (`aria-haspopup="dialog"`, calendar glyph) opening the popover; the two dropdowns are mutually exclusive, and each preset menu item sets `data-selected` when it is the active preset
- In period mode, a committed selection renders the trigger as two side-by-side segments: the relative token (e.g. `45m`, with a clock glyph) beside the resolved concrete window (e.g. `14:44 – 23:59`, with a calendar glyph), separated by a divider
- Reflow: the root is capped at the width of its container (`max-w-full`), so the trigger, presets included, never overflows a 320 px box.
- Server render and hydration: the time zone select lists only the chosen zone until mount (its city name, or the catalog's `Local` with no zone chosen), because the zone list, the local zone and the offsets depend on the runtime's clock and tz data. On mount it lists every zone with its offset, so the server HTML and the first client render match.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the trigger and `focus-visible:ring-offset-(--bg-surface-raised)` inside the popover. The Start/End date+time fields reuse `input`, whose ring offset resolves `var(--input-ring-offset, var(--bg-canvas))`; the fields container declares `--input-ring-offset: var(--bg-surface-raised)` once and it inherits to every field, so the ring gap matches the raised popover the fields sit on.
- Field labels: each visible Start / End / Date label is a `<label for>` bound to its date field through `useId()`; the time field beside it carries its own `aria-label` (`Start time` / `End time` / `Time`), so every field has a programmatic accessible name.
- Keyboard map: the trigger toggles the popover with `Enter`/`Space` and exposes `aria-haspopup`/`aria-expanded`; `Escape` and click-outside close it and return focus to the trigger; focus is trapped in the open popover. In the grid, `Tab` enters at the focused day, `Arrow` keys move focus (paging the visible window when crossing its first/last month), `Enter`/`Space` selects, `PageUp`/`PageDown` change month. Apply, Clear, presets, fields, and the timezone control are all reachable by `Tab`.
- ARIA: each month grid uses `role="grid"` with `role="row"` and `role="gridcell"` descendants; selected cells set `aria-selected="true"`; the current date sets `aria-current="date"`; navigation buttons carry `aria-label`; the popover is labelled by the trigger; decorative icons are `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:animate-none` on the popover and `motion-reduce:transition-none` on animated states.
- Touch target ≥40×40 px (or justified deviation): day cells use a 32×32 px (`small`), 36×36 px (`medium`), or 40×40 px (`large`) hit area; `small`/`medium` are a justified deviation for dense month-grid layouts, `large` meets the 40 px target.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the previous/next month chevrons mirror (`rtl:-scale-x-100`); the clock and calendar trigger icons do not.
- Motion: the month strip slide mirrors (`rtl:` swaps `translate-x-full` and `-translate-x-full`), so under `dir="rtl"` the next month enters from the left, the side its chevron points to.
- Keyboard: in the day grid `ArrowRight`/`ArrowLeft` move one day later/earlier, swapped under `dir="rtl"` (`logicalArrowKey`): `ArrowLeft` moves to the next day. `ArrowUp`/`ArrowDown`, `PageUp`/`PageDown` and `Home`/`End` are unchanged.
- User data: dates and times are printed by `Intl` in the active locale; the typed field value uses the `Input` `dir="auto"`.
- Teleported content: the teleported date popover and presets menu bind `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Internationalization

- Every built-in string comes from the `calendar` group of the locale catalog (`useLocale`): trigger placeholder, Period / Select period, Start / End / Date / Time labels, Apply, preset labels, hint headings, timezone label, and the words that separate a typed range (`calendar.rangeSeparators`: `to|through`, `a|até`, `a|hasta`).
- Printed text uses `Intl` in the active locale: the trigger label, the field values and their placeholders (`Jun 1, 2026` in `en`, `1 de jun. de 2026` in `pt-BR`), the time fields, weekday and month names.
- Period hint chips are printed by `Intl` (`Intl.NumberFormat` units and `Intl.RelativeTimeFormat`): `12 hours` / `12 horas`, `yesterday` / `ontem`, `last month` / `mês passado`, and the fixed hints (`Jan 1` / `1 de jan.`, `1/1 - 1/2` / `01/01 - 02/01`). A chip applies exactly the text it shows.
- Typing is parsed in the active locale with English always accepted as well: unit words and their abbreviations, `today`/`yesterday`/`last week`/`last month`/`last year`/`this month` and their translations, month names (long and short, accents optional), numeric dates in the locale's day/month order (`1/2/2026` is 2 January in `en`, 1 February in `pt-BR`), ISO `2026-01-05`, and ranges split by `-`, `–` or a separator word. Times accept `14:30`, `14h30` and `2:30 pm`.

## Examples

### Default

```vue
<script setup>
  import CalendarRoot from '@aziontech/webkit/calendar-root'
  import { ref } from 'vue'

  const range = ref(null)
</script>

<template>
  <CalendarRoot
    v-model="range"
    mode="range"
    clearable
    show-time
    show-timezone
  />
</template>
```

### Open

```vue
<script setup>
  import CalendarRoot from '@aziontech/webkit/calendar-root'
  import { ref } from 'vue'

  const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })
</script>

<template>
  <div class="min-h-[640px] w-full max-w-[560px]">
    <CalendarRoot
      v-model="range"
      mode="range"
      :open="true"
      show-time
      show-timezone
      clearable
    />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import CalendarRoot from '@aziontech/webkit/calendar-root'
  import { ref } from 'vue'

  const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })
</script>

<template>
  <div class="flex flex-wrap items-start gap-4">
    <CalendarRoot
      v-model="range"
      mode="range"
      size="small"
    />
    <CalendarRoot
      v-model="range"
      mode="range"
      size="medium"
    />
    <CalendarRoot
      v-model="range"
      mode="range"
      size="large"
    />
  </div>
</template>
```
