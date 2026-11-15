# Split view

The events explorer. The user comes here to answer what happened on their traffic: how many events, how many errors, when they spiked, and what one event looked like in full. They narrow the log by fields and time, scan the rows, and open one event beside the log without losing their place. The fields, the log and the event document are three panes of one workspace, and every filter acts on all of them at once.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/console`), which owns the rail, the header and the `main`. The explorer is a workspace: its root carries `data-layout-fill`, so the layout's `main` stops scrolling, the root fills it, and the fields panel, the log and the event document each scroll on their own at every width (`h-dvh` only sizes a standalone preview).

## When to use

- Events or logs explored over time, where the volume chart and the rows must agree on one period and one set of filters.
- Users pivot on field values (level, source, status, host) to find a pattern, then read one event's full document.
- The record has more fields than a table row can hold, so the full document opens beside the list instead of in a details page.

## When not to use

- A first-level list of resources the user creates and manages: use `view/table-view`.
- The log of one deployment or build run: use `detail/deployment-logs`.
- Metrics and charts without a row-level log: use `dashboard/analytics-dashboard`.
- Files and folders of a storage resource: use `view/file-browser`.
- Querying a database with SQL: use `view/query-editor`.

## Building blocks

### A. Filter — `FilterMenu` (required)

`FilterMenu` bound with `v-model="filters"` and `:fields`: the Filter button (counting the applied fields) opens a drill-in menu, the field list first, then the values of the chosen field. Period is a `date` field whose options are the block's presets (Last 15 minutes to Last 24 hours) plus the menu's own Custom range calendar; Source, Level and every field added from the fields panel are `multi` fields. The block maps its filter fields to `FilterMenuField`s and keeps matching the log itself. Do not build a filter popover, its count badge or its value rows by hand.

### B. Search and toolbar — `Input`, `Tooltip`, `IconButton` (required)

A medium search `Input` across events, hosts, paths and addresses, then outlined medium `IconButton`s for Refresh and Download CSV, each named by a `Tooltip` and an `aria-label` with the same words.

### C. Applied filters — `FilterMenu.ChipGroup` (optional)

`FilterMenu.ChipGroup` shares the model and the fields with the menu: one chip per applied field under the controls row, which summarizes its values, reopens the menu on its field and can be removed. The row wraps; it never scrolls sideways.

### D. Fields panel — `Sidebar`, `Input`, `Field`, `Checkbox`, `Popover`, `Item`, `Accordion`, `Tag` (optional)

A resizable, collapsible start `Sidebar` named Fields with its own Search fields `Input`. Core fields sit on top; the rest are grouped by category in an `Accordion`, each category trigger carrying a small `Tag` with its applied count. Each field has a `Checkbox` that shows or hides its column in the log, and a `Popover` of its top values, each an option `Item` (`clickable`, `variant="option"`, `aria-pressed` while applied) with its count, that applies the value as a filter. The panel hides when the explorer is narrower than the panel plus the log.

### E. Log — `Chart`, `Skeleton`, `DataTable`, `Tag`, `EmptyState` (required)

Above the table, a summary `dl` of Events, Errors and Avg request time, and the stacked volume `Chart` by level (`Chart.Bar type="histogram" stacked`: solid columns that touch, one per time bucket, with `Chart.Brush`, bound to `v-model:range`). Each level wears its step of the severity ramp (Error `severity-critical`, Warning `severity-medium`, Info `severity-low`, Debug `severity-info`), and `Chart.Tooltip total` lists every level in the bucket with a Total row under them and a footer hint: Click to filter to this bucket, or drag to select a span. Dragging across the chart selects a span and filters the period to it; from the keyboard the arrow keys step through buckets, Shift with the arrows extends a span and Enter applies it. The primary and every variant (Query, Sessions, EventDocument included) use this same `Chart`; no variant draws its own bars. Below it the event `DataTable`, `paginated` at 25 rows, with a detail column first, Level as a small `Tag` in the level's severity, and the columns chosen in the fields panel. Its empty slot picks one small `EmptyState`: no traffic yet, no match for the search, or nothing in the window.

### F. Event document — `Resizable`, `Tooltip`, `IconButton`, `Tag`, `CodeBlock` (required)

Each row's detail cell is an `IconButton` named Open event <id> with `aria-expanded`, so a keyboard user opens an event with Tab and Enter; a row click does the same for a pointer. When the explorer is wide enough for the fields panel, the log and the document, the event opens in the end pane of a horizontal `Resizable` (`Resizable.Handle` named Resize the event panel, the pane 320 to 512 px, collapsed while no event is open), so the handle sits on the inner edge and dragging it inward widens the document. Its header holds the Event heading and a small Close `IconButton` in a `Tooltip`; the body shows the level and source as small `Tag`s, lists the fields and ends with the full event in a `CodeBlock` that copies it as JSON.

### G. Narrow document — `Drawer`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `Tag`, `CodeBlock` (required)

Below that width the same document opens in a large right `Drawer` titled Event, with `PanelHeader`, `DrawerTitle` and the drawer's own close button. Crossing the breakpoint moves an open event between the pane and the drawer instead of closing it.

The fields panel (D) is the `split-view#Fields` piece of the inventory; it lives in the primary and every variant, so it has no variant of its own.

