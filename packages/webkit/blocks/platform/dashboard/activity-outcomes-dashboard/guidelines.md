# Activity outcomes dashboard

The page an operator opens to answer "what did these actors ask for, and what did the rules decide?".
It counts every request by its outcome (allowed, blocked, held, approved, denied, over budget), shows
how those outcomes moved over time, breaks them down by actor, category and destination, and ends in
the request log, where each row names the rule that decided it. Every region reads the same filters,
so narrowing the time range or the actor moves the whole page at once.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- A policy or rule engine decides on requests made by a known set of actors (agents, users, service
  accounts) and the reader needs the outcome mix and the evidence behind it.
- The outcomes are exclusive (one request has exactly one outcome), so they can stack.
- The reader needs to go from a total to the individual request and the rule that decided it on one page.

## When not to use

- The page monitors latency or error rates of services, not decisions: use
  `platform/dashboard/service-monitoring-dashboard`.
- The subject is open alerts and their severity rather than every request: use
  `platform/dashboard/alerts-dashboard`.
- The reader only needs the log with filters and no summary: use `platform/view/table-view`.
- Traffic volume per host or country with no decision behind it: use
  `platform/dashboard/analytics-dashboard`.
- WAF traffic blocked by rule sets, with attack categories and source IPs: use
  `platform/dashboard/security-dashboard`. This block is per-actor policy decisions with a request log.

## Building blocks

### A. Page heading and time range — `PageHeader`, `Select` (required)

Title `Request activity` with a one-sentence description of what the page reports. The heading's
actions slot holds the time range `Select` (named `Time range` by its `aria-label`) and the refresh
control. The time range scopes everything else, so it sits with the title, not in the filter row.

### B. Refresh — `IconButton` (optional)

Re-reads the current filters without changing them (the block emits `refresh`). Icon-only, so it
carries `aria-label="Refresh"`. Omit it when the data streams in on its own.

### C. Filters — `FilterMenu` (required)

One `FilterMenu` with three multi-choice fields: Actor, Outcome and Category, in a container labelled
`Filters`, with its `FilterMenu.Chips` on the row below. The filters are global: every tile, chart,
breakdown and the log read them. Never repeat a filter inside a card.

### D. Destination — `Input` (optional)

A text filter beside the menu, named `Destination host` by its `aria-label`, that keeps the requests
whose destination contains the typed host (`api.example.com` as the placeholder).

### E. Clear filters — `Button` (required)

When the filters match no request, the log and the chart show the no-match state with an outlined
`Clear filters` button that empties the menu and the destination.

### F. Outcome tiles — `StatTile` (required)

Seven tiles in a grid labelled `Outcomes`, four per row until the widest screens. Each shows the count
for the range and the delta against the previous period. Pass `inverse` on every outcome where a rise
is bad (blocked, held, denied, over budget) so the delta reads red when it grows.

### G. Metric definitions — `Hint` (required)

One `Hint` per tile and per card title defines the metric in a sentence. Definitions never go in the
label.

### H. Chart and breakdown cards — `ChartCard` (required)

Every chart and the log sit in a `ChartCard` with a title and the same header layout. A card keeps its
box in every state.

### I. Outcomes over time — `Chart` (required)

Stacked bars, one series per exclusive outcome, colored with the status role (allowed success,
blocked danger, held warning): here the color means a state, which is the only case the status
tokens are for. The legend toggles a series and shows its total for the range.

### J. Breakdowns — `BarList` (required)

Three ranked lists (by actor, by category, by destination), each with an `aria-label` naming what it
ranks. Rank by count, largest first.

### K. Outcome in the log — `Table`, `Tag` (required)

Each log row states its outcome as a `Table.CellStatus` in the same status hue as its series in the chart, so the
chart and the log read the same scale. The card header's count (`<n> requests`) is also a `Tag`.

### L. Request log — `TableRoot` (required)

Columns: time, actor, outcome, category, severity, destination, method and the rule that decided it.
Figures and times use tabular numbers. The rule column is what makes the page actionable: the reader
goes from an unexpected block to the rule that caused it.

### M. Severity — `SeverityTag` (required)

The severity of the category a request fell in, on the severity ramp. Do not reuse it for the
outcome; outcome and severity are two different facts.

### N. Empty regions — `EmptyState` (required)

Each chart, breakdown and the log render their own `EmptyState` when the range holds no request
(`No requests in this time range`), keeping the card's box. A filter that matches nothing is a
different state: `No requests match these filters` / `Clear the filters or pick other values.` with
`Clear filters`, and the tiles show a dash.

## Do

- Keep every region on the same filters; a change of range or actor updates the whole page together.
- Stack only outcomes that are exclusive, and keep the series order the same in the chart, the legend,
  the tiles and the tags.
- Mark rising-is-bad tiles as `inverse`.
- Name the deciding rule in every log row.

## Don't

- Don't color a categorical series (actor, category) with a status token.
- Don't put a second filter row inside a card; the page has one set of filters.
- Don't hide an outcome with zero requests from the tiles; show `0` so the set stays complete.
- Don't explain a metric in its label; use the `Hint`.

## Copy

- **Title:** a noun phrase for what is reported. `Request activity`.
- **Description:** one sentence, what the page shows. `What each actor requested through the rules and what the rules decided.`
- **Filter labels:** one or two words, no colon. `Time range`, `Actor`, `Outcome`, `Category`, `Destination host`.
- **No match:** `No requests match these filters` / `Clear the filters or pick other values.`
- **Tile labels:** the outcome name in sentence case. `Over budget`, not `Over Budget (requests)`.
- **Hint:** one sentence defining the metric. `Requests the rules held for a person to approve.`
- **Empty state:** what is missing, then what fills it and what to do. `No requests in this time range` / `Requests the rules evaluate appear here. Widen the time range to see older ones.`
- **Outcome tags:** past participle, one word. `Allowed`, `Blocked`, `Held`.

## Accessibility

- The refresh control is an `IconButton` with `aria-label="Refresh"`.
- The filter container is labelled `Filters`, the tile grid `Outcomes`, each `BarList` names what it ranks.
- `FilterMenu` names its applied count on the Filter button; the time range `Select` and the destination `Input` carry an `aria-label`; the destination placeholder is an example, not the label.
- Outcome is never color alone: the chart legend, the tooltip and the log `Tag` all carry the word.
- Times, counts and deltas use `tabular-nums` so columns do not jitter on refresh.

## States

- Default: the populated page for the selected time range.
- NoMatch (a state of Default): the filters match no request; tiles show a dash, the chart and the log show `No requests match these filters` with `Clear filters`, and the breakdowns empty out.
- Loading: while the range loads, tiles, chart and breakdowns render their own `Skeleton` and the log holds Skeleton rows; nothing reflows.
- Empty: no request in the range; tiles show a dash with no delta, every card keeps its box with an empty state, and the log says to widen the time range.
- Failed: the request for the period failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/alerts-dashboard` — when the reader starts from open alerts instead of every request.
- `platform/dashboard/analytics-dashboard` — the same tiles, chart and table grammar for traffic volume.
- `platform/view/table-view` — the log on its own, as a filterable list page.
- `SeverityTag` / `Tag` — severity and outcome are separate columns with separate scales.
