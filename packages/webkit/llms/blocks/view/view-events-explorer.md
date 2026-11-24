# ViewEventsExplorer (`view/view-events-explorer`)

> The events explorer (the app marks its Events navigation entry active): the controls row (`FilterMenu`, event search, the time zone, Refresh and Download CSV) over the applied `FilterMenu.ChipGroup`, and the explorer. The explorer pairs a resizable, collapsible fields `Sidebar` (each field a column checkbox and a popover of its top values, grouped in an `Accordion` by category) with the log: the Events, Errors and Avg request time summary, the stacked volume chart whose buckets filter the period on click or drag, and the event `DataTable`. Each row's detail `IconButton` (or a row click) opens the event document (its fields, the request's `Trace` with the critical path when the event carries spans, and the JSON) beside the log in the end pane of a `Resizable` when the explorer is wide enough, and in a `Drawer` when it is not. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main. Its root carries data-layout-fill, so the main stops scrolling and the fields panel, the log and the document scroll on their own.

- Surface: app
- Source: `blocks/view/view-events-explorer/view-events-explorer.vue` in `@aziontech/webkit`
- MCP: `get_block("view/view-events-explorer")`
- Components: [Accordion](../../components/accordion.md), [Alert](../../components/alert.md), [Button](../../components/button.md), [Chart](../../components/chart.md), [Checkbox](../../components/checkbox.md), [Chip](../../components/chip.md), [CodeBlock](../../components/code-block.md), [CopyButton](../../components/copy-button.md), [DataTable](../../components/data-table.md), `DataTableLoadMore`, `DataTablePagination`, [DateRangePicker](../../components/date-range-picker.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [FilterMenu](../../components/filter-menu.md), [FilterMenu](../../components/filter-menu.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), `PanelHeader`, [Popover](../../components/popover.md), [PropertyFilter](../../components/property-filter.md), [Resizable](../../components/resizable.md), [Select](../../components/select.md), [Sidebar](../../components/sidebar.md), [Skeleton](../../components/skeleton.md), [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), [Trace](../../components/trace.md), `use-collection`, `use-locale`, `use-shortcuts`
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

A resizable, collapsible start `Sidebar` named Fields with its own Search fields `Input`. Core fields sit on top; the rest are grouped by category in an `Accordion`, each category trigger carrying a small `Tag` with its applied count. Each field has a `Checkbox` that shows or hides its column in the log, and a `Popover` of its top values, opened from the field's value count drawn as a framed target of at least 24 px with a hover fill, so it reads as a control and not a stray digit; each value is an option `Item` (`clickable`, `variant="option"`, `aria-pressed` while applied) with its count, that applies the value as a filter. The panel hides when the explorer is narrower than the panel plus the log.

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
  import Alert from '@aziontech/webkit/alert'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import type { FilterMenuModel, FilterMenuValue } from '@aziontech/webkit/filter-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Resizable from '@aziontech/webkit/resizable'
  import Tooltip from '@aziontech/webkit/tooltip'
  import type { TraceSpan, TraceView } from '@aziontech/webkit/trace'
  import { computed, ref } from 'vue'

  import { useEventsExplorerColumns } from './composables/use-events-explorer-columns'
  import { useEventsExplorerDocument } from './composables/use-events-explorer-document'
  import { useEventsExplorerFormat } from './composables/use-events-explorer-format'
  import {
    defaultFieldsWidth,
    useEventsExplorerLayout
  } from './composables/use-events-explorer-layout'
  import { useEventsExplorerLog } from './composables/use-events-explorer-log'
  import { useEventsExplorerSelection } from './composables/use-events-explorer-selection'
  import { useEventsExplorerVolume } from './composables/use-events-explorer-volume'
  import EventDocument from './parts/event-document.vue'
  import EventsTable from './parts/events-table.vue'
  import EventsToolbar from './parts/events-toolbar.vue'
  import FieldsPanel from './parts/fields-panel.vue'
  import FilterChips from './parts/filter-chips.vue'
  import LogSummary from './parts/log-summary.vue'

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

  const format = useEventsExplorerFormat(() => props.timeZone)
  const log = useEventsExplorerLog(props, { filters, exclusions, search, page }, format)
  const { matchedEvents, eventFields, eventFieldCategories, menuFields, exclusionChips } = log
  const volume = useEventsExplorerVolume(props, filters, matchedEvents, log.nowDate, format)

  const fieldsOpen = ref(true)
  const fieldsWidth = ref(defaultFieldsWidth)
  const documentWidth = ref(400)
  const explorerEl = ref<HTMLElement | null>(null)
  const { showFieldsPanel, isWide } = useEventsExplorerLayout({
    fieldsOpen,
    fieldsWidth,
    documentWidth,
    explorerEl
  })
  const compactLog = computed(() => !isWide.value)

  const { shownColumns, toggleColumn, columns, genericColumns } = useEventsExplorerColumns(
    log,
    compactLog
  )

  const selection = useEventsExplorerSelection(selectedKey, matchedEvents, isWide, (event, row) =>
    emit('select', event, log.sourceEvents.value.find((record) => record.id === row.id) ?? row)
  )
  const { documentEvent, documentDrawerOpen, documentPaneExpanded, closeDocument } = selection
  const { documentFields, documentRows, documentTabs } = useEventsExplorerDocument(
    log,
    selection.selectedEvent,
    documentEvent,
    format
  )
  const traceView = ref<TraceView>('waterfall')

  const tableEl = ref<InstanceType<typeof EventsTable> | null>(null)
  const exportCsv = () => tableEl.value?.exportCsv()

  const noTraffic = computed(() => !log.serverMode.value && !log.sourceEvents.value.length)
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
        <EventsToolbar
          v-model:filters="filters"
          v-model:search="search"
          :menu-fields="menuFields"
          :time-zone="timeZone"
          :loading="loading"
          :export-disabled="!tableEl"
          @refresh="(event: MouseEvent) => emit('refresh', event)"
          @export="exportCsv"
        />

        <FilterChips
          v-model:filters="filters"
          :menu-fields="menuFields"
          :exclusion-chips="exclusionChips"
          @remove-exclusion="log.removeExclusion"
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
              <FieldsPanel
                v-model:filters="filters"
                v-model:open="fieldsOpen"
                v-model:width="fieldsWidth"
                :fields="eventFields"
                :categories="eventFieldCategories"
                :events="matchedEvents"
                :shown-columns="shownColumns"
                :count-state="loading ? 'loading' : error ? 'unknown' : 'ready'"
                @toggle-column="toggleColumn"
              />
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
              <LogSummary
                :loading="loading"
                :summary="volume.summary.value"
                :error-share-label="volume.errorShareLabel.value"
                :series="volume.volumeSeries.value"
                :labels="volume.volumeLabels.value"
                :format-label="format.formatEventClock"
                :chart-label="volume.chartLabel.value"
                @select-range="volume.selectVolume"
              />

              <EventsTable
                ref="tableEl"
                v-model:page="page"
                v-model:page-size="pageSize"
                :events="matchedEvents"
                :columns="columns"
                :generic-columns="genericColumns"
                :status-field="log.eventField('status')"
                :selected-key="selectedKey"
                :compact="compactLog"
                :total="total"
                :more-rows="moreRows"
                :loading-more="loadingMore"
                :loading="loading"
                :no-traffic="noTraffic"
                :searching="Boolean(search.trim())"
                :format-clock="format.formatEventClockSeconds"
                @open="selection.openDocument"
                @load-more="(event: Event) => emit('load-more', event)"
              />
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
                <EventDocument
                  v-model:trace-view="traceView"
                  :event="documentEvent"
                  :fields="documentFields"
                  :rows="documentRows"
                  :tabs="documentTabs"
                >
                  <template
                    v-if="$slots['document-fields']"
                    #document-fields="fieldsSlot"
                  >
                    <slot
                      name="document-fields"
                      v-bind="fieldsSlot"
                    />
                  </template>
                </EventDocument>
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
        <div
          class="min-h-0 flex-1 overflow-auto outline-none"
          tabindex="-1"
          data-autofocus
        >
          <EventDocument
            v-if="documentEvent"
            v-model:trace-view="traceView"
            :event="documentEvent"
            :fields="documentFields"
            :rows="documentRows"
            :tabs="documentTabs"
          >
            <template
              v-if="$slots['document-fields']"
              #document-fields="fieldsSlot"
            >
              <slot
                name="document-fields"
                v-bind="fieldsSlot"
              />
            </template>
          </EventDocument>
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

const shareOf = (total: number) => (fraction: number) => Math.max(1, Math.round(total * fraction))

const leadSpans = (
  method: string,
  uri: string,
  total: number,
  cache: string,
  status: number
): TraceSpan[] => {
  const share = shareOf(total)
  const rules = share(0.04)
  return [
    {
      id: 'request',
      name: `${method} ${uri}`,
      service: 'Application',
      start: 0,
      duration: total,
      status: status >= 500 ? 'error' : undefined,
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
      start: 1 + rules,
      duration: share(0.03),
      attributes: { 'cache.status': cache }
    }
  ]
}

const originMessage = (status: number) =>
  status === 504
    ? 'The origin did not answer before the timeout.'
    : status >= 500
      ? `The origin answered ${status} on every try.`
      : undefined

const originSpan = (
  after: number,
  originEnd: number,
  firstByte: number,
  total: number,
  status: number
): TraceSpan => {
  const failed = status >= 500
  const share = shareOf(total)
  return {
    id: 'origin',
    parentId: 'request',
    name: 'fetch origin',
    service: 'Network',
    start: after,
    duration: originEnd - after,
    status: failed ? 'error' : undefined,
    message: originMessage(status),
    events: failed
      ? [{ at: after + share(0.01), name: 'connection-open' }]
      : [
          { at: after + share(0.01), name: 'connection-open' },
          { at: firstByte, name: 'first-byte' }
        ]
  }
}

const retrySpans = (after: number, originEnd: number): TraceSpan[] => {
  const step = Math.floor((originEnd - after) / 3)
  return [0, 1, 2].map((attempt) => ({
    id: `attempt-${attempt + 1}`,
    parentId: 'origin',
    name: `try ${attempt + 1}`,
    service: 'Network',
    start: after + attempt * step + 1,
    duration: step - 2,
    status: 'error',
    attributes: { 'http.status_code': 502 }
  }))
}

const storeSpans = (firstByte: number, total: number): TraceSpan[] => [
  {
    id: 'store',
    parentId: 'request',
    name: 'store in cache',
    service: 'Cache',
    start: firstByte,
    duration: shareOf(total)(0.08)
  },
  {
    id: 'deliver',
    parentId: 'request',
    name: 'deliver',
    service: 'Network',
    start: firstByte,
    duration: total - firstByte - 1
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
  const share = shareOf(total)
  const spans = leadSpans(method, uri, total, cache, status)
  const after = 1 + share(0.04) + share(0.03)
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
  spans.push(originSpan(after, originEnd, firstByte, total, status))
  if (status === 502) spans.push(...retrySpans(after, originEnd))
  if (!failed) spans.push(...storeSpans(firstByte, total))
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

## `composables/use-event-query-range.ts`

```ts
import type {
  DateRangeUnit,
  DateRangeValue,
  RelativeOption
} from '@aziontech/webkit/date-range-picker'
import { computed, type ComputedRef, ref, type WritableComputedRef } from 'vue'

import { fullWindowMinutes } from '../lib/event-log'
import { type QueryFilterValue, referenceNow } from '../lib/event-query'

/** The time range of the Query variant and its bridge to the Period filter. */
export interface UseEventQueryRangeReturn {
  /** The value of the range picker. */
  range: WritableComputedRef<DateRangeValue | null>
  /** The relative ranges the picker offers. */
  relativeOptions: RelativeOption[]
  /** The moment the ranges end at. */
  rangeNow: Date
  /** The oldest moment the picker reaches. */
  rangeMin: Date
  /** The range as the Period filter value. */
  periodValue: ComputedRef<QueryFilterValue>
  /** Sets the range from a Period filter value. */
  setPeriod: (value: QueryFilterValue | undefined) => void
  /** The date lies inside the range. */
  inWindow: (date: unknown) => boolean
}

const relativeOptions: RelativeOption[] = [
  { key: 'last-15-minutes', amount: 15, unit: 'minute' },
  { key: 'last-1-hour', amount: 1, unit: 'hour' },
  { key: 'last-6-hours', amount: 6, unit: 'hour' },
  { key: 'last-24-hours', amount: 24, unit: 'hour' }
]

const unitMs: Record<DateRangeUnit, number> = {
  second: 1000,
  minute: 60000,
  hour: 3600000,
  day: 86400000,
  week: 604800000,
  month: 2592000000,
  year: 31536000000
}

const presetMinutes: Record<string, number> = { '15m': 15, '1h': 60, '6h': 360, '24h': 1440 }

const rangeNow = new Date(referenceNow)
const rangeMin = new Date(referenceNow - 7 * 24 * 3600000)

const windowOf = (value: DateRangeValue | null) => {
  if (!value) {
    return { start: new Date(referenceNow - fullWindowMinutes * 60000), end: rangeNow }
  }
  if (value.type === 'relative') {
    return { start: new Date(referenceNow - value.amount * unitMs[value.unit]), end: rangeNow }
  }
  if (value.type === 'since') return { start: new Date(value.start), end: rangeNow }
  return { start: new Date(value.start), end: new Date(value.end) }
}

const rangeOfPreset = (value: QueryFilterValue | undefined): DateRangeValue | null => {
  const minutes = presetMinutes[String(value ?? '24h')] ?? fullWindowMinutes
  const option = relativeOptions.find(
    (candidate) => candidate.amount * unitMs[candidate.unit] === minutes * 60000
  )
  return option
    ? { type: 'relative', key: option.key, amount: option.amount, unit: option.unit }
    : null
}

export function useEventQueryRange(): UseEventQueryRangeReturn {
  const range = ref<DateRangeValue | null>({
    type: 'relative',
    amount: 24,
    unit: 'hour',
    key: 'last-24-hours'
  })

  const activeWindow = computed(() => windowOf(range.value))

  const periodValue = computed<QueryFilterValue>(() => {
    const value = range.value
    if (!value) return '24h'
    if (value.type === 'relative') {
      const minutes = (value.amount * unitMs[value.unit]) / 60000
      const preset = Object.entries(presetMinutes).find(([, length]) => length === minutes)
      if (preset) return preset[0]
    }
    return { start: activeWindow.value.start, end: activeWindow.value.end }
  })

  const setPeriod = (value: QueryFilterValue | undefined) => {
    if (value && typeof value === 'object') {
      if (!value.start) return
      range.value = {
        type: 'absolute',
        start: value.start.toISOString(),
        end: (value.end ?? rangeNow).toISOString()
      }
      return
    }
    range.value = rangeOfPreset(value)
  }

  const inWindow = (date: unknown) => {
    if (!(date instanceof Date)) return false
    const time = date.getTime()
    return time >= activeWindow.value.start.getTime() && time <= activeWindow.value.end.getTime()
  }

  return {
    range: computed({
      get: () => range.value,
      set: (value) => {
        range.value = value
      }
    }),
    relativeOptions,
    rangeNow,
    rangeMin,
    periodValue,
    setPeriod,
    inWindow
  }
}
```

## `composables/use-event-query.ts`

```ts
import type { PropertyFilterQuery, PropertyFilterSubmit } from '@aziontech/webkit/property-filter'
import { matchesQuery } from '@aziontech/webkit/use-collection'
import { computed, type ComputedRef, type Ref, ref, type WritableComputedRef } from 'vue'

import { eventSources } from '../lib/event-log'
import {
  filtersFromQuery,
  type QueryEntry,
  queryProperties,
  queryToText,
  searchableFields,
  tokensForFilters
} from '../lib/event-query'
import { sampleEvents } from '../sample'
import type { EventsExplorerEvent, EventsExplorerFilters } from '../view-events-explorer.vue'
import type { UseEventQueryRangeReturn } from './use-event-query-range'

/** The typed query of the Query variant, its history and its bridge to the filters. */
export interface UseEventQueryReturn {
  /** The text in the query bar. */
  queryText: WritableComputedRef<string>
  /** The query text last applied. */
  appliedText: ComputedRef<string>
  /** The query last applied. */
  appliedQuery: ComputedRef<PropertyFilterQuery>
  /** Why the typed query was not applied. */
  queryNotice: ComputedRef<string>
  /** The page of the log. */
  page: WritableComputedRef<number>
  /** The last queries run, newest first. */
  recentQueries: WritableComputedRef<QueryEntry[]>
  /** The filters the log shows, read from and written to the query. */
  filters: WritableComputedRef<EventsExplorerFilters>
  /** Events in the range that match the query. */
  matchedCount: ComputedRef<number>
  /** An event matches the applied query. */
  matchesAppliedQuery: (event: EventsExplorerEvent) => boolean
  /** Applies the query the bar submitted. */
  submitQuery: (event: KeyboardEvent, payload: PropertyFilterSubmit) => void
  /** Fills the bar with a query and runs it. */
  runQuery: (entry: QueryEntry) => void
}

const recentLimit = 8

const initialQuery: PropertyFilterQuery = {
  tokens: [
    { propertyKey: 'level', operator: '=', value: 'Error' },
    { propertyKey: 'host', operator: '=', value: 'api.example.com' }
  ],
  operation: 'and'
}

const initialRecent = (): QueryEntry[] => [
  {
    text: 'status >= 500',
    query: { tokens: [{ propertyKey: 'status', operator: '>=', value: '500' }], operation: 'and' }
  },
  {
    text: 'source = security AND level = Warning',
    query: {
      tokens: [
        { propertyKey: 'source', operator: '=', value: 'security' },
        { propertyKey: 'level', operator: '=', value: 'Warning' }
      ],
      operation: 'and'
    }
  }
]

const writable = <T>(source: { value: T }) =>
  computed({
    get: () => source.value,
    set: (value: T) => {
      source.value = value
    }
  })

interface QueryState {
  queryNotice: Ref<string>
  appliedQuery: Ref<PropertyFilterQuery>
  appliedText: Ref<string>
  page: Ref<number>
  recentQueries: Ref<QueryEntry[]>
}

const queryApplier =
  (state: QueryState) =>
  ({ text, query }: PropertyFilterSubmit) => {
    if (!query) {
      state.queryNotice.value =
        'This query mixes AND and OR. Use one of them throughout, then press Enter again.'
      return
    }
    state.queryNotice.value = ''
    state.appliedQuery.value = query
    state.appliedText.value = text.trim()
    state.page.value = 1
    const applied = state.appliedText.value
    if (!applied) return
    state.recentQueries.value = [
      { text: applied, query },
      ...state.recentQueries.value.filter((entry) => entry.text !== applied)
    ].slice(0, recentLimit)
  }

export function useEventQuery(timeRange: UseEventQueryRangeReturn): UseEventQueryReturn {
  const queryText = ref(queryToText(initialQuery))
  const appliedQuery = ref<PropertyFilterQuery>(initialQuery)
  const appliedText = ref(queryText.value)
  const queryNotice = ref('')
  const page = ref(1)
  const recentQueries = ref<QueryEntry[]>(initialRecent())

  const applyQuery = queryApplier({ queryNotice, appliedQuery, appliedText, page, recentQueries })

  const submitQuery = (_event: KeyboardEvent, payload: PropertyFilterSubmit) => applyQuery(payload)

  const matchesAppliedQuery = (event: EventsExplorerEvent) =>
    matchesQuery(
      { ...event, sourceLabel: eventSources[event.source] ?? event.source },
      appliedQuery.value,
      queryProperties,
      searchableFields
    )

  const runQuery = (entry: QueryEntry) => {
    queryText.value = entry.text
    applyQuery(entry)
  }

  const matchedCount = computed(
    () =>
      sampleEvents.filter((event) => timeRange.inWindow(event.at) && matchesAppliedQuery(event))
        .length
  )

  const filters = computed<EventsExplorerFilters>({
    get: () => filtersFromQuery(appliedQuery.value, timeRange.periodValue.value),
    set: (next) => {
      const current = filters.value
      if (next.period?.[0] !== current.period?.[0]) timeRange.setPeriod(next.period?.[0])
      const tokens = tokensForFilters(appliedQuery.value.tokens, current, next)
      if (!tokens) return
      const query = { tokens, operation: appliedQuery.value.operation }
      queryText.value = queryToText(query)
      applyQuery({ text: queryText.value, query })
    }
  })

  return {
    queryText: writable(queryText),
    appliedText: computed(() => appliedText.value),
    appliedQuery: computed(() => appliedQuery.value),
    queryNotice: computed(() => queryNotice.value),
    page: writable(page),
    recentQueries: writable(recentQueries),
    filters,
    matchedCount,
    matchesAppliedQuery,
    submitQuery,
    runQuery
  }
}
```

## `composables/use-events-explorer-columns.ts`

```ts
import type { TableColumn } from '@aziontech/webkit/data-table'
import { computed, type ComputedRef, ref, watch } from 'vue'

import type { EventsExplorerField } from '../view-events-explorer.vue'

/** The columns of the log and the fields shown as columns. */
export interface UseEventsExplorerColumnsReturn {
  /** Ids of the optional fields shown as columns. */
  shownColumns: ComputedRef<string[]>
  /** Shows or hides the column of a field. */
  toggleColumn: (id: string) => void
  /** The columns of the table. */
  columns: ComputedRef<TableColumn[]>
  /** The shown fields without a cell of their own. */
  genericColumns: ComputedRef<EventsExplorerField[]>
}

/** The fields the columns read. */
export interface EventsExplorerColumnSource {
  /** Every field, in order. */
  eventFields: ComputedRef<EventsExplorerField[]>
  /** Fields that always show. */
  coreFields: ComputedRef<EventsExplorerField[]>
  /** Fields the panel can show or hide. */
  optionalFields: ComputedRef<EventsExplorerField[]>
  /** Finds a field by id. */
  eventField: (id: string) => EventsExplorerField | undefined
}

const customCellFields = ['status']

const toColumn = (field: EventsExplorerField): TableColumn => ({
  accessorKey: field.id,
  header: field.label,
  sortable: true,
  ...(field.principal ? { principal: true } : {}),
  ...(field.grow ? { grow: field.grow } : {}),
  ...(field.minWidth ? { minWidth: field.minWidth } : {}),
  ...(field.align ? { align: field.align } : {})
})

export function useEventsExplorerColumns(
  source: EventsExplorerColumnSource,
  compactLog: ComputedRef<boolean>
): UseEventsExplorerColumnsReturn {
  const { eventFields, coreFields, optionalFields, eventField } = source

  const defaultColumns = () => {
    const known = ['host', 'status', 'remoteAddress'].filter((id) => eventField(id))
    return known.length ? known : optionalFields.value.slice(0, 3).map((field) => field.id)
  }

  const shown = ref(defaultColumns())

  watch(
    () => eventFields.value.map((field) => field.id).join(' '),
    () => {
      shown.value = defaultColumns()
    }
  )

  const toggleColumn = (id: string) => {
    shown.value = shown.value.includes(id)
      ? shown.value.filter((column) => column !== id)
      : [...shown.value, id]
  }

  const columns = computed<TableColumn[]>(() => [
    { id: 'detail', header: '', width: 44, align: 'center', hideable: false },
    ...(compactLog.value
      ? coreFields.value.filter((field) => field.id === 'message').map(toColumn)
      : coreFields.value.map(toColumn)),
    ...optionalFields.value.filter((field) => shown.value.includes(field.id)).map(toColumn)
  ])

  const genericColumns = computed(() =>
    optionalFields.value.filter(
      (field) => shown.value.includes(field.id) && !customCellFields.includes(field.id)
    )
  )

  return { shownColumns: computed(() => shown.value), toggleColumn, columns, genericColumns }
}
```

## `composables/use-events-explorer-document.ts`

```ts
import type { CodeBlockTab } from '@aziontech/webkit/code-block'
import type { FilterMenuValue } from '@aziontech/webkit/filter-menu'
import { computed, type ComputedRef } from 'vue'

import { canFilterField, type EventRow, hasEventValue } from '../lib/event-log'
import type { EventsExplorerDocumentField, EventsExplorerField } from '../view-events-explorer.vue'
import type { UseEventsExplorerFormatReturn } from './use-events-explorer-format'

/** One row of the default document summary. */
export interface EventsExplorerDocumentRow {
  /** Id of the field. */
  id: string
  /** Label of the field. */
  label: string
  /** The value as written. */
  value: string
}

/** What the open event document lists. */
export interface UseEventsExplorerDocumentReturn {
  /** Every field of the document event. */
  documentFields: ComputedRef<EventsExplorerDocumentField[]>
  /** The summary rows of the open event. */
  documentRows: ComputedRef<EventsExplorerDocumentRow[]>
  /** The JSON tab of the open event. */
  documentTabs: ComputedRef<CodeBlockTab[]>
}

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

/** The fields the document reads. */
export interface EventsExplorerDocumentSource {
  /** Every field, in order. */
  eventFields: ComputedRef<EventsExplorerField[]>
  /** Fields the panel can show or hide. */
  optionalFields: ComputedRef<EventsExplorerField[]>
  /** Finds a field by id. */
  eventField: (id: string) => EventsExplorerField | undefined
}

export function useEventsExplorerDocument(
  source: EventsExplorerDocumentSource,
  selectedEvent: ComputedRef<EventRow | null>,
  documentEvent: ComputedRef<EventRow | null>,
  format: UseEventsExplorerFormatReturn
): UseEventsExplorerDocumentReturn {
  const { eventFields, optionalFields, eventField } = source

  const summaryOrder = computed(() => {
    const known = summaryPriority.filter((id) => eventField(id))
    return known.length ? known : optionalFields.value.map((field) => field.id)
  })

  const documentFields = computed<EventsExplorerDocumentField[]>(() => {
    const event = documentEvent.value
    if (!event) return []
    return eventFields.value
      .filter((field) => hasEventValue(event, field.id))
      .map((field) => ({
        id: field.id,
        label: field.label,
        value: format.formatEventValue(field, event[field.id]),
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
        return { id, label: field?.label ?? id, value: format.formatEventValue(field, event[id]) }
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

  return { documentFields, documentRows, documentTabs }
}
```

## `composables/use-events-explorer-format.ts`

```ts
import type { FilterMenuValue } from '@aziontech/webkit/filter-menu'
import { useLocale } from '@aziontech/webkit/use-locale'
import { type MaybeRefOrGetter, toValue } from 'vue'

import { formatFieldValue, isDate } from '../lib/event-log'
import type { EventsExplorerField } from '../view-events-explorer.vue'

/** The formatters of the explorer, written in its time zone and locale. */
export interface UseEventsExplorerFormatReturn {
  /** Day and clock of an event, for the Time column. */
  formatEventTime: (date: Date) => string
  /** Hours and minutes, for the chart axis. */
  formatEventClock: (date: unknown) => string
  /** Hours, minutes and seconds, for the folded Event cell. */
  formatEventClockSeconds: (date: unknown) => string
  /** A custom period, as its chip and the chart name it. */
  formatPeriod: (value: FilterMenuValue) => string
  /** A field value, as the table, the panel and the document write it. */
  formatEventValue: (field: EventsExplorerField | undefined, value: unknown) => string
  /** A locale number. */
  formatNumber: (value: number) => string
}

export function useEventsExplorerFormat(
  timeZone: MaybeRefOrGetter<string>
): UseEventsExplorerFormatReturn {
  const { formatDate, formatNumber } = useLocale()

  const dayFormat = (value: Date | number | string) =>
    formatDate(value, { month: 'short', day: '2-digit', timeZone: toValue(timeZone) })
  const clockFormat = (value: Date | number | string) =>
    formatDate(value, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: toValue(timeZone)
    })
  const axisFormat = (value: Date | number | string) =>
    formatDate(value, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: toValue(timeZone)
    })

  const formatEventTime = (date: Date) =>
    isDate(date) ? `${dayFormat(date)}, ${clockFormat(date)}` : ''
  const formatEventClock = (date: unknown) => (isDate(date) ? axisFormat(date) : '')
  const formatEventClockSeconds = (date: unknown) => (isDate(date) ? clockFormat(date) : '')

  const formatPeriod = (value: FilterMenuValue) => {
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

  const formatEventValue = (field: EventsExplorerField | undefined, value: unknown) =>
    formatFieldValue(field, value, formatNumber)

  return {
    formatEventTime,
    formatEventClock,
    formatEventClockSeconds,
    formatPeriod,
    formatEventValue,
    formatNumber
  }
}
```

## `composables/use-events-explorer-layout.ts`

```ts
import { computed, type ComputedRef, onMounted, onScopeDispose, type Ref, ref, watch } from 'vue'

const logMinWidth = 480
const documentMinWidth = 348
const fieldsPanelWidth = 268

/** The panes of the explorer and the widths that fold them. */
export interface UseEventsExplorerLayoutReturn {
  /** The fields panel fits beside the log. */
  showFieldsPanel: ComputedRef<boolean>
  /** The document fits beside the fields panel and the log. */
  isWide: ComputedRef<boolean>
}

/** The panel widths the layout reads and clamps. */
export interface EventsExplorerPanes {
  /** The fields panel is open. */
  fieldsOpen: Ref<boolean>
  /** Width of the fields panel. */
  fieldsWidth: Ref<number>
  /** Width of the document pane. */
  documentWidth: Ref<number>
  /** The element whose width decides the layout. */
  explorerEl: Ref<HTMLElement | null>
}

export const defaultFieldsWidth = fieldsPanelWidth

export function useEventsExplorerLayout(panes: EventsExplorerPanes): UseEventsExplorerLayoutReturn {
  const { fieldsOpen, fieldsWidth, documentWidth, explorerEl } = panes
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

  onMounted(() => {
    if (!explorerEl.value) return
    explorerWidth.value = explorerEl.value.offsetWidth
    explorerObserver = new ResizeObserver(([entry]) => {
      explorerWidth.value = entry.contentRect.width
    })
    explorerObserver.observe(explorerEl.value)
  })

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

  onScopeDispose(() => {
    explorerObserver?.disconnect()
  })

  return { showFieldsPanel, isWide }
}
```

## `composables/use-events-explorer-log.ts`

```ts
import type { FilterMenuField, FilterMenuValue } from '@aziontech/webkit/filter-menu'
import { computed, type ComputedRef, type Ref, watch } from 'vue'

import {
  eventLevelOptions,
  eventPeriods,
  type EventRow,
  eventSourceOptions,
  eventSources,
  fieldValueCounts,
  type FilterField,
  matchPeriod,
  searchEvents
} from '../lib/event-log'
import { sampleCategories, sampleEvents, sampleFields, sampleNow } from '../sample'
import type {
  EventsExplorerEvent,
  EventsExplorerField,
  EventsExplorerFieldCategory,
  EventsExplorerFilters,
  EventsExplorerProps
} from '../view-events-explorer.vue'
import type { UseEventsExplorerFormatReturn } from './use-events-explorer-format'

/** The models the log reads and writes. */
export interface EventsExplorerLogModels {
  /** Applied values per filter field. */
  filters: Ref<EventsExplorerFilters>
  /** Values that hide an event. */
  exclusions: Ref<EventsExplorerFilters>
  /** The search text. */
  search: Ref<string>
  /** The page of the table. */
  page: Ref<number>
}

/** One exclusion as its chip writes it. */
export interface EventsExplorerExclusionChip {
  /** Stable key of the chip. */
  key: string
  /** Id of the field. */
  id: string
  /** The excluded value. */
  value: FilterMenuValue
  /** Label of the field. */
  label: string
  /** The value as written. */
  text: string
}

/** The events, the fields and the filters of the log. */
export interface UseEventsExplorerLogReturn {
  /** The moment relative periods end at. */
  nowDate: ComputedRef<Date>
  /** Every field, in order. */
  eventFields: ComputedRef<EventsExplorerField[]>
  /** The categories of the fields panel. */
  eventFieldCategories: ComputedRef<EventsExplorerFieldCategory[]>
  /** Fields that always show. */
  coreFields: ComputedRef<EventsExplorerField[]>
  /** Fields the panel can show or hide. */
  optionalFields: ComputedRef<EventsExplorerField[]>
  /** Finds a field by id. */
  eventField: (id: string) => EventsExplorerField | undefined
  /** The events given, or the sample. */
  sourceEvents: ComputedRef<EventsExplorerEvent[]>
  /** The events that match the filters, the exclusions, the match test and the search. */
  matchedEvents: ComputedRef<EventRow[]>
  /** The fields of the filter menu. */
  menuFields: ComputedRef<FilterMenuField[]>
  /** One chip per exclusion. */
  exclusionChips: ComputedRef<EventsExplorerExclusionChip[]>
  /** Removes one exclusion. */
  removeExclusion: (id: string, value: FilterMenuValue) => void
  /** The server pages the events. */
  serverMode: ComputedRef<boolean>
}

const fieldsOf = (props: EventsExplorerProps) => {
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
  return { eventFields, eventFieldCategories, coreFields, optionalFields, eventField }
}

const baseFilterFieldsOf = (
  nowDate: ComputedRef<Date>,
  format: UseEventsExplorerFormatReturn
): FilterField[] => [
  {
    label: 'Period',
    id: 'period',
    kind: 'range',
    options: eventPeriods,
    formatValue: format.formatPeriod,
    match: (event, values) => matchPeriod(event.at, values, nowDate.value)
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

const filterFieldsOf = (
  filters: Ref<EventsExplorerFilters>,
  eventRows: ComputedRef<EventRow[]>,
  eventField: (id: string) => EventsExplorerField | undefined,
  nowDate: ComputedRef<Date>,
  format: UseEventsExplorerFormatReturn
) => {
  const baseFilterFields = baseFilterFieldsOf(nowDate, format)
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
          label: format.formatEventValue(field, value)
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

  return { filterFields, menuFields }
}

const exclusionsOf = (
  exclusions: Ref<EventsExplorerFilters>,
  eventField: (id: string) => EventsExplorerField | undefined,
  format: UseEventsExplorerFormatReturn
) => {
  const exclusionChips = computed(() =>
    Object.entries(exclusions.value).flatMap(([id, values]) => {
      const field = eventField(id)
      return values.map((value) => ({
        key: `${id}:${String(value)}`,
        id,
        value,
        label: field?.label ?? id,
        text: format.formatEventValue(field, value)
      }))
    })
  )

  const removeExclusion = (id: string, value: FilterMenuValue) => {
    exclusions.value = {
      ...exclusions.value,
      [id]: (exclusions.value[id] ?? []).filter((item) => item !== value)
    }
  }

  return { exclusionChips, removeExclusion }
}

const rowsOf = (props: EventsExplorerProps, format: UseEventsExplorerFormatReturn) => {
  const serverMode = computed(() => props.total !== undefined)
  const sourceEvents = computed<EventsExplorerEvent[]>(
    () => props.events ?? (props.loading || props.error ? [] : sampleEvents)
  )
  const eventRows = computed<EventRow[]>(() =>
    sourceEvents.value.map((event) => ({
      ...event,
      time: format.formatEventTime(event.at),
      sourceLabel: eventSources[event.source] ?? event.source
    }))
  )
  return { serverMode, sourceEvents, eventRows }
}

export function useEventsExplorerLog(
  props: EventsExplorerProps,
  models: EventsExplorerLogModels,
  format: UseEventsExplorerFormatReturn
): UseEventsExplorerLogReturn {
  const { filters, exclusions, search, page } = models
  const nowDate = computed(() => props.now ?? sampleNow)
  const fields = fieldsOf(props)
  const { eventFields, eventField } = fields

  const { serverMode, sourceEvents, eventRows } = rowsOf(props, format)

  const { filterFields, menuFields } = filterFieldsOf(
    filters,
    eventRows,
    eventField,
    nowDate,
    format
  )

  const passesFilters = (event: EventRow) =>
    filterFields.value.every((field) => {
      const values = filters.value[field.id]
      if (!values?.length) return true
      return field.match(event, values)
    })

  const filteredEvents = computed(() =>
    eventRows.value.filter(
      (event) =>
        passesFilters(event) &&
        Object.entries(exclusions.value).every(
          ([id, values]) => !values.includes(event[id] as FilterMenuValue)
        ) &&
        (!props.match || props.match(event))
    )
  )

  const { exclusionChips, removeExclusion } = exclusionsOf(exclusions, eventField, format)

  watch([filters, exclusions], () => {
    page.value = 1
  })

  const matchedEvents = computed(() =>
    serverMode.value
      ? eventRows.value
      : searchEvents(filteredEvents.value, search.value, eventFields.value)
  )

  watch(search, () => {
    page.value = 1
  })

  return {
    nowDate,
    ...fields,
    sourceEvents,
    matchedEvents,
    menuFields,
    exclusionChips,
    removeExclusion,
    serverMode
  }
}
```

## `composables/use-events-explorer-selection.ts`

```ts
import { computed, type ComputedRef, type Ref, ref, watch, type WritableComputedRef } from 'vue'

import type { EventRow } from '../lib/event-log'

/** The open event and where its document shows. */
export interface UseEventsExplorerSelectionReturn {
  /** The selected event among the matching ones. */
  selectedEvent: ComputedRef<EventRow | null>
  /** The event the document shows; it stays while the document closes. */
  documentEvent: ComputedRef<EventRow | null>
  /** The narrow drawer is open. */
  documentDrawerOpen: WritableComputedRef<boolean>
  /** The wide document pane is open. */
  documentPaneExpanded: WritableComputedRef<boolean>
  /** Closes the document. */
  closeDocument: () => void
  /** Opens the document of a row. */
  openDocument: (event: MouseEvent | KeyboardEvent, row: EventRow) => void
}

export function useEventsExplorerSelection(
  selectedKey: Ref<string>,
  matchedEvents: ComputedRef<EventRow[]>,
  isWide: ComputedRef<boolean>,
  onSelect: (event: MouseEvent | KeyboardEvent, row: EventRow) => void
): UseEventsExplorerSelectionReturn {
  const selectedEvent = computed(
    () => matchedEvents.value.find((event) => event.id === selectedKey.value) ?? null
  )
  const shownEvent = ref<EventRow | null>(null)
  watch(
    selectedEvent,
    (event) => {
      if (event) shownEvent.value = event
    },
    { immediate: true }
  )

  const drawerOpen = ref(false)

  watch(isWide, (wide) => {
    drawerOpen.value = !wide && Boolean(selectedKey.value)
  })

  const closeDocument = () => {
    selectedKey.value = ''
    drawerOpen.value = false
  }

  const openDocument = (event: MouseEvent | KeyboardEvent, row: EventRow) => {
    selectedKey.value = row.id
    drawerOpen.value = !isWide.value
    onSelect(event, row)
  }

  const documentPaneExpanded = computed({
    get: () => isWide.value && Boolean(selectedEvent.value),
    set: (expanded) => {
      if (!expanded) closeDocument()
    }
  })

  watch(drawerOpen, (open) => {
    if (!open && !isWide.value) selectedKey.value = ''
  })

  const documentDrawerOpen = computed({
    get: () => drawerOpen.value,
    set: (open) => {
      drawerOpen.value = open
    }
  })

  return {
    selectedEvent,
    documentEvent: computed(() => shownEvent.value),
    documentDrawerOpen,
    documentPaneExpanded,
    closeDocument,
    openDocument
  }
}
```

## `composables/use-events-explorer-volume.ts`

```ts
import type { ChartRange, ChartSeries } from '@aziontech/webkit/chart'
import { computed, type ComputedRef, type Ref } from 'vue'

import {
  eventBuckets,
  eventPeriods,
  type EventRow,
  eventSummary,
  levelColors,
  levelOrder,
  periodRange
} from '../lib/event-log'
import type {
  EventsExplorerFilters,
  EventsExplorerProps,
  EventsExplorerSummary
} from '../view-events-explorer.vue'
import type { UseEventsExplorerFormatReturn } from './use-events-explorer-format'

/** The numbers and the volume chart above the log. */
export interface UseEventsExplorerVolumeReturn {
  /** The numbers above the chart. */
  summary: ComputedRef<EventsExplorerSummary>
  /** The share of errors, as the Errors number reads it out. */
  errorShareLabel: ComputedRef<string>
  /** Start of each bar. */
  volumeLabels: ComputedRef<Date[]>
  /** One stacked series per level. */
  volumeSeries: ComputedRef<ChartSeries[]>
  /** Name of the chart, with its summary and how to use it. */
  chartLabel: ComputedRef<string>
  /** Filters the period to a span of bars. */
  selectVolume: (span: ChartRange | null) => void
}

export function useEventsExplorerVolume(
  props: EventsExplorerProps,
  filters: Ref<EventsExplorerFilters>,
  matchedEvents: ComputedRef<EventRow[]>,
  nowDate: ComputedRef<Date>,
  format: UseEventsExplorerFormatReturn
): UseEventsExplorerVolumeReturn {
  const appliedPeriod = computed(() => filters.value.period?.[0] ?? '')
  const activeWindow = computed(() => periodRange(appliedPeriod.value, nowDate.value))

  const windowLabel = computed(() => {
    const period = appliedPeriod.value
    if (period && typeof period === 'object') return format.formatPeriod(period)
    return eventPeriods.find((option) => option.value === period)?.label ?? 'Last 24 hours'
  })

  const buckets = computed(
    () => props.buckets ?? eventBuckets(matchedEvents.value, activeWindow.value, nowDate.value)
  )
  const summary = computed(() => props.summary ?? eventSummary(matchedEvents.value))

  const errorShareLabel = computed(() =>
    summary.value.total
      ? `${((summary.value.errors / summary.value.total) * 100).toFixed(1)}% of events`
      : 'none'
  )

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
    if (from && to) filters.value = { ...filters.value, period: [{ start: from.at, end: to.end }] }
  }

  const chartSummary = computed(() => {
    if (!busiestBucket.value?.total) return `No events in the ${windowLabel.value.toLowerCase()}.`
    return `Busiest bucket at ${format.formatEventClock(busiestBucket.value.at)} with ${busiestBucket.value.total} events.`
  })

  const chartLabel = computed(
    () =>
      `Event volume, ${windowLabel.value.toLowerCase()}. ${chartSummary.value} Drag across the chart, or hold Shift with the arrow keys and press Enter, to filter the log to a span.`
  )

  return { summary, errorShareLabel, volumeLabels, volumeSeries, chartLabel, selectVolume }
}
```

## `composables/use-investigation-sessions.ts`

```ts
import { computed, type ComputedRef, type Ref, ref, type WritableComputedRef } from 'vue'

import type { EventsExplorerFilters } from '../view-events-explorer.vue'

/** One investigation tab: its own filters and search. */
export interface InvestigationSession {
  /** Stable key of the tab. */
  id: string
  /** Name on the tab. */
  name: string
  /** Applied filters of the tab. */
  filters: EventsExplorerFilters
  /** Search text of the tab. */
  search: string
}

/** The open investigations and what can be done with them. */
export interface UseInvestigationSessionsReturn {
  /** The open investigations, in order. */
  sessions: ComputedRef<InvestigationSession[]>
  /** Id of the active investigation. */
  activeSession: WritableComputedRef<string>
  /** The active investigation. */
  currentSession: ComputedRef<InvestigationSession>
  /** Filters of the active investigation. */
  filters: WritableComputedRef<EventsExplorerFilters>
  /** Search of the active investigation. */
  search: WritableComputedRef<string>
  /** Why the last action did nothing, read out to the user. */
  notice: ComputedRef<string>
  /** Opens a new investigation. */
  create: () => void
  /** Copies an investigation next to itself. */
  duplicate: (id: string) => void
  /** Closes an investigation, never the last one. */
  close: (id: string) => void
  /** Renames an investigation. */
  rename: (id: string, name: string) => void
}

const sessionLimit = 5
const limitNotice = `Up to ${sessionLimit} investigations stay open. Close one to start another.`

const initialSessions = (): InvestigationSession[] => [
  { id: 's1', name: 'All traffic', filters: { period: ['24h'] }, search: '' },
  {
    id: 's2',
    name: 'API errors',
    filters: { period: ['6h'], level: ['Error'], host: ['api.example.com'] },
    search: ''
  },
  {
    id: 's3',
    name: 'Security blocks',
    filters: { period: ['1h'], source: ['security'] },
    search: 'blocked'
  }
]

interface SessionState {
  sessions: Ref<InvestigationSession[]>
  active: Ref<string>
  notice: Ref<string>
}

const sessionActions = ({ sessions, active, notice }: SessionState) => {
  let sessionSeed = 3

  const nextId = () => {
    sessionSeed += 1
    return sessionSeed
  }

  const full = () => {
    if (sessions.value.length < sessionLimit) return false
    notice.value = limitNotice
    return true
  }

  const insertAfter = (index: number, session: InvestigationSession) => {
    if (full()) return
    sessions.value = [
      ...sessions.value.slice(0, index + 1),
      session,
      ...sessions.value.slice(index + 1)
    ]
    active.value = session.id
    notice.value = ''
  }

  const create = () => {
    if (full()) return
    const seed = nextId()
    const session = {
      id: `s${seed}`,
      name: `Investigation ${seed}`,
      filters: { period: ['24h'] },
      search: ''
    }
    insertAfter(sessions.value.length - 1, session)
  }

  const duplicate = (id: string) => {
    const source = sessions.value.find((session) => session.id === id)
    if (!source || full()) return
    const copy = { ...source, id: `s${nextId()}`, name: `${source.name} copy` }
    insertAfter(
      sessions.value.findIndex((session) => session.id === id),
      copy
    )
  }

  const close = (id: string) => {
    if (sessions.value.length === 1) return
    const index = sessions.value.findIndex((session) => session.id === id)
    const remaining = sessions.value.filter((session) => session.id !== id)
    sessions.value = remaining
    if (active.value === id) active.value = remaining[Math.max(0, index - 1)].id
    notice.value = ''
  }

  return { create, duplicate, close }
}

export function useInvestigationSessions(): UseInvestigationSessionsReturn {
  const sessions = ref<InvestigationSession[]>(initialSessions())
  const active = ref('s2')
  const notice = ref('')
  const { create, duplicate, close } = sessionActions({ sessions, active, notice })

  const currentSession = computed(
    () => sessions.value.find((session) => session.id === active.value) ?? sessions.value[0]
  )

  const updateSession = (id: string, patch: Partial<InvestigationSession>) => {
    sessions.value = sessions.value.map((session) =>
      session.id === id ? { ...session, ...patch } : session
    )
  }

  return {
    sessions: computed(() => sessions.value),
    activeSession: computed({
      get: () => active.value,
      set: (id) => {
        active.value = id
      }
    }),
    currentSession,
    filters: computed({
      get: () => currentSession.value.filters,
      set: (next) => updateSession(currentSession.value.id, { filters: next })
    }),
    search: computed({
      get: () => currentSession.value.search,
      set: (next) => updateSession(currentSession.value.id, { search: next })
    }),
    notice: computed(() => notice.value),
    create,
    duplicate,
    close,
    rename: (id: string, name: string) => updateSession(id, { name })
  }
}
```

## `composables/use-saved-queries.ts`

```ts
import { toast } from '@aziontech/webkit/toast'
import {
  computed,
  type ComputedRef,
  onBeforeUnmount,
  type Ref,
  ref,
  type WritableComputedRef
} from 'vue'

import type { QueryEntry, SavedQuery } from '../lib/event-query'
import type { UseEventQueryReturn } from './use-event-query'

/** The saved and recent queries popovers of the Query variant. */
export interface UseSavedQueriesReturn {
  /** The saved queries, in order. */
  savedQueries: ComputedRef<SavedQuery[]>
  /** The Saved queries popover is open. */
  savedOpen: WritableComputedRef<boolean>
  /** The Recent queries popover is open. */
  recentOpen: WritableComputedRef<boolean>
  /** The name typed for the current query. */
  saveName: WritableComputedRef<string>
  /** What the last action did, read out to the user. */
  savedStatus: ComputedRef<string>
  /** A name is typed and a query is applied. */
  canSave: ComputedRef<boolean>
  /** Saves the applied query under the typed name. */
  saveQuery: () => void
  /** Deletes a saved query, with Undo. */
  deleteSavedQuery: (entry: SavedQuery) => void
  /** Runs a saved query and closes its popover. */
  applySavedQuery: (entry: SavedQuery) => void
  /** Runs a recent query and closes its popover. */
  applyRecentQuery: (entry: QueryEntry) => void
  /** Clears the recent queries, with Undo. */
  clearRecentQueries: () => void
}

const initialSaved = (): SavedQuery[] => [
  {
    id: 'q1',
    name: 'Server errors',
    text: 'status >= 500',
    query: { tokens: [{ propertyKey: 'status', operator: '>=', value: '500' }], operation: 'and' }
  },
  {
    id: 'q2',
    name: 'Cache misses on the API',
    text: 'cacheStatus = MISS AND host = api.example.com',
    query: {
      tokens: [
        { propertyKey: 'cacheStatus', operator: '=', value: 'MISS' },
        { propertyKey: 'host', operator: '=', value: 'api.example.com' }
      ],
      operation: 'and'
    }
  }
]

const writable = <T>(source: { value: T }) =>
  computed({
    get: () => source.value,
    set: (value: T) => {
      source.value = value
    }
  })

const deleteWithUndo = (list: Ref<SavedQuery[]>, status: Ref<string>, entry: SavedQuery) => {
  const snapshot = [...list.value]
  list.value = list.value.filter((saved) => saved.id !== entry.id)
  status.value = `Deleted “${entry.name}”.`
  toast.info(`Saved query “${entry.name}” deleted.`, {
    id: 'events-saved-query',
    actions: [
      {
        label: 'Undo',
        onClick: () => {
          list.value = snapshot
          status.value = `Restored “${entry.name}”.`
        }
      }
    ]
  })
}

const clearWithUndo = (recent: { value: QueryEntry[] }) => {
  const snapshot = [...recent.value]
  recent.value = []
  toast.info('Recent queries cleared.', {
    id: 'events-recent-queries',
    actions: [{ label: 'Undo', onClick: () => (recent.value = snapshot) }]
  })
}

export function useSavedQueries(eventQuery: UseEventQueryReturn): UseSavedQueriesReturn {
  const savedQueries = ref<SavedQuery[]>(initialSaved())
  let savedSeed = 2
  const savedOpen = ref(false)
  const recentOpen = ref(false)
  const saveName = ref('')
  const savedStatus = ref('')

  const canSave = computed(() => Boolean(saveName.value.trim() && eventQuery.appliedText.value))

  const saveQuery = () => {
    if (!canSave.value) return
    savedSeed += 1
    const name = saveName.value.trim()
    savedQueries.value = [
      ...savedQueries.value,
      {
        id: `q${savedSeed}`,
        name,
        text: eventQuery.appliedText.value,
        query: eventQuery.appliedQuery.value
      }
    ]
    saveName.value = ''
    savedStatus.value = `Saved “${name}”.`
  }

  const deleteSavedQuery = (entry: SavedQuery) => deleteWithUndo(savedQueries, savedStatus, entry)

  const applySavedQuery = (entry: SavedQuery) => {
    eventQuery.runQuery(entry)
    savedOpen.value = false
  }

  const applyRecentQuery = (entry: QueryEntry) => {
    eventQuery.runQuery(entry)
    recentOpen.value = false
  }

  const clearRecentQueries = () => {
    recentOpen.value = false
    clearWithUndo(eventQuery.recentQueries)
  }

  onBeforeUnmount(() => {
    toast.dismiss('events-saved-query')
    toast.dismiss('events-recent-queries')
  })

  return {
    savedQueries: computed(() => savedQueries.value),
    savedOpen: writable(savedOpen),
    recentOpen: writable(recentOpen),
    saveName: writable(saveName),
    savedStatus: computed(() => savedStatus.value),
    canSave,
    saveQuery,
    deleteSavedQuery,
    applySavedQuery,
    applyRecentQuery,
    clearRecentQueries
  }
}
```

## `composables/use-simulated-refresh.ts`

```ts
import { computed, type ComputedRef, onScopeDispose, ref } from 'vue'

/** A refresh the sample answers after a short delay. */
export interface UseSimulatedRefreshReturn {
  /** The refresh is in flight. */
  loading: ComputedRef<boolean>
  /** Starts a refresh unless one is in flight. */
  refresh: () => void
}

export function useSimulatedRefresh(delay = 700): UseSimulatedRefreshReturn {
  const busy = ref(false)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  const refresh = () => {
    if (busy.value) return
    busy.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      busy.value = false
    }, delay)
  }
  onScopeDispose(() => clearTimeout(refreshTimer))
  return { loading: computed(() => busy.value), refresh }
}
```

## `lib/event-log.ts`

```ts
import type { ChartColor } from '@aziontech/webkit/chart'
import type { FilterMenuRange, FilterMenuValue } from '@aziontech/webkit/filter-menu'
import type { TagSeverity } from '@aziontech/webkit/tag'

import type {
  EventsExplorerBucket,
  EventsExplorerEvent,
  EventsExplorerEventLevel,
  EventsExplorerField,
  EventsExplorerSummary
} from '../view-events-explorer.vue'

/** An event as the log shows it, with its written time and source. */
export type EventRow = EventsExplorerEvent & { time: string; sourceLabel: string }

/** One value of a filter field. */
export interface FilterOption {
  /** The value a filter applies. */
  value: FilterMenuValue
  /** The value as written. */
  label: string
  /** Opens the menu's own range picker instead of applying a value. */
  custom?: boolean
}

/** One field the log can be filtered by. */
export interface FilterField {
  /** Label of the field. */
  label: string
  /** Key of the field. */
  id: string
  /** A time range or a list of values. */
  kind: 'range' | 'options'
  /** The values offered. */
  options: FilterOption[]
  /** Writes an applied value. */
  formatValue?: (value: FilterMenuValue) => string
  /** Tests an event against the applied values. */
  match: (event: EventRow, values: FilterMenuValue[]) => boolean
}

export const eventSources: Record<string, string> = {
  http: 'HTTP Requests',
  security: 'Security',
  services: 'Services',
  access: 'Access Control'
}

export const eventSourceOptions = Object.entries(eventSources).map(([value, label]) => ({
  value,
  label
}))

const eventLevels: Record<EventsExplorerEventLevel, TagSeverity> = {
  Error: 'danger',
  Warning: 'warning',
  Info: 'info',
  Debug: 'neutral'
}

export const eventLevelSeverity = (level: EventsExplorerEventLevel) =>
  eventLevels[level] ?? 'neutral'

export const levelOrder = Object.keys(eventLevels) as EventsExplorerEventLevel[]

export const eventLevelOptions = levelOrder.map((value) => ({ value, label: value }))

export const levelColors: Record<EventsExplorerEventLevel, ChartColor> = {
  Error: 'severity-critical',
  Warning: 'severity-medium',
  Info: 'severity-low',
  Debug: 'severity-info'
}

export const eventPeriods: FilterOption[] = [
  { value: '15m', label: 'Last 15 minutes' },
  { value: '1h', label: 'Last hour' },
  { value: '6h', label: 'Last 6 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: 'custom', label: 'Custom range', custom: true }
]

const periodMinutes: Record<string, number> = { '15m': 15, '1h': 60, '6h': 360, '24h': 1440 }

export const fullWindowMinutes = periodMinutes['24h']

export const isDate = (value: unknown): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime())

const endOfRange = (end: Date) => {
  const midnight =
    end.getHours() === 0 &&
    end.getMinutes() === 0 &&
    end.getSeconds() === 0 &&
    end.getMilliseconds() === 0
  return midnight
    ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999)
    : end
}

const withinRange = (date: Date, range: FilterMenuRange | null) => {
  if (!range) return true
  const { start, end } = range
  if (!start && !end) return true
  if (!isDate(date)) return false
  if (start && date.getTime() < start.getTime()) return false
  return !end || date.getTime() <= endOfRange(end).getTime()
}

export const periodRange = (value: FilterMenuValue, now: Date): FilterMenuRange => {
  if (value && typeof value === 'object') {
    return { start: value.start ?? null, end: value.end ?? now }
  }
  const minutes = periodMinutes[value] ?? fullWindowMinutes
  return { start: new Date(now.getTime() - minutes * 60000), end: now }
}

export const matchPeriod = (date: Date, values: FilterMenuValue[], now: Date) => {
  const [period] = values ?? []
  if (!period || period === 'custom' || !isDate(date)) return true
  return withinRange(date, periodRange(period, now))
}

const isBlank = (value: unknown) => value === undefined || value === null || value === ''

export const hasEventValue = (event: EventsExplorerEvent, id: string) => !isBlank(event[id])

export const searchEvents = (list: EventRow[], term: string, fields: EventsExplorerField[]) => {
  const needle = term.trim().toLowerCase()
  if (!needle) return list
  return list.filter((event) =>
    fields.some((field) => {
      const value = event[field.id]
      return value !== undefined && value !== null && String(value).toLowerCase().includes(needle)
    })
  )
}

export const fieldValueCounts = (list: EventRow[], id: string) => {
  const counts = new Map<FilterMenuValue, number>()
  for (const event of list) {
    const value = event[id] as FilterMenuValue | undefined | null
    if (value === undefined || value === null || value === '') continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
}

export const countFieldValues = (list: EventRow[], id: string) => {
  const values = new Set<unknown>()
  for (const event of list) {
    const value = event[id]
    if (!isBlank(value)) values.add(value)
  }
  return values.size
}

const bucketCountFor = (windowMinutes: number) => {
  if (windowMinutes <= 15) return 12
  if (windowMinutes <= 60) return 20
  return 32
}

export const eventBuckets = (
  list: EventRow[],
  range: FilterMenuRange | null,
  now: Date
): EventsExplorerBucket[] => {
  const end = (range?.end ?? now).getTime()
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

export const eventSummary = (list: EventRow[]): EventsExplorerSummary => {
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

const unfilterableFields = new Set(['time', 'sourceLabel'])

export const canFilterField = (field: EventsExplorerField) => !unfilterableFields.has(field.id)

export const formatFieldValue = (
  field: EventsExplorerField | undefined,
  value: unknown,
  formatNumber: (value: number) => string
) => {
  if (isBlank(value)) return '—'
  if (typeof value !== 'number' || !field?.format) return String(value)
  return field.format === 'number' ? formatNumber(value) : `${value} ms`
}

export const statusSeverity = (status: unknown) => {
  if (typeof status !== 'number') return null
  if (status >= 500) return 'danger'
  if (status >= 400) return 'warning'
  return 'success'
}
```

## `lib/event-query.ts`

```ts
import type {
  FilteringProperty,
  PropertyFilterQuery,
  PropertyFilterToken
} from '@aziontech/webkit/property-filter'

import { sampleEvents, sampleFields, sampleNow } from '../sample'
import type { EventsExplorerEvent, EventsExplorerFilters } from '../view-events-explorer.vue'
import { eventLevelOptions, eventSourceOptions } from './event-log'

/** One applied value of a filter field. */
export type QueryFilterValue = EventsExplorerFilters[string][number]

/** A query as typed and as parsed. */
export interface QueryEntry {
  /** The query text. */
  text: string
  /** The parsed query. */
  query: PropertyFilterQuery
}

/** A query kept under a name. */
export interface SavedQuery extends QueryEntry {
  /** Stable key of the saved query. */
  id: string
  /** The name it was saved under. */
  name: string
}

export const referenceNow = sampleNow.getTime()

export const timeZones = [
  'UTC',
  'America/Sao_Paulo',
  'America/New_York',
  'Europe/Lisbon',
  'Asia/Tokyo'
]

export const zoneLabel = (zone: string) => {
  const offset =
    new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'longOffset' })
      .formatToParts(new Date(referenceNow))
      .find((part) => part.type === 'timeZoneName')
      ?.value.replace('GMT', 'UTC')
      .replace('-', '−') ?? zone
  const utcOffset = offset === 'UTC' ? 'UTC+00:00' : offset
  if (!zone.includes('/')) return utcOffset
  const city = zone.split('/').at(-1)?.replace(/_/g, ' ') ?? zone
  return `${utcOffset} · ${city}`
}

const valueCounts = (list: EventsExplorerEvent[], id: string) => {
  const counts = new Map<string | number, number>()
  for (const event of list) {
    const value = event[id]
    if (typeof value !== 'string' && typeof value !== 'number') continue
    if (value === '') continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
}

const valueFields = ['host', 'requestMethod', 'cacheStatus', 'country', 'ruleName', 'serviceName']

export const queryProperties: FilteringProperty[] = [
  { key: 'level', label: 'Level', options: eventLevelOptions },
  { key: 'source', label: 'Source', options: eventSourceOptions },
  ...sampleFields
    .filter((field) => !field.core)
    .map((field): FilteringProperty => {
      if (field.align === 'end') return { key: field.id, label: field.label, type: 'number' }
      if (!valueFields.includes(field.id)) return { key: field.id, label: field.label }
      return {
        key: field.id,
        label: field.label,
        options: valueCounts(sampleEvents, field.id).map(({ value }) => ({
          value: String(value)
        }))
      }
    })
]

export const searchableFields = sampleFields.map((field) => field.id)

const quoteValue = (value: string) =>
  /[\s"'=!:^<>]/.test(value) ? `"${value.replaceAll('"', '')}"` : value

export const queryToText = (query: PropertyFilterQuery) =>
  query.tokens
    .map((token) =>
      token.propertyKey
        ? `${token.propertyKey} ${token.operator} ${quoteValue(token.value)}`
        : quoteValue(token.value)
    )
    .join(query.operation === 'or' ? ' OR ' : ' AND ')

const rawValue = (id: string, text: string): QueryFilterValue => {
  const needle = text.toLowerCase()
  for (const event of sampleEvents) {
    const value = event[id]
    if (
      (typeof value === 'string' || typeof value === 'number') &&
      String(value).toLowerCase() === needle
    )
      return value
  }
  return text
}

const sameValue = (a: QueryFilterValue, b: QueryFilterValue) =>
  typeof a !== 'object' &&
  typeof b !== 'object' &&
  String(a).toLowerCase() === String(b).toLowerCase()

export const filtersFromQuery = (
  query: PropertyFilterQuery,
  period: QueryFilterValue
): EventsExplorerFilters => {
  const out: EventsExplorerFilters = { period: [period] }
  const { tokens, operation } = query
  if (operation === 'or' && tokens.length > 1) return out
  for (const token of tokens) {
    if (!token.propertyKey || token.operator !== '=') continue
    out[token.propertyKey] = [
      ...(out[token.propertyKey] ?? []),
      rawValue(token.propertyKey, token.value)
    ]
  }
  return out
}

const withoutValue = (tokens: PropertyFilterToken[], id: string, value: QueryFilterValue) =>
  tokens.filter(
    (token) =>
      !(token.propertyKey === id && token.operator === '=' && sameValue(token.value, value))
  )

const missingFrom = (list: QueryFilterValue[], other: QueryFilterValue[]) =>
  list.filter((item) => !other.some((value) => sameValue(value, item)))

export const tokensForFilters = (
  tokens: PropertyFilterToken[],
  current: EventsExplorerFilters,
  next: EventsExplorerFilters
): PropertyFilterToken[] | null => {
  let result = [...tokens]
  let changed = false
  const ids = new Set([...Object.keys(current), ...Object.keys(next)])
  ids.delete('period')
  for (const id of ids) {
    const before = current[id] ?? []
    const after = next[id] ?? []
    for (const value of missingFrom(before, after)) {
      result = withoutValue(result, id, value)
      changed = true
    }
    for (const value of missingFrom(after, before)) {
      if (typeof value === 'object') continue
      result = [...result, { propertyKey: id, operator: '=', value: String(value) }]
      changed = true
    }
  }
  return changed ? result : null
}
```

## `parts/document-field-search.vue`

```ts
<script setup lang="ts">
  import CopyButton from '@aziontech/webkit/copy-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref, watch } from 'vue'

  import type {
    EventsExplorerDocumentField,
    EventsExplorerFilters
  } from '../view-events-explorer.vue'

  export interface DocumentFieldSearchProps {
    /** Every field of the open event. */
    fields: EventsExplorerDocumentField[]
    /** Id of the open event; a new one clears the search. */
    selectedKey: string
  }

  const props = defineProps<DocumentFieldSearchProps>()

  const filters = defineModel<EventsExplorerFilters>('filters', { required: true })
  const exclusions = defineModel<EventsExplorerFilters>('exclusions', { required: true })

  type AppliedValue = EventsExplorerDocumentField['raw']

  const documentQuery = ref('')

  watch(
    () => props.selectedKey,
    () => {
      documentQuery.value = ''
    }
  )

  const highlightParts = (text: string, term: string) => {
    if (!term) return [{ text, hit: false }]
    const parts: { text: string; hit: boolean }[] = []
    const lower = text.toLowerCase()
    let from = 0
    let at = lower.indexOf(term)
    while (at !== -1) {
      if (at > from) parts.push({ text: text.slice(from, at), hit: false })
      parts.push({ text: text.slice(at, at + term.length), hit: true })
      from = at + term.length
      at = lower.indexOf(term, from)
    }
    if (from < text.length) parts.push({ text: text.slice(from), hit: false })
    return parts
  }

  const shownRows = (fields: EventsExplorerDocumentField[]) => {
    const term = documentQuery.value.trim().toLowerCase()
    return fields
      .map((field) => ({ ...field, parts: highlightParts(field.value, term) }))
      .filter(
        (row) =>
          !term ||
          row.label.toLowerCase().includes(term) ||
          row.id.toLowerCase().includes(term) ||
          row.value.toLowerCase().includes(term)
      )
  }

  const documentStatus = (fields: EventsExplorerDocumentField[]) => {
    if (!documentQuery.value.trim()) return ''
    return `${shownRows(fields).length} of ${fields.length} fields match.`
  }

  const shownFieldsJson = (fields: EventsExplorerDocumentField[]) =>
    JSON.stringify(Object.fromEntries(shownRows(fields).map((row) => [row.id, row.raw])), null, 2)

  const isIncluded = (id: string, value: AppliedValue) => (filters.value[id] ?? []).includes(value)

  const isExcluded = (id: string, value: AppliedValue) =>
    (exclusions.value[id] ?? []).includes(value)

  const without = (list: AppliedValue[] = [], value: AppliedValue) =>
    list.filter((item) => item !== value)

  const includeValue = (id: string, value: AppliedValue) => {
    const current = filters.value[id] ?? []
    filters.value = {
      ...filters.value,
      [id]: current.includes(value) ? without(current, value) : [...current, value]
    }
    exclusions.value = { ...exclusions.value, [id]: without(exclusions.value[id], value) }
  }

  const excludeValue = (id: string, value: AppliedValue) => {
    const current = exclusions.value[id] ?? []
    exclusions.value = {
      ...exclusions.value,
      [id]: current.includes(value) ? without(current, value) : [...current, value]
    }
    filters.value = { ...filters.value, [id]: without(filters.value[id], value) }
  }

  const FIELD_ROW_CLASS =
    'group grid min-w-0 grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center gap-x-(--spacing-sm) rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-2xs) transition-colors ' +
    'duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none'
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <div class="min-w-0 flex-1">
        <Input
          v-model="documentQuery"
          size="small"
          placeholder="Search in this event"
          aria-label="Search in this event"
          class="w-full"
          data-testid="document-search"
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
      <Tooltip content="Copy the fields shown as JSON">
        <CopyButton
          :value="shownFieldsJson(fields)"
          variant="outline"
          size="small"
          aria-label="Copy the fields shown as JSON"
          copied-label="Fields copied as JSON"
          data-testid="document-copy"
        />
      </Tooltip>
    </div>
    <p
      role="status"
      class="sr-only"
    >
      {{ documentStatus(fields) }}
    </p>
    <dl
      v-if="shownRows(fields).length"
      class="flex min-w-0 flex-col"
      data-testid="document-fields"
    >
      <div
        v-for="row in shownRows(fields)"
        :key="row.id"
        :class="FIELD_ROW_CLASS"
      >
        <dt class="min-w-0 truncate text-label-sm text-(--text-muted)">
          {{ row.label }}
        </dt>
        <dd class="m-0 flex min-w-0 items-center gap-(--spacing-xs)">
          <span class="min-w-0 flex-1 break-words text-label-code-sm text-(--text-default)">
            <template
              v-for="(part, index) in row.parts"
              :key="index"
            >
              <mark
                v-if="part.hit"
                class="rounded-(--shape-control) bg-(--bg-selected) text-inherit"
                >{{ part.text }}</mark
              >
              <template v-else>{{ part.text }}</template>
            </template>
          </span>
          <span
            v-if="row.filterable"
            class="flex shrink-0 items-center gap-(--spacing-2xs)"
          >
            <Tooltip :content="`Filter by ${row.label} ${row.value}`">
              <IconButton
                icon="az az-zoom-in"
                variant="ghost"
                size="small"
                :aria-label="`Filter by ${row.label} ${row.value}`"
                :aria-pressed="isIncluded(row.id, row.raw)"
                data-testid="document-include"
                @click="includeValue(row.id, row.raw)"
              />
            </Tooltip>
            <Tooltip :content="`Exclude ${row.label} ${row.value}`">
              <IconButton
                icon="az az-zoom-out"
                variant="ghost"
                size="small"
                :aria-label="`Exclude ${row.label} ${row.value}`"
                :aria-pressed="isExcluded(row.id, row.raw)"
                data-testid="document-exclude"
                @click="excludeValue(row.id, row.raw)"
              />
            </Tooltip>
          </span>
        </dd>
      </div>
    </dl>
    <p
      v-else
      class="px-(--spacing-xs) text-body-sm text-(--text-muted)"
    >
      No field matches “{{ documentQuery }}”.
    </p>
  </div>
</template>
```

## `parts/event-document.vue`

```ts
<script setup lang="ts">
  import CodeBlock, { type CodeBlockTab } from '@aziontech/webkit/code-block'
  import Tag from '@aziontech/webkit/tag'
  import Trace, { type TraceView } from '@aziontech/webkit/trace'

  import type { EventsExplorerDocumentRow } from '../composables/use-events-explorer-document'
  import { eventLevelSeverity, type EventRow } from '../lib/event-log'
  import type {
    EventsExplorerDocumentField,
    EventsExplorerEvent
  } from '../view-events-explorer.vue'

  export interface EventDocumentProps {
    /** The open event. */
    event: EventRow
    /** Every field of the event, for the document-fields slot. */
    fields: EventsExplorerDocumentField[]
    /** The summary rows shown when the slot is left out. */
    rows: EventsExplorerDocumentRow[]
    /** The JSON tab of the event. */
    tabs: CodeBlockTab[]
  }

  defineProps<EventDocumentProps>()

  const traceView = defineModel<TraceView>('traceView', { required: true })

  defineSlots<{
    /** Replaces the fields of the event. */
    'document-fields'?(props: {
      event: EventsExplorerEvent
      fields: EventsExplorerDocumentField[]
    }): unknown
  }>()
</script>

<template>
  <div class="flex min-w-0 flex-col">
    <div class="flex min-w-0 flex-col gap-(--spacing-md) p-(--spacing-md) pb-(--spacing-lg)">
      <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
        <div class="flex flex-wrap items-center gap-(--spacing-xs)">
          <Tag
            :label="event.level"
            :severity="eventLevelSeverity(event.level)"
            size="small"
          />
          <Tag
            :label="event.sourceLabel"
            severity="neutral"
            size="small"
          />
        </div>
        <p class="text-body-md text-(--text-default)">{{ event.message }}</p>
        <p class="text-label-code-sm tabular-nums text-(--text-muted)">
          {{ event.time }}
        </p>
      </div>

      <slot
        name="document-fields"
        :event="event"
        :fields="fields"
      >
        <dl
          class="grid min-w-0 grid-cols-[minmax(0,8rem)_minmax(0,1fr)] items-baseline gap-x-(--spacing-md) gap-y-(--spacing-sm)"
        >
          <template
            v-for="row in rows"
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
      v-if="event.spans?.length"
      class="flex min-w-0 flex-col gap-(--spacing-xs) pb-(--spacing-lg)"
    >
      <h3 class="px-(--spacing-md) text-label-sm text-(--text-default)">Trace</h3>
      <div class="border-y border-(--border-muted)">
        <Trace
          :key="event.id"
          v-model:view="traceView"
          :spans="event.spans"
          :bordered="false"
          highlight-critical-path
          :aria-label="`Trace of request ${String(event.requestId ?? event.id)}`"
        />
      </div>
    </div>

    <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
      <h3 class="px-(--spacing-md) text-label-sm text-(--text-default)">Event document</h3>
      <div class="min-w-0">
        <CodeBlock
          :tabs="tabs"
          :bordered="false"
          show-line-numbers
          copy-aria-label="Copy the event document as JSON"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>
```

## `parts/events-table.vue`

```ts
<script setup lang="ts">
  import DataTable, { type TableColumn, type TableExposed } from '@aziontech/webkit/data-table'
  import DataTableLoadMore from '@aziontech/webkit/data-table-load-more'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { ref } from 'vue'

  import {
    eventLevelSeverity,
    type EventRow,
    formatFieldValue,
    statusSeverity
  } from '../lib/event-log'
  import type { EventsExplorerEventLevel, EventsExplorerField } from '../view-events-explorer.vue'

  export interface EventsTableProps {
    /** The matching events. */
    events: EventRow[]
    /** The columns of the table. */
    columns: TableColumn[]
    /** The shown fields without a cell of their own. */
    genericColumns: EventsExplorerField[]
    /** The Status field, when the events have one. */
    statusField?: EventsExplorerField
    /** Id of the open event. */
    selectedKey: string
    /** Time, Level and Source fold into the Event cell. */
    compact: boolean
    /** Every event that matches on the server. */
    total?: number
    /** More events exist after the last one. */
    moreRows: boolean
    /** The next events are loading. */
    loadingMore: boolean
    /** The table shows its loading rows. */
    loading: boolean
    /** No event exists at all. */
    noTraffic: boolean
    /** A search is typed. */
    searching: boolean
    /** Writes the clock time of the folded Event cell. */
    formatClock: (date: unknown) => string
  }

  withDefaults(defineProps<EventsTableProps>(), { statusField: undefined, total: undefined })

  const emit = defineEmits<{
    open: [event: MouseEvent | KeyboardEvent, row: EventRow]
    'load-more': [event: Event]
  }>()

  const page = defineModel<number>('page', { required: true })
  const pageSize = defineModel<number>('pageSize', { required: true })

  const { formatNumber } = useLocale()

  const tableEl = ref<TableExposed<EventRow> | null>(null)

  const OPEN_ROW_CLASS =
    'flex min-h-0 flex-1 [&_[role=row]:has([data-open-event])]:[--table-row-bg:var(--bg-selected)]!'

  const STATUS_CELL_CLASS =
    'min-w-0 truncate text-label-code-sm tabular-nums text-(--text-default) ' +
    'data-[severity=danger]:text-(--danger-foreground) data-[severity=warning]:text-(--warning-foreground)'

  defineExpose({
    /** Downloads the log shown as CSV. */
    exportCsv: () => tableEl.value?.exportCsv({ filename: 'events.csv' })
  })
</script>

<template>
  <section class="flex min-h-0 min-w-0 flex-1 flex-col">
    <div :class="OPEN_ROW_CLASS">
      <DataTable
        ref="tableEl"
        :data="events"
        :columns="columns"
        row-key="id"
        sortable
        :bordered="false"
        density="compact"
        max-height="100%"
        class="w-full"
        :loading="loading"
        @row-click="(event: MouseEvent | KeyboardEvent, row: EventRow) => emit('open', event, row)"
      >
        <template #header-detail>
          <span class="sr-only">Open the event document</span>
        </template>

        <template #cell-detail="{ row }">
          <IconButton
            :icon="row.id === selectedKey ? 'az az-chevron-down' : 'az az-chevron-right'"
            variant="ghost"
            size="small"
            :aria-label="`Open event ${row.id}`"
            :aria-expanded="row.id === selectedKey"
            :data-open-event="row.id === selectedKey || undefined"
            @click.stop="emit('open', $event, row)"
          />
        </template>

        <template #cell-time="{ value }">
          <span class="min-w-0 truncate text-label-code-sm tabular-nums text-(--text-muted)">
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
            v-if="compact"
            class="flex min-w-0 flex-col gap-(--spacing-2xs) py-(--spacing-2xs)"
          >
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <Tag
                :label="String(row.level)"
                :severity="eventLevelSeverity(row.level)"
                size="small"
                class="shrink-0"
              />
              <span class="shrink-0 text-label-code-sm tabular-nums text-(--text-muted)">{{
                formatClock(row.at)
              }}</span>
              <span class="min-w-0 truncate text-body-xs text-(--text-muted)">{{
                row.sourceLabel
              }}</span>
            </div>
            <span class="whitespace-normal break-words text-(--text-default)">{{ value }}</span>
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
            {{ formatFieldValue(statusField, value, formatNumber) }}
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
            {{ formatFieldValue(field, value, formatNumber) }}
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
            v-else-if="searching"
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
        <template #load-more>
          <DataTableLoadMore
            :more-rows="moreRows"
            :loading="loadingMore"
            @load-more="(event: Event) => emit('load-more', event)"
          />
        </template>
        <template #footer>
          <DataTablePagination
            v-model:page="page"
            v-model:page-size="pageSize"
            :manual="total !== undefined"
            :total="total"
          />
        </template>
      </DataTable>
    </div>
  </section>
</template>
```

## `parts/events-toolbar.vue`

```ts
<script setup lang="ts">
  import type { FilterMenuField } from '@aziontech/webkit/filter-menu'
  import FilterMenu from '@aziontech/webkit/filter-menu-root'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { ref } from 'vue'

  import type { EventsExplorerFilters } from '../view-events-explorer.vue'

  export interface EventsToolbarProps {
    /** The fields of the filter menu. */
    menuFields: FilterMenuField[]
    /** IANA time zone the times are written in. */
    timeZone: string
    /** A request is in flight. */
    loading: boolean
    /** Download CSV is not available yet. */
    exportDisabled: boolean
  }

  defineProps<EventsToolbarProps>()

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    export: [event: MouseEvent]
  }>()

  const filters = defineModel<EventsExplorerFilters>('filters', { required: true })
  const search = defineModel<string>('search', { required: true })
  const searchEl = ref<InstanceType<typeof Input> | null>(null)
  useShortcuts({
    keys: '/',
    label: 'Focus search',
    element: () => (searchEl.value?.$el as HTMLElement | null | undefined) ?? null,
    handler: () => searchEl.value?.focus()
  })
</script>

<template>
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
          ref="searchEl"
          v-model="search"
          size="medium"
          placeholder="Search events, hosts, paths or addresses"
          aria-keyshortcuts="/"
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
          :disabled="exportDisabled"
          aria-label="Download CSV"
          data-testid="export-button"
          @click="(event: MouseEvent) => emit('export', event)"
        />
      </Tooltip>
    </div>
  </header>
</template>
```

## `parts/field-row.vue`

```ts
<script setup lang="ts">
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import type { FilterMenuValue } from '@aziontech/webkit/filter-menu'
  import Item from '@aziontech/webkit/item-root'
  import Popover from '@aziontech/webkit/popover'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import {
    countFieldValues,
    type EventRow,
    fieldValueCounts,
    formatFieldValue
  } from '../lib/event-log'
  import type { EventsExplorerField } from '../view-events-explorer.vue'

  export interface FieldRowProps {
    /** The field; locked fields always show. */
    field: EventsExplorerField & { locked?: boolean }
    /** Its column shows in the log. */
    checked: boolean
    /** Distinct values among the matching events. */
    count: number
    /** The log can be filtered by this field. */
    filterable: boolean
    /** The matching events, the source of its top values. */
    events: EventRow[]
    /** The values of the field applied as filters. */
    applied: FilterMenuValue[]
    /** Whether the count is known: the events are loading, or failed to load. */
    countState?: 'ready' | 'loading' | 'unknown'
  }

  const props = withDefaults(defineProps<FieldRowProps>(), { countState: 'ready' })

  const emit = defineEmits<{
    'toggle-column': []
    'toggle-value': [value: FilterMenuValue]
  }>()

  const { formatNumber } = useLocale()

  const topValues = 6

  const topFieldValues = () => fieldValueCounts(props.events, props.field.id).slice(0, topValues)

  const fieldValueOverflow = () =>
    Math.max(0, countFieldValues(props.events, props.field.id) - topValues)

  const isValueApplied = (value: FilterMenuValue) => props.applied.includes(value)

  const FIELD_ROW_CLASS =
    'group flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-2xs) transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:bg-(--bg-hover) motion-reduce:transition-none'

  const FIELD_COUNT_CLASS =
    'shrink-0 cursor-pointer text-label-code-sm tabular-nums text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:text-(--text-default) group-hover:text-(--text-default) motion-reduce:transition-none'
</script>

<template>
  <div :class="FIELD_ROW_CLASS">
    <div class="min-w-0 flex-1">
      <Field
        orientation="horizontal"
        :disabled="field.locked"
      >
        <Checkbox
          :model-value="checked"
          @update:model-value="emit('toggle-column')"
        />
        <Field.Label>
          <span class="truncate">{{ field.label }}</span>
        </Field.Label>
      </Field>
    </div>

    <span
      v-if="countState === 'loading'"
      class="shrink-0 px-(--spacing-2xs)"
      data-testid="field-row__count-loading"
    >
      <Skeleton
        width="1.5rem"
        height="0.75rem"
      />
    </span>

    <span
      v-else-if="countState === 'unknown'"
      class="shrink-0 px-(--spacing-2xs) text-label-code-sm text-(--text-muted)"
      :aria-label="`${field.label} values unknown`"
    >
      –
    </span>

    <Popover
      v-else-if="filterable && count"
      side="end"
      align="start"
    >
      <div :class="FIELD_COUNT_CLASS">
        <Popover.Trigger
          role="button"
          tabindex="0"
          :aria-label="`Filter by ${field.label}, ${count} values`"
        >
          <span
            data-testid="field-row__count"
            class="inline-flex min-h-6 min-w-6 items-center justify-center rounded-(--shape-control) border border-(--border-muted) px-(--spacing-2xs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none"
            >{{ count }}</span
          >
        </Popover.Trigger>
      </div>

      <Popover.Content>
        <div class="flex min-w-0 flex-col p-(--spacing-2xs)">
          <p class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)">
            {{ field.label }} · top values
          </p>

          <Item
            v-for="entry in topFieldValues()"
            :key="String(entry.value)"
            clickable
            variant="option"
            :aria-pressed="isValueApplied(entry.value)"
            @click="emit('toggle-value', entry.value)"
          >
            <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
              <span class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-default)">
                {{ formatFieldValue(field, entry.value, formatNumber) }}
              </span>
              <span class="shrink-0 text-label-code-sm tabular-nums text-(--text-muted)">
                {{ entry.count }}
              </span>
              <i
                v-if="isValueApplied(entry.value)"
                class="az az-check shrink-0 text-(--primary)"
                aria-hidden="true"
              />
            </span>
          </Item>

          <p
            v-if="fieldValueOverflow()"
            class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
          >
            {{ fieldValueOverflow() }} more values in this window.
          </p>
        </div>
      </Popover.Content>
    </Popover>

    <span
      v-else
      class="shrink-0 px-(--spacing-2xs) text-label-code-sm tabular-nums text-(--text-muted) data-empty:text-(--text-disabled)"
      :data-empty="count ? null : true"
      :aria-label="`${count} distinct values`"
    >
      {{ count }}
    </span>
  </div>
