# ViewEventsExplorer (`view/view-events-explorer`)

> The events explorer (the app marks its Events navigation entry active): the controls row (`FilterMenu`, event search, the time zone, Refresh and Download CSV) over the applied `FilterMenu.ChipGroup`, and the explorer. The explorer pairs a resizable, collapsible fields `Sidebar` (each field a column checkbox and a popover of its top values, grouped in an `Accordion` by category) with the log: the Events, Errors and Avg request time summary, the stacked volume chart whose buckets filter the period on click or drag, and the event `DataTable`. Each row's detail `IconButton` (or a row click) opens the event document (its fields, the request's `Trace` with the critical path when the event carries spans, and the JSON) beside the log in the end pane of a `Resizable` when the explorer is wide enough, and in a `Drawer` when it is not. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main. Its root carries data-layout-fill, so the main stops scrolling and the fields panel, the log and the document scroll on their own.

- Surface: app
- Source: `blocks/view/view-events-explorer/view-events-explorer.vue` in `@aziontech/webkit`
- MCP: `get_block("view/view-events-explorer")`
- Components: [Accordion](../../components/accordion.md), [Alert](../../components/alert.md), [Button](../../components/button.md), [Chart](../../components/chart.md), [Checkbox](../../components/checkbox.md), [Chip](../../components/chip.md), [CodeBlock](../../components/code-block.md), [CopyButton](../../components/copy-button.md), [DataTable](../../components/data-table.md), [DateRangePicker](../../components/date-range-picker.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [FilterMenu](../../components/filter-menu.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), `PanelHeader`, [Popover](../../components/popover.md), [PropertyFilter](../../components/property-filter.md), [Resizable](../../components/resizable.md), [Select](../../components/select.md), [Sidebar](../../components/sidebar.md), [Skeleton](../../components/skeleton.md), [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), [Trace](../../components/trace.md), `use-collection`, `use-locale`
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

real-time events; events visualizer; event explorer; log explorer; logs viewer; request logs; events search; eventos em tempo real; visualizador de eventos; explorador de logs; split view; master detail; list and detail panes; visão dividida; query language; events query; saved searches; saved queries; query history; date range; time range picker; investigation tabs; event document; request trace; trace waterfall; critical path; trace de requisição; consulta de eventos; buscas salvas; intervalo de datas

The events explorer. The user comes here to answer what happened on their traffic: how many events, how many errors, when they spiked, and what one event looked like in full. They narrow the log by fields and time, scan the rows, and open one event beside the log without losing their place. The fields, the log and the event document are three panes of one workspace, and every filter acts on all of them at once.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`. The explorer is a workspace: its root carries `data-layout-fill`, so the layout's `main` stops scrolling, the root fills it, and the fields panel, the log and the event document each scroll on their own at every width (`h-dvh` only sizes a standalone preview).

## When to use

- Events or logs explored over time, where the volume chart and the rows must agree on one period and one set of filters.
- Users pivot on field values (level, source, status, host) to find a pattern, then read one event's full document.
- The record has more fields than a table row can hold, so the full document opens beside the list instead of in a details page.

## When not to use

- A first-level list of resources the user creates and manages: use `view/view-table`.
- The log of one deployment or build run: use `detail/detail-deployment-logs`.
- Metrics and charts without a row-level log: use `dashboard/dashboard-analytics`.
- Files and folders of a storage resource: use `view/view-file-browser`.
- Querying a database with SQL: use `view/view-query-editor`.

## Building blocks

### A. Filter — `FilterMenu` (required)

`FilterMenu` bound with `v-model="filters"` and `:fields`: the Filter button (counting the applied fields) opens a drill-in menu, the field list first, then the values of the chosen field. Period is a `date` field whose options are the block's presets (Last 15 minutes to Last 24 hours) plus the menu's own Custom range calendar; Source, Level and every field added from the fields panel are `multi` fields. The block maps its filter fields to `FilterMenuField`s and keeps matching the log itself. Do not build a filter popover, its count badge or its value rows by hand.

### B. Search and toolbar — `Input`, `Tooltip`, `IconButton` (required)

A medium search `Input` across events, hosts, paths and addresses, then the time zone, then outlined medium `IconButton`s for Refresh and Download CSV, each named by a `Tooltip` and an `aria-label` with the same words.

**The time zone is always visible in the toolbar.** Every time on this page (the log, the chart axis, the document) is in one zone, so the toolbar says which one, beside the time controls, at every width: `Times in UTC` as muted text with a globe glyph when the zone is fixed, or a `Select` named Time zone that reads `UTC−03:00 · Sao Paulo` when the person can change it (Query variant). The `DateRangePicker` panel does not repeat it: the picker states the offset of an absolute range on its trigger and leaves the zone to the page. Use the same pattern on every page that shows metrics and logs together. The controls row wraps: when the filter button and the search field (never under `--container-3xs`) leave no room for the zone and the actions, those move to a line of their own at the end, so the zone never sits under the search field.

### C. Applied filters — `FilterMenu.ChipGroup` (optional)

`FilterMenu.ChipGroup` shares the model and the fields with the menu: one chip per applied field under the controls row, which summarizes its values, reopens the menu on its field and can be removed. The row wraps; it never scrolls sideways.

### D. Fields panel — `Sidebar`, `Input`, `Field`, `Checkbox`, `Popover`, `Item`, `Accordion`, `Tag` (optional)

A resizable, collapsible start `Sidebar` named Fields with its own Search fields `Input`. Core fields sit on top; the rest are grouped by category in an `Accordion`, each category trigger carrying a small `Tag` with its applied count. Each field has a `Checkbox` that shows or hides its column in the log, and a `Popover` of its top values, each an option `Item` (`clickable`, `variant="option"`, `aria-pressed` while applied) with its count, that applies the value as a filter. The panel hides when the explorer is narrower than the panel plus the log.

### E. Log — `Chart`, `Skeleton`, `DataTable`, `Tag`, `EmptyState`, `Alert` (required)

Above the table, a summary `dl` of Events, Errors and Avg request time, and the stacked volume `Chart` by level (`Chart.Bar type="histogram" stacked`: solid columns that touch, one per time bucket, with `Chart.Brush`, bound to `v-model:range`). Each level wears its step of the severity ramp (Error `severity-critical`, Warning `severity-medium`, Info `severity-low`, Debug `severity-info`), and `Chart.Tooltip total` lists every level in the bucket with a Total row under them and a footer hint: Click to filter to this bucket, or drag to select a span. Dragging across the chart selects a span and filters the period to it; from the keyboard the arrow keys step through buckets, Shift with the arrows extends a span and Enter applies it. The primary and every variant (Query, Sessions, EventDocument included) use this same `Chart`; no variant draws its own bars. Below it the event `DataTable`, `paginated` at 25 rows, with a detail column first, Level as a small `Tag` in the level's severity, and the columns chosen in the fields panel. While the explorer is too narrow for the document pane, Time, Level and Source fold into the Event cell: Level `Tag`, the clock time and the source on top, the event message wrapped under them, so a phone or tablet reads what happened without scrolling sideways. Its empty slot picks one small `EmptyState`: no traffic yet, no match for the search, or nothing in the window. When `error` is set, a danger `Alert` with the message and Retry takes the place of the summary, the chart and the table; the fields panel stays.

### F. Event document — `Resizable`, `Tooltip`, `IconButton`, `Tag`, `Trace`, `CodeBlock` (required)

Each row's detail cell is an `IconButton` named Open event <id> with `aria-expanded`, so a keyboard user opens an event with Tab and Enter; a row click does the same for a pointer. When the explorer is wide enough for the fields panel, the log and the document, the event opens in the end pane of a horizontal `Resizable` (`Resizable.Handle` named Resize the event panel, the pane 320 to 512 px, collapsed while no event is open), so the handle sits on the inner edge and dragging it inward widens the document. Its header holds the Event heading and a small Close `IconButton` in a `Tooltip`; the body shows the level and source as small `Tag`s, lists the fields and ends with the full event in a `CodeBlock` that copies it as JSON. When the event carries the `spans` of its request, a Trace section sits between the fields and the JSON: an unbordered `Trace` with `highlight-critical-path`, named Trace of request <request id>, so the reader goes from "this request was slow or failed" to the step that held it up without leaving the log.

### G. Narrow document — `Drawer`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `Tag`, `Trace`, `CodeBlock` (required)

Below that width the same document opens in a large right `Drawer` titled Event, with `PanelHeader`, `DrawerTitle` and the drawer's own close button. Crossing the breakpoint moves an open event between the pane and the drawer instead of closing it.

The fields panel (D) is the `view-events-explorer#Fields` piece of the inventory; it lives in the primary and every variant, so it has no variant of its own.

### H. Query bar — `Tooltip`, `IconButton` (optional)

Variant Query only; it adds `PropertyFilter` (`mode="query"`), `DateRangePicker` and `Select` to the page, in the block's `toolbar` slot, in place of the Filter popover and the search field.

For people who type their questions. `DateRangePicker` replaces the Period field of the Filter popover: relative ranges (Last 15 minutes to Last 24 hours), an absolute range typed in the chosen time zone and bounded to the retained days, and Previous and Next, which move the window by its own length. Beside it a `Select` named Time zone shows the zone at all times (`UTC+00:00`, `UTC−03:00 · Sao Paulo`) and changes it; the picker binds the same `v-model:time-zone`, so a typed range is read in that zone. The times in the log, the chart axis and the document follow that zone. `PropertyFilter` in query mode replaces both the Filter popover and the search field: one query string (`level = Error AND host = api.example.com`), suggestions for the word at the caret, the reason under the field when the query is invalid, and the match count. Enter applies it; a query that mixes AND and OR shows a message instead of guessing. A value picked in the fields panel adds or removes its `field = value` clause, so the panel and the query never disagree.

### I. Saved and recent queries — `Popover`, `IconButton`, `Input`, `Item`, `Tooltip` (optional)

Variant Query only.

Two outlined `IconButton`s beside the bar open a `Popover` each. Saved queries lists name and query text, applies one on click, deletes one with a small Delete button, and saves the applied query under a typed name. Recent queries lists the last eight queries run, newest first, with Clear history. Applying an entry fills the bar and runs it.

### J. Investigation tabs — `IconButton`, `Input`, `Tooltip` (optional)

Variant Sessions only; it adds `Tabs` and `DropdownMenu` to the page.

Above the controls row, one tab per open investigation; each keeps its own filters, search and period, and switching tabs closes the open document. New investigation (a transparent `IconButton`) adds a tab, up to five; past the limit a status line says to close one. The actions `DropdownMenu` renames, duplicates or closes the active tab. Rename opens an inline `Input` over the tab (also F2 or a double click on it): Enter keeps the name, Escape restores it. Each tab is `closable` while more than one is open: the × on the tab closes it with the pointer, and Delete on the focused tab closes it from the keyboard (the tab announces the shortcut through `aria-keyshortcuts`); focus moves to the tab before it. The last tab cannot be closed. The × is not a separate focusable button: inside a `tablist` anything focusable that is not a tab fails `aria-required-children`, so the keyboard path is Delete, as in the WAI-ARIA tabs pattern, and the actions menu keeps Close investigation for discovery.

### K. Document tools — `Chip`, `Input`, `IconButton`, `Tooltip` (optional)

Variant EventDocument only; it adds `CopyButton` to the page and fills the block's `document-fields` slot.

The document lists every field of the event. Search in this event narrows the list to fields whose name or value matches and highlights the match. Each filterable value has Filter by (keep only events with it) and Exclude (hide them) buttons that apply to the log; an exclusion shows as a `Host is not legacy.example.com` `Chip` with the other filters (the block draws it for any `v-model:exclusions`). Copy copies the fields shown as JSON; the full JSON document stays below.

## Data

The block takes its events through props and emits every action; it fetches nothing. `EventsExplorerEvent`, `EventsExplorerField`, `EventsExplorerBucket`, `EventsExplorerProps` and the other types are exported from `view-events-explorer.vue`, and `sample.ts` holds the sample events, fields and clock the block renders when `events` is left out (and never while `loading` or `error` is set). The filters (the period included), the search and the page are models the page can own, so it can run them on the server.

| Prop / model              | Type                            | What it does                                                                                                                                                                                                                                                                                  |
| ------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `events`                  | `EventsExplorerEvent[]`         | The events: `id`, `at`, `source`, `level`, `message`, optional `spans` (the `TraceSpan`s of the request, shown as its trace in the document) and one key per field. Pass `[]` for a workspace with no traffic.                                                                                |
| `fields`                  | `EventsExplorerField[]`         | The fields, in order; the columns, the fields panel and the document follow them. Core fields stay shown, and the first columns are `host`, `status` and `remoteAddress` when the fields have them, else the first three others; `time` and `sourceLabel` are derived from `at` and `source`. |
| `categories`              | `EventsExplorerFieldCategory[]` | The groups of the fields panel, in order. Left out with `fields` given, one group per `category` the fields name.                                                                                                                                                                             |
| `buckets`                 | `EventsExplorerBucket[]`        | The volume chart bars, per level. Left out, the block counts them from the events in the period.                                                                                                                                                                                              |
| `summary`                 | `EventsExplorerSummary`         | Events, Errors and Avg request time. Left out, counted from the events that match.                                                                                                                                                                                                            |
| `total`                   | `number`                        | Server mode: every match on the server. `events` is then the page the server filtered, the block does not filter, search or slice it, and the pages follow `page` and `pageSize`.                                                                                                             |
| `now`                     | `Date`                          | Where relative periods end (Last hour ends now). Left out, the sample clock; a live page passes the time of its request.                                                                                                                                                                      |
| `moreRows`, `loadingMore` | `boolean`                       | More events exist after the last one, and the next ones are loading; the table offers to load more and emits `load-more`.                                                                                                                                                                     |
| `loading`                 | `boolean`                       | A request is in flight: `Skeleton`s hold the summary and the chart, the table shows its loading rows and Refresh spins.                                                                                                                                                                       |
| `error`                   | `string`                        | Why the events failed to load, shown in the danger `Alert` with Retry that replaces the log.                                                                                                                                                                                                  |
| `v-model:filters`         | `EventsExplorerFilters`         | Applied values per field id, as `FilterMenu` writes them. `period` holds the range: `15m`, `1h`, `6h`, `24h` or `{ start, end }` (the chart brush writes one). Starts at `24h`.                                                                                                               |
| `v-model:search`          | `string`                        | The search text.                                                                                                                                                                                                                                                                              |
| `v-model:page`            | `number`                        | The table page, 1-based, back to `1` when the filters or the search change.                                                                                                                                                                                                                   |
| `v-model:page-size`       | `number`                        | Rows per page, `25` by default.                                                                                                                                                                                                                                                               |
| `timeZone`                | `string`                        | The IANA zone the times, the chart and the period are written in, and the zone the controls row names. `UTC` by default.                                                                                                                                                                      |
| `match`                   | `(event) => boolean`            | A test every event must pass besides the filters, such as a typed query (Query passes its `PropertyFilter` query here).                                                                                                                                                                       |
| `v-model:exclusions`      | `EventsExplorerFilters`         | Values per field id the log hides; each shows as a removable `Field is not value` chip beside the filter chips.                                                                                                                                                                               |
| `v-model:selected-key`    | `string`                        | The id of the event whose document is open; empty for none.                                                                                                                                                                                                                                   |

| Slot              | Props                           | What it replaces                                                                                                                                                         |
| ----------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `toolbar`         | `{ exportCsv, exportDisabled }` | The controls row and the filter chips. Query puts its time range, zone, query bar and saved and recent queries here; `exportCsv` downloads the log shown.                |
| `document-fields` | `{ event, fields }`             | The fields of the open event in its document. `fields` lists every field with a value (`EventsExplorerDocumentField`); EventDocument adds search, Filter by and Exclude. |

| Event       | Payload           | When                                                        |
| ----------- | ----------------- | ----------------------------------------------------------- |
| `refresh`   | `(event)`         | Refresh in the controls row.                                |
| `retry`     | `(event)`         | Retry in the error alert.                                   |
| `select`    | `(event, record)` | An event was opened, from its detail button or a row click. |
| `load-more` | `(event)`         | The end of the loaded events neared, with `moreRows` set.   |

To go live, render the block from a page that owns the query and pass what it returns:

```vue
<script setup lang="ts">
  import { ref } from 'vue'

  import ViewEventsExplorer, { type EventsExplorerFilters } from './view-events-explorer.vue'

  const filters = ref<EventsExplorerFilters>({ period: ['24h'] })
  const search = ref('')
  const page = ref(1)
  const pageSize = ref(25)
  const { data, pending, error, refresh } = useEvents({ filters, search, page, pageSize })
  const loadError = "Couldn't load events. Check your connection and retry."
</script>

<template>
  <ViewEventsExplorer
    v-model:filters="filters"
    v-model:search="search"
    v-model:page="page"
    v-model:page-size="pageSize"
    :events="data?.events ?? []"
    :fields="data?.fields"
    :buckets="data?.buckets"
    :summary="data?.summary"
    :total="data?.total"
    :now="data?.requestedAt"
    :loading="pending"
    :error="error ? loadError : ''"
    @refresh="refresh"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import, and give `fields` its own list. A log that streams instead of paging passes `moreRows` and appends the next events on `load-more`.

## Do

- Drive the summary, the chart and the table from one filtered set, so every number agrees.
- Let a click or drag on the chart set the period, and show the period as a filter the user can clear.
- Keep the row selected while its document is open, and switch between pane and drawer by the explorer's width, not the viewport's.
- Let `FilterMenu` count the applied fields on its trigger and `FilterMenu.ChipGroup` show each one in field order.
- Pick the empty message that matches why the log is empty.
- In query mode, keep the applied query text as the user typed it, and save and list that text.
- Keep each investigation tab self-contained: its own filters, search and period.
- Let the document act on the log (Filter by, Exclude), so a pivot is one click from the value.
- Mark the page root with `data-layout-fill`, so the panes scroll on their own instead of the page.

## Don't

- Don't navigate away to read one event; the document opens beside the log.
- Don't add a second filter surface (a row of `Select`s, a filter bar in the fields panel) beside the Filter menu.
- Don't hide the controls row or the summary when the log is empty.
- Don't encode level by colour alone; the chart has a card with level names and counts, and the table shows level as text.
- Don't let a wide log scroll the page sideways.
- Don't size the root with `calc(100dvh - …)`; `data-layout-fill` fits it to the layout's `main`.
- Don't offer the query bar and the Filter menu at once; pick the one that fits the users.
- Don't guess the meaning of a query that mixes AND and OR; say so and let the user fix it.
- Don't let investigation tabs grow without a limit, and never close the last one.

## Copy

- **Search:** placeholder names what is searched, e.g. "Search events, hosts, paths or addresses"; `aria-label` "Search events".
- **Summary labels:** short nouns, e.g. "Events", "Errors", "Avg request time".
- **Chart hint:** one instruction, e.g. "Drag across the chart, or hold Shift with the arrow keys and press Enter, to filter the log to a span."
- **Empty log:** title states the fact and the description says what to do, e.g. "No events in this window" with "Widen the period or clear a filter to see more of the log."
- **Fields panel:** controls name the panel, e.g. "Hide the fields panel", "Show the fields panel".
- **Document:** drawer title "Event"; close button "Close the event document".
- **Query bar:** `aria-label` "Query events"; placeholder with one real example; the range "Events time range".
- **Saved queries:** "Name the current query", Save, "Delete <name>"; empty "No saved queries yet. Name the current query to keep it."
- **Tabs:** "New investigation", "Actions for <name>", Rename, Duplicate, "Close investigation"; limit "Up to 5 investigations stay open. Close one to start another."
- **Document tools:** "Search in this event", "Filter by <field> <value>", "Exclude <field> <value>", "Copy the fields shown as JSON"; no match "No field matches “<text>”."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The explorer sits in the layout's one `main` landmark; each `Sidebar` is named (Fields, Event document) with its own collapse, expand and resize labels.
- The chart is `Chart`'s one tab stop with an `aria-label` that carries the summary (busiest bucket) and the instruction; arrow keys move between buckets, Shift extends a span, Enter commits it, and the tooltip follows keyboard focus as it follows the pointer.
- The Errors value carries an `aria-label` with its share of all events.
- Every icon-only button has an `aria-label`; decorative glyphs are `aria-hidden="true"`. The row detail button names its event and carries `aria-expanded`.
- Value options in the fields-panel popovers are buttons with `aria-pressed`, so applied values are announced; the Filter menu's own rows come from `FilterMenu`.
- The log rows are one tab stop: Arrow Up and Arrow Down move between rows, Home and End jump to the first and last, and Enter opens the focused event's document, as a click on the row does.
- The document drawer traps focus while open and closes on Escape; motion is turned off under `prefers-reduced-motion`.
- Query: `/` focuses the query bar from anywhere on the page, except while typing in a field; the bar is a `combobox` whose invalid state sets `aria-invalid` and points `aria-describedby` at the reason; the mixed AND / OR message and the saved-query confirmations are `role="status"`.
- Sessions: the tabs follow the `Tabs` keyboard map (arrows, Home, End); F2 renames and Delete closes the focused tab, and the same actions sit in a named menu for pointer and screen-reader users; focus returns to the tab after rename or close.
- EventDocument: Filter by and Exclude are toggle buttons (`aria-pressed`) named with the field and value; the match count of the document search is announced in a `role="status"`.

## States

- Default: live traffic with the summary, the chart and the log filled, and no filters applied; while the page refreshes (`loading` with `events`) the summary values and the chart show `Skeleton`s and the table its loading rows.
- Loading: the first load (`loading` with no `events`); `Skeleton`s hold the summary values and the chart band and the table shows its loading rows.
- Filtered: errors from the Security and Access Control sources (`v-model:filters` seeded with them); the Filter button counts three fields and each shows as a `FilterMenu.ChipGroup` chip.
- Empty: a workspace with no traffic yet (`events` is `[]`); the summary reads zero, the chart is flat and the log shows No events yet.
- Error: the event request failed (`error` is set); the fields panel stays and the log pane shows a danger `Alert` with the message and Retry, which emits `retry`.
- Query: `level = Error AND host = api.example.com` over the last 24 hours, with two saved and two recent queries.
- Sessions: three investigation tabs, API errors active; the tabs sit above the block, which each tab feeds through `v-model:filters` and `v-model:search`.
- EventDocument: an error event's document open, with Host is not legacy.example.com applied.

## Related

- `view/view-table` — the same controls row over a resource list.
- `detail/detail-deployment-logs` — logs of one deployment run.
- `dashboard/dashboard-analytics` — the metrics view for the same traffic.
- `shell/shell-console` — the layout this explorer renders in.
- `DataTable` — the log table; see `skills/webkit-tables`, `skills/webkit-data-viz` and `skills/webkit-ui-states`.

## Variants

- `Default` — primary (the code below)
- `Filtered` — Errors from the Security and Access Control sources: the Filter button counts three applied fields and each shows as a chip that reopens the menu on that field or removes it.
- `Empty` — A workspace with no traffic yet: the summary reads zero, the chart is flat and the log shows its No events yet state.
- `Loading` — The first load: Skeletons hold the Events, Errors and Avg request time values and the chart band, and the event table shows its loading rows.
- `Error` — The event log request failed: the fields panel stays, and the log pane shows a danger Alert that says the events did not load and offers Retry.
- `Query` — A typed query bar: a `DateRangePicker` (relative ranges, an absolute range typed in the chosen time zone, Previous and Next) drives the period beside an always-visible Time zone `Select`, and `PropertyFilter` in query mode takes `level = Error AND host = api.example.com`, suggests fields, operators and values at the caret, explains an invalid query under the field and applies it on Enter. Saved queries (name, apply, delete) and Recent queries sit in two popovers beside the bar; the field values in the fields panel add or remove clauses of the query; the log, chart and times follow the chosen zone.
- `Sessions` — Several investigations open as tabs above the explorer, each keeping its own filters, search and period: API errors is active, with All traffic and Security blocks beside it. New investigation adds a tab (up to five, then a message says to close one); the actions menu renames (also F2 or a double click, with an inline field: Enter keeps, Escape cancels), duplicates or closes the active one (also Delete on the focused tab).
- `EventDocument` — An error event selected with its document open beside the log. The document lists every field of the event with a Search in this event field that narrows and highlights the fields, a Filter by and an Exclude button per value that apply to the log (an exclusion shows as an is not chip), and Copy that copies the fields shown as JSON; the full JSON document follows.

Each variant is the same screen in another state: `get_block("view/view-events-explorer", { variant })`, or the file under `blocks/view/view-events-explorer/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Chart, {
    type ChartColor,
    type ChartRange,
    type ChartSeries
  } from '@aziontech/webkit/chart'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Chip from '@aziontech/webkit/chip'
  import CodeBlock from '@aziontech/webkit/code-block'
  import DataTable, { type TableColumn, type TableExposed } from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import FilterMenu, {
    type FilterMenuField,
    type FilterMenuModel,
    type FilterMenuRange,
    type FilterMenuValue
  } from '@aziontech/webkit/filter-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item-root'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import Resizable from '@aziontech/webkit/resizable'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import Trace, { type TraceSpan, type TraceView } from '@aziontech/webkit/trace'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  import { sampleCategories, sampleEvents, sampleFields, sampleNow } from './sample'

  /** Severity of an event; it colors the level tag and stacks the volume chart. */
  export type EventsExplorerEventLevel = 'Error' | 'Warning' | 'Info' | 'Debug'

  /** One event of the log. */
  export interface EventsExplorerEvent {
    /** Stable key of the event. */
    id: string
    /** When the event happened; the Time column, the period filter and the chart read it. */
    at: Date
    /** Source key: http, security, services or access (any other key shows as written). */
    source: string
    /** Severity of the event. */
    level: EventsExplorerEventLevel
    /** One-line description, the Event column and the heading of the document. */
    message: string
    /** Spans of the request the event records; when set, the document shows its trace. */
    spans?: TraceSpan[]
    /** Every other value, keyed by the id of a field in fields. */
    [field: string]: unknown
  }

  /** How a field value is written: a locale number, or a number of milliseconds. */
  export type EventsExplorerFieldFormat = 'number' | 'milliseconds'

  /** One field of the events: a table column, a row of the fields panel and a key of the document. */
  export interface EventsExplorerField {
    /** Key of the value on each event; time and sourceLabel are derived from at and source. */
    id: string
    /** Column header and fields panel label. */
    label: string
    /** Always shown and locked in the fields panel. */
    core?: boolean
    /** The principal column of the table. */
    principal?: boolean
    /** Id of the category that groups the field in the fields panel while it is hidden. */
    category?: string
    /** Share of the spare width the column takes. */
    grow?: TableColumn['grow']
    /** Narrowest width of the column, in pixels. */
    minWidth?: number
    /** Alignment of the column; end for numbers. */
    align?: TableColumn['align']
    /** Writes the value in the code font. */
    mono?: boolean
    /** How the value is written. */
    format?: EventsExplorerFieldFormat
  }

  /** A group of hidden fields in the fields panel. */
  export interface EventsExplorerFieldCategory {
    /** Key the fields name in their category. */
    id: string
    /** Heading of the group. */
    label: string
  }

  /** One bar of the volume chart. */
  export interface EventsExplorerBucket {
    /** Start of the bar. */
    at: Date
    /** End of the bar. */
    end: Date
    /** Events in the bar. */
    total: number
    /** Events in the bar per level. */
    levels: Record<string, number>
  }

  /** The numbers above the chart. */
  export interface EventsExplorerSummary {
    /** Events that match. */
    total: number
    /** Of them, events at the Error level. */
    errors: number
    /** Mean request time in milliseconds, or null when no event has one. */
    avgRequestTimeMs: number | null
  }

  /** Applied values per filter field; period holds the time range. */
  export type EventsExplorerFilters = FilterMenuModel

  /** One field of the open event, as the document lists it. */
  export interface EventsExplorerDocumentField {
    /** Id of the field. */
    id: string
    /** Label of the field. */
    label: string
    /** The value as written in the document. */
    value: string
    /** The value as the event holds it, the one a filter applies. */
    raw: FilterMenuValue
    /** The log can be filtered by this field. */
    filterable: boolean
  }

  export interface EventsExplorerProps {
    /** The events. Left out, the sample renders. Filtered, searched and paged in the browser unless total is set. */
    events?: EventsExplorerEvent[]
    /** The fields of the events, in order; the columns, the fields panel and the document follow them. Left out, the sample fields. */
    fields?: EventsExplorerField[]
    /** The categories of the fields panel, in order. Left out, derived from the fields. */
    categories?: EventsExplorerFieldCategory[]
    /** The volume chart bars. Left out, counted from the events in the period. */
    buckets?: EventsExplorerBucket[]
    /** The numbers above the chart. Left out, counted from the events that match. */
    summary?: EventsExplorerSummary
    /** Every event that matches on the server: events is then one page the server already filtered, and the pages follow page and pageSize. */
    total?: number
    /** The moment relative periods end at. Left out, the sample clock. */
    now?: Date
    /** More events exist after the last one; the table offers to load more. */
    moreRows?: boolean
    /** The next events are loading. */
    loadingMore?: boolean
    /** A request is in flight: skeletons hold the numbers and the chart, and the table shows its loading rows. */
    loading?: boolean
    /** Why the events could not load; a danger alert with Retry replaces the log. */
    error?: string
    /** IANA time zone the times, the chart and the period are written in. */
    timeZone?: string
    /** An extra test every event must pass besides the filters, such as a typed query. */
    match?: (event: EventsExplorerEvent) => boolean
  }

  const props = withDefaults(defineProps<EventsExplorerProps>(), {
    events: undefined,
    fields: undefined,
    categories: undefined,
    buckets: undefined,
    summary: undefined,
    total: undefined,
    now: undefined,
    moreRows: false,
    loadingMore: false,
    loading: false,
    error: '',
    timeZone: 'UTC',
    match: undefined
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    select: [event: MouseEvent | KeyboardEvent, record: EventsExplorerEvent]
    'load-more': [event: Event]
  }>()

  const filters = defineModel<EventsExplorerFilters>('filters', {
    default: () => ({ period: ['24h'] })
  })
  const search = defineModel<string>('search', { default: '' })
  const page = defineModel<number>('page', { default: 1 })
  const pageSize = defineModel<number>('pageSize', { default: 25 })
  const selectedKey = defineModel<string>('selectedKey', { default: '' })
  const exclusions = defineModel<EventsExplorerFilters>('exclusions', {
    default: () => ({})
  })

  defineSlots<{
    /** Replaces the controls row and the filter chips; exportCsv downloads the log shown. */
    toolbar?(props: { exportCsv: () => void; exportDisabled: boolean }): unknown
    /** Replaces the fields of the open event in its document. */
    'document-fields'?(props: {
      event: EventsExplorerEvent
      fields: EventsExplorerDocumentField[]
    }): unknown
  }>()

  type EventRow = EventsExplorerEvent & { time: string; sourceLabel: string }

  type AppliedValue = FilterMenuValue

  interface FilterOption {
    value: AppliedValue
    label: string
    custom?: boolean
  }

  interface FilterField {
    label: string
    id: string
    kind: 'range' | 'options'
    options: FilterOption[]
    formatValue?: (value: AppliedValue) => string
    match: (event: EventRow, values: AppliedValue[]) => boolean
  }

  const { formatDate, formatNumber } = useLocale()

  const nowDate = computed(() => props.now ?? sampleNow)

  const dayFormat = (value: Date | number | string) =>
    formatDate(value, {
      month: 'short',
      day: '2-digit',
      timeZone: props.timeZone
    })
  const clockFormat = (value: Date | number | string) =>
    formatDate(value, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: props.timeZone
    })
  const axisFormat = (value: Date | number | string) =>
    formatDate(value, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: props.timeZone
    })
  const isDate = (value: unknown): value is Date =>
    value instanceof Date && !Number.isNaN(value.getTime())

  const formatEventTime = (date: Date) =>
    isDate(date) ? `${dayFormat(date)}, ${clockFormat(date)}` : ''

  const formatEventClock = (date: unknown) => (isDate(date) ? axisFormat(date) : '')

  const formatEventClockSeconds = (date: unknown) => (isDate(date) ? clockFormat(date) : '')

  const eventSources: Record<string, string> = {
    http: 'HTTP Requests',
    security: 'Security',
    services: 'Services',
    access: 'Access Control'
  }

  const eventSourceOptions = Object.entries(eventSources).map(([value, label]) => ({
    value,
    label
  }))

  const eventLevels: Record<EventsExplorerEventLevel, TagSeverity> = {
    Error: 'danger',
    Warning: 'warning',
    Info: 'info',
    Debug: 'neutral'
  }

  const eventLevelSeverity = (level: EventsExplorerEventLevel) => eventLevels[level] ?? 'neutral'

  const levelOrder = Object.keys(eventLevels) as EventsExplorerEventLevel[]

  const eventLevelOptions = levelOrder.map((value) => ({ value, label: value }))

  const eventPeriods: FilterOption[] = [
    { value: '15m', label: 'Last 15 minutes' },
    { value: '1h', label: 'Last hour' },
    { value: '6h', label: 'Last 6 hours' },
    { value: '24h', label: 'Last 24 hours' },
    { value: 'custom', label: 'Custom range', custom: true }
  ]

  const periodMinutes: Record<string, number> = { '15m': 15, '1h': 60, '6h': 360, '24h': 1440 }

  const fullWindowMinutes = periodMinutes['24h']

  const withinRange = (date: Date, range: FilterMenuRange | null) => {
    if (!range) return true
    const { start, end } = range
    if (!start && !end) return true
    if (!isDate(date)) return false
    if (start && date.getTime() < start.getTime()) return false
    if (end) {
      const midnight =
        end.getHours() === 0 &&
        end.getMinutes() === 0 &&
        end.getSeconds() === 0 &&
        end.getMilliseconds() === 0
      const bound = midnight
        ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999)
        : end
      if (date.getTime() > bound.getTime()) return false
    }
    return true
  }

  const periodRange = (value: AppliedValue, now = nowDate.value): FilterMenuRange => {
    if (value && typeof value === 'object') {
      return { start: value.start ?? null, end: value.end ?? now }
    }
    const minutes = periodMinutes[value] ?? fullWindowMinutes
    return { start: new Date(now.getTime() - minutes * 60000), end: now }
  }

  const matchPeriod = (date: Date, values: AppliedValue[]) => {
    const [period] = values ?? []
    if (!period || period === 'custom' || !isDate(date)) return true
    return withinRange(date, periodRange(period))
  }

  const formatPeriod = (value: AppliedValue) => {
    if (!value || typeof value !== 'object') return ''
    const { start, end } = value
    if (!start) return end ? `Until ${formatEventClock(end)}` : ''
    const sameDay = end && dayFormat(start) === dayFormat(end)
    const from = `${dayFormat(start)}, ${formatEventClock(start)}`
    if (!end) return `Since ${from}`
    return sameDay
      ? `${from} to ${formatEventClock(end)}`
      : `${from} to ${dayFormat(end)}, ${formatEventClock(end)}`
  }

  const eventFields = computed(() => props.fields ?? sampleFields)

  const eventFieldCategories = computed<EventsExplorerFieldCategory[]>(() => {
    if (props.categories) return props.categories
    if (!props.fields) return sampleCategories
    const ids = [...new Set(props.fields.map((field) => field.category ?? ''))].filter(Boolean)
    return ids.map((category) => ({ label: category, id: category }))
  })

  const coreFields = computed(() => eventFields.value.filter((field) => field.core))

  const optionalFields = computed(() => eventFields.value.filter((field) => !field.core))

  const eventField = (id: string) => eventFields.value.find((field) => field.id === id)

  const formatEventValue = (field: EventsExplorerField | undefined, value: unknown) => {
    if (value === undefined || value === null || value === '') return '—'
    if (typeof value !== 'number' || !field?.format) return String(value)
    return field.format === 'number' ? formatNumber(value) : `${value} ms`
  }

  const serverMode = computed(() => props.total !== undefined)

  const sourceEvents = computed<EventsExplorerEvent[]>(
    () => props.events ?? (props.loading || props.error ? [] : sampleEvents)
  )

  const eventRows = computed<EventRow[]>(() =>
    sourceEvents.value.map((event) => ({
      ...event,
      time: formatEventTime(event.at),
      sourceLabel: eventSources[event.source] ?? event.source
    }))
  )

  const searchEvents = (list: EventRow[], term: string) => {
    const needle = term.trim().toLowerCase()
    if (!needle) return list
    return list.filter((event) =>
      eventFields.value.some((field) => {
        const value = event[field.id]
        return value !== undefined && value !== null && String(value).toLowerCase().includes(needle)
      })
    )
  }

  const fieldValueCounts = (list: EventRow[], id: string) => {
    const counts = new Map<AppliedValue, number>()
    for (const event of list) {
      const value = event[id] as AppliedValue | undefined | null
      if (value === undefined || value === null || value === '') continue
      counts.set(value, (counts.get(value) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
  }

  const countFieldValues = (list: EventRow[], id: string) => {
    const values = new Set<unknown>()
    for (const event of list) {
      const value = event[id]
      if (value !== undefined && value !== null && value !== '') values.add(value)
    }
    return values.size
  }

  const bucketCountFor = (windowMinutes: number) => {
    if (windowMinutes <= 15) return 12
    if (windowMinutes <= 60) return 20
    return 32
  }

  const eventBuckets = (
    list: EventRow[],
    range: FilterMenuRange | null
  ): EventsExplorerBucket[] => {
    const end = (range?.end ?? nowDate.value).getTime()
    const start = (range?.start ?? new Date(end - fullWindowMinutes * 60000)).getTime()
    const span = Math.max(1, end - start)
    const bars = bucketCountFor(span / 60000)
    const width = span / bars
    const result = Array.from({ length: bars }, (_, index) => ({
      at: new Date(start + index * width),
      end: new Date(start + (index + 1) * width),
      total: 0,
      levels: Object.fromEntries(levelOrder.map((level) => [level, 0]))
    }))
    for (const event of list) {
      if (!isDate(event.at)) continue
      const offset = event.at.getTime() - start
      if (offset < 0 || offset > span) continue
      const bucket = result[Math.min(bars - 1, Math.floor(offset / width))]
      bucket.total += 1
      if (bucket.levels[event.level] !== undefined) bucket.levels[event.level] += 1
    }
    return result
  }

  const eventSummary = (list: EventRow[]): EventsExplorerSummary => {
    const errors = list.filter((event) => event.level === 'Error').length
    const times = list
      .map((event) => event.requestTimeMs)
      .filter((value): value is number => typeof value === 'number')
    return {
      total: list.length,
      errors,
      avgRequestTimeMs: times.length
        ? Math.round(times.reduce((sum, value) => sum + value, 0) / times.length)
        : null
    }
  }

  const baseFilterFields: FilterField[] = [
    {
      label: 'Period',
      id: 'period',
      kind: 'range',
      options: eventPeriods,
      formatValue: formatPeriod,
      match: (event, values) => matchPeriod(event.at, values)
    },
    {
      label: 'Source',
      id: 'source',
      kind: 'options',
      options: eventSourceOptions,
      match: (event, values) => values.includes(event.source)
    },
    {
      label: 'Level',
      id: 'level',
      kind: 'options',
      options: eventLevelOptions,
      match: (event, values) => values.includes(event.level)
    }
  ]

  const baseFilterIds = new Set(baseFilterFields.map((field) => field.id))

  const activeFieldIds = computed(() =>
    Object.keys(filters.value).filter(
      (id) => !baseFilterIds.has(id) && Boolean(filters.value[id]?.length)
    )
  )

  const filterFields = computed<FilterField[]>(() => [
    ...baseFilterFields,
    ...activeFieldIds.value.map((id): FilterField => {
      const field = eventField(id)
      return {
        id,
        label: field?.label ?? id,
        kind: 'options',
        options: fieldValueCounts(eventRows.value, id).map(({ value }) => ({
          value,
          label: formatEventValue(field, value)
        })),
        match: (event: EventRow, values: readonly unknown[]) => values.includes(event[id])
      }
    })
  ])

  const menuFields = computed<FilterMenuField[]>(() =>
    filterFields.value.map((field) => ({
      label: field.label,
      id: field.id,
      type: field.kind === 'range' ? 'date' : 'multiple',
      options: (field.options ?? [])
        .filter((option) => !option.custom)
        .map((option) => ({ value: option.value as string | number, label: option.label }))
    }))
  )

  const filteredEvents = computed(() =>
    eventRows.value.filter(
      (event) =>
        filterFields.value.every((field) => {
          const values = filters.value[field.id]
          if (!values?.length) return true
          return field.match(event, values)
        }) &&
        Object.entries(exclusions.value).every(
          ([id, values]) => !values.includes(event[id] as FilterMenuValue)
        ) &&
        (!props.match || props.match(event))
    )
  )

  const exclusionChips = computed(() =>
    Object.entries(exclusions.value).flatMap(([id, values]) => {
      const field = eventField(id)
      return values.map((value) => ({
        key: `${id}:${String(value)}`,
        id,
        value,
        label: field?.label ?? id,
        text: formatEventValue(field, value)
      }))
    })
  )

  const removeExclusion = (id: string, value: FilterMenuValue) => {
    exclusions.value = {
      ...exclusions.value,
      [id]: (exclusions.value[id] ?? []).filter((item) => item !== value)
    }
  }

  watch([filters, exclusions], () => {
    page.value = 1
  })

  const tableEl = ref<TableExposed<EventRow> | null>(null)
  const exportCsv = () => tableEl.value?.exportCsv({ filename: 'events.csv' })

  const matchedEvents = computed(() =>
    serverMode.value ? eventRows.value : searchEvents(filteredEvents.value, search.value)
  )

  watch(search, () => {
    page.value = 1
  })

  const appliedPeriod = computed(() => filters.value.period?.[0] ?? '')

  const activeWindow = computed(() => periodRange(appliedPeriod.value))

  const windowLabel = computed(() => {
    const period = appliedPeriod.value
    if (period && typeof period === 'object') return formatPeriod(period)
    return eventPeriods.find((option) => option.value === period)?.label ?? 'Last 24 hours'
  })

  const selectTimeRange = ({ start, end }: FilterMenuRange) => {
    filters.value = { ...filters.value, period: [{ start, end }] }
  }

  const buckets = computed(
    () => props.buckets ?? eventBuckets(matchedEvents.value, activeWindow.value)
  )
  const summary = computed(() => props.summary ?? eventSummary(matchedEvents.value))

  const errorShareLabel = computed(() =>
    summary.value.total
      ? `${((summary.value.errors / summary.value.total) * 100).toFixed(1)}% of events`
      : 'none'
  )

  const noTraffic = computed(() => !serverMode.value && !sourceEvents.value.length)

  const defaultColumns = () => {
    const known = ['host', 'status', 'remoteAddress'].filter((id) => eventField(id))
    return known.length ? known : optionalFields.value.slice(0, 3).map((field) => field.id)
  }

  const shownColumns = ref(defaultColumns())
  const fieldsOpen = ref(true)
  const fieldSearch = ref('')

  const matchesFieldSearch = (field: EventsExplorerField) => {
    const term = fieldSearch.value.trim().toLowerCase()
    if (!term) return true
    return field.label.toLowerCase().includes(term) || field.id.toLowerCase().includes(term)
  }

  const shownFields = computed<Array<EventsExplorerField & { locked?: boolean }>>(() => [
    ...coreFields.value.filter(matchesFieldSearch).map((field) => ({ ...field, locked: true })),
    ...optionalFields.value.filter(
      (field) => shownColumns.value.includes(field.id) && matchesFieldSearch(field)
    )
  ])

  const fieldCategories = computed(() =>
    eventFieldCategories.value
      .map((category) => ({
        ...category,
        fields: optionalFields.value.filter(
          (field) =>
            field.category === category.id &&
            !shownColumns.value.includes(field.id) &&
            matchesFieldSearch(field)
        )
      }))
      .filter((category) => category.fields.length)
  )

  const hasFieldMatches = computed(
    () => shownFields.value.length > 0 || fieldCategories.value.length > 0
  )

  const categoryFilterCount = (category: { fields: EventsExplorerField[] }) =>
    category.fields.filter((field) => filters.value[field.id]?.length).length

  const defaultCategories = () => eventFieldCategories.value.slice(0, 1).map(({ id }) => id)

  const openCategories = ref(defaultCategories())

  watch(
    () => eventFields.value.map((field) => field.id).join(' '),
    () => {
      shownColumns.value = defaultColumns()
      openCategories.value = defaultCategories()
    }
  )

  const collapsedBeforeSearch = ref<string[] | null>(null)
  watch(fieldSearch, (term, previous) => {
    const searching = Boolean(term.trim())
    if (searching && !previous.trim()) collapsedBeforeSearch.value = [...openCategories.value]
    if (searching) {
      openCategories.value = fieldCategories.value.map((category) => category.id)
      return
    }
    openCategories.value = collapsedBeforeSearch.value ?? defaultCategories()
    collapsedBeforeSearch.value = null
  })

  const fieldCounts = computed(() =>
    Object.fromEntries(
      eventFields.value.map((field) => [field.id, countFieldValues(matchedEvents.value, field.id)])
    )
  )

  const topValues = 6

  const unfilterableFields = new Set(['time', 'sourceLabel'])

  const canFilterField = (field: EventsExplorerField) => !unfilterableFields.has(field.id)

  const topFieldValues = (id: string) =>
    fieldValueCounts(matchedEvents.value, id).slice(0, topValues)

  const fieldValueOverflow = (id: string) =>
    Math.max(0, countFieldValues(matchedEvents.value, id) - topValues)

  const isValueApplied = (id: string, value: AppliedValue) =>
    (filters.value[id] ?? []).includes(value)

  const toggleColumn = (id: string) => {
    shownColumns.value = shownColumns.value.includes(id)
      ? shownColumns.value.filter((shown) => shown !== id)
      : [...shownColumns.value, id]
  }

  const toggleFieldValue = (id: string, value: AppliedValue) => {
    const current = filters.value[id] ?? []
    const next = current.includes(value)
      ? current.filter((applied) => applied !== value)
      : [...current, value]
    filters.value = { ...filters.value, [id]: next }
  }

  const toColumn = (field: EventsExplorerField): TableColumn => ({
    accessorKey: field.id,
    header: field.label,
    sortable: true,
    ...(field.principal ? { principal: true } : {}),
    ...(field.grow ? { grow: field.grow } : {}),
    ...(field.minWidth ? { minWidth: field.minWidth } : {}),
    ...(field.align ? { align: field.align } : {})
  })

  const columns = computed<TableColumn[]>(() => [
    { id: 'detail', header: '', width: 44, align: 'center', hideable: false },
    ...(compactLog.value
      ? coreFields.value.filter((field) => field.id === 'message').map(toColumn)
      : coreFields.value.map(toColumn)),
    ...optionalFields.value.filter((field) => shownColumns.value.includes(field.id)).map(toColumn)
  ])

  const customCellFields = ['status']
  const genericColumns = computed(() =>
    optionalFields.value.filter(
      (field) => shownColumns.value.includes(field.id) && !customCellFields.includes(field.id)
    )
  )

  const statusField = computed(() => eventField('status'))

  const statusSeverity = (status: unknown) => {
    if (typeof status !== 'number') return null
    if (status >= 500) return 'danger'
    if (status >= 400) return 'warning'
    return 'success'
  }

  const selectedId = selectedKey
  const selectedEvent = computed(
    () => matchedEvents.value.find((event) => event.id === selectedId.value) ?? null
  )
  const documentEvent = ref<EventRow | null>(null)
  const traceView = ref<TraceView>('waterfall')
  watch(
    selectedEvent,
    (event) => {
      if (event) documentEvent.value = event
    },
    { immediate: true }
  )

  const logMinWidth = 480
  const documentMinWidth = 348
  const fieldsPanelWidth = 268

  const explorerEl = ref<HTMLElement | null>(null)
  const explorerWidth = ref(0)
  let explorerObserver: ResizeObserver | null = null

  const showFieldsPanel = computed(
    () => explorerWidth.value === 0 || explorerWidth.value >= fieldsPanelWidth + logMinWidth
  )

  const isWide = computed(
    () =>
      explorerWidth.value === 0 ||
      explorerWidth.value >= fieldsPanelWidth + logMinWidth + documentMinWidth
  )

  const compactLog = computed(() => !isWide.value)

  const documentDrawerOpen = ref(false)

  onMounted(() => {
    if (!explorerEl.value) return
    explorerWidth.value = explorerEl.value.offsetWidth
    explorerObserver = new ResizeObserver(([entry]) => {
      explorerWidth.value = entry.contentRect.width
    })
    explorerObserver.observe(explorerEl.value)
  })

  watch(isWide, (wide) => {
    documentDrawerOpen.value = !wide && Boolean(selectedId.value)
  })

  const closeDocument = () => {
    selectedId.value = ''
    documentDrawerOpen.value = false
  }

  const openDocument = (event: MouseEvent | KeyboardEvent, row: EventRow) => {
    selectedId.value = row.id
    documentDrawerOpen.value = !isWide.value
    emit('select', event, sourceEvents.value.find((record) => record.id === row.id) ?? row)
  }

  const documentCollapsed = computed({
    get: () => !selectedEvent.value,
    set: (collapsed) => {
      if (collapsed) closeDocument()
    }
  })

  const documentPaneExpanded = computed({
    get: () => isWide.value && !documentCollapsed.value,
    set: (expanded) => {
      if (!expanded) closeDocument()
    }
  })

  watch(documentDrawerOpen, (open) => {
    if (!open && !isWide.value) selectedId.value = ''
  })

  const fieldsWidth = ref(fieldsPanelWidth)
  const documentWidth = ref(400)

  const documentMaxWidth = computed(() => {
    if (explorerWidth.value === 0) return Infinity
    const fieldsUsed = showFieldsPanel.value && fieldsOpen.value ? fieldsWidth.value : 0
    return Math.max(documentMinWidth, explorerWidth.value - fieldsUsed - logMinWidth)
  })

  watch(
    [documentMaxWidth, documentWidth],
    ([max, width]) => {
      if (width > max) documentWidth.value = max
    },
    { flush: 'sync' }
  )

  const summaryPriority = [
    'host',
    'requestMethod',
    'requestUri',
    'status',
    'serviceName',
    'serviceDurationMs',
    'ruleName',
    'requestTimeMs',
    'remoteAddress',
    'country',
    'cacheStatus',
    'resourceId'
  ]

  const summaryLimit = 6

  const summaryOrder = computed(() => {
    const known = summaryPriority.filter((id) => eventField(id))
    return known.length ? known : optionalFields.value.map((field) => field.id)
  })

  const hasEventValue = (event: EventRow, id: string) => {
    const value = event[id]
    return value !== undefined && value !== null && value !== ''
  }

  const documentFields = computed<EventsExplorerDocumentField[]>(() => {
    const event = documentEvent.value
    if (!event) return []
    return eventFields.value
      .filter((field) => hasEventValue(event, field.id))
      .map((field) => ({
        id: field.id,
        label: field.label,
        value: formatEventValue(field, event[field.id]),
        raw: event[field.id] as FilterMenuValue,
        filterable: canFilterField(field)
      }))
  })

  const documentRows = computed(() => {
    const event = selectedEvent.value
    if (!event) return []
    return summaryOrder.value
      .filter((id) => hasEventValue(event, id))
      .slice(0, summaryLimit)
      .map((id) => {
        const field = eventField(id)
        return { id, label: field?.label ?? id, value: formatEventValue(field, event[id]) }
      })
  })

  const documentTabs = computed(() => {
    const event = selectedEvent.value
    if (!event) return []
    const payload = Object.fromEntries(
      eventFields.value
        .filter((field) => hasEventValue(event, field.id))
        .map((field) => [field.id, event[field.id]])
    )
    return [
      {
        label: 'Document',
        value: 'document',
        language: 'json',
        code: JSON.stringify(payload, null, 2)
      }
    ]
  })

  const levelColors: Record<EventsExplorerEventLevel, ChartColor> = {
    Error: 'severity-critical',
    Warning: 'severity-medium',
    Info: 'severity-low',
    Debug: 'severity-info'
  }

  const volumeLabels = computed(() => buckets.value.map((bucket) => bucket.at))

  const volumeSeries = computed<ChartSeries[]>(() =>
    levelOrder.map((level) => ({
      name: level,
      id: level,
      color: levelColors[level] ?? 'other',
      values: buckets.value.map((bucket) => bucket.levels[level] ?? 0)
    }))
  )

  const busiestIndex = computed(() =>
    buckets.value.reduce(
      (highest, bucket, index) =>
        bucket.total > (buckets.value[highest]?.total ?? 0) ? index : highest,
      0
    )
  )

  const busiestBucket = computed(() => buckets.value[busiestIndex.value] ?? null)

  const selectVolume = (span: ChartRange | null) => {
    if (!span) return
    const from = buckets.value[span[0]]
    const to = buckets.value[span[1]]
    if (from && to) selectTimeRange({ start: from.at, end: to.end })
  }

  const chartSummary = computed(() => {
    if (!busiestBucket.value?.total) return `No events in the ${windowLabel.value.toLowerCase()}.`
    return `Busiest bucket at ${formatEventClock(busiestBucket.value.at)} with ${busiestBucket.value.total} events.`
  })

  const chartLabel = computed(
    () =>
      `Event volume, ${windowLabel.value.toLowerCase()}. ${chartSummary.value} Drag across the chart, or hold Shift with the arrow keys and press Enter, to filter the log to a span.`
  )

  onBeforeUnmount(() => {
    explorerObserver?.disconnect()
  })

  const FIELD_ROW_CLASS =
    'group flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-2xs) transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:bg-(--bg-hover) motion-reduce:transition-none'

  const FIELD_COUNT_CLASS =
    'shrink-0 cursor-pointer text-label-code-sm tabular-nums text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:text-(--text-default) group-hover:text-(--text-default) motion-reduce:transition-none'

  const STATUS_CELL_CLASS =
    'min-w-0 truncate text-label-code-sm tabular-nums text-(--text-default) ' +
    'data-[severity=danger]:text-(--danger-foreground) data-[severity=warning]:text-(--warning-foreground)'
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <header
      class="flex shrink-0 flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-lg) py-(--spacing-sm)"
    >
      <slot
        name="toolbar"
        :export-csv="exportCsv"
        :export-disabled="!tableEl"
      >
        <header class="flex flex-wrap items-center gap-x-(--layout-group-gap) gap-y-(--spacing-xs)">
          <div class="flex min-w-0 grow basis-(--container-3xs) items-center gap-(--spacing-xs)">
            <FilterMenu
              v-model="filters"
              :fields="menuFields"
              class="shrink-0"
              data-testid="filter-button"
            />
            <div class="flex min-w-36 grow basis-(--container-2xs)">
              <Input
                v-model="search"
                size="medium"
                placeholder="Search events, hosts, paths or addresses"
                aria-label="Search events"
                class="w-full"
              >
                <template #leading>
                  <i
                    class="az az-search"
                    aria-hidden="true"
                  />
                </template>
              </Input>
            </div>
          </div>
          <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
            <span
              class="text-label-sm inline-flex items-center gap-(--spacing-2xs) whitespace-nowrap text-(--text-muted)"
              data-testid="events-time-zone"
            >
              <i
                class="az az-globe"
                aria-hidden="true"
              />
              Times in {{ timeZone }}
            </span>
            <Tooltip
              content="Refresh"
              class="shrink-0"
            >
              <IconButton
                icon="az az-refresh"
                variant="outline"
                size="medium"
                :loading="loading"
                aria-label="Refresh"
                data-testid="refresh-button"
                @click="(event: MouseEvent) => emit('refresh', event)"
              />
            </Tooltip>
            <Tooltip
              content="Download CSV"
              class="shrink-0"
            >
              <IconButton
                icon="az az-download"
                variant="outline"
                size="medium"
                :disabled="!tableEl"
                aria-label="Download CSV"
                data-testid="export-button"
                @click="exportCsv"
              />
            </Tooltip>
          </div>
        </header>

        <div
          v-if="exclusionChips.length"
          class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
        >
          <FilterMenu.ChipGroup
            v-model="filters"
            :fields="menuFields"
            data-testid="filter-chips"
          />
          <span
            v-for="chip in exclusionChips"
            :key="chip.key"
            class="inline-flex w-fit max-w-full"
          >
            <Chip
              :label="`${chip.label} is not ${chip.text}`"
              variant="filled"
              size="medium"
              removable
              data-testid="exclusion-chip"
              @remove="removeExclusion(chip.id, chip.value)"
            >
              <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                <span class="truncate text-(--text-muted)">{{ chip.label }} is not</span>
                <span class="truncate">{{ chip.text }}</span>
              </span>
            </Chip>
          </span>
        </div>
        <FilterMenu.ChipGroup
          v-else
          v-model="filters"
          :fields="menuFields"
          data-testid="filter-chips"
        />
      </slot>
    </header>

    <section
      ref="explorerEl"
      class="animate-content-enter motion-reduce:animate-none relative flex min-h-0 min-w-0 flex-1 overflow-hidden"
    >
      <Resizable
        orientation="horizontal"
        aria-label="Events explorer"
        class="min-h-0 min-w-0 flex-1"
      >
        <Resizable.Pane aria-label="Events">
          <div class="flex h-full min-h-0 min-w-0 flex-1">
            <div
              v-if="showFieldsPanel"
              key="fields-panel"
              class="contents [--sidebar-width:var(--container-2xs)]"
            >
              <Sidebar
                v-model:open="fieldsOpen"
                v-model:width="fieldsWidth"
                resizable
                collapsible
                aria-label="Fields"
                collapse-aria-label="Hide the fields panel"
                expand-aria-label="Show the fields panel"
                resize-aria-label="Resize the fields panel"
              >
                <template #header>
                  <div class="px-(--spacing-xs)">
                    <Input
                      v-model="fieldSearch"
                      size="medium"
                      class="w-full"
                      placeholder="Search fields"
                      aria-label="Search fields"
                    >
                      <template #leading>
                        <i
                          class="az az-search"
                          aria-hidden="true"
                        />
                      </template>
                    </Input>
                  </div>
                </template>

                <div>
                  <div
                    class="flex items-baseline justify-between gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-2xs) pt-(--spacing-2xs)"
                  >
                    <span class="text-label-sm text-(--text-muted)">Shown</span>
                    <span class="text-label-sm text-(--text-muted)">Values</span>
                  </div>

                  <div
                    v-for="field in shownFields"
                    :key="field.id"
                    :class="FIELD_ROW_CLASS"
                  >
                    <div class="min-w-0 flex-1">
                      <Field
                        orientation="horizontal"
                        :disabled="field.locked"
                      >
                        <Checkbox
                          :model-value="true"
                          @update:model-value="toggleColumn(field.id)"
                        />
                        <Field.Label>
                          <span class="truncate">{{ field.label }}</span>
                        </Field.Label>
                      </Field>
                    </div>

                    <Popover
                      v-if="canFilterField(field) && fieldCounts[field.id]"
                      side="end"
                      align="start"
                    >
                      <div :class="FIELD_COUNT_CLASS">
                        <Popover.Trigger
                          role="button"
                          tabindex="0"
                          :aria-label="`Filter by ${field.label}, ${fieldCounts[field.id]} values`"
                        >
                          {{ fieldCounts[field.id] }}
                        </Popover.Trigger>
                      </div>

                      <Popover.Content>
                        <div class="flex min-w-0 flex-col p-(--spacing-2xs)">
                          <p
                            class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
                          >
                            {{ field.label }} · top values
                          </p>

                          <Item
                            v-for="entry in topFieldValues(field.id)"
                            :key="String(entry.value)"
                            clickable
                            variant="option"
                            :aria-pressed="isValueApplied(field.id, entry.value)"
                            @click="toggleFieldValue(field.id, entry.value)"
                          >
                            <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                              <span
                                class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-default)"
                              >
                                {{ formatEventValue(field, entry.value) }}
                              </span>
                              <span
                                class="shrink-0 text-label-code-sm tabular-nums text-(--text-muted)"
                              >
                                {{ entry.count }}
                              </span>
                              <i
                                v-if="isValueApplied(field.id, entry.value)"
                                class="az az-check shrink-0 text-(--primary)"
                                aria-hidden="true"
                              />
                            </span>
                          </Item>

                          <p
                            v-if="fieldValueOverflow(field.id)"
                            class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
                          >
                            {{ fieldValueOverflow(field.id) }} more values in this window.
                          </p>
                        </div>
                      </Popover.Content>
                    </Popover>

                    <span
                      v-else
                      class="shrink-0 px-(--spacing-2xs) text-label-code-sm tabular-nums text-(--text-muted) data-empty:text-(--text-disabled)"
                      :data-empty="fieldCounts[field.id] ? null : true"
                      :aria-label="`${fieldCounts[field.id]} distinct values`"
                    >
                      {{ fieldCounts[field.id] }}
                    </span>
                  </div>

                  <div
                    v-if="fieldCategories.length"
                    class="mt-(--spacing-xs)"
                  >
                    <Accordion
                      v-model="openCategories"
                      type="multiple"
                      size="medium"
                      icon-position="leading"
                    >
                      <Accordion.Item
                        v-for="category in fieldCategories"
                        :key="category.id"
                        :value="category.id"
                      >
                        <Accordion.Trigger>
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <span class="truncate text-label-sm text-(--text-default)">
                              {{ category.label }}
                            </span>
                            <Tag
                              v-if="categoryFilterCount(category)"
                              :label="String(categoryFilterCount(category))"
                              severity="info"
                              size="small"
                            />
                          </span>
                        </Accordion.Trigger>

                        <Accordion.Content :padded="false">
                          <div
                            v-for="field in category.fields"
                            :key="field.id"
                            :class="FIELD_ROW_CLASS"
                          >
                            <div class="min-w-0 flex-1">
                              <Field orientation="horizontal">
                                <Checkbox
                                  :model-value="false"
                                  @update:model-value="toggleColumn(field.id)"
                                />
                                <Field.Label>
                                  <span class="truncate">{{ field.label }}</span>
                                </Field.Label>
                              </Field>
                            </div>

                            <Popover
                              v-if="canFilterField(field) && fieldCounts[field.id]"
                              side="end"
                              align="start"
                            >
                              <div :class="FIELD_COUNT_CLASS">
                                <Popover.Trigger
                                  role="button"
                                  tabindex="0"
                                  :aria-label="`Filter by ${field.label}, ${fieldCounts[field.id]} values`"
                                >
                                  {{ fieldCounts[field.id] }}
                                </Popover.Trigger>
                              </div>

                              <Popover.Content>
                                <div class="flex min-w-0 flex-col p-(--spacing-2xs)">
                                  <p
                                    class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
                                  >
                                    {{ field.label }} · top values
                                  </p>

                                  <Item
                                    v-for="entry in topFieldValues(field.id)"
                                    :key="String(entry.value)"
                                    clickable
                                    variant="option"
                                    :aria-pressed="isValueApplied(field.id, entry.value)"
                                    @click="toggleFieldValue(field.id, entry.value)"
                                  >
                                    <span
                                      class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)"
                                    >
                                      <span
                                        class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-default)"
                                      >
                                        {{ formatEventValue(field, entry.value) }}
                                      </span>
                                      <span
                                        class="shrink-0 text-label-code-sm tabular-nums text-(--text-muted)"
                                      >
                                        {{ entry.count }}
                                      </span>
                                      <i
                                        v-if="isValueApplied(field.id, entry.value)"
                                        class="az az-check shrink-0 text-(--primary)"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </Item>

                                  <p
                                    v-if="fieldValueOverflow(field.id)"
                                    class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
                                  >
                                    {{ fieldValueOverflow(field.id) }} more values in this window.
                                  </p>
                                </div>
                              </Popover.Content>
                            </Popover>

                            <span
                              v-else
                              class="shrink-0 px-(--spacing-2xs) text-label-code-sm tabular-nums text-(--text-muted) data-empty:text-(--text-disabled)"
                              :data-empty="fieldCounts[field.id] ? null : true"
                              :aria-label="`${fieldCounts[field.id]} distinct values`"
                            >
                              {{ fieldCounts[field.id] }}
                            </span>
                          </div>
                        </Accordion.Content>
                      </Accordion.Item>
                    </Accordion>
                  </div>

                  <p
                    v-if="!hasFieldMatches"
                    class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
                  >
                    No fields match "{{ fieldSearch }}".
                  </p>
                </div>
              </Sidebar>
            </div>

            <div
              v-if="error"
              class="flex min-w-0 flex-1 flex-col overflow-hidden p-(--spacing-md)"
            >
              <Alert
                severity="danger"
                :label="error"
                action-label="Retry"
                @action="(event: MouseEvent) => emit('retry', event)"
              />
            </div>
            <div
              v-else
              class="flex min-w-0 flex-1 flex-col overflow-hidden"
            >
              <section
                class="flex shrink-0 flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
              >
                <div class="flex flex-wrap items-end gap-(--spacing-md)">
                  <dl class="flex flex-wrap items-end gap-(--spacing-xl)">
                    <div class="flex flex-col">
                      <dt class="text-label-sm text-(--text-muted)">Events</dt>
                      <dd class="m-0 text-heading-xs tabular-nums text-(--text-default)">
                        <Skeleton
                          v-if="loading"
                          width="4rem"
                          height="1.5rem"
                        />
                        <template v-else>{{ formatNumber(summary.total) }}</template>
                      </dd>
                    </div>
                    <div class="flex flex-col">
                      <dt class="text-label-sm text-(--text-muted)">Errors</dt>
                      <dd
                        class="m-0 text-heading-xs tabular-nums text-(--text-default) data-raised:text-(--danger-foreground)"
                        :data-raised="summary.errors ? true : null"
                        :aria-label="`${summary.errors} errors, ${errorShareLabel}`"
                      >
                        <Skeleton
                          v-if="loading"
                          width="3rem"
                          height="1.5rem"
                        />
                        <template v-else>{{ formatNumber(summary.errors) }}</template>
                      </dd>
                    </div>
                    <div class="flex flex-col">
                      <dt class="text-label-sm text-(--text-muted)">Avg request time</dt>
                      <dd class="m-0 text-heading-xs tabular-nums text-(--text-default)">
                        <Skeleton
                          v-if="loading"
                          width="4rem"
                          height="1.5rem"
                        />
                        <template v-else>{{
                          summary.avgRequestTimeMs === null ? '—' : `${summary.avgRequestTimeMs} ms`
                        }}</template>
                      </dd>
                    </div>
                  </dl>
                </div>

                <Skeleton
                  v-if="loading"
                  height="5rem"
                />
                <Chart
                  v-else
                  :range="null"
                  :series="volumeSeries"
                  :labels="volumeLabels"
                  :format-label="formatEventClock"
                  :height="80"
                  :aria-label="chartLabel"
                  @update:range="selectVolume"
                >
                  <Chart.Axis
                    type="x"
                    :ticks="3"
                  />
                  <Chart.Brush />
                  <Chart.Bar
                    type="histogram"
                    stacked
                  />
                  <Chart.Crosshair />
                  <Chart.Tooltip total>
                    <template #footer
                      >Click to filter to this bucket, or drag to select a span.</template
                    >
                  </Chart.Tooltip>
                </Chart>
              </section>

              <section class="flex min-h-0 min-w-0 flex-1 flex-col">
                <div class="flex min-h-0 flex-1">
                  <DataTable
                    ref="tableEl"
                    v-model:page="page"
                    v-model:page-size="pageSize"
                    :data="matchedEvents"
                    :columns="columns"
                    row-key="id"
                    sortable
                    paginated
                    :manual-pagination="total !== undefined"
                    :row-count="total"
                    :more-rows="moreRows"
                    :loading-more="loadingMore"
                    :bordered="false"
                    density="compact"
                    max-height="100%"
                    class="w-full"
                    :loading="loading"
                    @row-click="openDocument"
                    @load-more="(event: Event) => emit('load-more', event)"
                  >
                    <template #header-detail>
                      <span class="sr-only">Open the event document</span>
                    </template>

                    <template #cell-detail="{ row }">
                      <IconButton
                        :icon="row.id === selectedId ? 'az az-chevron-down' : 'az az-chevron-right'"
                        variant="ghost"
                        size="small"
                        :aria-label="`Open event ${row.id}`"
                        :aria-expanded="row.id === selectedId"
                        @click.stop="openDocument($event, row)"
                      />
                    </template>

                    <template #cell-time="{ value }">
                      <span
                        class="min-w-0 truncate text-label-code-sm tabular-nums text-(--text-muted)"
                      >
                        {{ value }}
                      </span>
                    </template>

                    <template #cell-level="{ value }">
                      <Tag
                        :label="String(value)"
                        :severity="eventLevelSeverity(value as EventsExplorerEventLevel)"
                        size="small"
                      />
                    </template>

                    <template #cell-message="{ value, row }">
                      <div
                        v-if="compactLog"
                        class="flex min-w-0 flex-col gap-(--spacing-2xs) py-(--spacing-2xs)"
                      >
                        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <Tag
                            :label="String(row.level)"
                            :severity="eventLevelSeverity(row.level)"
                            size="small"
                            class="shrink-0"
                          />
                          <span
                            class="shrink-0 text-label-code-sm tabular-nums text-(--text-muted)"
                            >{{ formatEventClockSeconds(row.at) }}</span
                          >
                          <span class="min-w-0 truncate text-body-xs text-(--text-muted)">{{
                            row.sourceLabel
                          }}</span>
                        </div>
                        <span class="whitespace-normal break-words text-(--text-default)">{{
                          value
                        }}</span>
                      </div>
                      <span
                        v-else
                        class="min-w-0 truncate text-(--text-default)"
                        >{{ value }}</span
                      >
                    </template>

                    <template #cell-status="{ value }">
                      <span
                        :class="STATUS_CELL_CLASS"
                        :data-severity="statusSeverity(value)"
                      >
                        {{ formatEventValue(statusField, value) }}
                      </span>
                    </template>

                    <template
                      v-for="field in genericColumns"
                      :key="field.id"
                      #[`cell-${field.id}`]="{ value }"
                    >
                      <span
                        class="min-w-0 truncate text-(--text-default) data-mono:text-label-code-sm data-numeric:tabular-nums"
                        :data-mono="field.mono || null"
                        :data-numeric="field.align === 'end' || null"
                      >
                        {{ formatEventValue(field, value) }}
                      </span>
                    </template>

                    <template #empty>
                      <EmptyState
                        v-if="noTraffic"
                        key="no-traffic"
                        size="small"
                        icon="az az-inbox"
                        title="No events yet"
                        description="Events appear here as soon as traffic reaches this workspace's resources."
                      />
                      <EmptyState
                        v-else-if="search.trim()"
                        key="no-match"
                        size="small"
                        icon="az az-search"
                        title="No events match this search"
                        description="Clear the search, or widen the period to cover more of the log."
                      />
                      <EmptyState
                        v-else
                        key="no-events"
                        size="small"
                        icon="az az-filter-off"
                        title="No events in this window"
                        description="Widen the period or clear a filter to see more of the log."
                      />
                    </template>
                  </DataTable>
                </div>
              </section>
            </div>
          </div>
        </Resizable.Pane>
        <Resizable.Handle
          v-if="documentPaneExpanded"
          aria-label="Resize the event panel"
        />
        <Resizable.Pane
          v-model:basis="documentWidth"
          v-model:open="documentPaneExpanded"
          collapsible
          :min="320"
          :max="512"
          aria-label="Event document"
        >
          <aside
            :inert="!documentPaneExpanded"
            aria-labelledby="event-document-title"
            class="flex h-full min-h-0 min-w-0 flex-col border-s border-(--border-default) bg-(--bg-surface)"
          >
            <div
              class="flex items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
            >
              <h2
                id="event-document-title"
                class="min-w-0 truncate text-heading-2xs text-(--text-default)"
              >
                Event
              </h2>
              <Tooltip content="Close">
                <IconButton
                  icon="az az-x"
                  variant="ghost"
                  size="small"
                  aria-label="Close the event document"
                  @click="closeDocument"
                />
              </Tooltip>
            </div>
            <div class="min-h-0 flex-1 overflow-y-auto">
              <div
                v-if="documentEvent"
                class="min-w-0"
              >
                <div class="flex min-w-0 flex-col">
                  <div
                    class="flex min-w-0 flex-col gap-(--spacing-md) p-(--spacing-md) pb-(--spacing-lg)"
                  >
                    <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                      <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                        <Tag
                          :label="documentEvent.level"
                          :severity="eventLevelSeverity(documentEvent.level)"
                          size="small"
                        />
                        <Tag
                          :label="documentEvent.sourceLabel"
                          severity="neutral"
                          size="small"
                        />
                      </div>
                      <p class="text-body-md text-(--text-default)">{{ documentEvent.message }}</p>
                      <p class="text-label-code-sm tabular-nums text-(--text-muted)">
                        {{ documentEvent.time }}
                      </p>
                    </div>

                    <slot
                      name="document-fields"
                      :event="documentEvent"
                      :fields="documentFields"
                    >
                      <dl
                        class="grid min-w-0 grid-cols-[minmax(0,8rem)_minmax(0,1fr)] items-baseline gap-x-(--spacing-md) gap-y-(--spacing-sm)"
                      >
                        <template
                          v-for="row in documentRows"
                          :key="row.id"
                        >
                          <dt class="min-w-0 text-label-sm text-(--text-muted)">{{ row.label }}</dt>
                          <dd
                            class="m-0 min-w-0 break-words text-label-code-sm text-(--text-default)"
                          >
                            {{ row.value }}
                          </dd>
                        </template>
                      </dl>
                    </slot>
                  </div>

                  <div
                    v-if="documentEvent.spans?.length"
                    class="flex min-w-0 flex-col gap-(--spacing-xs) pb-(--spacing-lg)"
                  >
                    <h3 class="px-(--spacing-md) text-label-sm text-(--text-default)">Trace</h3>
                    <div class="border-y border-(--border-muted)">
                      <Trace
                        :key="documentEvent.id"
                        :spans="documentEvent.spans"
                        :bordered="false"
                        v-model:view="traceView"
                        highlight-critical-path
                        :aria-label="`Trace of request ${String(documentEvent.requestId ?? documentEvent.id)}`"
                      />
                    </div>
                  </div>

                  <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                    <h3 class="px-(--spacing-md) text-label-sm text-(--text-default)">
                      Event document
                    </h3>
                    <div class="min-w-0">
                      <CodeBlock
                        :tabs="documentTabs"
                        :bordered="false"
                        show-line-numbers
                        copy-aria-label="Copy the event document as JSON"
                        class="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </Resizable.Pane>
      </Resizable>
    </section>

    <Drawer
      v-model:open="documentDrawerOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>Event</DrawerTitle>
        </PanelHeader>
        <div class="min-h-0 flex-1 overflow-auto">
          <div
            v-if="documentEvent"
            class="flex min-w-0 flex-col"
          >
            <div
              class="flex min-w-0 flex-col gap-(--spacing-md) p-(--spacing-md) pb-(--spacing-lg)"
            >
              <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                  <Tag
                    :label="documentEvent.level"
                    :severity="eventLevelSeverity(documentEvent.level)"
                    size="small"
                  />
                  <Tag
                    :label="documentEvent.sourceLabel"
                    severity="neutral"
                    size="small"
                  />
                </div>
                <p class="text-body-md text-(--text-default)">
                  {{ documentEvent.message }}
                </p>
                <p class="text-label-code-sm tabular-nums text-(--text-muted)">
                  {{ documentEvent.time }}
                </p>
              </div>

              <slot
                name="document-fields"
                :event="documentEvent"
                :fields="documentFields"
              >
                <dl
                  class="grid min-w-0 grid-cols-[minmax(0,8rem)_minmax(0,1fr)] items-baseline gap-x-(--spacing-md) gap-y-(--spacing-sm)"
                >
                  <template
                    v-for="row in documentRows"
                    :key="row.id"
                  >
                    <dt class="min-w-0 text-label-sm text-(--text-muted)">{{ row.label }}</dt>
                    <dd class="m-0 min-w-0 break-words text-label-code-sm text-(--text-default)">
                      {{ row.value }}
                    </dd>
                  </template>
                </dl>
              </slot>
            </div>

            <div
              v-if="documentEvent.spans?.length"
              class="flex min-w-0 flex-col gap-(--spacing-xs) pb-(--spacing-lg)"
            >
              <h3 class="px-(--spacing-md) text-label-sm text-(--text-default)">Trace</h3>
              <div class="border-y border-(--border-muted)">
                <Trace
                  :key="documentEvent.id"
                  :spans="documentEvent.spans"
                  :bordered="false"
                  v-model:view="traceView"
                  highlight-critical-path
                  :aria-label="`Trace of request ${String(documentEvent.requestId ?? documentEvent.id)}`"
                />
              </div>
            </div>

            <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
              <h3 class="px-(--spacing-md) text-label-sm text-(--text-default)">Event document</h3>
              <div class="min-w-0">
                <CodeBlock
                  :tabs="documentTabs"
                  :bordered="false"
                  show-line-numbers
                  copy-aria-label="Copy the event document as JSON"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>
