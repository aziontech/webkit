# Date Picker

> DatePicker picks **one date**, optionally with a time, in a form field. A trigger button opens a popover that holds a month grid, a typed date field (and a time field with `showTime`), an optional footer and a Cancel / Apply pair. The selection is staged in a draft inside the popover and committed to `v-model` only on Apply (or immediately when `show-apply` is false); Cancel closes, drops the draft and refocuses the trigger, as in `date-range-picker`. Date math uses the native `Date` API only — no date library; the trigger formats the value with `Intl` in `v-model:time-zone` (the local zone when empty), and the panel shows and edits it in that zone too: the grid, the date and time fields and the `min` / `max` bounds are wall-clock time there, and `v-model` stays the instant. Before 6.0 this component was `Calendar` and also picked ranges, periods and presets; every range — relative or absolute, with or without times — now belongs to `date-range-picker`, which reuses this component's month grid and fields as internal parts. The name follows Cloudscape DatePicker and the shadcn "Date Picker".

- Import: `import DatePickerRoot from '@aziontech/webkit/date-picker-root'`
- Compound import (dot notation, not tree-shakeable): `import DatePicker from '@aziontech/webkit/date-picker'`
- Category: input · Surface: app · Structure: composition
- API as JSON: [date-picker.json](date-picker.json)

## When to use

- Use DatePicker to pick one date (optionally with a time) in a form field. For any start–end range use DateRangePicker; to display a moment in time use Timestamp.
- A due date, a start date, an expiry date, a birthday.
- A date and a time of day together (`show-time`): a scheduled maintenance window start, a release time.

## Do

- `modelValue` is committed only on Apply; read the final value from `update:modelValue` or the second argument of `apply`, and set `:show-apply="false"` when every edit should commit at once.
- Bind a `Date` or `null`.
- Bound the selectable days with `min` and `max` instead of validating after commit. Unlike `date-range-picker` (five years back to the end of today by default), DatePicker is unbounded by default: a single date is often in the future (a token expiry, an alert schedule), so a page sets `min` to today there, and sets `max` only when the date must be in the past.
- Send `toISOString()` (or the ISO date `2026-11-15`) to the server, never the printed label.

## Don’t

