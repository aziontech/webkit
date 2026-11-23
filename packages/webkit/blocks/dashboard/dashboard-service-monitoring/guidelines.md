# Service monitoring dashboard

The page an on-call engineer keeps open: is every service up, how fast is it answering, how many
requests fail, and which alerts are open right now. One tile per service states its p95 latency and
its state in words; latency percentiles and error rates sit in two charts read over one window; the
open alerts live in a rail on the right that scrolls on its own, so the alerts stay in view while the
reader studies a chart.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`. Its root carries `data-layout-fill`, so the layout's `main` stops scrolling and the root fills it: from `xl` the charts column and the alerts rail scroll on their own; below `xl` the root itself scrolls, so the page still scrolls as one (`h-dvh` only sizes a standalone preview).

## When to use

- Use dashboard-service-monitoring for latency percentiles, error rates and live state per service.
- The reader watches a known set of services for state changes and threshold breaches.
- Latency percentiles and error rates matter more than volume.
- Open alerts need to stay visible next to the evidence.

## When not to use

- Volume and status codes over a longer period: use `dashboard/dashboard-analytics`.
- Alert triage by severity with a full queue and trends: use `dashboard/dashboard-alerts`.
- One experience score with bands: use `dashboard/dashboard-health-score`.

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

### L. Load failure — `Alert` (required)

When `error` is set, one danger `Alert` under the page heading says `Couldn't load <page>.` followed by the message, with Retry, which emits `retry`. Every region keeps its header and shows a quiet `Not available.` line in place of its content, and each tile shows a dash over a neutral `Couldn't load` band, so one failed request reads as one problem instead of a wall of red banners.

## Data

The block takes its records through props and emits every action; it fetches nothing. `ServiceMonitoringService`, `ServiceMonitoringSeriesData`, `ServiceMonitoringAlert`, `ServiceMonitoringWindow` and `ServiceMonitoringDashboardProps` are exported from `dashboard-service-monitoring.vue`, and `sample.ts` holds the sample services, series and alerts the block renders when a data prop is left out (and never while `loading` or `error` is set).

| Prop / model     | Type                          | What it does                                                                                                                   |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `services`       | `ServiceMonitoringService[]`  | One tile per service. A service with `latency: null` shows a dash and no state.                                                |
| `latency`        | `ServiceMonitoringSeriesData` | The `p50`, `p95` and `p99` lines over the window. No series is the `No traffic yet` empty chart.                               |
| `errorRate`      | `ServiceMonitoringSeriesData` | The `Status 4xx` and `Status 5xx` lines over the window.                                                                       |
| `alerts`         | `ServiceMonitoringAlert[]`    | The open alerts in the rail. Pass `[]` for `No open alerts`.                                                                   |
| `loading`        | `boolean`                     | The window is loading: the tiles, both charts and the rail hold Skeletons; the window switch stays usable.                     |
| `error`          | `string`                      | Why the period could not load; one danger `Alert` under the heading shows it with Retry, and the regions show `Not available.` |
| `v-model:window` | `'1h' \| '6h' \| '24h'`       | The window every tile and chart reads; refetch when it changes. Defaults to `24h`.                                             |

| Event   | Payload   | When                             |
| ------- | --------- | -------------------------------- |
| `retry` | `(event)` | Retry in the page's error alert. |

Each alert row links to `/alerts/<id>`; point it at your alert page. To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import DashboardServiceMonitoring, {
    type ServiceMonitoringWindow
  } from './dashboard-service-monitoring.vue'

  const range = ref<ServiceMonitoringWindow>('24h')
  const { data, pending, error, refresh } = useServiceMetrics(range)
</script>

<template>
  <DashboardServiceMonitoring
    v-model:window="range"
    :services="data?.services ?? []"
    :latency="data?.latency"
    :error-rate="data?.errorRate"
    :alerts="data?.alerts ?? []"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

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
- Loading: `loading`; every tile, both charts and the rail hold Skeletons; the window switch stays usable.
- Empty: no traffic yet (`latency: null` per service, no series, `alerts: []`); tiles show a dash, both charts say metrics appear once a service serves requests, and the rail reads `No open alerts`.
- Error: `error` is set; one danger `Alert` under the heading names what did not load, carries the message and offers Retry; tiles show a dash over a quiet band and every region keeps its header over `Not available.`

## Related

- `dashboard/dashboard-alerts` — the full alert queue with severity trends.
- `dashboard/dashboard-health-score` — the same services as one experience score.
- `dashboard/dashboard-analytics` — volume and status codes over a longer period.