```

## `sample.ts`

```ts
import type { TraceSpan } from '@aziontech/webkit/trace'

import type {
  EventsExplorerEvent,
  EventsExplorerEventLevel,
  EventsExplorerField,
  EventsExplorerFieldCategory
} from './view-events-explorer.vue'

export const sampleNow = new Date(Date.UTC(2026, 10, 10, 14, 30))

export const sampleCategories: EventsExplorerFieldCategory[] = [
  { id: 'request', label: 'Request' },
  { id: 'response', label: 'Response' },
  { id: 'cache', label: 'Cache' },
  { id: 'performance', label: 'Performance' },
  { id: 'geolocation', label: 'Geolocation' },
  { id: 'client', label: 'Client' },
  { id: 'security', label: 'Security' },
  { id: 'services', label: 'Services' },
  { id: 'identifiers', label: 'Identifiers' }
]

export const sampleFields: EventsExplorerField[] = [
  { id: 'time', label: 'Time', core: true, minWidth: 80, mono: true },
  { id: 'level', label: 'Level', core: true, minWidth: 104 },
  { id: 'sourceLabel', label: 'Source', core: true, minWidth: 80 },
  { id: 'message', label: 'Event', core: true, principal: true, grow: 3 },
  { id: 'host', label: 'Host', category: 'request', grow: 2, mono: true },
  { id: 'requestMethod', label: 'Method', category: 'request', minWidth: 80, mono: true },
  { id: 'requestUri', label: 'Path', category: 'request', grow: 2, mono: true },
  { id: 'status', label: 'Status', category: 'response', align: 'end', minWidth: 80, mono: true },
  {
    id: 'requestTimeMs',
    label: 'Request time',
    category: 'performance',
    align: 'end',
    minWidth: 80,
    format: 'milliseconds'
  },
  {
    id: 'bytesSent',
    label: 'Bytes sent',
    category: 'response',
    align: 'end',
    minWidth: 80,
    format: 'number'
  },
  { id: 'cacheStatus', label: 'Cache status', category: 'cache', minWidth: 80, mono: true },
  { id: 'country', label: 'Country', category: 'geolocation', minWidth: 80 },
  { id: 'remoteAddress', label: 'Remote address', category: 'client', minWidth: 80, mono: true },
  { id: 'ruleName', label: 'Rule', category: 'security', minWidth: 80 },
  { id: 'serviceName', label: 'Service', category: 'services', minWidth: 80, mono: true },
  {
    id: 'serviceDurationMs',
    label: 'Service duration',
    category: 'services',
    align: 'end',
    minWidth: 80,
    format: 'milliseconds'
  },
  { id: 'requestId', label: 'Request ID', category: 'identifiers', minWidth: 80, mono: true },
  { id: 'resourceId', label: 'Resource ID', category: 'identifiers', minWidth: 80, mono: true },
  { id: 'userAgent', label: 'User agent', category: 'client', grow: 3, mono: true }
]

