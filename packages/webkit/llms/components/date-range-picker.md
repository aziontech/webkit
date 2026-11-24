# Date Range Picker

> A time range for queries over time: logs, events, traces and metrics. After the Console Kit date-time range (quick ranges, a custom duration, absolute range with times, a range that ends now, previous and next, auto refresh, the time zone) and Cloudscape's date range picker. The value is one of three shapes: - **relative** — `{ type: 'relative', amount: 15, unit: 'minute' }`, read as "the last 15 minutes" and re-resolved against the clock on every query, so a live view keeps moving. With `snap: true` the start is rounded down to the start of the unit in the time zone: `{ amount: 1, unit: 'day', snap: true }` is **Today** (midnight to now), `unit: 'week'` is **This week** (from Sunday, like the month grid). - **absolute** — `{ type: 'absolute', start, end }`, two ISO 8601 instants. - **since** — `{ type: 'since', start }`, an ISO 8601 start and an end that is always now ("from the incident until now"). The trigger prints `Last 15 minutes`, `Today`, the absolute range in the selected time zone with its UTC offset (`Nov 10, 16:00 – 17:00 (UTC+00:00)`; the date is printed once when both ends are on the same day), or `Nov 10, 2026, 9:30 – now`. It never cuts the text off: a long value wraps onto a second line. The panel switches between Relative (first) and Absolute. Absolute has two views of one draft. It opens on the **calendar view**: the `DatePicker` month grid with only the weeks the month needs (five rows for most months; click a start day and an end day; its caption has Month and Year selects between the previous and next month arrows). A blue link-variant button under it, **Enter dates** (pencil icon), swaps the grid for the **fields view**: the Start and End rows, each label before its date and time on one line, typed or picked (each time field a `Combobox` that takes a typed time or lists the day in 30-minute steps, plus the current time when it falls between two, opened under the field and scrolled to the current time; the times are hidden with `showTime` off); there the link reads **Show calendar** and swaps back. Days picked on the grid fill the fields and typed values show on the grid. When the picker also offers relative ranges, an **End at now** checkbox sits beside the link in both views and makes a `since` range. Relative shows the quick ranges first, two columns when there is room (read down the first column, then the second), then, directly under them with no divider, a blue link-variant **Custom range** button (sliders icon; the custom duration in use is printed beside it); choosing it replaces the quick ranges with the Duration and Unit fields and a **Back to quick ranges** button, so the form stays out of the way until someone asks for it (owner decision RV-P2-1: the custom range reads as an action, not as one more quick range). The default quick ranges are Today, This week, Last minute, Last 5, 15 and 30 minutes, Last hour, Last 24 hours, Last 7, 30 and 90 days and Last year; `relativeOptions` replaces them. The panel opens on Relative unless the committed value is absolute or `since` (then Absolute). The panel does not name the time zone: the page states it beside the picker, always visible (`Times in UTC` or a Time zone select in the toolbar, see `blocks/view/events-explorer`), and the trigger of an absolute range carries its UTC offset. With `showTimeZone` the panel shows the time zone selector above Apply (a `Combobox`: type a city or a zone to filter the list), for a page that has no toolbar of its own to hold it. The footer starts with a compact **Refresh every** select, a ghost `Select` with a refresh glyph and a short label (`↻ 5 min`; Off, 10 sec … 1 hr; **5 minutes** by default), before Cancel and Apply on both tabs; it sets the auto-refresh interval whenever the panel offers relative ranges (`showRefresh` turns it off). Every select in the panel (Unit, Refresh every, the calendar's Month and Year) is the WebKit `Select`, never a native `select`. The panel commits only on Apply; Cancel and Escape drop the draft. Absolute boundaries are typed as wall-clock time in the selected zone and stored as instants, so the same value reads correctly in every zone. With `showStep`, Previous and Next move the range by its own length. On a phone (below 640 px) the panel is a full-width sheet at the bottom of the screen. Every range stays inside limits the page can set: `min` (unset: the start of the day five years ago), `max` (unset: the end of today; a later date allows future dates, for a maintenance window or an alert schedule) and `maxDuration` (unset: any length). They disable the days, months and years outside them in the calendar, drop the quick ranges that do not fit, and refuse a typed range or a custom duration that does not fit with a message. Date math uses `Intl` and the native `Date` only.

