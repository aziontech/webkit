# Split view

The events explorer. The user comes here to answer what happened on their traffic: how many events, how many errors, when they spiked, and what one event looked like in full. They narrow the log by fields and time, scan the rows, and open one event beside the log without losing their place. The fields, the log and the event document are three panes of one workspace, and every filter acts on all of them at once.

## When to use

- Events or logs explored over time, where the volume chart and the rows must agree on one period and one set of filters.
- Users pivot on field values (level, source, status, host) to find a pattern, then read one event's full document.
- The record has more fields than a table row can hold, so the full document opens beside the list instead of in a details page.

## When not to use

- A first-level list of resources the user creates and manages: use `platform/view/table-view`.
- The log of one deployment or build run: use `platform/detail/deployment-logs`.
- Metrics and charts without a row-level log: use `platform/dashboard/data-dashboard`.
- Files and folders of a storage resource: use `platform/view/file-browser`.
- Querying a database with SQL: use `platform/view/query-editor`.

## Building blocks

### A. Console shell — `Sidebar`, `Brand`, `Command`, `Menu`, `Avatar`, `DropdownMenu`, `Tooltip`, `IconButton`, `ThemeSwitcher`, `Button`, `StatusIndicator`, `GlobalHeader`, `Kbd`, `ButtonHighlight`, `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent` (required)

The platform shell with the Events navigation entry active: the resizable, collapsible `Sidebar` with `Brand`, `Menu` and the account footer; the `GlobalHeader` with the `Command` palette and its `Kbd` hint, Create and the Agent `ButtonHighlight`; and on a phone the same navigation in a right `Drawer`. The explorer fills the rest of the viewport with no page heading.

### B. Filter popover — `Popover`, `Button`, `Badge`, `CalendarRoot`, `Input` (required)

An outlined medium Filter `Button` opens one `Popover` placed `bottom-start`: the field list first, then the values of the chosen field with their counts. A small `Badge` on the trigger counts applied fields. The period offers presets and a `CalendarRoot` range; the popover stays open while the calendar is open. Long value lists get their own search `Input`.

### C. Search and toolbar — `Input`, `Tooltip`, `IconButton` (required)

A medium search `Input` across events, hosts, paths and addresses, then outlined medium `IconButton`s for Refresh and Download CSV, each named by a `Tooltip` and an `aria-label` with the same words.

### D. Applied filters — `Chip` (optional)

One medium `Chip` per applied field under the controls row. A chip summarizes its values, reopens the popover on its field and can be removed. The row wraps; it never scrolls sideways.

### E. Fields panel — `Sidebar`, `Input`, `Checkbox`, `Popover`, `Accordion`, `Tag` (optional)

A resizable, collapsible start `Sidebar` named Fields with its own Search fields `Input`. Core fields sit on top; the rest are grouped by category in an `Accordion`, each category trigger carrying a small `Tag` with its applied count. Each field has a `Checkbox` that shows or hides its column in the log, and a `Popover` of its top values that applies a value as a filter. The panel hides when the explorer is narrower than the panel plus the log.

### F. Log — `Chart`, `TableRoot`, `Tag`, `EmptyState` (required)

Above the table, a summary `dl` of Events, Errors and Avg request time, and the stacked volume `Chart` by level (`Chart.Bar stacked` with `Chart.Brush`, bound to `v-model:range`). Clicking a bucket filters the period to it and dragging selects a span; the arrow keys step through buckets and Enter applies one. Below it the event `TableRoot`, `paginated` at 25 rows, with a detail column first, Level as a `Tag`, and the columns chosen in the fields panel. Its empty slot picks one small `EmptyState`: no traffic yet, no match for the search, or nothing in the window.

### G. Event document — `Sidebar`, `Tooltip`, `IconButton`, `Tag`, `CodeBlock` (required)

Clicking a row opens the event in a resizable end `Sidebar` beside the log when the explorer is wide enough for the fields panel, the log and the document. Its header shows the level and source as `Tag`s and a small Close `IconButton` in a `Tooltip`; the body lists the fields and ends with the full event in a `CodeBlock` that copies it as JSON.