- A start and an end, whole days or with times, relative or absolute → use `date-range-picker`.
- Displaying a date the person does not edit → use `timestamp`.
- A duration or count (retention days, TTL) rather than a date → use `number-input`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [date-range-picker](date-range-picker.md) — every range: relative windows (`last 15 minutes`) kept relative, absolute ranges down to the minute, and whole days with `:show-time="false"`. It is built on this component's grid, fields and time zone selector.
- [timestamp](timestamp.md) — shows a moment in time in the app's time zone.
- [field](field.md) — inside a `Field`, the trigger takes the field's label (`for` points at it), description, `invalid` and `disabled`.
- [select](select.md) — the Month and Year selects in the calendar caption (`variant="ghost"`, `size="small"`).
- [combobox](combobox.md) — the time field: a typed time or a pick from the 30-minute list, which opens under the field so the panel stays as thin as the grid.
- [input](input.md) — the trigger and the date field share its heights, hover, and disabled treatment, so they align side by side.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token; affects the trigger, day-cell hit-area, and typography. |
| `min` | `Date \| undefined` | `undefined` | false | Earliest selectable date; earlier days render disabled. |
| `max` | `Date \| undefined` | `undefined` | false | Latest selectable date; later days render disabled. |
| `disabled` | `boolean` | `false` | false | Disables the trigger, grid, and all controls, applying disabled tokens. |
| `invalid` | `boolean` | `false` | false | Marks the trigger invalid: sets `aria-invalid` and the danger border. An enclosing `Field`'s `invalid` sets it too. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled (`v-model:open` unbound). |
| `placeholder` | `string` | `''` | false | Trigger text shown when there is no selection. Empty uses the locale catalog (`Select a date`). |
| `showFields` | `boolean` | `true` | false | Shows the date field (and the time field with `showTime`) in the panel. Set false when the grid is the whole interaction and typing a date is not offered. |
| `showTime` | `boolean` | `false` | false | Shows a time field beside the date field, so the value carries a time of day. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | false | Places the fields and Apply column below the calendar (vertical) or beside it (horizontal). |
| `ariaLabel` | `string` | `''` | false | Accessible name of the trigger; the current value is appended (`Due date: Nov 15, 2026`). Empty leaves the name to the Field label or the trigger text. |
| `clearable` | `boolean` | `false` | false | Shows a clear control on the trigger that empties the committed selection. |
| `showApply` | `boolean` | `true` | false | Stages edits in a draft and shows Cancel and Apply; when false, every edit commits immediately and neither button renders. |
| `split` | `boolean` | `false` | false | Renders the trigger as a split control with a separate chevron affordance. |
| `modelValue` | `DatePickerValue` | `null` | false | Two-way value (`v-model`). |
| `open` | `boolean` | `undefined` | false | Two-way value (`v-model:open`). |
| `timeZone` | `string` | `''` | false | Two-way value (`v-model:timeZone`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `month-change` | `DatePickerMonth` | Emitted when the first visible month changes via navigation or keyboard paging. Payload is `{ year, month }` (month is 0-indexed). |
| `apply` | `(event: Event, value: Date \| null)` | Emitted when the draft selection is committed via Apply; `event` is the activating click or key event, `value` the committed date. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `trigger` | { open, value, displayValue } | Replaces the default trigger button; scope exposes the open state, raw value, and formatted label. |
| `footer` | — | Custom footer/action-bar content (e.g. `<DatePicker.Clear>`) alongside Apply. |

## Sub-component imports

- `@aziontech/webkit/date-picker-clear`

## Sub-components

- `date-picker-clear/date-picker-clear.vue` — context-aware button that clears the draft selection through injected context; disabled when there is no selection. Placed in the `footer` slot.

Internal parts, not exported, shared with `date-range-picker`, in `parts/`: `parts/date-picker-grid.vue` (the month grid; its caption reads `‹ Month ⌄ Year ⌄ ›`: the previous and next month arrows, and between them two ghost `Select`s, Month (the twelve month names, a month fully outside `min`/`max` disabled) and Year (from `min`'s year to `max`'s year, or ten years either side of today when unbounded, always including the shown year); picking a month or a year moves the grid there and emits `month-change`, a year that would land outside `min`/`max` keeps the month inside them), `parts/date-picker-fields.vue` (the date and time fields, a Start/End pair for a range; each time field is a `Combobox` with `allow-custom` that lists the day in 30-minute steps under the field — plus the current time when it is between two steps, so the list opens on it — shows a clock icon and takes any typed time), `parts/date-picker-timezone.vue` (the time zone selector `date-range-picker` shows, a `Combobox` with `allow-custom` off that filters the zones by city, zone id or offset as the person types), and the trigger shell both pickers render: `parts/date-picker-control.vue` (the bordered control box), `parts/date-picker-trigger.vue` (the trigger button: icon, value, chevron), `parts/date-picker-control-button.vue` (a button inside the control box, such as the clear and split buttons here and the Previous and Next buttons of `date-range-picker`) and `parts/date-picker-popover.vue` (the panel: placement, backdrop on small screens, focus trap, Escape and outside click close it). No part renders a native `select`. A private part lives in `parts/`, so it is not mistaken for a public `date-picker-<part>`.

## v-model

| Model               | Type           | Default     | Emits               | Notes                                                                                                                                                                                                                                                                                       |
| ------------------- | -------------- | ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`           | `Date \| null` | `null`      | `update:modelValue` | The committed date via `defineModel`; `null` on clear. Only updated on Apply (or immediately when `showApply` is false). Uncontrolled when unbound.                                                                                                                                         |
| `v-model:open`      | `boolean`      | `undefined` | `update:open`       | Open state of the popover via `defineModel`. Fires when the popover opens or closes. Unbound, the popover keeps its own state and starts at `defaultOpen`.                                                                                                                                  |
| `v-model:time-zone` | `string`       | `''`        | `update:timeZone`   | IANA time zone the value is shown and picked in, via `defineModel('timeZone')`: the trigger formats in it, and the grid, the fields and `min` / `max` are its wall-clock time, so picking 16:00 commits 16:00 there. Empty resolves to the local zone. Same name as on `date-range-picker`. |

**Booleans that default to true.** `showFields` and `showApply` default to `true`: they switch off parts of the default panel. Inverting them (`hideFields`, `instant`) would break every consumer, so they are recorded here as the exceptions to props.md's default-false rule.

## States

- Visual states: `default`, `hover`, `focus-visible`, `selected`, `disabled`, `today`, `outside` (adjacent-month), popover `open` / `closed`
- **Field contract parity.** Every field-shaped surface — the trigger and the date + time fields — follows the shared `inputs` field contract used by `input`, `number-input`, `select-trigger` and `textarea`, so a DatePicker reads identically to a text field placed beside it: heights are `small=28px` / `medium=32px` / `large=40px`, the value renders at `.text-label-sm`, and `disabled` applies `var(--bg-disabled)` + `var(--text-disabled)` + `cursor-not-allowed` rather than an opacity wash.
- **Hover is identical to `input`.** The whole trigger is one field with one border, so hover raises **only** that border to `var(--border-strong)` — no background wash on any segment. It is suppressed while the control is focused and while `disabled`, via the same selector `input` uses: `[&:not(:focus-within):not([data-disabled])]:hover:border-(--border-strong)`. Hovering any segment — the date, clear, or split — raises the single shared border.
- `data-state` on the root and trigger mirrors the popover open state (`open` | `closed`)
- `data-size` mirrors the `size` prop on the root, trigger, and each day cell (`small` | `medium` | `large`)
- `data-selected` mirrors the selected day cell
- `data-band` on each day cell is `single` on the selected day and `none` elsewhere (the `start` / `middle` / `end` bands are `date-range-picker`'s)
- `data-today` marks the current date, taken from the nearest `ConfigProvider` `now` when set (so a server render and the hydrating client agree), else the current time; the grid also opens on that month when there is no value; `data-outside` marks an adjacent-month day cell
- `data-disabled` mirrors the `disabled` prop on the root, unselectable day cells, and the clear control when there is no selection
- `data-invalid` mirrors `invalid` (own prop or the enclosing `Field`'s) on the root and the trigger shell, with `aria-invalid` on the trigger and the danger border
- Reflow: the root is capped at the width of its container (`max-w-full`), so the trigger never overflows a 320 px box.
- `data-side` (`bottom` | `top`) and `data-align` (`start`) on the calendar panel mirror where it landed after flipping; `start` follows the text direction, so under `rtl` the panel lines up with the field's right edge

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the trigger and `focus-visible:ring-offset-(--bg-surface-raised)` inside the popover. The date and time fields reuse `input`, whose ring offset resolves `var(--input-ring-offset, var(--bg-canvas))`; the fields container declares `--input-ring-offset: var(--bg-surface-raised)` once and it inherits to every field.
- Field labels: the visible Date label is a `<label for>` bound to its date field through `useId()`; the time field beside it carries its own `aria-label` (`Time`), so every field has a programmatic accessible name.
- Keyboard map: the trigger toggles the popover with `Enter`/`Space` and exposes `aria-haspopup`/`aria-expanded`; `Escape` and click-outside close it and return focus to the trigger; focus is trapped in the open popover. Opening focuses the selected day (else today, else the first enabled day); `Shift+Tab` reaches the month controls. In the grid, `Tab` enters at the focused day, `Arrow` keys move focus (paging the visible month when crossing its first/last day), `Enter`/`Space` selects, `Home`/`End` move to the first/last day of the week (the grid starts on Sunday; logical, so the same under `dir="rtl"`), `PageUp`/`PageDown` change month, `Shift+PageUp`/`Shift+PageDown` change year. The caption's Month and Year selects keep the `select` keyboard map (`Enter`/`Space`/`ArrowDown` open the list, the arrows move, typing jumps to an option, `Escape` closes only the list and leaves the popover open). Tests: `date-picker.test.ts` › Home and End, Shift+PageDown and Shift+PageUp; jumps to the month and year picked in the caption selects; bounds the year list by min and max. Cancel, Apply, Clear and the fields are all reachable by `Tab`.
- ARIA: the month grid uses `role="grid"` with `role="row"` and `role="gridcell"` descendants; the selected cell sets `aria-selected="true"`; the current date sets `aria-current="date"`; navigation buttons carry `aria-label`; the caption's Month and Year selects are `combobox` buttons named `Month` and `Year` from the catalog, showing the visible month and year; the popover is a `dialog` named by the catalog (`Choose date`); decorative icons are `aria-hidden="true"`.
- In a required `Field`, the trigger's `aria-describedby` adds the Field's `requiredId`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:animate-none` on the popover and `motion-reduce:transition-none` on animated states.
- Touch target ≥40×40 px (or justified deviation): day cells use a 32×32 px (`small`), 36×36 px (`medium`), or 40×40 px (`large`) hit area; `small`/`medium` are a justified deviation for dense month-grid layouts, `large` meets the 40 px target.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the previous/next month chevrons mirror (`rtl:-scale-x-100`); the calendar trigger icon does not.
- Motion: the month strip slide mirrors (`rtl:` swaps `translate-x-full` and `-translate-x-full`), so under `dir="rtl"` the next month enters from the left, the side its chevron points to.
- Keyboard: in the day grid `ArrowRight`/`ArrowLeft` move one day later/earlier, swapped under `dir="rtl"` (`logicalArrowKey`): `ArrowLeft` moves to the next day. `ArrowUp`/`ArrowDown`, `PageUp`/`PageDown` and `Home`/`End` are unchanged.
- User data: dates and times are printed by `Intl` in the active locale; the typed field value uses the `Input` `dir="auto"`.
- Teleported content: the teleported date popover binds `dir` and `lang` from the nearest `ConfigProvider` (`usePortalLocale`), so it keeps the provider's direction and language although it renders under `body`. With no provider nothing is set and the document's own `dir` and `lang` apply.

## Internationalization

- Every built-in string comes from the `datePicker` group of the locale catalog (`useLocale`): trigger placeholder (`Select a date`), Date / Time labels, Cancel, Apply, Clear, the month navigation labels and the caption selects (`datePicker.month` `Month`, `datePicker.year` `Year`).
- The active locale is the nearest `ConfigProvider`'s `locale`, else the device locale (`navigator.language`); the server render and the hydrating client use `en-US`, and the device locale applies right after mount.
- What the person sends stays unambiguous: `v-model` is a `Date` whatever the display format, so an app sends `toISOString()` (or the ISO date `2026-11-15`) to its server, never the printed label.
- Printed text uses `Intl` in the active locale: the trigger label, the field value and its placeholder, a hint and never a bare date (`e.g. Jan 31, 2026` in `en`, `ex.: 31 de jan. de 2026` in `pt-BR`; the time field reads `hh:mm`), the time field and its 30-minute list, weekday and month names, the Month select's options (`Intl` `month: 'long'`) and the Year select's options (`Intl` `year: 'numeric'`).
- Typing is parsed in the active locale with English always accepted as well: month names (long and short, accents optional), numeric dates in the locale's day/month order (`1/2/2026` is 2 January in `en`, 1 February in `pt-BR`) and ISO `2026-01-05`. Times accept `14:30`, `14h30` and `2:30 pm`.

## Responsive

- The root is capped at its container (`max-w-full`), so the trigger never overflows a 320 px box. The trigger never cuts its value off: a value longer than the trigger wraps to a second line and the trigger grows (its height is a minimum, not a fixed size).
- Narrow (below 640 px, `max-sm:`): the panel opens as a sheet — full width, attached to the bottom of the screen, at most 85 % of the viewport high, scrolling inside, over a `--bg-backdrop` layer that closes it on tap; the content is centred. From 640 px it is the anchored popover, capped at `min(100vw − 2 × --spacing-sm, 44rem)`.
- `orientation="horizontal"` needs room for the grid and the fields side by side; on narrow screens keep the default vertical layout.
- Touch: day cells are 32 / 36 / 40 px by `size`; use `size="large"` on touch-first surfaces. The trigger, clear and split buttons each carry an invisible `aria-hidden` child (`data-slot="touch-target"`) shown only under `pointer-coarse:` that extends the hit area to at least 44 px tall.

## Examples

### Default

```vue
<script setup>
  import DatePickerRoot from '@aziontech/webkit/date-picker-root'
  import { ref } from 'vue'

  const date = ref(null)
</script>

<template>
  <DatePickerRoot
    v-model="date"
    aria-label="Start date"
  />
</template>
```

### Sizes

```vue
<script setup>
  import DatePickerRoot from '@aziontech/webkit/date-picker-root'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const start = ref(new Date(2026, 9, 8))
  const review = ref(new Date(2026, 9, 15))
  const end = ref(new Date(2026, 9, 22))
</script>

<template>
  <div class="flex flex-wrap items-start gap-4">
    <Field class="max-w-fit">
      <Field.Label>Start date</Field.Label>
      <DatePickerRoot
        v-model="start"
        size="small"
      />
    </Field>
    <Field class="max-w-fit">
      <Field.Label>Review date</Field.Label>
      <DatePickerRoot
        v-model="review"
        size="medium"
      />
    </Field>
    <Field class="max-w-fit">
      <Field.Label>End date</Field.Label>
      <DatePickerRoot
        v-model="end"
        size="large"
      />
    </Field>
  </div>
</template>
```

### Horizontal

```vue
<script setup>
  import DatePickerRoot from '@aziontech/webkit/date-picker-root'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const date = ref(null)
</script>

<template>
  <Field>
    <Field.Label>Maintenance start</Field.Label>
    <DatePickerRoot
      v-model="date"
      orientation="horizontal"
      clearable
      show-time
    />
  </Field>
</template>
```