- Import: `import DateRangePicker from '@aziontech/webkit/date-range-picker'`
- Category: input · Surface: app · Structure: monolithic
- API as JSON: [date-range-picker.json](date-range-picker.json)

## When to use

- Use DateRangePicker for any start–end range: relative ('last 24 hours') or absolute, with or without times; turn times off for whole-day reports and billing periods. For one date use DatePicker; to display a moment in time use Timestamp.
- Filtering events, logs, traces or metrics by time, where "the last N minutes" must stay relative.
- Any range that needs times of day and a time zone, not only dates.
- Investigations that page through time window by window (`show-step`).
- Whole-day ranges for a report or a billing period: `range-selector-mode="absolute-only"` with `:show-time="false"`.
- Dashboards and live logs that re-run their query on a timer (`v-model:refresh-interval`, `@refresh`). Auto refresh is **on by default** (every 5 minutes), so every page must handle `@refresh` by re-running its query; a page that cannot re-run it passes `:show-refresh="false"` (or binds `v-model:refresh-interval` to `0` to start with it off).

## Do

- Keep relative and `since` values relative: resolve them to instants when the query runs (`now - amount × unit` to `now`, or `start` to `now`), never when the user picks them. `useTimeRange(value, { timeZone })` from `@aziontech/webkit/use-time-range` returns `from` and `to`, rounds `snap` ranges in the zone, and holds the window until `refresh()`; call that `refresh()` from `@refresh`. Its `TIME_RANGE_PRESETS` (last hour, 24 hours, 7 days, 30 days) go in `relative-options`.
- Fix the reference clock in tests, demos and server-rendered pages so labels and step limits are deterministic: `now` on the app's `ConfigProvider` covers every picker below it; the `now` prop overrides it for one picker.
- Bind `v-model:time-zone` to the user's saved preference, and show times elsewhere on the page in the same zone.
- Set `min` to the retention limit and `maxDuration` to the longest window the query can answer, instead of validating after Apply. The defaults (five years back to the end of today) suit logs and metrics; pass a later `max` only where a future range makes sense (a maintenance window, an alert schedule).
- State the time zone on the page, beside the picker and always visible (`Times in UTC`, or a Time zone `Select` when the person can change it), on every page that shows metrics and logs; the picker panel does not repeat it.
- Name the picker after what it filters (`aria-label="Events time range"`).
- Always handle `@refresh`: the picker refreshes every 5 minutes unless the page turns it off, so a page that ignores the event offers a refresh that does nothing.

## Don’t