### H. Narrow document — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `DrawerClose`, `Tag`, `CodeBlock` (required)

Below that width the same document opens in a medium right `Drawer` titled Event, with `PanelHeader`, `DrawerTitle` and `DrawerClose`. Crossing the breakpoint moves an open event between the pane and the drawer instead of closing it.

The fields panel (E) is the `split-view#Fields` piece of the inventory; it lives in the primary and every variant, so it has no variant of its own.

### I. Query bar — `Tooltip`, `IconButton` (optional)

Variant Query only; it adds `PropertyFilter` (`mode="query"`) and `DateRangePicker` to the page, in place of the Filter popover and the search field.

For people who type their questions. `DateRangePicker` replaces the Period field of the Filter popover: relative ranges (Last 15 minutes to Last 24 hours), an absolute range typed in the chosen time zone and bounded to the retained days, and Previous and Next, which move the window by its own length. The times in the log, the chart axis and the document follow that zone. `PropertyFilter` in query mode replaces both the Filter popover and the search field: one query string (`level = Error AND host = api.example.com`), suggestions for the word at the caret, the reason under the field when the query is invalid, and the match count. Enter applies it; a query that mixes AND and OR shows a message instead of guessing. A value picked in the fields panel adds or removes its `field = value` clause, so the panel and the query never disagree.

### J. Saved and recent queries — `Popover`, `IconButton`, `Input`, `Button`, `Tooltip` (optional)

Variant Query only.

Two outlined `IconButton`s beside the bar open a `Popover` each. Saved queries lists name and query text, applies one on click, deletes one with a small Delete button, and saves the applied query under a typed name. Recent queries lists the last eight queries run, newest first, with Clear history. Applying an entry fills the bar and runs it.

### K. Investigation tabs — `IconButton`, `DropdownMenu`, `Input`, `Tooltip` (optional)

Variant Sessions only; it adds `Tabs` to the page.

Above the controls row, one tab per open investigation; each keeps its own filters, search and period, and switching tabs closes the open document. New investigation (a transparent `IconButton`) adds a tab, up to five; past the limit a status line says to close one. The actions `DropdownMenu` renames, duplicates or closes the active tab. Rename opens an inline `Input` over the tab (also F2 or a double click on it): Enter keeps the name, Escape restores it. Each tab is `closable` while more than one is open: the × on the tab closes it with the pointer, and Delete on the focused tab closes it from the keyboard (the tab announces the shortcut through `aria-keyshortcuts`); focus moves to the tab before it. The last tab cannot be closed. The × is not a separate focusable button: inside a `tablist` anything focusable that is not a tab fails `aria-required-children`, so the keyboard path is Delete, as in the WAI-ARIA tabs pattern, and the actions menu keeps Close investigation for discovery.

### L. Document tools — `Input`, `IconButton`, `Tooltip`, `Chip` (optional)

Variant EventDocument only; it adds `CopyButton` to the page.

The document lists every field of the event. Search in this event narrows the list to fields whose name or value matches and highlights the match. Each filterable value has Filter by (keep only events with it) and Exclude (hide them) buttons that apply to the log; an exclusion shows as a `Host is not legacy.example.com` chip with the other filters. Copy copies the fields shown as JSON; the full JSON document stays below.

## Do

- Drive the summary, the chart and the table from one filtered set, so every number agrees.
- Let a click or drag on the chart set the period, and show the period as a filter the user can clear.
- Keep the row selected while its document is open, and switch between pane and drawer by the explorer's width, not the viewport's.
- Count applied fields on the Filter `Badge` and show each one as a `Chip` in field order.
- Pick the empty message that matches why the log is empty.
- In query mode, keep the applied query text as the user typed it, and save and list that text.
- Keep each investigation tab self-contained: its own filters, search and period.
- Let the document act on the log (Filter by, Exclude), so a pivot is one click from the value.

## Don't

