---
name: date-range-picker
category: input
structure: monolithic
status: implemented
spec_version: 16
template: 2
checksum: 4ae449e18917bc0b844ea537e6e5159453f8ca1a7c92ac04bdabe5918ad420f4
created: 2026-11-11
last_updated: 2026-11-21
---

# DateRangePicker — Component Spec

## Purpose

A time range for queries over time: logs, events, traces and metrics. After the Console Kit date-time range (quick ranges, a custom duration, absolute range with times, a range that ends now, previous and next, auto refresh, the time zone) and Cloudscape's date range picker. The value is one of three shapes:

- **relative** — `{ type: 'relative', amount: 15, unit: 'minute' }`, read as "the last 15 minutes" and re-resolved against the clock on every query, so a live view keeps moving. With `snap: true` the start is rounded down to the start of the unit in the time zone: `{ amount: 1, unit: 'day', snap: true }` is **Today** (midnight to now), `unit: 'week'` is **This week** (from Sunday, like the month grid).
- **absolute** — `{ type: 'absolute', start, end }`, two ISO 8601 instants.
- **since** — `{ type: 'since', start }`, an ISO 8601 start and an end that is always now ("from the incident until now").

The trigger prints `Last 15 minutes`, `Today`, the absolute range in the selected time zone with its UTC offset (`Nov 10, 16:00 – 17:00 (UTC+00:00)`; the date is printed once when both ends are on the same day), or `Nov 10, 2026, 9:30 – now`. It never cuts the text off: a long value wraps onto a second line. The panel switches between Relative (first) and Absolute. Absolute has two views of one draft. It opens on the **calendar view**: the `DatePicker` month grid with only the weeks the month needs (five rows for most months; click a start day and an end day; its caption has Month and Year selects between the previous and next month arrows). A blue link-variant button under it, **Enter dates** (pencil icon), swaps the grid for the **fields view**: the Start and End rows, each label before its date and time on one line, typed or picked (each time field a `Combobox` that takes a typed time or lists the day in 30-minute steps, plus the current time when it falls between two, opened under the field and scrolled to the current time; the times are hidden with `showTime` off); there the link reads **Show calendar** and swaps back. Days picked on the grid fill the fields and typed values show on the grid. When the picker also offers relative ranges, an **End at now** checkbox sits beside the link in both views and makes a `since` range. Relative shows the quick ranges first, two columns when there is room (read down the first column, then the second), then, directly under them with no divider, a blue link-variant **Custom range** button (sliders icon; the custom duration in use is printed beside it); choosing it replaces the quick ranges with the Duration and Unit fields and a **Back to quick ranges** button, so the form stays out of the way until someone asks for it (owner decision RV-P2-1: the custom range reads as an action, not as one more quick range). The default quick ranges are Today, This week, Last minute, Last 5, 15 and 30 minutes, Last hour, Last 24 hours, Last 7, 30 and 90 days and Last year; `relativeOptions` replaces them. The panel opens on Relative unless the committed value is absolute or `since` (then Absolute). The panel does not name the time zone: the page states it beside the picker, always visible (`Times in UTC` or a Time zone select in the toolbar, see `blocks/view/events-explorer`), and the trigger of an absolute range carries its UTC offset. With `showTimeZone` the panel shows the time zone selector above Apply (a `Combobox`: type a city or a zone to filter the list), for a page that has no toolbar of its own to hold it. The footer starts with a compact **Refresh every** select, a ghost `Select` with a refresh glyph and a short label (`↻ 5 min`; Off, 10 sec … 1 hr; **5 minutes** by default), before Cancel and Apply on both tabs; it sets the auto-refresh interval whenever the panel offers relative ranges (`showRefresh` turns it off). Every select in the panel (Unit, Refresh every, the calendar's Month and Year) is the Azion UI `Select`, never a native `select`. The panel commits only on Apply; Cancel and Escape drop the draft. Absolute boundaries are typed as wall-clock time in the selected zone and stored as instants, so the same value reads correctly in every zone. With `showStep`, Previous and Next move the range by its own length. On a phone (below 640 px) the panel is a full-width sheet at the bottom of the screen. Every range stays inside limits the page can set: `min` (unset: the start of the day five years ago), `max` (unset: the end of today; a later date allows future dates, for a maintenance window or an alert schedule) and `maxDuration` (unset: any length). They disable the days, months and years outside them in the calendar, drop the quick ranges that do not fit, and refuse a typed range or a custom duration that does not fit with a message. Date math uses `Intl` and the native `Date` only.

## When to use

- Use DateRangePicker for any start–end range: relative ('last 24 hours') or absolute, with or without times; turn times off for whole-day reports and billing periods. For one date use DatePicker; to display a moment in time use Timestamp.
- Filtering events, logs, traces or metrics by time, where "the last N minutes" must stay relative.
- Any range that needs times of day and a time zone, not only dates.
- Investigations that page through time window by window (`show-step`).
- Whole-day ranges for a report or a billing period: `range-selector-mode="absolute-only"` with `:show-time="false"`.
- Dashboards and live logs that re-run their query on a timer (`v-model:refresh-interval`, `@refresh`). Auto refresh is **on by default** (every 5 minutes), so every page must handle `@refresh` by re-running its query; a page that cannot re-run it passes `:show-refresh="false"` (or binds `v-model:refresh-interval` to `0` to start with it off).

## When NOT to use

- A single date or a date and time → use `date-picker`.
- A fixed list of named intervals and nothing custom → use `select` or `toggle-group`.

## Related

- `date-picker` — the trigger control, the panel, the month grid, the date and time fields and the time zone selector come from its internal parts, so both pickers look and behave the same. Split: DatePicker picks one date (optionally with a time); DateRangePicker owns every range and keeps a relative window relative.
- `timestamp` — displays a moment in time; both read the `ConfigProvider` `timeZone`.
- `config-provider` — its `timeZone` is the zone the picker formats in while `v-model:time-zone` is unbound.
- `field` — inside a `Field`, the trigger takes the field's label (`for` points at it), description, `invalid` and `disabled`.
- `property-filter` — the query bar it sits next to in an events toolbar.
- `chart` — the histogram whose brush usually writes an absolute range back into this picker.

## Best practices

- Keep relative and `since` values relative: resolve them to instants when the query runs (`now - amount × unit` to `now`, or `start` to `now`), never when the user picks them. `useTimeRange(value, { timeZone })` from `@aziontech/ui/use-time-range` returns `from` and `to`, rounds `snap` ranges in the zone, and holds the window until `refresh()`; call that `refresh()` from `@refresh`. Its `TIME_RANGE_PRESETS` (last hour, 24 hours, 7 days, 30 days) go in `relative-options`.
- Fix the reference clock in tests, demos and server-rendered pages so labels and step limits are deterministic: `now` on the app's `ConfigProvider` covers every picker below it; the `now` prop overrides it for one picker.
- Bind `v-model:time-zone` to the user's saved preference, and show times elsewhere on the page in the same zone.
- Set `min` to the retention limit and `maxDuration` to the longest window the query can answer, instead of validating after Apply. The defaults (five years back to the end of today) suit logs and metrics; pass a later `max` only where a future range makes sense (a maintenance window, an alert schedule).
- State the time zone on the page, beside the picker and always visible (`Times in UTC`, or a Time zone `Select` when the person can change it), on every page that shows metrics and logs; the picker panel does not repeat it.
- Name the picker after what it filters (`aria-label="Events time range"`).
- Always handle `@refresh`: the picker refreshes every 5 minutes unless the page turns it off, so a page that ignores the event offers a refresh that does nothing.

## Usage

```vue
<script setup>
  import DateRangePicker from '@aziontech/ui/date-range-picker'
  import { ref } from 'vue'

  const range = ref({ type: 'relative', amount: 15, unit: 'minute', key: 'last-15-minutes' })
  const timeZone = ref('UTC')
  const refreshInterval = ref(300)
  const runQuery = () => {}
</script>

<template>
  <DateRangePicker
    v-model="range"
    v-model:time-zone="timeZone"
    v-model:refresh-interval="refreshInterval"
    show-step
    aria-label="Events time range"
    @refresh="runQuery"
  />
</template>
```

## Props

| Prop                | Type                                              | Default                                                       | Required | JSDoc                                                                                                                                      |
| ------------------- | ------------------------------------------------- | ------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `relativeOptions`   | `RelativeOption[]`                                | Today, This week, 1m, 5m, 15m, 30m, 1h, 24h, 7d, 30d, 90d, 1y | false    | Quick ranges listed on the Relative tab.                                                                                                   |
| `timeZones`         | `string[]`                                        | `[]`                                                          | false    | Zones offered by the selector. Empty falls back to the zones `Intl` supports.                                                              |
| `showTimeZone`      | `boolean`                                         | `false`                                                       | false    | Shows the time zone selector in the panel. Off, the panel says nothing about the zone and the page states it.                              |
| `showTime`          | `boolean`                                         | `true`                                                        | false    | Shows the start and end time fields of an absolute range. Off, a range covers whole days (a report or billing period).                     |
| `showStep`          | `boolean`                                         | `false`                                                       | false    | Shows Previous and Next buttons that move the range back or forward by its own length.                                                     |
| `showRefresh`       | `boolean`                                         | `true`                                                        | false    | Shows the Refresh every selector in the panel while it offers relative ranges; bind v-model:refresh-interval and run the query on refresh. |
| `rangeSelectorMode` | `'default' \| 'relative-only' \| 'absolute-only'` | `'default'`                                                   | false    | Which kinds of range the panel offers.                                                                                                     |
| `min`               | `Date`                                            | undefined (the start of the day five years before today)      | false    | Earliest selectable instant. Unset, the start of the day five years before today.                                                          |
| `max`               | `Date`                                            | undefined (the end of today)                                  | false    | Latest selectable instant. Unset, the end of today; pass a later date to allow future dates.                                               |
| `maxDuration`       | `DateRangeDuration`                               | undefined                                                     | false    | Longest range a person may pick, for example 90 days. Unset, any length between min and max.                                               |
| `now`               | `Date`                                            | undefined                                                     | false    | Reference clock for relative ranges and stepping. Unset uses the nearest `ConfigProvider`'s `now`, then the real clock.                    |
| `placeholder`       | `string`                                          | `''`                                                          | false    | Trigger text with no range. Empty uses the locale catalog.                                                                                 |
| `ariaLabel`         | `string`                                          | `''`                                                          | false    | Accessible name of the trigger. Empty uses the Field label inside a `Field`, else the locale catalog.                                      |
| `disabled`          | `boolean`                                         | `false`                                                       | false    | Disables the trigger and the step buttons.                                                                                                 |
| `invalid`           | `boolean`                                         | `false`                                                       | false    | Marks the trigger invalid: sets `aria-invalid` and the danger border. An enclosing `Field`'s `invalid` sets it too.                        |
| `defaultOpen`       | `boolean`                                         | `false`                                                       | false    | Initial open state when uncontrolled (`v-model:open` unbound).                                                                             |
| `size`              | `'small' \| 'medium' \| 'large'`                  | `'medium'`                                                    | false    | Size token of the trigger and the panel controls.                                                                                          |

**Booleans that default to true.** `showTime` defaults to `true`: an events toolbar always states the times of its boundaries. Inverting it would break every consumer, so it is recorded here as an exception to props.md's default-false rule. `showRefresh` defaults to `true` (owner direction 2026-11-18, decision RV-P4): every observability time picker the owner benchmarked offers auto refresh next to the range (Grafana, CloudWatch, Kibana; Vercel and Supabase as a Live mode), so the picker always offers it; it is hidden on an `absolute-only` picker, whose fixed range never changes, and a page that cannot re-run its query passes `:show-refresh="false"`. While it is hidden the picker never ticks, whatever `refreshInterval` holds. `refreshInterval` defaults to `300` (5 minutes, owner direction 2026-11-18, decision RV-S3), so auto refresh is on until the page or the person turns it off. `showTimeZone` defaults to `false` (owner review 2026-11-18): like Grafana, Elastic, Cloudscape and CloudWatch, the zone is changed elsewhere unless the page opts in; since owner decision RV-D2a (2026-11-18) the panel no longer names the zone at all, and the page states it beside the picker. The component is new in 6.0, so no released consumer depends on the old default. **Limits by default** (owner decision RV-D2c, 2026-11-18): `min` and `max` default to five years back and the end of today, computed from the reference clock (`now`) in the picker's zone, because a time range almost always filters past data (logs, events, metrics, billing) and an unbounded calendar invites a range the backend cannot answer. A page that needs future dates passes a later `max`.

Types (exported from the component): `DateRangeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'`; `DateRangeValue = { type: 'relative'; amount: number; unit: DateRangeUnit; key?: string; snap?: boolean } | { type: 'absolute'; start: string; end: string } | { type: 'since'; start: string }`; `RelativeOption = { key: string; amount: number; unit: DateRangeUnit; label?: string; snap?: boolean }` (an empty `label` prints `Last {count} {unit}` from the catalog, or `Today` / `This week` / `This month` / `This year` for a snapped option of 1 day, week, month or year); `DateRangeRefreshUnit = 'second' | 'minute' | 'hour'`; `DateRangeDuration = { amount: number; unit: DateRangeUnit }` (the `maxDuration` shape, the same amount and unit as a relative range).

## v-model

| Model                     | Type                     | Default     | Emits                    | Notes                                                                                                                                                                                                                                                                                                                                           |
| ------------------------- | ------------------------ | ----------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`                 | `DateRangeValue \| null` | `null`      | `update:modelValue`      | The committed range: relative (last N units, re-resolved against now) or absolute (ISO instants). Set on Apply with a valid draft, or by Previous / Next (always an absolute range).                                                                                                                                                            |
| `v-model:timeZone`        | `string`                 | `''`        | `update:timeZone`        | IANA time zone the absolute range is typed and shown in; empty uses the local zone. Set on Apply after the zone changed in the panel.                                                                                                                                                                                                           |
| `v-model:refreshInterval` | `number`                 | `300`       | `update:refreshInterval` | Auto-refresh interval in seconds; `0` is off. Set on Apply from the panel's Refresh every select (Off is 0; a bound value outside the list is kept as its own entry). While above 0 and Refresh every is offered (`showRefresh`, not `absolute-only`) the picker fires `refresh` on every tick; the default is 5 minutes, so handle `@refresh`. |
| `v-model:open`            | `boolean`                | `undefined` | `update:open`            | Open state of the panel via `defineModel('open')`: the trigger, Apply, Cancel, `Esc` and an outside click update it. Unbound, the picker keeps it itself and starts at `defaultOpen`.                                                                                                                                                           |

## Events

| Event     | Payload | Notes                                                                                                                                                                                                                      |
| --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `refresh` | `()`    | On every auto-refresh tick while `refreshInterval` is above 0 (5 minutes by default), Refresh every is offered, the picker is enabled and the page is visible. A timer signal, not a user action: it carries no DOM event. |

## Slots

_none_ — the trigger, the panel and its two tabs are fixed parts.

## States

- Visual states: `default`, `hover`, `focus-visible`, `open`, `disabled`; the panel shows an inline error after an Apply that the draft cannot satisfy, and at once (without waiting for Apply) when both ends of an absolute range are set and the end is not after the start.
- `data-state="open|closed"` on the root and the panel; `data-size`; `data-disabled`; `data-invalid` on the root and the trigger shell (own `invalid` or the enclosing `Field`'s, with `aria-invalid` on the trigger and the danger border); `data-empty` on the trigger with no value; `data-selected` on the chosen quick range.
- The Next button is disabled while the range ends now (relative or `since`) or when the step would pass `max` (or now); Previous is disabled when the step would pass `min`.
- `data-view="quick|custom"` on the Relative tab body: `quick` lists the quick ranges and the Custom range row, `custom` shows the Duration (a `number-input` with no stepper buttons) and Unit fields in their place. `data-selected` on the Custom range row and on the custom duration group when the draft is a custom duration (no quick range picked); the row then also shows that duration (`Last 2 days`).
- Limits: days, months and years outside `min`/`max` are disabled in the calendar; while a start day is picked and the end is not, the days further than `maxDuration` from it are disabled too; quick ranges that start before `min` or run longer than `maxDuration` are not listed.
- With an auto-refresh interval above 0 the trigger's accessible name ends with the interval (`…, refreshes every 30 seconds`); the trigger draws no refresh glyph (owner 2026-11-18: the interval lives in the panel's Refresh every select).
- `data-view="calendar|fields"` on the Absolute tab body; `data-inline-labels` on its date fields.
- `data-side` (`bottom` | `top`) and `data-align` (`start`) on the calendar panel mirror where it landed after flipping; `start` follows the text direction, so under `rtl` the panel lines up with the field's right edge

## Behaviour

- Opening seeds the draft from the committed value and picks the tab: a relative value opens the Relative tab with its quick range selected and its amount and unit in the custom fields; no value opens the Relative tab (the first tab) with the first quick range selected; an absolute value (its boundaries as wall-clock time in the zone) or a `since` value (End at now on) opens the Absolute tab. `relative-only` and `absolute-only` show only their own tab.
- The Absolute tab opens on the calendar view every time the panel opens or the tab is chosen. The month grid's caption reads `‹ Month ⌄ Year ⌄ ›` (the arrows move one month; the Month and Year selects jump straight to a month or a year, the years running from `min` to `max`, or ten years either side of today, and months fully outside `min`/`max` disabled); the grid has as many week rows as the month needs (five or six, four for a February that starts on Sunday); the first click sets the start day, the second the end day, and a second click before the start swaps them. **Enter dates** swaps the grid for the Start and End rows (date and time, typed or picked from the 30-minute list) and moves focus to the Start date; **Show calendar** swaps back and moves focus to the grid's focusable day. Both views edit the same draft, so nothing is lost on a swap. The fields view is the place to set times and the fastest way to type a known range.
- End at now works in both views: in the calendar view the grid then picks only the start day (one click, no end), and in the fields view only the start date and time are shown; the value is `{ type: 'since', start }` either way.
- The Relative tab opens on the quick ranges. **Custom range** replaces them with the Duration and Unit fields (seeded from the picked quick range) and moves focus to Duration; from then the draft is a custom duration. **Back to quick ranges** returns to the list and focuses the Custom range row; if the fields still match the quick range picked before, that range is picked again, else the custom duration stays the draft and the row shows it. Switching tabs returns to the list.
- Picking a quick range copies its amount and unit into the custom fields; editing the amount or the unit makes the draft a custom duration and clears the quick range.
- Limits: unset, `min` is the start of the day five years before today and `max` the end of today, both in the picker's zone from the reference clock. Apply refuses a custom duration longer than `maxDuration` or reaching before `min`, and an absolute or `since` range outside `min`/`max` or longer than `maxDuration`; a range longer than `maxDuration` is flagged as soon as both ends are set (`Choose a range of 90 days or less.`). The Year select runs from `min`'s year to `max`'s. Previous is disabled when the step would pass `min`.
- End at now is offered only when the panel offers relative ranges too (`rangeSelectorMode` `default`): an `absolute-only` picker promises absolute values, so it never emits `since`.
- End at now on: the grid and the fields pick the start only (one day, one time) and the value is `{ type: 'since', start }`; off again, the end comes back as now.
- The Relative tab's Custom range link sits directly under the quick ranges, with no divider between them.
- Auto refresh: on by default every 5 minutes. The Refresh every select is a draft like the range; Apply writes `refreshInterval` in seconds (0 for Off). The timer starts after mount, restarts when the interval changes, stops while disabled, while Refresh every is hidden (`showRefresh` off or `absolute-only`) and on unmount, and skips ticks while the page is hidden.
- Changing the zone in the panel keeps the same instants and re-expresses the draft in the new zone; the trigger of a committed absolute range re-labels when `timeZone` changes.
- Apply validates: a custom duration must be a whole number above 0; an absolute range needs a start and an end, the end after the start, and both inside `min` and `max`; a `since` start must be before now, after `min` and within `maxDuration` of now; a custom duration must fit `min` and `maxDuration`. The message is announced (`role="alert"`) and the panel stays open. An end that is not after the start is flagged as soon as it is typed or picked. The empty date fields show a hint (`e.g. Jan 31, 2026`) and the empty time fields `hh:mm`, so an empty end never reads as a value.
- Previous and Next resolve the current value (relative and `since` values against `now`, snapped ranges in the zone) and emit the absolute range shifted by its length.

## Motion & Animations

| Trigger         | Animation / Transition                       | Token (see `contributing/docs/TOKENS.md` § Animations) | Reduced-motion fallback         |
| --------------- | -------------------------------------------- | ------------------------------------------------------ | ------------------------------- |
| panel open      | `animate-popup-scale-in`                     | semantic (150ms · cubic-bezier)                        | `motion-reduce:animate-none`    |
| panel close     | `animate-popup-scale-out`                    | semantic (110ms · cubic-bezier)                        | `motion-reduce:animate-none`    |
| chevron         | `transition-transform duration-150 ease-out` | inline (matches `date-picker`)                         | `motion-reduce:transition-none` |
| hover / options | `transition-colors duration-150 ease-out`    | inline (matches `date-picker`)                         | `motion-reduce:transition-none` |

Below 640 px the same `animate-popup-scale-in` / `animate-popup-scale-out` run from the bottom centre of the sheet (`transform-origin: bottom center`); the backdrop appears and disappears with the panel, without motion.

## Tokens

| Region          | Token (TOKENS.md)                                                          |
| --------------- | -------------------------------------------------------------------------- |
| trigger surface | `var(--bg-surface)`, `var(--border-default)`, hover `var(--border-strong)` |
| panel surface   | `var(--bg-surface-raised)`, `var(--shadow-sm)`, `var(--shape-card)`        |
| selected option | `var(--bg-selected)`; hover `var(--bg-hover)`                              |
| muted text      | `var(--text-muted)`                                                        |
| sheet backdrop  | `var(--bg-backdrop)` (below 640 px)                                        |
| error message   | `var(--danger-foreground)`                                                 |
| gaps            | `var(--spacing-2xs)`, `var(--spacing-xs)`, `var(--spacing-sm)`             |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: a 2 px `--ring-color` ring inset on each trigger segment; the quick ranges ring their row when the radio inside has focus.
- Keyboard map: `Enter`/`Space` on the trigger opens the panel and the focus trap moves into it; `Tab` cycles inside the panel; the range type is a `ToggleGroup` (arrow keys); the quick ranges are native radios (`ArrowUp`/`ArrowDown` move and select, down the first column and then the second, the order they are read in); Custom range is a link-variant button after them (`Enter`/`Space` shows the Duration and Unit fields and moves focus to Duration), and Back to quick ranges is the first button of that view (it returns to the list and focuses Custom range); on the Absolute tab the order is the grid (or the Start and End fields), End at now, then the view button: **Enter dates** (`Enter`/`Space` shows the fields and moves focus to the Start date) and **Show calendar** (`Enter`/`Space` shows the grid and moves focus to its focusable day); the End at now checkbox toggles with `Space`; then Refresh every, Cancel and Apply in the footer; Unit, Refresh every and the calendar's Month and Year are Azion UI `Select`s (`Enter`/`Space`/`ArrowDown` open the list, the arrows move, typing jumps to an option, `Escape` closes only the list); the time zone selector is a `Combobox`; the range type lists Relative before Absolute; the grid keeps the `date-picker` keyboard map; a time field keeps the `combobox` keyboard map (focus or `ArrowDown` opens the 30-minute list, `Enter` takes the highlighted time or the typed one, `Escape` closes only the list); `Escape` closes without committing and returns focus to the trigger. On a phone a tap on the backdrop closes the sheet like Cancel.
- ARIA: the trigger has `aria-haspopup="dialog"`, `aria-expanded` and a name that starts with the picker's label and contains the visible range and, with auto refresh on, the interval (inside a `Field` with no `ariaLabel`, the Field label names it and the trigger also carries the Field's `aria-describedby` and `aria-invalid`, plus `requiredId` when required); the panel is a named `dialog`; the custom duration is a `group` named "Custom range" whose duration and unit have visible labels; the quick ranges are a `fieldset` with a `legend`; End at now is a `checkbox` named by its visible `label`; the view switch is a native `button` named by its visible text; Unit is a `combobox` button (Azion UI `Select`) labelled by its visible text through `aria-labelledby`, and Refresh every is a `combobox` button named "Refresh every" by `aria-label` (it shows only the glyph and the short interval); the calendar's Month and Year selects are named `Month` and `Year`; the error is `role="alert"` and described from the duration field; Previous and Next are named buttons; the sheet backdrop is `aria-hidden`.
- Targets: options are 32 px high (44 px on `pointer: coarse`); the selects are 44 px high and the step buttons 44 px wide on `pointer: coarse`.
- The custom duration is one two-column grid (a third for the duration, two thirds for the Unit select); Refresh every, Cancel and Apply share the footer row, Refresh every at the start edge and the buttons at the end edge, in both directions (checked at 320, 390 and 1280 px, and right-to-left at 390 px, in `src/test/date-picker-readability.test.ts`).
- Quick ranges layout: the `legend` and every option are padded `var(--spacing-xs)` inline, so the heading and the option labels start on one inline edge in both directions (checked left-to-right and right-to-left in `src/test/date-picker-readability.test.ts`).
- Initial focus: with `rangeSelectorMode="relative-only"` (no range-type toggle) the focus trap lands on the checked quick range, the one the trigger shows, or on Custom range when the value is a custom duration.
- Contrast ≥4.5:1 from the semantic text tokens.

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

## Right-to-left

- Layout: logical utilities only (`border-s`, `border-e`, `ps-`/`pe-`, `end-`, `text-start`); the panel anchors to the start edge of the trigger.
- Icons: the Previous and Next chevrons and the Custom range and Back to quick ranges chevrons mirror (the stylesheet mirrors directional glyphs; the step buttons also carry `rtl:-scale-x-100`); the clock and calendar glyphs do not.
- Keyboard: the grid's arrow keys follow the reading direction (from `date-picker`).
- User data: the range text sits in `<bdi>`.
- Teleported content: the panel binds `dir` and `lang` from the nearest `ConfigProvider` (`usePortalLocale`).

## Responsive

- No truncation at any width: the trigger is inline and capped at its container (`max-w-full`); its value wraps (`overflow-wrap: anywhere`) and the trigger grows taller (its height is a minimum), with the UTC offset kept on one line. The panel's labels, quick ranges and field values are never cut off (checked at 320, 390 and 1280 px in `src/test/date-picker-readability.test.ts`).
- Container query: the quick ranges are one column below 15 rem of list width and two columns from there (`@container` on the fieldset); the two columns fill top to bottom, half the ranges each (rounded up in the first).
- Desktop (from 640 px): an anchored popover exactly as thin as the month grid on both tabs (seven day cells of the size token plus `--spacing-sm` on each side: 276 px at `medium`), capped at the viewport minus `--spacing-sm` on each side, scrolling inside itself when taller than the viewport. The Absolute/Relative switch and the footer (Refresh every, Cancel, Apply, and the zone selector with `showTimeZone`) stay fixed and only the tab body between them scrolls; the Absolute tab shows either the calendar or the fields, never both, so every view of both tabs, Apply included, fits without scrolling on a 1280 × 720 laptop and a 390 × 664 phone (`src/test/date-picker-readability.test.ts`). The time list opens under its field as a `Combobox` list, so it never widens the panel (checked in `src/test/date-picker-readability.test.ts`).
- Phone (below 640 px, `max-sm:`): a sheet — full width, attached to the bottom of the screen, at most 85 % of the viewport high, scrolling inside, padded for the home indicator (`safe-area-inset-bottom`), over a `--bg-backdrop` layer; the footer keeps Refresh every at the start edge and Cancel and Apply at the end edge.
- Touch: options, selects and step buttons are 44 px on `pointer: coarse`; the trigger and the step buttons each carry an invisible `aria-hidden` child (`data-slot="touch-target"`) shown only under `pointer-coarse:` that extends the hit area to 44 px tall; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: `./date-range-picker` in `.size-limit.json` (it carries the `date-picker` grid, fields and time zone selector, `select`, `combobox`, `toggle-group`, `button`, `number-input`, `checkbox` and the placement and focus-trap composables).
- Runtime budget: zone conversion is two `Intl.DateTimeFormat#formatToParts` calls per boundary; nothing runs per frame. Auto refresh is one `setInterval` per picker, only while the interval is above 0, cleared on unmount.
- Heavy parts: none; the panel renders only while open.

## Examples

- Default — a relative range, with `@refresh` handled (auto refresh is on by default).
- Absolute, RelativeOnly, WithStep, TimeZone, UntilNow, AutoRefresh — justified: each documents one of the range modes (absolute, relative, a range that ends now), stepping, the time zone contract or the auto-refresh contract, which have no `variant`/`size` axis.
- Limits, FutureDates — justified: Limits shows `maxDuration` (90 days) over the default bounds (five years back to today); FutureDates shows a later `max` that allows a future range (a maintenance window, the token expiry and alert schedule case). Neither is a `variant`/`size` axis.
- Disabled — a disabled picker with a committed range (state example for the `disabled` prop).

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/ui/*` path must exist in `packages/ui/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
