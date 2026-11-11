# Analytics dashboard

The page a developer or operator opens to see how much traffic their services handled and how well
they handled it: requests, data transferred, success rate and server errors for the period, then the
charts and the table that explain those totals. Every tile, chart and the table read the same period,
so one change of range moves every region together. It is the reference grammar for the other
dashboards: KPI row first, a 12-column grid of `ChartCard`s below, one shared card header.

## When to use

- The reader monitors volume and quality of traffic (requests, bytes, status codes) over a period.
- Several metrics share one time window and one set of dimensions (host, country, status code).
- The reader needs to move from a total to the breakdown and then to the rows behind it.

## When not to use

- Usage per project or product, with the previous period overlaid: use
  `platform/dashboard/data-dashboard`.
- Latency percentiles and live service health with an alert rail: use
  `platform/dashboard/service-monitoring-dashboard`.
- Blocked and allowed requests and the rules behind them: use `platform/dashboard/security-dashboard`.
- The reader arranges the cards themselves: use `platform/dashboard/configurable-dashboard`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Analytics` and one sentence on what the page shows, over the rest of the page in the standard
`layout-column`.

### B. KPI row — `StatTile` (required)

Four tiles: `Requests`, `Data transferred`, `Success rate`, `Status 5xx`. Each shows the period total,
a sparkline and the change against the previous period. `Status 5xx` passes `inverse`, because a rise
is a regression.

### C. Metric definitions — `Hint` (required)

Each tile and card title carries a `Hint` with a one-sentence definition
(`Share of requests that ended in a 2xx or 3xx status.`).

### D. Cards — `ChartCard` (required)

Every chart and the table sit in a `ChartCard` on the 12-column grid. `Requests over time` spans the
grid; `Status codes` and `Requests by country` share a row; `Top hosts` closes it. Every card carries
the same header: title with `Hint`, tags, form toggle where it applies, Expand, and the more-options
menu.

### E. Aggregation and variation — `Tag` (required)

`Sum` names the aggregation; a second tag states the change for the period (`+10.03%`). Tags state
facts; they are not buttons.

### F. Line or Bar — `ToggleGroup` (optional)

Switches a time series between Line and Bar. Only on time series, never on a ranked bar chart. Its
`aria-label` names the card (`Chart form for Requests over time`).

### G. Control labels — `Tooltip` (required)

Names each icon-only control on hover and focus (`Expand`, `More options`).

### H. Expand — `IconButton` (optional)

Opens the card at full size. Icon-only, with an `aria-label` that names the card
(`Expand Requests over time`).

### I. More options — `DropdownMenu` (optional)

`Copy query` and `Export CSV`. Secondary actions go here so the header stays one line.

### J. Charts — `Chart` (required)

`Requests over time` as an area, `Status codes` as a multi-series line (2xx, 3xx, 4xx, 5xx), and
`Requests by country` as labeled horizontal bars. The series take the categorical role in declaration
order; reserve the status role for a series whose color means a state.

### K. Table search — `Input` (optional)

Searches `Top hosts` (`Search hosts or services`). It filters this table only, so it sits inside the
card, not in the page header.

### L. Top hosts — `TableRoot` (required)

A searchable, paginated table of hosts with tabular figures, right-aligned numbers.

### M. Empty regions — `EmptyState` (required)

Each card keeps its box with its own empty state: `No traffic yet` /
`Metrics appear here once a service serves requests.` for charts, and `No matching rows` /
`Change the search.` when the table search matches nothing.

## Do

- Keep the KPI row to the four numbers the reader checks first; put the rest in cards.
- Use one card header layout for every card, so the controls are in the same place.
- Let one period drive every region.
- Distinguish "nothing recorded" from "nothing matches the search" in the empty copy.

## Don't

- Don't give a card its own period selector.
- Don't offer Line or Bar on a ranked breakdown; bars are the only form there.
- Don't put more than one search on the page header; table search belongs to its table.
- Don't use status colors for categorical series such as countries or hosts.

## Copy

- **Title:** `Analytics`. **Description:** `Requests, data transferred and errors your services handled in the period.`
- **Card titles:** noun phrase, sentence case. `Requests over time`, `Status codes`, `Top hosts`.
- **Tile labels:** the metric name only. `Data transferred`, never `Data transferred (GB)`; the unit belongs to the value.
- **Hint:** one sentence ending with a period. `Requests that ended in a server error. A rise is a regression.`
- **Menu items:** verb first. `Copy query`, `Export CSV`.
- **Empty state:** `No traffic yet` / `Metrics appear here once a service serves requests.`
- **No-match state:** `No matching rows` / `Change the search.`

## Accessibility

- Every icon-only control has an `aria-label` that names its card, plus a `Tooltip`.
- The `ToggleGroup` is labelled with the card it controls.
- The search `Input` has an `aria-label` equal to its placeholder, since there is no visible label.
- Figures use `tabular-nums`; deltas carry a sign and a word, not color alone.
- Charts expose their table twin and keyboard model through `Chart`; do not replace them with a bare SVG.

## States

- Default: the populated dashboard for the period.
- Loading: every tile, chart and the table hold their place with a `Skeleton`; the grid does not reflow.
- Empty: no traffic in the period; tiles show a dash with no delta or trend, and each card keeps its box with an `EmptyState`.
- Failed: the request for the period failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/data-dashboard` — the same grammar for usage per project, with the previous period overlaid.
- `platform/dashboard/configurable-dashboard` — when the reader arranges the cards.
- `platform/dashboard/service-monitoring-dashboard` — latency percentiles and an alert rail.
- `ChartCard` / `StatTile` — the card and tile every dashboard shares.