- A single date or a date and time → use `date-picker`.
- A fixed list of named intervals and nothing custom → use `select` or `toggle-group`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [date-picker](date-picker.md) — the trigger control, the panel, the month grid, the date and time fields and the time zone selector come from its internal parts, so both pickers look and behave the same. Split: DatePicker picks one date (optionally with a time); DateRangePicker owns every range and keeps a relative window relative.
- [timestamp](timestamp.md) — displays a moment in time; both read the `ConfigProvider` `timeZone`.
- [config-provider](config-provider.md) — its `timeZone` is the zone the picker formats in while `v-model:time-zone` is unbound.
- [field](field.md) — inside a `Field`, the trigger takes the field's label (`for` points at it), description, `invalid` and `disabled`.
- [property-filter](property-filter.md) — the query bar it sits next to in an events toolbar.
- [chart](chart.md) — the histogram whose brush usually writes an absolute range back into this picker.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `relativeOptions` | `RelativeOption[]` | `Today, This week, 1m, 5m, 15m, 30m, 1h, 24h, 7d, 30d, 90d, 1y` | false | Quick ranges listed on the Relative tab. |
| `timeZones` | `string[]` | `[]` | false | Zones offered by the selector. Empty falls back to the zones `Intl` supports. |
| `showTimeZone` | `boolean` | `false` | false | Shows the time zone selector in the panel. Off, the panel says nothing about the zone and the page states it. |
| `showTime` | `boolean` | `true` | false | Shows the start and end time fields of an absolute range. Off, a range covers whole days (a report or billing period). |
| `showStep` | `boolean` | `false` | false | Shows Previous and Next buttons that move the range back or forward by its own length. |
| `showRefresh` | `boolean` | `true` | false | Shows the Refresh every selector in the panel while it offers relative ranges; bind v-model:refresh-interval and run the query on refresh. |
| `rangeSelectorMode` | `'default' \| 'relative-only' \| 'absolute-only'` | `'default'` | false | Which kinds of range the panel offers. |
| `min` | `Date` | `undefined (the start of the day five years before today)` | false | Earliest selectable instant. Unset, the start of the day five years before today. |
| `max` | `Date` | `undefined (the end of today)` | false | Latest selectable instant. Unset, the end of today; pass a later date to allow future dates. |
| `maxDuration` | `DateRangeDuration` | `undefined` | false | Longest range a person may pick, for example 90 days. Unset, any length between min and max. |
| `now` | `Date` | `undefined` | false | Reference clock for relative ranges and stepping. Unset uses the nearest `ConfigProvider`'s `now`, then the real clock. |
| `placeholder` | `string` | `''` | false | Trigger text with no range. Empty uses the locale catalog. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the trigger. Empty uses the Field label inside a `Field`, else the locale catalog. |
| `disabled` | `boolean` | `false` | false | Disables the trigger and the step buttons. |
| `invalid` | `boolean` | `false` | false | Marks the trigger invalid: sets `aria-invalid` and the danger border. An enclosing `Field`'s `invalid` sets it too. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled (`v-model:open` unbound). |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token of the trigger and the panel controls. |
| `modelValue` | `DateRangeValue \| null` | `null` | false | Two-way value (`v-model`). |
| `timeZone` | `string` | `''` | false | Two-way value (`v-model:timeZone`). |
| `open` | `boolean` | `undefined` | false | Two-way value (`v-model:open`). |
| `refreshInterval` | `number` | `300` | false | Two-way value (`v-model:refreshInterval`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `refresh` | `()` | On every auto-refresh tick while `refreshInterval` is above 0 (5 minutes by default), Refresh every is offered, the picker is enabled and the page is visible. A timer signal, not a user action: it carries no DOM event. |

## v-model

| Model                     | Type                     | Default     | Emits                    | Notes                                                                                                                                                                                                                                                                                                                                           |
| ------------------------- | ------------------------ | ----------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`                 | `DateRangeValue \| null` | `null`      | `update:modelValue`      | The committed range: relative (last N units, re-resolved against now) or absolute (ISO instants). Set on Apply with a valid draft, or by Previous / Next (always an absolute range).                                                                                                                                                            |
| `v-model:timeZone`        | `string`                 | `''`        | `update:timeZone`        | IANA time zone the absolute range is typed and shown in; empty uses the local zone. Set on Apply after the zone changed in the panel.                                                                                                                                                                                                           |
| `v-model:refreshInterval` | `number`                 | `300`       | `update:refreshInterval` | Auto-refresh interval in seconds; `0` is off. Set on Apply from the panel's Refresh every select (Off is 0; a bound value outside the list is kept as its own entry). While above 0 and Refresh every is offered (`showRefresh`, not `absolute-only`) the picker fires `refresh` on every tick; the default is 5 minutes, so handle `@refresh`. |
| `v-model:open`            | `boolean`                | `undefined` | `update:open`            | Open state of the panel via `defineModel('open')`: the trigger, Apply, Cancel, `Esc` and an outside click update it. Unbound, the picker keeps it itself and starts at `defaultOpen`.                                                                                                                                                           |

## States

- Visual states: `default`, `hover`, `focus-visible`, `open`, `disabled`; the panel shows an inline error after an Apply that the draft cannot satisfy, and at once (without waiting for Apply) when both ends of an absolute range are set and the end is not after the start.
- `data-state="open|closed"` on the root and the panel; `data-size`; `data-disabled`; `data-invalid` on the root and the trigger shell (own `invalid` or the enclosing `Field`'s, with `aria-invalid` on the trigger and the danger border); `data-empty` on the trigger with no value; `data-selected` on the chosen quick range.
- The Next button is disabled while the range ends now (relative or `since`) or when the step would pass `max` (or now); Previous is disabled when the step would pass `min`.
- `data-view="quick|custom"` on the Relative tab body: `quick` lists the quick ranges and the Custom range row, `custom` shows the Duration (a `number-input` with no stepper buttons) and Unit fields in their place. `data-selected` on the Custom range row and on the custom duration group when the draft is a custom duration (no quick range picked); the row then also shows that duration (`Last 2 days`).
- Limits: days, months and years outside `min`/`max` are disabled in the calendar; while a start day is picked and the end is not, the days further than `maxDuration` from it are disabled too; quick ranges that start before `min` or run longer than `maxDuration` are not listed.
- With an auto-refresh interval above 0 the trigger's accessible name ends with the interval (`…, refreshes every 30 seconds`); the trigger draws no refresh glyph (owner 2026-11-18: the interval lives in the panel's Refresh every select).
- `data-view="calendar|fields"` on the Absolute tab body; `data-inline-labels` on its date fields.
- `data-side` (`bottom` | `top`) and `data-align` (`start`) on the calendar panel mirror where it landed after flipping; `start` follows the text direction, so under `rtl` the panel lines up with the field's right edge

## Accessibility

- Visible focus: a 2 px `--ring-color` ring inset on each trigger segment; the quick ranges ring their row when the radio inside has focus.
- Keyboard map: `Enter`/`Space` on the trigger opens the panel and the focus trap moves into it; `Tab` cycles inside the panel; the range type is a `ToggleGroup` (arrow keys); the quick ranges are native radios (`ArrowUp`/`ArrowDown` move and select, down the first column and then the second, the order they are read in); Custom range is a link-variant button after them (`Enter`/`Space` shows the Duration and Unit fields and moves focus to Duration), and Back to quick ranges is the first button of that view (it returns to the list and focuses Custom range); on the Absolute tab the order is the grid (or the Start and End fields), End at now, then the view button: **Enter dates** (`Enter`/`Space` shows the fields and moves focus to the Start date) and **Show calendar** (`Enter`/`Space` shows the grid and moves focus to its focusable day); the End at now checkbox toggles with `Space`; then Refresh every, Cancel and Apply in the footer; Unit, Refresh every and the calendar's Month and Year are WebKit `Select`s (`Enter`/`Space`/`ArrowDown` open the list, the arrows move, typing jumps to an option, `Escape` closes only the list); the time zone selector is a `Combobox`; the range type lists Relative before Absolute; the grid keeps the `date-picker` keyboard map; a time field keeps the `combobox` keyboard map (focus or `ArrowDown` opens the 30-minute list, `Enter` takes the highlighted time or the typed one, `Escape` closes only the list); `Escape` closes without committing and returns focus to the trigger. On a phone a tap on the backdrop closes the sheet like Cancel.
- ARIA: the trigger has `aria-haspopup="dialog"`, `aria-expanded` and a name that starts with the picker's label and contains the visible range and, with auto refresh on, the interval (inside a `Field` with no `ariaLabel`, the Field label names it and the trigger also carries the Field's `aria-describedby` and `aria-invalid`, plus `requiredId` when required); the panel is a named `dialog`; the custom duration is a `group` named "Custom range" whose duration and unit have visible labels; the quick ranges are a `fieldset` with a `legend`; End at now is a `checkbox` named by its visible `label`; the view switch is a native `button` named by its visible text; Unit is a `combobox` button (WebKit `Select`) labelled by its visible text through `aria-labelledby`, and Refresh every is a `combobox` button named "Refresh every" by `aria-label` (it shows only the glyph and the short interval); the calendar's Month and Year selects are named `Month` and `Year`; the error is `role="alert"` and described from the duration field; Previous and Next are named buttons; the sheet backdrop is `aria-hidden`.
- Targets: options are 32 px high (44 px on `pointer: coarse`); the selects are 44 px high and the step buttons 44 px wide on `pointer: coarse`.
- The custom duration is one two-column grid (a third for the duration, two thirds for the Unit select); Refresh every, Cancel and Apply share the footer row, Refresh every at the start edge and the buttons at the end edge, in both directions (checked at 320, 390 and 1280 px, and right-to-left at 390 px, in `src/test/date-picker-readability.test.ts`).
- Quick ranges layout: the `legend` and every option are padded `var(--spacing-xs)` inline, so the heading and the option labels start on one inline edge in both directions (checked left-to-right and right-to-left in `src/test/date-picker-readability.test.ts`).
- Initial focus: with `rangeSelectorMode="relative-only"` (no range-type toggle) the focus trap lands on the checked quick range, the one the trigger shows, or on Custom range when the value is a custom duration.
- Contrast ≥4.5:1 from the semantic text tokens.

## Right-to-left

- Layout: logical utilities only (`border-s`, `border-e`, `ps-`/`pe-`, `end-`, `text-start`); the panel anchors to the start edge of the trigger.
- Icons: the Previous and Next chevrons and the Custom range and Back to quick ranges chevrons mirror (the stylesheet mirrors directional glyphs; the step buttons also carry `rtl:-scale-x-100`); the clock and calendar glyphs do not.
- Keyboard: the grid's arrow keys follow the reading direction (from `date-picker`).
- User data: the range text sits in `<bdi>`.
- Teleported content: the panel binds `dir` and `lang` from the nearest `ConfigProvider` (`usePortalLocale`).

## Internationalization

| Key                                                             | English source                                            | Override prop          |
| --------------------------------------------------------------- | --------------------------------------------------------- | ---------------------- |
| `dateRangePicker.label`                                         | Time range                                                | `ariaLabel`            |
| `dateRangePicker.placeholder`                                   | Select a time range                                       | `placeholder`          |
| `dateRangePicker.dialog`                                        | Choose a time range                                       | —                      |
| `dateRangePicker.rangeType`                                     | Range type                                                | —                      |
| `dateRangePicker.relative` / `absolute`                         | Relative / Absolute                                       | —                      |
| `datePicker.month` / `year`                                     | Month / Year (names of the calendar caption selects)      | —                      |
| `dateRangePicker.quickRanges`                                   | Quick ranges                                              | —                      |
| `dateRangePicker.custom`                                        | Custom range                                              | —                      |
| `dateRangePicker.showQuickRanges`                               | Back to quick ranges                                      | —                      |
| `dateRangePicker.amount` / `unit`                               | Duration / Unit                                           | —                      |
| `dateRangePicker.second` … `year`                               | Last second / Last {count} seconds … (plural)             | `RelativeOption.label` |
| `dateRangePicker.unitSecond` … `unitYear`                       | Seconds … Years                                           | —                      |
| `dateRangePicker.today` / `thisWeek` / `thisMonth` / `thisYear` | Today / This week / This month / This year                | `RelativeOption.label` |
| `dateRangePicker.now`                                           | now                                                       | —                      |
| `dateRangePicker.untilNow`                                      | End at now                                                | —                      |
| `dateRangePicker.enterDates`                                    | Enter dates                                               | —                      |
| `dateRangePicker.showCalendar`                                  | Show calendar                                             | —                      |
| `dateRangePicker.refreshEvery`                                  | Refresh every                                             | —                      |
| `dateRangePicker.refreshOff`                                    | Off                                                       | —                      |
| `dateRangePicker.refreshSecond` … `refreshHour`                 | refreshes every second / every {count} seconds … (plural) | —                      |
| `dateRangePicker.apply` / `cancel`                              | Apply / Cancel                                            | —                      |
| `dateRangePicker.previous` / `next`                             | Previous range / Next range                               | —                      |
| `dateRangePicker.incomplete`                                    | Choose a start and an end.                                | —                      |
| `dateRangePicker.order`                                         | The end must be after the start.                          | —                      |
| `dateRangePicker.outOfBounds`                                   | Choose a range inside the allowed dates.                  | —                      |
| `dateRangePicker.tooLong`                                       | Choose a range of {duration} or less.                     | —                      |
| `dateRangePicker.invalidAmount`                                 | Enter a whole number greater than 0.                      | —                      |

- Active locale: the nearest `ConfigProvider`'s `locale`, else the device locale (`navigator.language`); the server render and the hydrating client use `en-US`, and the device locale applies right after mount.
- What the person sends stays unambiguous: an absolute `v-model` carries `start` and `end` as ISO 8601 instants (`2026-11-15T00:00:00.000Z`), a `since` one its `start` the same way, and a relative one carries `amount`, `unit` and `snap`, whatever the display format; `refreshInterval` is a number of seconds.
- The two-word tab labels (`Relative` / `Absolute` and their translations) fit the toggle at 320 px; the tab labels, the quick ranges and the trigger wrap instead of being cut off, so a longer translation still reads in full.
- Formatting: the absolute range goes through `Intl.DateTimeFormat` in the active locale; the Refresh every intervals (`10 seconds`, `1 minute`) and the `maxDuration` in the too-long message (`90 days`) through `Intl.NumberFormat` with a long unit; the relative labels through the plural rules of the active locale; the grid, the date and time fields and the time zone selector use the `datePicker` keys.

## Responsive

- No truncation at any width: the trigger is inline and capped at its container (`max-w-full`); its value wraps (`overflow-wrap: anywhere`) and the trigger grows taller (its height is a minimum), with the UTC offset kept on one line. The panel's labels, quick ranges and field values are never cut off (checked at 320, 390 and 1280 px in `src/test/date-picker-readability.test.ts`).
- Container query: the quick ranges are one column below 15 rem of list width and two columns from there (`@container` on the fieldset); the two columns fill top to bottom, half the ranges each (rounded up in the first).
- Desktop (from 640 px): an anchored popover exactly as thin as the month grid on both tabs (seven day cells of the size token plus `--spacing-sm` on each side: 276 px at `medium`), capped at the viewport minus `--spacing-sm` on each side, scrolling inside itself when taller than the viewport. The Absolute/Relative switch and the footer (Refresh every, Cancel, Apply, and the zone selector with `showTimeZone`) stay fixed and only the tab body between them scrolls; the Absolute tab shows either the calendar or the fields, never both, so every view of both tabs, Apply included, fits without scrolling on a 1280 × 720 laptop and a 390 × 664 phone (`src/test/date-picker-readability.test.ts`). The time list opens under its field as a `Combobox` list, so it never widens the panel (checked in `src/test/date-picker-readability.test.ts`).
- Phone (below 640 px, `max-sm:`): a sheet — full width, attached to the bottom of the screen, at most 85 % of the viewport high, scrolling inside, padded for the home indicator (`safe-area-inset-bottom`), over a `--bg-backdrop` layer; the footer keeps Refresh every at the start edge and Cancel and Apply at the end edge.
- Touch: options, selects and step buttons are 44 px on `pointer: coarse`; the trigger and the step buttons each carry an invisible `aria-hidden` child (`data-slot="touch-target"`) shown only under `pointer-coarse:` that extends the hit area to 44 px tall; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({ type: 'relative', amount: 15, unit: 'minute', key: 'last-15-minutes' })
  const runQuery = () => {}
</script>

<template>
  <DateRangePicker
    v-model="range"
    aria-label="Events time range"
    @refresh="runQuery"
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

  const range = ref({ type: 'relative', amount: 24, unit: 'hour', key: 'last-24-hours' })
  const runQuery = () => {}
</script>

<template>
  <DateRangePicker
    v-model="range"
    range-selector-mode="relative-only"
    aria-label="Metrics interval"
    @refresh="runQuery"
  />
</template>
```