- Don't navigate away to read one event; the document opens beside the log.
- Don't add a second filter surface (a row of `Select`s, a filter bar in the fields panel) beside the Filter popover.
- Don't hide the controls row or the summary when the log is empty.
- Don't encode level by colour alone; the chart has a card with level names and counts, and the table shows level as text.
- Don't let a wide log scroll the page sideways.
- Don't offer the query bar and the Filter popover at once; pick the one that fits the users.
- Don't guess the meaning of a query that mixes AND and OR; say so and let the user fix it.
- Don't let investigation tabs grow without a limit, and never close the last one.

## Copy

- **Search:** placeholder names what is searched, e.g. "Search events, hosts, paths or addresses"; `aria-label` "Search events".
- **Summary labels:** short nouns, e.g. "Events", "Errors", "Avg request time".
- **Chart hint:** one instruction, e.g. "Click to filter to this bucket, or drag to select a span."
- **Empty log:** title states the fact and the description says what to do, e.g. "No events in this window" with "Widen the period or clear a filter to see more of the log."
- **Fields panel:** controls name the panel, e.g. "Hide the fields panel", "Show the fields panel".
- **Document:** drawer title "Event"; close button "Close the event document".
- **Query bar:** `aria-label` "Query events"; placeholder with one real example; the range "Events time range".
- **Saved queries:** "Name the current query", Save, "Delete <name>"; empty "No saved queries yet. Name the current query to keep it."
- **Tabs:** "New investigation", "Actions for <name>", Rename, Duplicate, "Close investigation"; limit "Up to 5 investigations stay open. Close one to start another."
- **Document tools:** "Search in this event", "Filter by <field> <value>", "Exclude <field> <value>", "Copy the fields shown as JSON"; no match "No field matches “<text>”."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- One `main` landmark holds the explorer; each `Sidebar` is named (Fields, Event document) with its own collapse, expand and resize labels.
- The chart is one focusable control with an `aria-label`; arrow keys move between buckets, Enter or Space applies one, the hover card is a `role="status"`, and a visually hidden summary describes the whole chart.
- The Errors value carries an `aria-label` with its share of all events.
- Every icon-only button has an `aria-label`; the filter `Badge` and decorative glyphs are `aria-hidden="true"`.
- Value options in the popovers expose `aria-checked`, so applied values are announced.
- The document drawer traps focus while open and closes on Escape; motion is turned off under `prefers-reduced-motion`.
- Query: the bar is a `combobox` whose invalid state sets `aria-invalid` and points `aria-describedby` at the reason; the mixed AND / OR message and the saved-query confirmations are `role="status"`.
- Sessions: the tabs follow the `Tabs` keyboard map (arrows, Home, End); F2 renames and Delete closes the focused tab, and the same actions sit in a named menu for pointer and screen-reader users; focus returns to the tab after rename or close.
- EventDocument: Filter by and Exclude are toggle buttons (`aria-pressed`) named with the field and value; the match count of the document search is announced in a `role="status"`.

## States

- Default: live traffic with the summary, the chart and the log filled, and no filters applied.
- Filtered: errors from the Security and Access Control sources; the Filter button counts three fields and each shows as a chip.
- Empty: a workspace with no traffic yet; the summary reads zero, the chart is flat and the log shows No events yet.
- Failed: the event request failed; the fields panel stays and the log pane shows a danger `Alert` that says the events did not load, with Retry.
- Query: `level = Error AND host = api.example.com` over the last 24 hours, with two saved and two recent queries.
- Sessions: three investigation tabs, API errors active.
- EventDocument: an error event's document open, with Host is not legacy.example.com applied.

## Related

- `platform/view/table-view` — the same controls row over a resource list.
- `platform/detail/deployment-logs` — logs of one deployment run.
- `platform/dashboard/data-dashboard` — the metrics view for the same traffic.
- `shells/console` — the shell this explorer sits in.
- `TableRoot` — the log table; see `skills/webkit-tables`, `skills/webkit-data-viz` and `skills/webkit-ui-states`.
