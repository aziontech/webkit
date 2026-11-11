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

### F. Log — `TableRoot`, `Tag`, `EmptyState` (required)

Above the table, a summary `dl` of Events, Errors and Avg request time, and the stacked volume chart by level. Clicking a bucket filters the period to it and dragging selects a span; the arrow keys step through buckets and Enter applies one. Below it the event `TableRoot`, `paginated` at 25 rows, with a detail column first, Level as a `Tag`, and the columns chosen in the fields panel. Its empty slot picks one small `EmptyState`: no traffic yet, no match for the search, or nothing in the window.

### G. Event document — `Sidebar`, `Tooltip`, `IconButton`, `Tag`, `CodeBlock` (required)

Clicking a row opens the event in a resizable end `Sidebar` beside the log when the explorer is wide enough for the fields panel, the log and the document. Its header shows the level and source as `Tag`s and a small Close `IconButton` in a `Tooltip`; the body lists the fields and ends with the full event in a `CodeBlock` that copies it as JSON.

### H. Narrow document — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `DrawerClose`, `Tag`, `CodeBlock` (required)

Below that width the same document opens in a medium right `Drawer` titled Event, with `PanelHeader`, `DrawerTitle` and `DrawerClose`. Crossing the breakpoint moves an open event between the pane and the drawer instead of closing it.

## Do

- Drive the summary, the chart and the table from one filtered set, so every number agrees.
- Let a click or drag on the chart set the period, and show the period as a filter the user can clear.
- Keep the row selected while its document is open, and switch between pane and drawer by the explorer's width, not the viewport's.
- Count applied fields on the Filter `Badge` and show each one as a `Chip` in field order.
- Pick the empty message that matches why the log is empty.

## Don't

- Don't navigate away to read one event; the document opens beside the log.
- Don't add a second filter surface (a row of `Select`s, a filter bar in the fields panel) beside the Filter popover.
- Don't hide the controls row or the summary when the log is empty.
- Don't encode level by colour alone; the chart has a card with level names and counts, and the table shows level as text.
- Don't let a wide log scroll the page sideways.

## Copy

- **Search:** placeholder names what is searched, e.g. "Search events, hosts, paths or addresses"; `aria-label` "Search events".
- **Summary labels:** short nouns, e.g. "Events", "Errors", "Avg request time".
- **Chart hint:** one instruction, e.g. "Click to filter to this bucket, or drag to select a span."
- **Empty log:** title states the fact and the description says what to do, e.g. "No events in this window" with "Widen the period or clear a filter to see more of the log."
- **Fields panel:** controls name the panel, e.g. "Hide the fields panel", "Show the fields panel".
- **Document:** drawer title "Event"; close button "Close the event document".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- One `main` landmark holds the explorer; each `Sidebar` is named (Fields, Event document) with its own collapse, expand and resize labels.
- The chart is one focusable control with an `aria-label`; arrow keys move between buckets, Enter or Space applies one, the hover card is a `role="status"`, and a visually hidden summary describes the whole chart.
- The Errors value carries an `aria-label` with its share of all events.
- Every icon-only button has an `aria-label`; the filter `Badge` and decorative glyphs are `aria-hidden="true"`.
- Value options in the popovers expose `aria-checked`, so applied values are announced.
- The document drawer traps focus while open and closes on Escape; motion is turned off under `prefers-reduced-motion`.

## States

- Default: live traffic with the summary, the chart and the log filled, and no filters applied.
- Filtered: errors from the Security and Access Control sources; the Filter button counts three fields and each shows as a chip.
- Empty: a workspace with no traffic yet; the summary reads zero, the chart is flat and the log shows No events yet.

## Related

- `platform/view/table-view` — the same controls row over a resource list.
- `platform/detail/deployment-logs` — logs of one deployment run.
- `platform/dashboard/data-dashboard` — the metrics view for the same traffic.
- `shells/console` — the shell this explorer sits in.
- `TableRoot` — the log table; see `skills/webkit-tables`, `skills/webkit-data-viz` and `skills/webkit-ui-states`.
