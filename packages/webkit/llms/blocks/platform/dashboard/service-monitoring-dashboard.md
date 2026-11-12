# ServiceMonitoringDashboard (`platform/dashboard/service-monitoring-dashboard`)

> The service monitoring dashboard pattern: status tiles with sparklines, multi-series charts and an alert rail. One StatTile per service carries its p95 latency, the change against the previous period and a sparkline, with a StatusIndicator naming its state in words. Below, Latency (p50, p95, p99) and Error rate (Status 4xx, Status 5xx) sit in ChartCards as multi-series line Charts, each with its own window ToggleGroup, while an Open alerts rail holds the right edge: a fixed-width column that scrolls on its own, independent of the tiles and charts, listing each alert as an Item in an Item.Group with a severity Tag. Under the xl breakpoint the rail folds below the charts and the page scrolls as one. Built from `StatTile`, `StatusIndicator`, `ChartCard`, `Chart`, `ToggleGroup`, `Hint`, `Item`, `Tag`, `Skeleton` and `EmptyState`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/dashboard/service-monitoring-dashboard/service-monitoring-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/dashboard/service-monitoring-dashboard")`
- Components: [Alert](../../../components/alert.md), [Chart](../../../components/chart.md), [ChartCard](../../../components/chart-card.md), [EmptyState](../../../components/empty-state.md), [Hint](../../../components/hint.md), [Item](../../../components/item.md), [Skeleton](../../../components/skeleton.md), [StatTile](../../../components/stat-tile.md), [StatusIndicator](../../../components/status-indicator.md), [Tag](../../../components/tag.md), [ToggleGroup](../../../components/toggle-group.md)
- Skills: `webkit-data-viz`, `webkit-ui-states`

## Asked as

service monitoring; monitoring dashboard; latency p95; error rate; uptime; service health; observability; monitoramento; painel de monitoramento; latência

The page an on-call engineer keeps open: is every service up, how fast is it answering, how many
requests fail, and which alerts are open right now. One tile per service states its p95 latency and
its state in words; latency percentiles and error rates sit in two charts with their own window; the
open alerts live in a rail on the right that scrolls on its own, so the alerts stay in view while the
reader studies a chart.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- The reader watches a known set of services for state changes and threshold breaches.
- Latency percentiles and error rates matter more than volume.
- Open alerts need to stay visible next to the evidence.

## When not to use

- Volume and status codes over a longer period: use `platform/dashboard/analytics-dashboard`.
- Alert triage by severity with a full queue and trends: use `platform/dashboard/alerts-dashboard`.
- One experience score with bands: use `platform/dashboard/health-score-dashboard`.

## Building blocks

### A. Service tiles — `StatTile` (required)

One tile per service: its name, p95 latency, the change `p95 latency vs previous 24 hours` and a
sparkline. Latency rising is bad, so every tile passes `inverse`.

### B. Service state — `StatusIndicator` (required)

In each tile's aside: `Operational`, `Degraded` or `Down`, with its status color. The state is a word,
so a tile is never read by color alone.

### C. Charts — `ChartCard` (required)

`Latency` and `Error rate`, side by side beside the rail at wide screens.

### D. Definitions — `Hint` (required)

On each chart title, defining the percentiles or the error rate.

### E. Window — `ToggleGroup` (required)

`1h`, `6h`, `24h`, one per chart (`Window for Latency`, `Window for Error rate`). Each chart has its
own window because an engineer zooms into one signal while keeping the other wide. The switches stay
usable while the data loads.

### F. Latency and error rate — `Chart` (required)

Multi-series lines: `p50`, `p95`, `p99` for latency; `Status 4xx`, `Status 5xx` for errors. Percentiles
are an ordered set; keep them in that order in the legend and tooltip.

### G. Alert level — `Tag` (required)

The count beside `Open alerts`, and each alert's level (`Critical`, `Warning`, `Info`) with its
severity.

### H. Loading placeholders — `Skeleton` (required)

Holds the rail's rows during the first load.

### I. Alert rail — `Item` (required)

Each open alert is an `Item` in an `Item.Group` labelled `Open alerts`: the threshold that tripped
(`Status 5xx above 5%`), the service and when it opened. The rail is a fixed-width column that scrolls
independently; under the `xl` breakpoint it folds below the charts and the page scrolls as one.

### J. Empty regions — `EmptyState` (required)

`No traffic yet` / `Latency appears here once a service serves requests.` in the charts, and
`No open alerts` / `Alerts appear here when a service crosses a threshold.` in the rail.

## Do