interface EventTemplate {
  source: string
  level: EventsExplorerEventLevel
  message: string
  requestMethod?: string
  requestUri?: string
  status?: number
  ruleName?: string
  serviceName?: string
  serviceDurationMs?: number
}

const minutesAgo = (minutes: number) => new Date(sampleNow.getTime() - minutes * 60 * 1000)

const hosts = [
  'example.com',
  'api.example.com',
  'staging.example.com',
  'legacy.example.com',
  'cdn.example.com'
]
const addresses = [
  '203.0.113.9',
  '198.51.100.12',
  '192.0.2.3',
  '198.51.100.55',
  '203.0.113.18',
  '192.0.2.21',
  '203.0.113.42'
]
const countries = ['United States', 'Brazil', 'Portugal', 'Germany', 'Chile']
const agents = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'curl/8.12.1',
  'Health-Check/1.0'
]
const cacheStatuses = ['HIT', 'MISS', 'BYPASS', 'EXPIRED']
const resources = ['res-3f9a21', 'res-77c40b', 'res-91de55']

const eventTemplates: EventTemplate[] = [
  {
    source: 'security',
    level: 'Error',
    message: 'Blocked SQL injection attempt on /api/session',
    requestMethod: 'POST',
    requestUri: '/api/session',
    status: 403,
    ruleName: 'SQL Injection · rule 942100'
  },
  {
    source: 'http',
    level: 'Warning',
    message: 'Origin responded 502 after 3 retries',
    requestMethod: 'GET',
    requestUri: '/checkout/cart',
    status: 502
  },
  {
    source: 'services',
    level: 'Info',
    message: 'auth-handler completed in 12ms',
    serviceName: 'auth-handler',
    serviceDurationMs: 12
  },
  {
    source: 'access',
    level: 'Warning',
    message: 'Rate limit reached for a single address',
    requestMethod: 'GET',
    requestUri: '/api/search',
    status: 429,
    ruleName: 'Rate Limit · 100 rpm'
  },
  {
    source: 'services',
    level: 'Debug',
    message: 'geo-router resolved region south-america',
    serviceName: 'geo-router',
    serviceDurationMs: 4
  },
  {
    source: 'http',
    level: 'Info',
    message: 'Delivered from cache',
    requestMethod: 'GET',
    requestUri: '/assets/app.js',
    status: 200
  },
  {
    source: 'access',
    level: 'Error',
    message: 'IP list “Known scrapers” denied the request',
    requestMethod: 'GET',
    requestUri: '/products',
    status: 403,
    ruleName: 'IP list · Known scrapers'
  },
  {
    source: 'http',
    level: 'Error',
    message: 'Origin timed out after 30s',
    requestMethod: 'GET',
    requestUri: '/reports/monthly.pdf',
    status: 504
  }
]