### H. Query bar — `Tooltip`, `IconButton` (optional)

Variant Query only; it adds `PropertyFilter` (`mode="query"`) and `DateRangePicker` to the page, in place of the Filter popover and the search field.

For people who type their questions. `DateRangePicker` replaces the Period field of the Filter popover: relative ranges (Last 15 minutes to Last 24 hours), an absolute range typed in the chosen time zone and bounded to the retained days, and Previous and Next, which move the window by its own length. The times in the log, the chart axis and the document follow that zone. `PropertyFilter` in query mode replaces both the Filter popover and the search field: one query string (`level = Error AND host = api.example.com`), suggestions for the word at the caret, the reason under the field when the query is invalid, and the match count. Enter applies it; a query that mixes AND and OR shows a message instead of guessing. A value picked in the fields panel adds or removes its `field = value` clause, so the panel and the query never disagree.

### I. Saved and recent queries — `Popover`, `IconButton`, `Input`, `Item`, `Tooltip` (optional)

Variant Query only.

Two outlined `IconButton`s beside the bar open a `Popover` each. Saved queries lists name and query text, applies one on click, deletes one with a small Delete button, and saves the applied query under a typed name. Recent queries lists the last eight queries run, newest first, with Clear history. Applying an entry fills the bar and runs it.

### J. Investigation tabs — `IconButton`, `Input`, `Tooltip` (optional)

Variant Sessions only; it adds `Tabs` and `DropdownMenu` to the page.

Above the controls row, one tab per open investigation; each keeps its own filters, search and period, and switching tabs closes the open document. New investigation (a transparent `IconButton`) adds a tab, up to five; past the limit a status line says to close one. The actions `DropdownMenu` renames, duplicates or closes the active tab. Rename opens an inline `Input` over the tab (also F2 or a double click on it): Enter keeps the name, Escape restores it. Each tab is `closable` while more than one is open: the × on the tab closes it with the pointer, and Delete on the focused tab closes it from the keyboard (the tab announces the shortcut through `aria-keyshortcuts`); focus moves to the tab before it. The last tab cannot be closed. The × is not a separate focusable button: inside a `tablist` anything focusable that is not a tab fails `aria-required-children`, so the keyboard path is Delete, as in the WAI-ARIA tabs pattern, and the actions menu keeps Close investigation for discovery.

### K. Document tools — `Input`, `IconButton`, `Tooltip` (optional)

Variant EventDocument only; it adds `CopyButton` to the page.

The document lists every field of the event. Search in this event narrows the list to fields whose name or value matches and highlights the match. Each filterable value has Filter by (keep only events with it) and Exclude (hide them) buttons that apply to the log; an exclusion shows as a `Host is not legacy.example.com` chip with the other filters. Copy copies the fields shown as JSON; the full JSON document stays below.

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
- The document drawer traps focus while open and closes on Escape; motion is turned off under `prefers-reduced-motion`.
- Query: the bar is a `combobox` whose invalid state sets `aria-invalid` and points `aria-describedby` at the reason; the mixed AND / OR message and the saved-query confirmations are `role="status"`.
- Sessions: the tabs follow the `Tabs` keyboard map (arrows, Home, End); F2 renames and Delete closes the focused tab, and the same actions sit in a named menu for pointer and screen-reader users; focus returns to the tab after rename or close.
- EventDocument: Filter by and Exclude are toggle buttons (`aria-pressed`) named with the field and value; the match count of the document search is announced in a `role="status"`.

## States

- Default: live traffic with the summary, the chart and the log filled, and no filters applied; while Refresh runs the summary values and the chart show `Skeleton`s and the table its loading rows.
- Loading: the first load; `Skeleton`s hold the summary values and the chart band and the table shows its loading rows.
- Filtered: errors from the Security and Access Control sources; the Filter button counts three fields and each shows as a `FilterMenu.ChipGroup` chip.
- Empty: a workspace with no traffic yet; the summary reads zero, the chart is flat and the log shows No events yet.
- Error: the event request failed; the fields panel stays and the log pane shows a danger `Alert` that says the events did not load, with Retry, which reruns the request like Refresh.
- Query: `level = Error AND host = api.example.com` over the last 24 hours, with two saved and two recent queries.
- Sessions: three investigation tabs, API errors active.
- EventDocument: an error event's document open, with Host is not legacy.example.com applied.

## Related

- `view/table-view` — the same controls row over a resource list.
- `detail/deployment-logs` — logs of one deployment run.
- `dashboard/analytics-dashboard` — the metrics view for the same traffic.
- `shell/console` — the layout this explorer renders in.
- `DataTable` — the log table; see `skills/webkit-tables`, `skills/webkit-data-viz` and `skills/webkit-ui-states`.
