# Date pickers: readable everywhere, and a complete time range picker

Owner request, 2026-11-18. Branch `proposal/date-picker`. Side-by-side preview:
[`date-picker-proposal.html`](./date-picker-proposal.html) (today vs proposed, desktop 1280 px and
phone 390 px, every tab, rendered from the real components).

## 1. The problem

1. **Text is cut off.** On `/components/date-range-picker`, example With Step, the panel's range
   type control reads `Relative range | Absolute ran…`, and the trigger
   `Nov 10, 16:00 – Nov 10, 17:00 (UTC+00:00)` is long and is cut with `…` as soon as its box is
   narrower. In Portuguese the toggle cuts `Intervalo absoluto` even on a desktop. The `DatePicker`
   trigger also cuts its value with `…`.
2. **No phone layout.** Both pickers open the same floating panel on a phone. It is placed next to
   the trigger, capped at 90 % of the screen, and the Cancel and Apply buttons are small.
3. **The time range picker is not complete.** The Azion Console has a richer picker (Quick,
   Absolute, Relative and Now tabs, "commonly used" ranges such as Today and This week, a range
   that ends now, auto refresh, the time zone on every tab). WebKit has quick ranges, a custom
   duration, an absolute range, step buttons and the time zone (absolute tab only).

## 2. What WebKit has today

| Component                                                                                | What it covers                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DateRangePicker` (`input/date-range-picker`)                                            | `v-model` = `{ type: 'relative', amount, unit }` or `{ type: 'absolute', start, end }` (ISO); `v-model:time-zone`; `v-model:open`; quick ranges (`relative-options`); custom duration; absolute grid + date/time fields; `show-step` (previous / next); `min`, `max`, `now`. |
| `DatePicker` (`input/date-picker`, compound)                                             | One date (optionally a time); month grid, typed date field, time field, time zone selector, `clearable`, `horizontal`. Its grid, fields and time zone selector are the internal parts `DateRangePicker` reuses.                                                              |
| `useTimeRange` (`use-time-range`)                                                        | Resolves a value to `from` / `to` instants when a query runs; `refresh()` re-resolves.                                                                                                                                                                                       |
| `Timestamp`                                                                              | Shows one instant in the zone.                                                                                                                                                                                                                                               |
| `ToggleGroup`, `Switch`, `Input`, `NumberInput`, `Select`, `Popover`, `Drawer`, `Button` | The building blocks the pickers compose (the panel uses `ToggleGroup`, `Input`, `Button`; `Switch` is added by this proposal).                                                                                                                                               |
| `FilterMenu`                                                                             | Uses `DateRangePicker` (absolute only) for its custom range.                                                                                                                                                                                                                 |

Against the Console picker: quick ranges ✓, custom "last N units" ✓, step ✓, absolute ✓, time
zone ✓ (absolute tab only), **Today / This week ✗, a range that ends now ✗, auto refresh ✗,
time zone on every tab ✗, "next N units" / start relative to now ✗**.

## 3. What mature systems do

- **Elastic EUI `EuiSuperDatePicker`** — the pattern the Console copies: a quick select menu with
  commonly used ranges, recently used ranges and a refresh interval panel, which appears only when
  the app handles refresh; start and end are each a date-math expression (`now-15m`, `now`) that
  can be edited on its own. [Super date picker](https://eui.elastic.co/docs/components/forms/date-and-time/super-date-picker/),
  [Auto refresh](https://eui.elastic.co/docs/components/forms/date-and-time/auto-refresh/).
- **Grafana** — the same date math (`now-5m` to `now`, `now/d` for "today so far"); the refresh
  picker is a separate control next to the time picker, with fixed intervals (5s … 1d), and
  "auto-refresh is most useful with ranges ending in now".
  [Time range controls](https://grafana.com/docs/grafana/v9.5/dashboards/use-dashboards/),
  [time settings schema](https://grafana.com/docs/grafana/v12.4/observability-as-code/schema-v2/timesettings-schema/),
  [relative range reference](https://grafana.com/docs/grafana/v4.3/reference/timerange).
- **AWS Cloudscape `DateRangePicker`** — what WebKit's picker follows: a segmented control between
  relative and absolute, `rangeSelectorMode` `default | absolute-only | relative-only`, relative
  suggestions plus a custom duration with chosen units.
  [Date range picker](https://cloudscape.design/components/date-range-picker).
- **Datadog** — lets you type a time frame in words (`last 5 minutes`, `Nov 10 – Nov 12`) and pauses
  "live" when you pick a fixed range. [Custom time frames](https://docs.datadoghq.com/dashboards/guide/custom_time_frames/).
- **Adobe React Spectrum** — overlays (popover, modal or tray) are chosen by screen width: on a
  phone a picker opens in a tray from the bottom.
  [DateRangePicker](https://react-spectrum.adobe.com/react-spectrum/DateRangePicker.html),
  [DialogTrigger width rule](https://github.com/adobe/react-spectrum/pull/3921).
- **Atlassian, Carbon, shadcn** — a plain date (range) field + calendar popover; no relative ranges,
  no refresh. [Atlassian datetime picker](https://atlassian.design/components/datetime-picker),
  [Carbon date picker](https://carbondesignsystem.com/components/date-picker/usage/),
  [shadcn date picker](https://ui.shadcn.com/docs/components/date-picker).
- **Supabase / Vercel logs** — a preset list ("last hour", "last 24 hours") plus a custom absolute
  range, and a live mode that follows now.

Take-aways: (1) the value has to stay relative ("last 15 minutes", "since 9:30 until now") until the
query runs; (2) refresh belongs with the range, because it only makes sense for ranges that end now;
(3) on a phone the panel becomes a bottom sheet; (4) nobody truncates a time range.

## 4. Decision

**Options on the existing `DateRangePicker`, no new component, no block.** Plus readability and
phone-layout fixes in both pickers.

Why:

- **Not a new component.** A `time-range-picker` next to `date-range-picker` would be two names for
  one idea, which the naming standard forbids (one overlay is `dialog`, never `modal`). Everything the
  Console picker does is a range, so it extends the range picker.
- **Not a block.** A block is a screen people copy (`blocks/<group>/<block>`). A time picker sits in
  dozens of toolbars and must behave the same everywhere, with tests, a11y and i18n owned once. A
  block also cannot run the refresh timer for its owner.
- **No separate refresh component (yet).** EUI and the Console keep refresh inside the picker; Grafana
  splits it. Inside keeps one button, one panel and one Apply, and it only shows with `show-refresh`.
  If a page ever needs refresh without a range, extracting it later is cheap.
- **Additive and non-breaking.** Every existing value, prop and event keeps working.

### Value model

```ts
type DateRangeValue =
  | { type: 'relative'; amount: number; unit: DateRangeUnit; key?: string; snap?: boolean } // last N units → now; snap: Today, This week
  | { type: 'absolute'; start: string; end: string } // two ISO 8601 instants
  | { type: 'since'; start: string } // an ISO 8601 start → now (new)