const requestSpans = (
  method: string,
  uri: string,
  total: number,
  cache: string,
  status: number
): TraceSpan[] => {
  const failed = status >= 500
  const share = (fraction: number) => Math.max(1, Math.round(total * fraction))
  const rules = share(0.04)
  const lookupAt = 1 + rules
  const lookup = share(0.03)
  const spans: TraceSpan[] = [
    {
      id: 'request',
      name: `${method} ${uri}`,
      service: 'Application',
      start: 0,
      duration: total,
      status: failed ? 'error' : undefined,
      attributes: { 'http.method': method, 'http.status_code': status }
    },
    {
      id: 'firewall',
      parentId: 'request',
      name: 'firewall rules',
      service: 'Firewall',
      start: 1,
      duration: rules
    },
    {
      id: 'cache',
      parentId: 'request',
      name: 'cache lookup',
      service: 'Cache',
      start: lookupAt,
      duration: lookup,
      attributes: { 'cache.status': cache }
    }
  ]
  const after = lookupAt + lookup
  if (cache === 'HIT' && !failed) {
    spans.push({
      id: 'deliver',
      parentId: 'request',
      name: 'deliver',
      service: 'Network',
      start: after,
      duration: total - after - 1
    })
    return spans
  }
  const originEnd = failed ? total - share(0.02) : total - share(0.25)
  const firstByte = failed ? originEnd : after + share(0.3)
  spans.push({
    id: 'origin',
    parentId: 'request',
    name: 'fetch origin',
    service: 'Network',
    start: after,
    duration: originEnd - after,
    status: failed ? 'error' : undefined,
    message:
      status === 504
        ? 'The origin did not answer before the timeout.'
        : failed
          ? `The origin answered ${status} on every try.`
          : undefined,
    events: failed
      ? [{ at: after + share(0.01), name: 'connection-open' }]
      : [
          { at: after + share(0.01), name: 'connection-open' },
          { at: firstByte, name: 'first-byte' }
        ]
  })
  if (status === 502) {
    const step = Math.floor((originEnd - after) / 3)
    ;[0, 1, 2].forEach((attempt) =>
      spans.push({
        id: `attempt-${attempt + 1}`,
        parentId: 'origin',
        name: `try ${attempt + 1}`,
        service: 'Network',
        start: after + attempt * step + 1,
        duration: step - 2,
        status: 'error',
        attributes: { 'http.status_code': 502 }
      })
    )
  }
  if (!failed) {
    spans.push(
      {
        id: 'store',
        parentId: 'request',
        name: 'store in cache',
        service: 'Cache',
        start: firstByte,
        duration: share(0.08)
      },
      {
        id: 'deliver',
        parentId: 'request',
        name: 'deliver',
        service: 'Network',
        start: firstByte,
        duration: total - firstByte - 1
      }
    )
  }
  return spans
}

