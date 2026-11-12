# Date Range Picker

> A time range for queries over time: logs, events, traces and metrics. After the Console Kit date-time range (quick ranges, absolute range with times, previous and next) and Cloudscape's date range picker. The value is either **relative** (`{ type: 'relative', amount: 15, unit: 'minute' }`, read as "the last 15 minutes" and re-resolved against the clock on every query, so a live view keeps moving) or **absolute** (`{ type: 'absolute', start, end }`, two ISO 8601 instants). The trigger prints `Last 15 minutes` or the absolute range in the selected time zone with its UTC offset. The panel switches between Relative range (the quick ranges and a custom duration) and Absolute range (the `Calendar` month grid, start and end date and time fields, and the time zone selector) and commits only on Apply; Cancel and Escape drop the draft. Absolute boundaries are typed as wall-clock time in the selected zone and stored as instants, so the same value reads correctly in every zone. With `showStep`, Previous and Next move the range by its own length. Date math uses `Intl` and the native `Date` only.

- Import: `import DateRangePicker from '@aziontech/webkit/date-range-picker'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [date-range-picker.json](https://github.com/aziontech/webkit/blob/main/.specs/date-range-picker.json)

## When to use

- Filtering events, logs, traces or metrics by time, where "the last N minutes" must stay relative.
- Any range that needs times of day and a time zone, not only dates.
- Investigations that page through time window by window (`show-step`).

## Do

- Keep relative values relative: resolve them to instants when the query runs (`now - amount × unit` to `now`), never when the user picks them.
- Pass `now` in tests, demos and server-rendered pages so labels and step limits are deterministic.
- Bind `v-model:time-zone` to the user's saved preference, and show times elsewhere on the page in the same zone.
- Set `max` (usually now) and `min` (the retention limit) instead of validating after Apply.
- Name the picker after what it filters (`aria-label="Events time range"`).

## Don’t

- Picking whole days for a report or a billing period, with day presets → use `calendar`.
- A single date or a date and time → use `calendar` with `mode="single"`.
- A fixed list of named intervals and nothing custom → use `select` or `toggle-group`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [calendar](calendar.md) — the month grid, the date and time fields and the time zone selector come from it, so both pickers look and behave the same.
- [property-filter](property-filter.md) — the query bar it sits next to in an events toolbar.
- [chart](chart.md) — the histogram whose brush usually writes an absolute range back into this picker.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `relativeOptions` | `RelativeOption[]` | `5m, 15m, 1h, 6h, 24h, 7d, 30d` | false | Quick ranges listed on the Relative tab. |
| `timeZones` | `string[]` | `[]` | false | Zones offered by the selector. Empty falls back to the zones `Intl` supports. |
| `showTimeZone` | `boolean` | `true` | false | Shows the time zone selector in the panel. |
| `showStep` | `boolean` | `false` | false | Shows Previous and Next buttons that move the range back or forward by its own length. |
| `rangeSelectorMode` | `'default' \| 'relative-only' \| 'absolute-only'` | `'default'` | false | Which kinds of range the panel offers. |
| `min` | `Date` | `undefined` | false | Earliest instant an absolute range may start at. |
| `max` | `Date` | `undefined` | false | Latest instant an absolute range may end at. |
| `now` | `Date` | `undefined` | false | Reference clock for relative ranges and stepping. Unset reads the real clock. |
| `placeholder` | `string` | `''` | false | Trigger text with no range. Empty uses the locale catalog. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the trigger. Empty uses the locale catalog. |
| `disabled` | `boolean` | `false` | false | Disables the trigger and the step buttons. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token of the trigger and the panel controls. |
| `modelValue` | `DateRangeValue \| null` | `null` | false | Two-way value (`v-model`). |
| `timeZone` | `string` | `''` | false | Two-way value (`v-model:timeZone`). |

## v-model

| Model              | Type                     | Default | Emits               | Notes                                                                                                                                                                                |
| ------------------ | ------------------------ | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model`          | `DateRangeValue \| null` | `null`  | `update:modelValue` | The committed range: relative (last N units, re-resolved against now) or absolute (ISO instants). Set on Apply with a valid draft, or by Previous / Next (always an absolute range). |
| `v-model:timeZone` | `string`                 | `''`    | `update:timeZone`   | IANA time zone the absolute range is typed and shown in; empty uses the local zone. Set on Apply after the zone changed in the panel.                                                |

## States

- Visual states: `default`, `hover`, `focus-visible`, `open`, `disabled`; the panel shows an inline error after an Apply that the draft cannot satisfy.
- `data-state="open|closed"` on the root and the panel; `data-size`; `data-disabled`; `data-empty` on the trigger with no value; `data-selected` on the chosen quick range.
- The Next button is disabled while the range is relative (it already ends now) or when the step would pass `max` (or now); Previous is disabled when the step would pass `min`.

## Accessibility