```

- `relative` with `snap: true` rounds the start down to the start of the unit **in the time zone**
  (`{ amount: 1, unit: 'day', snap: true }` = Today, `unit: 'week'` = This week from Sunday, like the
  month grid). Same as Grafana's `now/d`.
- `since` is the Console's "Now" tab: a fixed start and an end that is always now.
- The values map one-to-one to date math (`now-15m → now`, `now/d → now`, `2026-11-10T09:30Z → now`),
  so a query API that wants date math can convert them without loss.
- New model `v-model:refresh-interval` (seconds, `0` = off) and event `refresh` (fires each tick
  while the page is visible); new prop `show-refresh`.
- Time zone: the picker uses `v-model:time-zone`, else the `ConfigProvider` zone, else the device
  zone (UTC on the server and until mount), as the example-data rule asks. `useTimeRange` takes
  `{ timeZone }` so Today means today in that zone.

### Panel

| Tab      | Content                                                                                                                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Relative | Custom range (Duration + Unit, always visible, mirrors the picked quick range) → Quick ranges in two columns when there is room (Last 5 minutes … Last 30 days, plus Today and This week when the app passes them). |
| Absolute | Month grid → Start and End (date + time) → **End at now** switch (turns the range into `since`; the grid and fields then pick the start only).                                                                      |
| Both     | **Refresh every** switch + amount + unit (with `show-refresh`) → time zone → Cancel / Apply.                                                                                                                        |

The Console's four tabs (Quick, Absolute, Relative, Now) become two: Relative already is Quick, and
Now is a switch on Absolute. Two short tabs fit a 320 px phone in every language.

### Readability (both pickers)

- Nothing is cut off with `…`: trigger values wrap to a second line and the trigger grows; the UTC
  offset stays on one line; quick ranges and labels wrap.
- Shorter text: tabs `Relative` / `Absolute` (pt-BR/es `Relativo` / `Absoluto`); a range inside one
  day prints the date once (`Nov 10, 16:00 – 17:00 (UTC+00:00)` instead of
  `Nov 10, 16:00 – Nov 10, 17:00 (UTC+00:00)`).
- Desktop: the range panel is a fixed 24 rem, so the quick ranges get two columns and the tabs never
  squeeze.

### Phone (320–430 px)

- Below 640 px both pickers open as a **bottom sheet**: full width, attached to the bottom, at most
  85 % of the screen high, scrolling inside, safe-area padding, over a backdrop that closes it on tap.
- Cancel and Apply split the footer width; options, selects and step buttons are 44 px on touch.
- The trigger wraps instead of truncating, so `Nov 10, 2026, 9:30 – now (UTC+00:00)` stays legible in
  a 320 px toolbar.

### Keyboard and screen readers

- Unchanged map: trigger `Enter`/`Space` opens, focus is trapped, `Escape` cancels and returns focus.
- Custom range is a named `group`; quick ranges stay native radios (arrow keys); End at now and
  Refresh every are `switch`es named by their visible text.
- With refresh on, the trigger's name ends with "refreshes every 30 seconds".

## 5. What was built (branch `proposal/date-picker`)

- `DateRangePicker`: `snap` ranges (Today, This week, This month, This year labels), `since` ranges
  (End at now), `show-refresh` + `v-model:refresh-interval` + `refresh`, custom duration on top,
  two-column quick ranges, time zone on both tabs, wrapping trigger, compact same-day label, phone
  sheet. End at now shows only when the picker also offers relative ranges, so an `absolute-only`
  picker (FilterMenu) never receives a `since` value. The default quick ranges are unchanged; Today
  and This week are options with `snap: true` (shown in the AutoRefresh example).
- `DatePicker`: wrapping trigger, phone sheet.
- `useTimeRange`: `timeZone` option; resolves `snap` and `since`.
- Specs `date-range-picker` (v9) and `date-picker` (v12), locale catalogs (en, pt-BR, es), examples
  UntilNow and AutoRefresh, size budgets (with reasons in `size-budgets-v6.md`), catalog.
- Tests: the existing suites updated and extended (Today in a zone, End at now, auto refresh with a
  fake timer); a new styled suite `src/test/date-picker-readability.test.ts` checks at 320, 390 and
  1280 px, in English and Portuguese, that no text or field value is cut off, nothing leaves the
  screen, and the phone sheet fills the width and sits on the bottom. It fails on the old code.

## 6. Open decisions for the owner

1. **Per-end editing (EUI style).** Click the start or the end in the trigger and edit just that
   end as absolute, relative (`N units ago / from now`) or now. It needs a fourth value shape
   (`{ type: 'bounds', start, end }` with each end a date-math expression) and a second popover.
   Proposed as a follow-up only if a product needs "from 2 hours ago until 1 hour ago".
2. **Next N units** (ranges in the future, the Console's `Last ▾ / Next`). Rare in observability;
   left out.
3. **Scrolling list of times** next to the calendar (Console Absolute tab). WebKit keeps the typed
   time field (faster with a keyboard, works on phones); a list can be added to the shared grid part.
4. **"Account" time zone entry** (`Account (UTC-08:00)`): needs the account zone from the app; can be
   passed today through `time-zones` and `v-model:time-zone`.
5. **Week start.** This week starts on Sunday, like the month grid; a Monday start (ISO, most of
   Europe and Brazil business use) would change both together.
6. **Default quick ranges.** They stay as today (5m … 30d) because changing a default is a breaking
   change. Say yes to make Today and This week part of the default list (Console parity); it needs a
   `!` release note.
7. **The `since` value is new in the union.** TypeScript code that assumed "not absolute means
   relative" must handle it; the two blocks that did (`activity-history`, `events-explorer` query)
   are fixed here. It is unreleased 6.0 API, so no codemod is needed.