const sequence = (seed: number) => {
  let state = seed
  return (length: number) => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state % length
  }
}

const eventCount = 1500
const seedWindowMinutes = 1436

const ageFraction = (u: number) => (4 - Math.sqrt(16 - 15 * u)) / 3

const calmTemplates = eventTemplates.filter((template) => template.level !== 'Error')
const errorTemplates = eventTemplates.filter((template) => template.level === 'Error')
const rotation = [...calmTemplates, ...calmTemplates, ...errorTemplates]

const seedEvents = (): EventsExplorerEvent[] => {
  const pick = sequence(20260814)
  return Array.from({ length: eventCount }, (_, index) => {
    const template = rotation[index % rotation.length]
    const progress = (index + pick(100) / 100) / eventCount
    const at = minutesAgo(0.2 + seedWindowMinutes * ageFraction(progress))
    const requestScoped = template.source !== 'services'
    return {
      id: `ev-${String(index + 1).padStart(3, '0')}`,
      at,
      source: template.source,
      level: template.level,
      message: template.message,
      host: requestScoped ? hosts[pick(hosts.length)] : undefined,
      requestMethod: template.requestMethod,
      requestUri: template.requestUri,
      status: template.status,
      requestTimeMs: requestScoped ? 40 + pick(960) : undefined,
      bytesSent: requestScoped ? 512 + pick(180000) : undefined,
      cacheStatus: requestScoped ? cacheStatuses[pick(cacheStatuses.length)] : undefined,
      country: countries[pick(countries.length)],
      remoteAddress: addresses[pick(addresses.length)],
      ruleName: template.ruleName,
      serviceName: template.serviceName,
      serviceDurationMs: template.serviceDurationMs,
      requestId: `${(pick(0xffffff) + 0x100000).toString(16)}-${(pick(0xffff) + 0x1000).toString(16)}`,
      resourceId: resources[pick(resources.length)],
      userAgent: requestScoped ? agents[pick(agents.length)] : undefined
    }
  }).map((event) =>
    event.source === 'http' && typeof event.requestTimeMs === 'number'
      ? {
          ...event,
          spans: requestSpans(
            String(event.requestMethod),
            String(event.requestUri),
            event.requestTimeMs,
            String(event.cacheStatus),
            Number(event.status)
          )
        }
      : event
  )
}

export const sampleEvents: EventsExplorerEvent[] = seedEvents()
```