- Write the service state in words in every tile.
- Keep alerts in a rail that stays in view; fold it below the charts on narrow screens.
- Title an alert with the threshold that tripped, not with a generic name.
- Give each chart its own window.

## Don't

- Don't average latency into one line; show the percentiles.
- Don't use the status colors for percentile series.
- Don't make the rail scroll the page with it at wide screens.
- Don't hide the rail when there are no alerts; say `No open alerts`.

## Copy

- **Service state:** one word. `Operational`, `Degraded`, `Down`.
- **Delta label:** what is compared. `p95 latency vs previous 24 hours`.
- **Alert title:** metric, comparison, threshold with unit. `p95 latency above 800 ms`.
- **Alert time:** relative. `12 minutes ago`.
- **Empty rail:** `No open alerts` / `Alerts appear here when a service crosses a threshold.`

## Accessibility

- Each `ToggleGroup` names its chart.
- The rail's `Item.Group` has `aria-label="Open alerts"`. An independently scrolling region must be reachable by keyboard.
- The rail's scroll container is a `region` labelled by the `Open alerts` heading with `tabindex="0"`, so a keyboard user can scroll it in every browser.
- State and level are words (`StatusIndicator`, `Tag`), never color alone.
- Latency figures use `tabular-nums`.

## States

- Default: services reporting, both charts populated, open alerts in the rail.
- Loading: every tile, both charts and the rail hold Skeletons; the window switches stay usable.
- Empty: no traffic yet; tiles show a dash, both charts say metrics appear once a service serves requests, and the rail reads `No open alerts`.
- Failed: the request failed; tiles show a dash, and both charts and the alert rail show a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/alerts-dashboard` — the full alert queue with severity trends.
- `platform/dashboard/health-score-dashboard` — the same services as one experience score.
- `platform/dashboard/analytics-dashboard` — volume and status codes over a longer period.

## Variants

- `Default` — primary (the code below)
- `Loading` — The first load: every tile, both charts and the rail hold Skeletons, and the window switches stay usable.
- `Empty` — No traffic yet: the tiles show a dash, both charts explain that metrics appear once a service serves requests, and the rail reads No open alerts.
- `Failed` — The request for the window failed: each service tile reads as a dash, and both charts and the Open alerts rail show a danger Alert that names what did not load and offers Retry.

Each variant is the same screen in another state: `get_pattern("platform/dashboard/service-monitoring-dashboard", { variant })`, or the file under `blocks/platform/dashboard/service-monitoring-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  interface Service {
    id: string
    name: string
    status: { label: string; severity: StatusIndicatorSeverity }
    latency: number | null
    delta: number | null
    trend: number[]
  }

  interface SeriesData {
    labels: string[]
    series: ChartSeries[]
  }

  interface MonitorAlert {
    id: string
    severity: TagSeverity
    level: string
    title: string
    service: string
    opened: string
  }

  const loading = false
  const empty = false

  const latencyWindow = ref('24h')
  const errorWindow = ref('24h')

  const formatLatency = (value: number) => `${Math.round(value)} ms`
  const formatRate = (value: number) => {
    const digits = value === 0 || value >= 10 ? 0 : value >= 1 ? 1 : 2
    return `${value.toFixed(digits)}%`
  }

  const windows = [
    { label: '1h', value: '1h' },
    { label: '6h', value: '6h' },
    { label: '24h', value: '24h' }
  ]

  const services: Service[] = [
    {
      id: 'web-app-prod',
      name: 'web-app-prod',
      status: { label: 'Operational', severity: 'success' },
      latency: 142,
      delta: 5.5,
      trend: [
        150.67, 152.6, 143.48, 150.61, 171.97, 134.75, 156.49, 120.43, 137.84, 138.04, 133.41,
        128.77, 110.63, 113.94, 104.35, 120.48, 140.39, 121.08, 150.68, 147.66, 156.97, 145.05,
        167.95, 182.61
      ]
    },
    {
      id: 'web-app-eu-prod',
      name: 'web-app-eu-prod',
      status: { label: 'Degraded', severity: 'warning' },
      latency: 860,
      delta: 2.25,
      trend: [
        828.11, 694.93, 849.69, 857.09, 741.51, 859.84, 983.53, 944.1, 1050.31, 856.9, 1024.47,
        900.75, 1097.77, 979.12, 1039.02, 821.14, 907.25, 785.34, 823.67, 898.16, 865.15, 720.38,
        683.48, 658.36
      ]
    },
    {
      id: 'web-app-staging',
      name: 'web-app-staging',
      status: { label: 'Down', severity: 'danger' },
      latency: 2310,
      delta: -12.04,
      trend: [
        2104.28, 2300.85, 2301.59, 2409.15, 2402.99, 2401.06, 2617.89, 2745.05, 2768.72, 2277.7,
        2220.83, 2286.36, 2675.38, 1939.18, 2500.95, 2209.39, 1780.76, 1665.79, 1874.18, 2302.54,
        1891.4, 1910.35, 2044.63, 2247.64
      ]
    },
    {
      id: 'campaign-landing',
      name: 'campaign-landing',
      status: { label: 'Operational', severity: 'success' },
      latency: 98,
      delta: 10.54,
      trend: [
        105.49, 103.1, 103.58, 93.83, 87.47, 87.63, 72.17, 72.04, 94.71, 87.34, 70.53, 79.32, 88.95,
        106.75, 96.26, 114.14, 119.03, 120.22, 107.42, 116.74, 108.78, 111.72, 96.77, 101.55
      ]
    },
    {
      id: 'docs-site',
      name: 'docs-site',
      status: { label: 'Operational', severity: 'success' },
      latency: 121,
      delta: -8.03,
      trend: [
        96.77, 120.51, 110.12, 101.64, 120.94, 126.42, 134.79, 134.1, 151.8, 122.97, 143.1, 128.14,
        147.52, 124.23, 148.85, 124.28, 104.73, 124.28, 113.74, 96.17, 113.13, 109.24, 115.93,
        104.17
      ]
    },
    {
      id: 'api-gateway',
      name: 'api-gateway',
      status: { label: 'Operational', severity: 'success' },
      latency: 176,
      delta: -9.49,
      trend: [
        186.03, 178.2, 150.11, 171.27, 172.52, 148.71, 162.95, 162.72, 175.66, 169.93, 168.56,
        134.98, 177.79, 176.51, 198.4, 164.09, 195.65, 189.51, 192.61, 187.06, 226.81, 177.96,
        200.99, 193.54
      ]
    }
  ]

  const latency: Record<string, SeriesData> = {
    '1h': {
      labels: [
        '10:05',
        '10:10',
        '10:15',
        '10:20',
        '10:25',
        '10:30',
        '10:35',
        '10:40',
        '10:45',
        '10:50',
        '10:55',
        '11:00'
      ],
      series: [
        {
          id: 'p50',
          name: 'p50',
          values: [
            127.92, 94.53, 97.31, 107.2, 97.36, 110.69, 100.89, 146.8, 146.33, 157.18, 125.77,
            147.95
          ]
        },
        {
          id: 'p95',
          name: 'p95',
          values: [
            374.75, 373.91, 308.53, 443.04, 485.87, 397.39, 521.52, 468.61, 397.76, 496.69, 440.19,
            312.62
          ]
        },
        {
          id: 'p99',
          name: 'p99',
          values: [
            1165.45, 930.06, 842.26, 817.89, 883.2, 619.11, 793.63, 920.73, 881.72, 909.44, 1103.83,
            1106.58
          ]
        }
      ]
    },
    '6h': {
      labels: [
        '05:15',
        '05:30',
        '05:45',
        '06:00',
        '06:15',
        '06:30',
        '06:45',
        '07:00',
        '07:15',
        '07:30',
        '07:45',
        '08:00',
        '08:15',
        '08:30',
        '08:45',
        '09:00',
        '09:15',
        '09:30',
        '09:45',
        '10:00',
        '10:15',
        '10:30',
        '10:45',
        '11:00'
      ],
      series: [
        {
          id: 'p50',
          name: 'p50',
          values: [
            109.27, 121.76, 123.83, 136.32, 143.34, 126.41, 154.32, 161.25, 154.04, 126.59, 144.91,
            125.14, 123.9, 119.48, 136.03, 112.46, 100.17, 114.2, 92.48, 119.49, 102.27, 88.73,
            88.59, 106.46
          ]
        },
        {
          id: 'p95',
          name: 'p95',
          values: [
            360.16, 409.41, 410.82, 451.7, 420.29, 510.08, 543.55, 480.85, 517.95, 504.78, 469.87,
            512.06, 362.62, 389.29, 367.81, 440.34, 315.09, 286.34, 386.74, 318.29, 345.86, 293.6,
            390.07, 443.49
          ]
        },
        {
          id: 'p99',
          name: 'p99',
          values: [
            734.58, 794.77, 703.1, 706.89, 825.77, 691.9, 1007.2, 756.71, 1078.27, 1008.97, 869.74,
            1151.69, 1154.72, 1189.48, 1059.71, 1151.21, 989.75, 959.28, 1019.08, 879.11, 885.64,
            909.6, 768.14, 801.24
          ]
        }
      ]
    },
    '24h': {
      labels: [
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00'
      ],
      series: [
        {
          id: 'p50',
          name: 'p50',
          values: [
            113.92, 125.96, 114.96, 117.02, 113.25, 103.18, 118.59, 90.7, 90.48, 105.94, 98.49,
            104.23, 147.72, 147.56, 122.78, 148.06, 149.49, 161.4, 152.31, 134.62, 146.18, 127.38,
            127.85, 128.51
          ]
        },
        {
          id: 'p95',
          name: 'p95',
          values: [
            299.24, 390.05, 365.72, 431.21, 381.87, 406.48, 400.03, 508, 525.04, 509.32, 479.46,
            464.04, 426.39, 499.62, 517.73, 381.34, 355.4, 386.17, 409.9, 376.56, 297.01, 355.75,
            359.71, 364.61
          ]
        },
        {
          id: 'p99',
          name: 'p99',
          values: [
            691.25, 878.67, 869.6, 771.26, 1011.27, 1045.81, 1131.15, 1084.49, 923.34, 921.95,
            983.26, 948.46, 1047, 1003.13, 1065.87, 855.97, 895.38, 925.79, 809.96, 798.72, 711.55,
            898.95, 605.55, 837.83
          ]
        }
      ]
    }
  }

  const errorRate: Record<string, SeriesData> = {
    '1h': {
      labels: [
        '10:05',
        '10:10',
        '10:15',
        '10:20',
        '10:25',
        '10:30',
        '10:35',
        '10:40',
        '10:45',
        '10:50',
        '10:55',
        '11:00'
      ],
      series: [
        {
          id: '4xx',
          name: 'Status 4xx',
          color: 'warning',
          values: [2.03, 2.59, 2.38, 3.54, 2.62, 2.35, 2.53, 1.88, 1.6, 1.4, 1.69, 1.94]
        },
        {
          id: '5xx',
          name: 'Status 5xx',
          color: 'danger',
          values: [0.61, 0.63, 0.53, 0.66, 0.62, 0.85, 0.59, 0.54, 0.58, 0.48, 0.43, 0.37]
        }
      ]
    },
    '6h': {
      labels: [
        '05:15',
        '05:30',
        '05:45',
        '06:00',
        '06:15',
        '06:30',
        '06:45',
        '07:00',
        '07:15',
        '07:30',
        '07:45',
        '08:00',
        '08:15',
        '08:30',
        '08:45',
        '09:00',
        '09:15',
        '09:30',
        '09:45',
        '10:00',
        '10:15',
        '10:30',
        '10:45',
        '11:00'
      ],
      series: [
        {
          id: '4xx',
          name: 'Status 4xx',
          color: 'warning',
          values: [
            2.36, 2.73, 2.19, 3.04, 2.31, 1.76, 2.1, 2.4, 1.56, 2.22, 2.12, 1.94, 2.31, 1.6, 2.4,
            2.64, 1.89, 2.95, 3.15, 2.5, 3.12, 3.47, 2.53, 3.37
          ]
        },
        {
          id: '5xx',
          name: 'Status 5xx',
          color: 'danger',
          values: [
            0.63, 0.66, 0.71, 0.64, 0.81, 0.76, 0.66, 0.59, 0.68, 0.57, 0.59, 0.41, 0.57, 0.46,
            0.36, 0.6, 0.64, 0.53, 0.45, 0.54, 0.5, 0.67, 0.56, 0.72
          ]
        }
      ]
    },
    '24h': {
      labels: [
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00'
      ],
      series: [
        {
          id: '4xx',
          name: 'Status 4xx',
          color: 'warning',
          values: [
            3.3, 2.66, 2.63, 2.54, 2.66, 2.89, 3.1, 2.84, 2.19, 2.01, 2.54, 2.62, 1.77, 1.9, 2.06,
            1.9, 2.16, 1.45, 1.44, 2.19, 2.47, 1.96, 2.03, 2.58
          ]
        },
        {
          id: '5xx',
          name: 'Status 5xx',
          color: 'danger',
          values: [
            0.57, 0.45, 0.64, 0.48, 0.59, 0.75, 0.75, 0.73, 0.65, 0.64, 0.82, 0.66, 0.81, 0.67, 0.7,
            0.62, 0.56, 0.48, 0.39, 0.54, 0.44, 0.45, 0.31, 0.49
          ]
        }
      ]
    }
  }

  const alerts: MonitorAlert[] = [
    {
      id: 'stage-5xx',
      severity: 'danger',
      level: 'Critical',
      title: 'Status 5xx above 5%',
      service: 'web-app-staging',
      opened: '12 minutes ago'
    },
    {
      id: 'eu-latency',
      severity: 'warning',
      level: 'Warning',
      title: 'p95 latency above 800 ms',
      service: 'web-app-eu-prod',
      opened: '34 minutes ago'
    },
    {
      id: 'eu-upstream',
      severity: 'warning',
      level: 'Warning',
      title: 'Upstream timeouts rising',
      service: 'web-app-eu-prod',
      opened: '1 hour ago'
    },
    {
      id: 'docs-disk',
      severity: 'info',
      level: 'Info',
      title: 'Disk usage above 80%',
      service: 'docs-site',
      opened: '3 hours ago'
    }
  ]
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-col xl:flex-row">
    <div
      class="flex min-w-0 flex-1 flex-col gap-(--spacing-md) p-(--spacing-md) xl:overflow-y-auto"
    >
      <ul
        class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 lg:grid-cols-2 2xl:grid-cols-3"
      >
        <li
          v-for="service in services"
          :key="service.id"
          class="flex min-w-0 flex-col"
        >
          <StatTile
            :label="service.name"
            :value="service.latency"
            :format-value="formatLatency"
            :delta="service.delta"
            delta-label="p95 latency vs previous 24 hours"
            inverse
            :trend="service.trend"
            :loading="loading"
          >
            <template #aside>
              <StatusIndicator
                v-if="!loading && !empty"
                :severity="service.status.severity"
                :label="service.status.label"
              />
            </template>
          </StatTile>
        </li>
      </ul>

      <div class="grid min-w-0 grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1]">
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Latency</ChartCard.Title>
              <Hint text="Time to the first byte, by percentile, across every service." />
            </span>
            <ChartCard.Controls>
              <ToggleGroup
                v-model="latencyWindow"
                :options="windows"
                size="small"
                aria-label="Window for Latency"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              :series="latency[latencyWindow].series"
              :labels="latency[latencyWindow].labels"
              :format-value="formatLatency"
              empty-title="No traffic yet"
              empty-description="Latency appears here once a service serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Line />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Error rate</ChartCard.Title>
              <Hint text="Share of responses with a 4xx or 5xx status, across every service." />
            </span>
            <ChartCard.Controls>
              <ToggleGroup
                v-model="errorWindow"
                :options="windows"
                size="small"
                aria-label="Window for Error rate"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              :series="errorRate[errorWindow].series"
              :labels="errorRate[errorWindow].labels"
              :format-value="formatRate"
              empty-title="No traffic yet"
              empty-description="Error rates appear here once a service serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Line />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend />
            </Chart>
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>

    <aside
      aria-labelledby="open-alerts-title"
      class="flex min-h-0 min-w-0 flex-col border-t border-(--border-muted) bg-(--bg-surface) xl:w-(--container-sm) xl:shrink-0 xl:border-t-0 xl:border-s"
    >
      <div
        class="flex shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-muted) p-(--spacing-md)"
      >
        <h2
          id="open-alerts-title"
          class="m-0 text-label-lg text-(--text-default)"
        >
          Open alerts
        </h2>
        <Tag
          v-if="!loading && alerts.length"
          :label="String(alerts.length)"
          severity="secondary"
          size="small"
        />
      </div>
      <div
        class="min-h-0 flex-1 p-(--spacing-md) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) xl:overflow-y-auto"
        role="region"
        aria-labelledby="open-alerts-title"
        tabindex="0"
      >
        <div
          v-if="loading"
          class="flex flex-col gap-(--spacing-lg)"
        >
          <Skeleton
            v-for="row in 4"
            :key="row"
            width="100%"
            height="3rem"
          />
        </div>
        <Item.Group
          v-else-if="alerts.length"
          aria-label="Open alerts"
        >
          <Item
            v-for="alert in alerts"
            :key="alert.id"
            role="listitem"
            size="small"
          >
            <Item.Content>
              <Item.Title>{{ alert.title }}</Item.Title>
              <Item.Description>{{ alert.service }}</Item.Description>
              <Item.Description>Opened {{ alert.opened }}</Item.Description>
            </Item.Content>
            <Item.Actions>
              <Tag
                :label="alert.level"
                :severity="alert.severity"
                size="small"
              />
            </Item.Actions>
          </Item>
        </Item.Group>
        <EmptyState
          v-else
          size="small"
          icon="pi pi-check-circle"
          title="No open alerts"
          description="Alerts appear here when a service crosses a threshold."
        />
      </div>
    </aside>
  </div>
</template>
```
