# Service monitoring dashboard

The page an on-call engineer keeps open: is every service up, how fast is it answering, how many
requests fail, and which alerts are open right now. One tile per service states its p95 latency and
its state in words; latency percentiles and error rates sit in two charts read over one window; the
open alerts live in a rail on the right that scrolls on its own, so the alerts stay in view while the
reader studies a chart.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/console`), which owns the rail, the header and the `main`. Its root carries `data-layout-fill`, so the layout's `main` stops scrolling and the root fills it: from `xl` the charts column and the alerts rail scroll on their own; below `xl` the root itself scrolls, so the page still scrolls as one (`h-dvh` only sizes a standalone preview).

## When to use

- Use service-monitoring-dashboard for latency percentiles, error rates and live state per service.
- The reader watches a known set of services for state changes and threshold breaches.
- Latency percentiles and error rates matter more than volume.
- Open alerts need to stay visible next to the evidence.

## When not to use

- Volume and status codes over a longer period: use `dashboard/analytics-dashboard`.
- Alert triage by severity with a full queue and trends: use `dashboard/alerts-dashboard`.
- One experience score with bands: use `dashboard/health-score-dashboard`.

## Building blocks

### A. Page heading and window — `PageHeader` (required)

Title `Service monitoring` with one sentence on what the page shows, in the standard `layout-column`
of the charts pane. Its actions hold the one window control (section F) that every tile and chart reads.

### B. Service tiles — `StatTile` (required)

One tile per service: its name, p95 latency, the change `p95 latency vs previous 24 hours` and a
sparkline. Latency rising is bad, so every tile passes `inverse`.

### C. Service state — `StatusIndicator` (required)

In each tile's aside: `Operational`, `Degraded` or `Down`, with its status color. The state is a word,
so a tile is never read by color alone.

### D. Charts — `ChartCard` (required)

`Latency` and `Error rate`, stacked one over the other beside the rail at wide screens.

### E. Definitions — `Hint` (required)

On each chart title, defining the percentiles or the error rate.

### F. Window — `ToggleGroup` (required)

`1h`, `6h`, `24h`, one control in the page heading named `Window`. It drives the tiles' comparison
label (`p95 latency vs previous 6 hours`) and both charts, so every region reads the same window. It
stays usable while the data loads.

### G. Latency and error rate — `Chart` (required)

Multi-series lines: `p50`, `p95`, `p99` for latency; `Status 4xx`, `Status 5xx` for errors. Percentiles
are an ordered set; keep them in that order in the legend and tooltip.

### H. Alert level — `Tag` (required)

The count beside `Open alerts`, and each alert's level (`Critical`, `Warning`, `Info`) with its
severity.

### I. Loading placeholders — `Skeleton` (required)

Holds the rail's rows during the first load.

### J. Alert rail — `Item` (required)

Each open alert is an `Item` with `href` to the alert's page (`/alerts/stage-5xx`) in an `Item.Group`
labelled `Open alerts`: the threshold that tripped (`Status 5xx above 5%`), the service and when it
opened. The whole row is the link. The rail is a fixed-width column that scrolls
independently; under the `xl` breakpoint it folds below the charts and the page scrolls as one.

### K. Empty regions — `EmptyState` (required)

`No traffic yet` / `Latency appears here once a service serves requests.` in the charts, and
`No open alerts` / `Alerts appear here when a service crosses a threshold.` in the rail.

## Do

- Write the service state in words in every tile.
- Keep alerts in a rail that stays in view; fold it below the charts on narrow screens.
- Title an alert with the threshold that tripped, not with a generic name.
- Drive every tile and chart from the one window in the page heading.
- Mark the page root with `data-layout-fill` and let it scroll (`overflow-y-auto`), so the panes scroll on their own at `xl` and the page scrolls as one below it.

## Don't

- Don't average latency into one line; show the percentiles.
- Don't use the status colors for percentile series.
- Don't make the rail scroll the page with it at wide screens.
- Don't give a chart a window of its own.
- Don't hide the rail when there are no alerts; say `No open alerts`.

## Copy

- **Service state:** one word. `Operational`, `Degraded`, `Down`.
- **Delta label:** what is compared. `p95 latency vs previous 24 hours`.
- **Alert title:** metric, comparison, threshold with unit. `p95 latency above 800 ms`.
- **Alert time:** relative. `12 minutes ago`.
- **Empty rail:** `No open alerts` / `Alerts appear here when a service crosses a threshold.`

## Accessibility

- The window `ToggleGroup` is named `Window`; the page has one `h1` from `PageHeader`, and `Open alerts` is an `h2` under it.
- The rail's `Item.Group` has `aria-label="Open alerts"`. An independently scrolling region must be reachable by keyboard.
- The rail's scroll container is a `region` labelled by the `Open alerts` heading with `tabindex="0"`, so a keyboard user can scroll it in every browser.
- State and level are words (`StatusIndicator`, `Tag`), never color alone.
- Latency figures use `tabular-nums`.

## States

- Default: services reporting, both charts populated, open alerts in the rail.
- Loading: every tile, both charts and the rail hold Skeletons; the window switch stays usable.
- Empty: no traffic yet; tiles show a dash, both charts say metrics appear once a service serves requests, and the rail reads `No open alerts`.
- Error: the request failed; tiles show a dash, and both charts and the alert rail show a danger `Alert` that names what did not load and offers Retry.

## Related

- `dashboard/alerts-dashboard` — the full alert queue with severity trends.
- `dashboard/health-score-dashboard` — the same services as one experience score.
- `dashboard/analytics-dashboard` — volume and status codes over a longer period.