</template>
```

## `parts/fields-panel.vue`

```ts
<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import type { FilterMenuValue } from '@aziontech/webkit/filter-menu'
  import Input from '@aziontech/webkit/input'
  import Sidebar from '@aziontech/webkit/sidebar-root'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref, watch } from 'vue'

  import { canFilterField, countFieldValues, type EventRow } from '../lib/event-log'
  import type {
    EventsExplorerField,
    EventsExplorerFieldCategory,
    EventsExplorerFilters
  } from '../view-events-explorer.vue'
  import FieldRow from './field-row.vue'

  export interface FieldsPanelProps {
    /** Every field, in order. */
    fields: EventsExplorerField[]
    /** The categories that group the hidden fields. */
    categories: EventsExplorerFieldCategory[]
    /** The matching events, the source of the value counts. */
    events: EventRow[]
    /** Ids of the optional fields shown as columns. */
    shownColumns: string[]
    /** Whether the value counts are known: the events are loading, or failed to load. */
    countState?: 'ready' | 'loading' | 'unknown'
  }

  const props = withDefaults(defineProps<FieldsPanelProps>(), { countState: 'ready' })

  const emit = defineEmits<{
    'toggle-column': [id: string]
  }>()

  const filters = defineModel<EventsExplorerFilters>('filters', { required: true })
  const open = defineModel<boolean>('open', { required: true })
  const width = defineModel<number>('width', { required: true })

  const fieldSearch = ref('')

  const matchesFieldSearch = (field: EventsExplorerField) => {
    const term = fieldSearch.value.trim().toLowerCase()
    if (!term) return true
    return field.label.toLowerCase().includes(term) || field.id.toLowerCase().includes(term)
  }

  const coreFields = computed(() => props.fields.filter((field) => field.core))
  const optionalFields = computed(() => props.fields.filter((field) => !field.core))

  const shownFields = computed<Array<EventsExplorerField & { locked?: boolean }>>(() => [
    ...coreFields.value.filter(matchesFieldSearch).map((field) => ({ ...field, locked: true })),
    ...optionalFields.value.filter(
      (field) => props.shownColumns.includes(field.id) && matchesFieldSearch(field)
    )
  ])

  const fieldCategories = computed(() =>
    props.categories
      .map((category) => ({
        ...category,
        fields: optionalFields.value.filter(
          (field) =>
            field.category === category.id &&
            !props.shownColumns.includes(field.id) &&
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

  const defaultCategories = () => props.categories.slice(0, 1).map(({ id }) => id)

  const openCategories = ref(defaultCategories())

  watch(
    () => props.fields.map((field) => field.id).join(' '),
    () => {
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
      props.fields.map((field) => [field.id, countFieldValues(props.events, field.id)])
    )
  )

  const toggleFieldValue = (id: string, value: FilterMenuValue) => {
    const current = filters.value[id] ?? []
    const next = current.includes(value)
      ? current.filter((applied) => applied !== value)
      : [...current, value]
    filters.value = { ...filters.value, [id]: next }
  }
</script>

<template>
  <Sidebar
    v-model:open="open"
    v-model:width="width"
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

      <FieldRow
        v-for="field in shownFields"
        :key="field.id"
        :field="field"
        checked
        :count="fieldCounts[field.id]"
        :filterable="canFilterField(field)"
        :events="events"
        :applied="filters[field.id] ?? []"
        :count-state="countState"
        @toggle-column="emit('toggle-column', field.id)"
        @toggle-value="(value) => toggleFieldValue(field.id, value)"
      />

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
              <FieldRow
                v-for="field in category.fields"
                :key="field.id"
                :field="field"
                :checked="false"
                :count="fieldCounts[field.id]"
                :filterable="canFilterField(field)"
                :events="events"
                :applied="filters[field.id] ?? []"
                :count-state="countState"
                @toggle-column="emit('toggle-column', field.id)"
                @toggle-value="(value) => toggleFieldValue(field.id, value)"
              />
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
</template>
```

## `parts/filter-chips.vue`

```ts
<script setup lang="ts">
  import Chip from '@aziontech/webkit/chip'
  import FilterMenu, {
    type FilterMenuField,
    type FilterMenuValue
  } from '@aziontech/webkit/filter-menu'

  import type { EventsExplorerExclusionChip } from '../composables/use-events-explorer-log'
  import type { EventsExplorerFilters } from '../view-events-explorer.vue'

  export interface FilterChipsProps {
    /** The fields of the filter menu. */
    menuFields: FilterMenuField[]
    /** One chip per exclusion. */
    exclusionChips: EventsExplorerExclusionChip[]
  }

  defineProps<FilterChipsProps>()

  const emit = defineEmits<{
    'remove-exclusion': [id: string, value: FilterMenuValue]
  }>()

  const filters = defineModel<EventsExplorerFilters>('filters', { required: true })
</script>

<template>
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
        @remove="emit('remove-exclusion', chip.id, chip.value)"
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
</template>
```

## `parts/investigation-tabs.vue`

```ts
<script setup lang="ts">
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Tabs from '@aziontech/webkit/tabs'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { nextTick, ref } from 'vue'

  import type { InvestigationSession } from '../composables/use-investigation-sessions'

  export interface InvestigationTabsProps {
    /** The open investigations, in order. */
    sessions: InvestigationSession[]
    /** Name of the active investigation. */
    currentName: string
    /** Why the last action did nothing. */
    notice: string
  }

  const props = defineProps<InvestigationTabsProps>()

  const emit = defineEmits<{
    create: []
    duplicate: [id: string]
    close: [id: string]
    rename: [id: string, name: string]
  }>()

  const activeSession = defineModel<string>('active', { required: true })

  const sessionStripEl = ref<HTMLElement | null>(null)

  const focusSessionTab = async (id: string) => {
    await nextTick()
    sessionStripEl.value?.querySelector<HTMLElement>(`[data-testid="session-tab-${id}"]`)?.focus()
  }

  const act = async (run: () => void) => {
    const count = props.sessions.length
    run()
    await nextTick()
    if (props.sessions.length !== count) focusSessionTab(activeSession.value)
  }

  const renamingId = ref('')
  const renameDraft = ref('')
  const renameBox = ref({ left: 0, width: 0 })
  const renameInputEl = ref<{ $el: HTMLElement } | null>(null)

  const startRename = (id: string) => {
    const session = props.sessions.find((entry) => entry.id === id)
    const strip = sessionStripEl.value
    const tab = strip?.querySelector(`[data-testid="session-tab-${id}"]`)
    if (!session || !strip || !tab) return
    const stripBox = strip.getBoundingClientRect()
    const tabBox = tab.getBoundingClientRect()
    renameBox.value = { left: tabBox.left - stripBox.left, width: tabBox.width }
    renameDraft.value = session.name
    renamingId.value = id
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const input = renameInputEl.value?.$el?.querySelector('input') ?? null
        input?.focus()
        input?.select()
      })
    )
  }

  const finishRename = (commit: boolean) => {
    const id = renamingId.value
    if (!id) return
    const name = renameDraft.value.trim()
    if (commit && name) emit('rename', id, name)
    renamingId.value = ''
    focusSessionTab(id)
  }

  const sessionOf = (event: Event) =>
    (event.target as HTMLElement | null)
      ?.closest?.<HTMLElement>('[role="tab"]')
      ?.dataset.testid?.replace('session-tab-', '') ?? ''

  const onSessionDblclick = (event: MouseEvent) => {
    const id = sessionOf(event)
    if (id) startRename(id)
  }

  const onSessionKeydown = (event: KeyboardEvent) => {
    const id = sessionOf(event)
    if (!id) return
    if (event.key === 'F2') {
      event.preventDefault()
      startRename(id)
    }
  }

  const onSessionAction = (_event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) => {
    const id = activeSession.value
    if (value === 'rename') startRename(id)
    if (value === 'duplicate') act(() => emit('duplicate', id))
    if (value === 'close') act(() => emit('close', id))
  }
</script>

<template>
  <section
    ref="sessionStripEl"
    aria-label="Investigations"
    class="relative flex shrink-0 flex-col gap-(--spacing-2xs) border-b border-(--border-default) px-(--spacing-lg) pt-(--spacing-xs)"
    data-testid="session-strip"
  >
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <div
        role="presentation"
        class="min-w-0 flex-1"
        @keydown="onSessionKeydown"
        @dblclick="onSessionDblclick"
      >
        <Tabs v-model="activeSession">
          <Tabs.List>
            <Tabs.Trigger
              v-for="session in sessions"
              :key="session.id"
              :value="session.id"
              :label="session.name"
              :closable="sessions.length > 1"
              :data-testid="`session-tab-${session.id}`"
              @close="act(() => emit('close', session.id))"
            />
          </Tabs.List>
        </Tabs>
      </div>
      <Tooltip content="New investigation">
        <IconButton
          icon="az az-plus"
          variant="ghost"
          size="small"
          aria-label="New investigation"
          data-testid="session-new"
          @click="act(() => emit('create'))"
        />
      </Tooltip>
      <DropdownMenu
        side="bottom"
        align="end"
        @select="onSessionAction"
      >
        <DropdownMenu.Trigger>
          <Tooltip content="Investigation actions">
            <IconButton
              icon="az az-ellipsis"
              variant="ghost"
              size="small"
              :aria-label="`Actions for ${currentName}`"
              data-testid="session-actions"
            />
          </Tooltip>
        </DropdownMenu.Trigger>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            value="rename"
            label="Rename"
            command="F2"
          />
          <DropdownMenu.Item
            value="duplicate"
            label="Duplicate"
          />
          <DropdownMenu.Item
            value="close"
            label="Close investigation"
            :disabled="sessions.length === 1"
          />
        </DropdownMenu.Group>
      </DropdownMenu>
    </div>
    <div
      v-if="renamingId"
      class="absolute top-(--spacing-xs) z-10"
      :style="{ left: `${renameBox.left}px`, width: `${Math.max(renameBox.width, 160)}px` }"
    >
      <Input
        ref="renameInputEl"
        v-model="renameDraft"
        size="small"
        aria-label="Investigation name"
        class="w-full"
        data-testid="session-rename"
        @keydown.enter.prevent="finishRename(true)"
        @keydown.esc.prevent="finishRename(false)"
        @blur="finishRename(true)"
      />
    </div>
    <p
      role="status"
      class="text-body-sm text-(--text-muted)"
      data-testid="session-notice"
    >
      {{ notice }}
    </p>
  </section>
</template>
```

## `parts/query-toolbar.vue`

```ts
<script setup lang="ts">
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import IconButton from '@aziontech/webkit/icon-button'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { UseEventQueryReturn } from '../composables/use-event-query'
  import type { UseEventQueryRangeReturn } from '../composables/use-event-query-range'
  import type { UseSavedQueriesReturn } from '../composables/use-saved-queries'
  import { queryProperties, timeZones, zoneLabel } from '../lib/event-query'
  import RecentQueries from './recent-queries.vue'
  import SavedQueries from './saved-queries.vue'

  export interface QueryToolbarProps {
    /** The time range and its bridge to the Period filter. */
    timeRange: UseEventQueryRangeReturn
    /** The typed query and its history. */
    eventQuery: UseEventQueryReturn
    /** The saved and recent queries popovers. */
    savedQueries: UseSavedQueriesReturn
    /** A refresh is in flight. */
    loading?: boolean
    /** Nothing to export. */
    exportDisabled?: boolean
  }

  const props = withDefaults(defineProps<QueryToolbarProps>(), {
    loading: false,
    exportDisabled: false
  })

  const emit = defineEmits<{
    refresh: []
    export: []
  }>()

  const timeZone = defineModel<string>('timeZone', { required: true })
  const refreshInterval = defineModel<number>('refreshInterval', { required: true })

  const { range, relativeOptions, rangeNow, rangeMin } = props.timeRange
  const { queryText, queryNotice, matchedCount, recentQueries, submitQuery } = props.eventQuery
  const {
    savedQueries: savedEntries,
    savedOpen,
    recentOpen,
    saveName,
    savedStatus,
    canSave,
    saveQuery,
    deleteSavedQuery,
    applySavedQuery,
    applyRecentQuery,
    clearRecentQueries
  } = props.savedQueries

  const setTimeZone = (zone: string | undefined) => {
    if (zone) timeZone.value = zone
  }

  const QUERY_CLASS =
    'order-last flex min-w-0 basis-full @3xl/query-toolbar:order-none @3xl/query-toolbar:min-w-36 ' +
    '@3xl/query-toolbar:flex-1 @3xl/query-toolbar:basis-(--container-xs)'
</script>

<template>
  <header class="@container/query-toolbar">
    <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
      <div class="flex shrink-0 items-center">
        <DateRangePicker
          v-model="range"
          v-model:time-zone="timeZone"
          v-model:refresh-interval="refreshInterval"
          :relative-options="relativeOptions"
          :now="rangeNow"
          :min="rangeMin"
          :max="rangeNow"
          show-step
          aria-label="Events time range"
          data-testid="events-range"
          @refresh="emit('refresh')"
        />
      </div>
      <div class="flex shrink-0 items-center">
        <Select
          :model-value="timeZone"
          :display-value="zoneLabel"
          size="medium"
          variant="ghost"
          aria-label="Time zone"
          data-testid="events-time-zone"
          @update:model-value="setTimeZone"
        >
          <Select.Trigger>
            <template #leading>
              <i
                class="az az-globe text-(--text-muted)"
                aria-hidden="true"
              />
            </template>
          </Select.Trigger>
          <Select.Content>
            <Select.Item
              v-for="zone in timeZones"
              :key="zone"
              :value="zone"
            >
              {{ zoneLabel(zone) }}
            </Select.Item>
          </Select.Content>
        </Select>
      </div>
      <div :class="QUERY_CLASS">
        <PropertyFilter
          v-model:text="queryText"
          mode="query"
          :properties="queryProperties"
          :total-count="matchedCount"
          aria-label="Query events"
          placeholder="Query events, for example status >= 500 AND host = example.com"
          data-testid="events-query"
          @submit="submitQuery"
        />
      </div>
      <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
        <SavedQueries
          v-model:open="savedOpen"
          v-model:name="saveName"
          :entries="savedEntries"
          :status="savedStatus"
          :can-save="canSave"
          @apply="applySavedQuery"
          @delete="deleteSavedQuery"
          @save="saveQuery"
        />
        <RecentQueries
          v-model:open="recentOpen"
          :entries="recentQueries"
          @apply="applyRecentQuery"
          @clear="clearRecentQueries"
        />
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
            @click="emit('refresh')"
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
            :disabled="exportDisabled"
            aria-label="Download CSV"
            data-testid="export-button"
            @click="emit('export')"
          />
        </Tooltip>
      </div>
    </div>
  </header>

  <p
    role="status"
    class="text-body-sm text-(--danger-foreground) empty:hidden"
    data-testid="query-notice"
  >
    {{ queryNotice }}
  </p>
</template>
```

## `parts/log-summary.vue`

```ts
<script setup lang="ts">
  import Chart, { type ChartRange, type ChartSeries } from '@aziontech/webkit/chart'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import type { EventsExplorerSummary } from '../view-events-explorer.vue'

  export interface LogSummaryProps {
    /** Skeletons hold the numbers and the chart. */
    loading: boolean
    /** The numbers above the chart. */
    summary: EventsExplorerSummary
    /** The share of errors, as the Errors number reads it out. */
    errorShareLabel: string
    /** One stacked series per level. */
    series: ChartSeries[]
    /** Start of each bar. */
    labels: Date[]
    /** Writes a bar start on the axis. */
    formatLabel: (value: unknown) => string
    /** Name of the chart. */
    chartLabel: string
  }

  defineProps<LogSummaryProps>()

  const emit = defineEmits<{
    'select-range': [span: ChartRange | null]
  }>()

  const { formatNumber } = useLocale()
</script>

<template>
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
            <bdi
              v-else
              dir="ltr"
              data-testid="log-summary__request-time"
              >{{
                summary.avgRequestTimeMs === null
                  ? '—'
                  : formatNumber(summary.avgRequestTimeMs, {
                      style: 'unit',
                      unit: 'millisecond',
                      unitDisplay: 'short'
                    })
              }}</bdi
            >
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
      :series="series"
      :labels="labels"
      :format-label="formatLabel"
      :height="80"
      :aria-label="chartLabel"
      @update:range="(span: ChartRange | null) => emit('select-range', span)"
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
        <template #footer>Click to filter to this bucket, or drag to select a span.</template>
      </Chart.Tooltip>
    </Chart>
  </section>
</template>
```

## `parts/recent-queries.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item-root'
  import Popover from '@aziontech/webkit/popover'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { QueryEntry } from '../lib/event-query'

  export interface RecentQueriesProps {
    /** The last queries run, newest first. */
    entries: QueryEntry[]
  }

  defineProps<RecentQueriesProps>()

  const emit = defineEmits<{
    apply: [entry: QueryEntry]
    clear: []
  }>()

  const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <Popover
    v-model:open="open"
    side="bottom"
    align="end"
    size="small"
  >
    <Popover.Trigger>
      <Tooltip content="Recent queries">
        <IconButton
          icon="az az-history"
          variant="outline"
          size="medium"
          aria-label="Recent queries"
          data-testid="recent-queries__trigger"
        />
      </Tooltip>
    </Popover.Trigger>
    <Popover.Content>
      <div
        class="flex flex-col gap-(--spacing-xs) p-(--spacing-2xs)"
        data-testid="recent-queries"
      >
        <h2 class="px-(--spacing-xs) pt-(--spacing-2xs) text-label-sm text-(--text-muted)">
          Recent queries
        </h2>
        <ul
          v-if="entries.length"
          class="flex flex-col"
          aria-label="Recent queries"
        >
          <li
            v-for="entry in entries"
            :key="entry.text"
          >
            <Item
              clickable
              variant="option"
              data-testid="recent-queries__apply"
              @click="emit('apply', entry)"
            >
              <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
                <i
                  class="az az-history shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <span class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-default)">
                  {{ entry.text }}
                </span>
              </span>
            </Item>
          </li>
        </ul>
        <p
          v-else
          class="px-(--spacing-xs) text-body-sm text-(--text-muted)"
        >
          Queries you run appear here.
        </p>
        <div
          v-if="entries.length"
          class="border-t border-(--border-default) pt-(--spacing-2xs)"
        >
          <Button
            label="Clear history"
            variant="ghost"
            size="small"
            data-testid="recent-queries__clear"
            @click="emit('clear')"
          />
        </div>
      </div>
    </Popover.Content>
  </Popover>
</template>
```

## `parts/saved-queries.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item-root'
  import Popover from '@aziontech/webkit/popover'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { SavedQuery } from '../lib/event-query'

  export interface SavedQueriesProps {
    /** The saved queries, in order. */
    entries: SavedQuery[]
    /** What the last action did. */
    status: string
    /** A name is typed and a query is applied. */
    canSave: boolean
  }

  defineProps<SavedQueriesProps>()

  const emit = defineEmits<{
    apply: [entry: SavedQuery]
    delete: [entry: SavedQuery]
    save: []
  }>()

  const open = defineModel<boolean>('open', { required: true })
  const name = defineModel<string>('name', { required: true })
</script>

<template>
  <Popover
    v-model:open="open"
    side="bottom"
    align="end"
    size="small"
  >
    <Popover.Trigger>
      <Tooltip content="Saved queries">
        <IconButton
          icon="az az-bookmark"
          variant="outline"
          size="medium"
          aria-label="Saved queries"
          data-testid="saved-queries__trigger"
        />
      </Tooltip>
    </Popover.Trigger>
    <Popover.Content>
      <div
        class="flex flex-col gap-(--spacing-xs) p-(--spacing-2xs)"
        data-testid="saved-queries"
      >
        <h2 class="px-(--spacing-xs) pt-(--spacing-2xs) text-label-sm text-(--text-muted)">
          Saved queries
        </h2>
        <ul
          v-if="entries.length"
          class="flex flex-col"
          aria-label="Saved queries"
        >
          <li
            v-for="entry in entries"
            :key="entry.id"
            class="flex min-w-0 items-center gap-(--spacing-2xs)"
          >
            <Item
              clickable
              variant="option"
              class="min-w-0 flex-1"
              data-testid="saved-queries__apply"
              @click="emit('apply', entry)"
            >
              <span class="flex min-w-0 flex-1 flex-col items-start">
                <span class="max-w-full truncate text-label-sm text-(--text-default)">
                  {{ entry.name }}
                </span>
                <span class="max-w-full truncate text-label-code-sm text-(--text-muted)">
                  {{ entry.text }}
                </span>
              </span>
            </Item>
            <Tooltip content="Delete">
              <IconButton
                icon="az az-trash"
                variant="ghost"
                size="small"
                :aria-label="`Delete ${entry.name}`"
                data-testid="saved-queries__delete"
                @click="emit('delete', entry)"
              />
            </Tooltip>
          </li>
        </ul>
        <p
          v-else
          class="px-(--spacing-xs) text-body-sm text-(--text-muted)"
        >
          No saved queries yet. Name the current query to keep it.
        </p>
        <div
          class="flex items-center gap-(--spacing-xs) border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-xs)"
        >
          <div class="min-w-0 flex-1">
            <Input
              v-model="name"
              size="small"
              placeholder="Name the current query"
              aria-label="Name for the current query"
              class="w-full"
              data-testid="saved-queries__name"
              @keydown.enter.prevent="emit('save')"
            />
          </div>
          <Button
            label="Save"
            variant="secondary"
            size="small"
            :disabled="!canSave"
            data-testid="saved-queries__save"
            @click="emit('save')"
          />
        </div>
        <p
          role="status"
          class="sr-only"
        >
          {{ status }}
        </p>
      </div>
    </Popover.Content>
  </Popover>
</template>
```