- Visible focus: a 2 px `--ring-color` ring inset on each trigger segment; the quick ranges ring their row when the radio inside has focus.
- Keyboard map: `Enter`/`Space` on the trigger opens the panel and the focus trap moves into it; `Tab` cycles inside the panel; the range type is a `ToggleGroup` (arrow keys); the quick ranges are native radios (`ArrowUp`/`ArrowDown` move and select); the grid keeps the `calendar` keyboard map; `Escape` closes without committing and returns focus to the trigger.
- ARIA: the trigger has `aria-haspopup="dialog"`, `aria-expanded` and a name that starts with the picker's label and contains the visible range; the panel is a named `dialog`; the quick ranges are a `fieldset` with a `legend`; the custom duration and unit have visible labels; the error is `role="alert"` and described from the duration field; Previous and Next are named buttons.
- Targets: options are 32 px high (44 px on `pointer: coarse`).
- Contrast ≥4.5:1 from the semantic text tokens.

## Right-to-left

- Layout: logical utilities only (`border-s`, `border-e`, `ps-`/`pe-`, `end-`, `text-start`); the panel anchors to the start edge of the trigger.
- Icons: the Previous and Next chevrons mirror (`rtl:-scale-x-100`); the clock and calendar glyphs do not.
- Keyboard: the grid's arrow keys follow the reading direction (from `calendar`).
- User data: the range text sits in `<bdi>`.
- Teleported content: the panel binds `dir` and `lang` from the nearest `WebkitProvider` (`usePortalLocale`).

## Internationalization

| Key                                       | English source                                | Override prop          |
| ----------------------------------------- | --------------------------------------------- | ---------------------- |
| `dateRangePicker.label`                   | Time range                                    | `ariaLabel`            |
| `dateRangePicker.placeholder`             | Select a time range                           | `placeholder`          |
| `dateRangePicker.dialog`                  | Choose a time range                           | —                      |
| `dateRangePicker.rangeType`               | Range type                                    | —                      |
| `dateRangePicker.relative` / `absolute`   | Relative range / Absolute range               | —                      |
| `dateRangePicker.quickRanges`             | Quick ranges                                  | —                      |
| `dateRangePicker.custom`                  | Custom range                                  | —                      |
| `dateRangePicker.amount` / `unit`         | Duration / Unit                               | —                      |
| `dateRangePicker.second` … `year`         | Last second / Last {count} seconds … (plural) | `RelativeOption.label` |
| `dateRangePicker.unitSecond` … `unitYear` | Seconds … Years                               | —                      |
| `dateRangePicker.apply` / `cancel`        | Apply / Cancel                                | —                      |
| `dateRangePicker.previous` / `next`       | Previous range / Next range                   | —                      |
| `dateRangePicker.incomplete`              | Choose a start and an end.                    | —                      |
| `dateRangePicker.order`                   | The end must be after the start.              | —                      |
| `dateRangePicker.outOfBounds`             | Choose a range inside the allowed dates.      | —                      |
| `dateRangePicker.invalidAmount`           | Enter a whole number greater than 0.          | —                      |

- Formatting: the absolute range goes through `Intl.DateTimeFormat` in the active locale; the relative labels through the plural rules of the active locale; the grid, the date and time fields and the time zone selector use the `calendar` keys.

## Responsive

- Container queries: none; the trigger is inline and truncates its text inside the available width (`max-w-full`).
- Narrow (≤ 640 px): the panel is at most `min(90vw, 24rem)` wide and scrolls inside itself when taller than the viewport.
- Touch: options are 44 px high on `pointer: coarse`; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({ type: 'relative', amount: 15, unit: 'minute', key: 'last-15-minutes' })
</script>

<template>
  <DateRangePicker
    v-model="range"
    aria-label="Events time range"
  />
</template>
```

### Absolute

```vue
<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({
    type: 'absolute',
    start: '2026-11-10T12:00:00.000Z',
    end: '2026-11-10T18:30:00.000Z'
  })
</script>

<template>
  <DateRangePicker
    v-model="range"
    range-selector-mode="absolute-only"
    time-zone="UTC"
    :max="new Date('2026-11-11T00:00:00.000Z')"
    aria-label="Billing window"
  />
</template>
```

### RelativeOnly

```vue
<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const options = [
    { key: 'last-1-hour', amount: 1, unit: 'hour' },
    { key: 'last-24-hours', amount: 24, unit: 'hour' },
    { key: 'last-7-days', amount: 7, unit: 'day' },
    { key: 'last-30-days', amount: 30, unit: 'day' }
  ]

  const range = ref({ type: 'relative', amount: 24, unit: 'hour', key: 'last-24-hours' })
</script>

<template>
  <DateRangePicker
    v-model="range"
    :relative-options="options"
    range-selector-mode="relative-only"
    aria-label="Metrics interval"
  />
</template>
```
