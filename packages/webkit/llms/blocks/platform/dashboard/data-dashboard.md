# DataDashboard (`platform/dashboard/data-dashboard`)

> The data dashboard pattern: KPI tiles with sparklines and period-over-period deltas, followed by the breakdowns that explain them. Six StatTiles carry each metric’s period total, a sparkline and the change against the previous 24 hours, each with a Hint that defines the metric. Under them, a ChartCard draws data transferred this period over the previous one as two series, a labeled horizontal bar Chart ranks the projects by data transferred, and a searchable, paginated TableRoot lists requests and data transferred per project. Every card keeps its Sum and change Tags, an Expand IconButton and a DropdownMenu with Copy query and Export CSV. Built from `PageHeader`, `StatTile`, `ChartCard`, `Chart`, `TableRoot`, `Tag`, `Hint`, `ToggleGroup`, `IconButton`, `Tooltip`, `DropdownMenu`, `Input` and `EmptyState`.

- Surface: product
- Source: `blocks/platform/dashboard/data-dashboard/data-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/dashboard/data-dashboard")`
- Components: [Alert](../../../components/alert.md), [Chart](../../../components/chart.md), `ChartCard`, [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [Hint](../../../components/hint.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [PageHeader](../../../components/page-header.md), [StatTile](../../../components/stat-tile.md), `TableRoot`, [Tag](../../../components/tag.md), [ToggleGroup](../../../components/toggle-group.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

data dashboard; metrics dashboard; kpi dashboard; stat tiles; data transferred; usage dashboard; breakdown charts; métricas; painel de dados; painel de uso

The usage page: how much the account's projects consumed in the period, how that compares with the
previous period, and which projects drove it. It leads with six KPI tiles (each with a sparkline and
the change against the previous 24 hours), then explains the headline number with this period against
the previous one, a ranking of projects and a table of usage per project.

## When to use

- The reader checks consumption across several products or meters (requests, data, jobs, images).
- The comparison that matters is this period against the previous one.
- Usage is attributed to projects or other owners the reader can act on.

## When not to use

- Traffic quality (status codes, success rate) rather than consumption: use
  `platform/dashboard/analytics-dashboard`.
- Money, split by category: use `platform/dashboard/composition-dashboard`.
- The reader arranges the cards: use `platform/dashboard/configurable-dashboard`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Data usage` and one sentence on what the page shows, over the rest of the page in the standard
`layout-column`.

### B. KPI row — `StatTile` (required)

Six tiles: `Requests`, `Data transferred`, `Jobs run`, `Images processed`, `Requests inspected`,
`Logs exported`. Each has its period total, a sparkline and the change `vs previous 24 hours`.
Consumption is neither good nor bad by itself, so these tiles do not pass `inverse`; pass it only on a
metric where a rise is bad.

### C. Metric definitions — `Hint` (required)

One sentence per tile and card title (`Images resized, cropped or converted in the period.`).

### D. Cards — `ChartCard` (required)

`Data transferred, this period vs previous`, `Data transferred by project` and `Usage by project`,
each with the same header.

### E. Aggregation and change — `Tag` (required)

`Sum` plus the signed change for the period in every card header.

### F. Line or Bar — `ToggleGroup` (optional)

Only on the period comparison chart, labelled with its card.

### G. Control labels — `Tooltip` (required)

Names Expand and More options on hover and focus.

### H. Expand — `IconButton` (optional)

Opens a card full size; its `aria-label` names the card.

### I. More options — `DropdownMenu` (optional)

`Copy query` and `Export CSV` in every card.

### J. Charts — `Chart` (required)

The comparison draws `This period` and `Previous period` as two series of the same metric; the
current period is declared first so it takes the first series color. The project ranking is a labeled
horizontal bar chart, largest first.

### K. Table search — `Input` (optional)

`Search projects`, inside the `Usage by project` card.

### L. Usage by project — `TableRoot` (required)

Searchable, paginated; requests and data transferred per project in tabular, right-aligned figures.

### M. Empty regions — `EmptyState` (required)

`No usage yet` / `Usage appears here once a project serves requests.` when nothing was recorded, and
`No matching rows` / `Change the search.` when the search matches nothing.

## Do

- Compare against the previous period of the same length, and say so in the delta label.
- Keep the same card header on every card.
- Rank breakdowns largest first.

## Don't

- Don't color a rise in usage red unless it is a cost or a limit the reader wants to stay under.
- Don't mix units in one chart; one metric per chart.
- Don't add a per-card period.

## Copy

- **Title:** `Data usage`. **Description:** `What your projects consumed in the period, against the previous period.`
- **Tile labels:** the meter name. `Jobs run`, `Logs exported`.
- **Delta label:** what the change is against. `vs previous 24 hours`.
- **Card titles:** say what is compared. `Data transferred, this period vs previous`.
- **Series names:** `This period`, `Previous period`.
- **Empty state:** `No usage yet` / `Usage appears here once a project serves requests.`
- **No-match state:** `No matching rows` / `Change the search.`

## Accessibility

- Every icon-only control has an `aria-label` naming its card and a `Tooltip`.
- The search `Input` has `aria-label="Search projects"`.
- Figures use `tabular-nums`; deltas carry a sign.
- The two comparison series differ in more than color (legend names, tooltip rows).

## States

- Default: the populated usage page.
- Loading: `Skeleton`s hold every tile, chart and table row in place.
- Empty: no usage recorded yet; each tile shows a dash, and every chart and the table explain that nothing was recorded.
- Failed: the request for the period failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/analytics-dashboard` — the same grammar for traffic quality.
- `platform/dashboard/composition-dashboard` — when the total is money split by category.
- `platform/account/change-plan-drawer` — where usage limits are changed.

## Variants

- `Default` — primary (the code below)
- `Loading` — The first response is on its way: Skeletons hold every tile, chart and table row in place.
- `Empty` — No usage recorded yet: each tile shows a dash, and every chart and the table explain that nothing was recorded in the period.
- `Failed` — The request for the period failed: the tiles read as dashes, and every card keeps its header with a danger Alert that names what did not load and offers Retry.

Each variant is the same screen in another state: `get_pattern("platform/dashboard/data-dashboard", { variant })`, or the file under `blocks/platform/dashboard/data-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const formatCount = (value) => compact.format(value)

  const formatBytes = (value) => {
    const steps = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    let current = value
    let index = 0
    while (current >= 1000 && index < steps.length - 1) {
      current /= 1000
      index += 1
    }
    return `${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} ${steps[index]}`
  }

  const loading = false

  const figures = [
    {
      id: 'requests',
      label: 'Requests',
      description: 'Requests served by every project in the period.',
      unit: 'count',
      value: 49330393,
      delta: -1.83,
      trend: [
        1806444, 1576992, 1869283, 1891454, 1893374, 2012867, 2036776, 1980797, 2313210, 2444662,
        2507165, 2238034, 2315013, 2246445, 2351171, 2177971, 2295207, 2157832, 1993248, 2027048,
        1952960, 1940554, 1585246, 1716640
      ]
    },
    {
      id: 'data-transferred',
      label: 'Data transferred',
      description: 'Data delivered to clients, in and out, by every project in the period.',
      unit: 'bytes',
      value: 821729544000,
      delta: 8.98,
      trend: [
        37987787300, 41596689512, 40096114032, 42509594088, 39693463193, 38541437265, 34997200644,
        32832653647, 35896619893, 34695695753, 32560234611, 29835955559, 26447312700, 29730754488,
        27630321968, 25403501912, 30485256807, 28642766735, 30894459356, 31267070353, 35973056107,
        35248016247, 39016905389, 39746676441
      ]
    },
    {
      id: 'jobs-run',
      label: 'Jobs run',
      description: 'Background jobs that ran to completion in the period.',
      unit: 'count',
      value: 14546636,
      delta: 18.58,
      trend: [
        578482, 549084, 505643, 524549, 522829, 541220, 532059, 511331, 558322, 540484, 616959,
        622771, 614122, 697060, 666023, 646019, 673706, 678263, 739613, 667428, 662645, 668657,
        596124, 633243
      ]
    },
    {
      id: 'images-processed',
      label: 'Images processed',
      description: 'Images resized, cropped or converted in the period.',
      unit: 'count',
      value: 2002933,
      delta: 16.72,
      trend: [
        93274, 93157, 98234, 94141, 104108, 92749, 86064, 94234, 87803, 85279, 79578, 69276, 71356,
        63808, 62459, 74165, 76690, 67994, 79899, 83824, 78724, 85140, 92196, 88781
      ]
    },
    {
      id: 'requests-inspected',
      label: 'Requests inspected',
      description: 'Requests checked against security rules in the period.',
      unit: 'count',
      value: 30771941,
      delta: 2.78,
      trend: [
        1502207, 1457618, 1405860, 1393149, 1339849, 1286141, 1261605, 1252293, 1140520, 1185385,
        992858, 963099, 1082325, 1160330, 1160070, 1229994, 1202329, 1187616, 1405599, 1445636,
        1385091, 1402142, 1447647, 1482578
      ]
    },
    {
      id: 'logs-exported',
      label: 'Logs exported',
      description: 'Log data sent to external destinations in the period.',
      unit: 'bytes',
      value: 61800164400,
      delta: -7.73,
      trend: [
        2810255726, 2418807359, 2364529874, 2399632871, 2117725975, 1965392203, 2243329246,
        1954529809, 2216724649, 2190530044, 2115350572, 2338212538, 2503000274, 2614725041,
        2827373726, 2886198329, 3127436025, 3201613797, 2880012354, 3108954591, 2945086551,
        2856059556, 2936199828, 2778483462
      ]
    }
  ]

  const comparison = {
    delta: 8.98,
    labels: [
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
      '11:00',
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
      '23:00'
    ],
    series: [
      {
        id: 'current',
        name: 'This period',
        values: [
          37987787300, 41596689512, 40096114032, 42509594088, 39693463193, 38541437265, 34997200644,
          32832653647, 35896619893, 34695695753, 32560234611, 29835955559, 26447312700, 29730754488,
          27630321968, 25403501912, 30485256807, 28642766735, 30894459356, 31267070353, 35973056107,
          35248016247, 39016905389, 39746676441
        ]
      },
      {
        id: 'previous',
        name: 'Previous period',
        values: [
          36311824255, 36364065729, 35671651702, 38220818870, 34170491149, 39019034176, 35328541542,
          37510349711, 33962134894, 30438098447, 29382417841, 27076008841, 29470299745, 28487872271,
          27983934298, 25646807130, 25926728851, 25537721824, 27160266458, 25172084289, 28466967106,
          30258971553, 33662716159, 32759509159
        ]
      }
    ]
  }

  const ranking = {
    labels: [
      'web-app-prod',
      'web-app-eu-prod',
      'storefront-checkout',
      'marketing-site',
      'payments-api',
      'campaign-landing',
      'status-page',
      'web-app-staging'
    ],
    series: [
      {
        id: 'requests',
        name: 'Data transferred by project',
        values: [
          340000000000, 190000000000, 120000000000, 76000000000, 41000000000, 23000000000,
          9800000000, 3200000000
        ]
      }
    ]
  }

  const columns = [
    {
      id: 'project',
      accessorKey: 'project',
      header: 'Project',
      align: 'start',
      enableSorting: true,
      principal: true
    },
    {
      id: 'requests',
      accessorKey: 'requests',
      header: 'Requests',
      align: 'end',
      enableSorting: true,
      principal: false
    },
    {
      id: 'dataTransferred',
      accessorKey: 'dataTransferred',
      header: 'Data transferred',
      align: 'end',
      enableSorting: true,
      principal: false
    }
  ]

  const rows = [
    {
      id: 'web-app-prod',
      project: 'web-app-prod',
      requests: 18420000,
      dataTransferred: '340 GB'
    },
    {
      id: 'web-app-eu-prod',
      project: 'web-app-eu-prod',
      requests: 11730000,
      dataTransferred: '190 GB'
    },
    {
      id: 'storefront-checkout',
      project: 'storefront-checkout',
      requests: 7910000,
      dataTransferred: '120 GB'
    },
    {
      id: 'marketing-site',
      project: 'marketing-site',
      requests: 4380000,
      dataTransferred: '76.0 GB'
    },
    {
      id: 'payments-api',
      project: 'payments-api',
      requests: 6240000,
      dataTransferred: '41.0 GB'
    },
    {
      id: 'campaign-landing',
      project: 'campaign-landing',
      requests: 1570000,
      dataTransferred: '23.0 GB'
    },
    { id: 'status-page', project: 'status-page', requests: 860000, dataTransferred: '9.8 GB' },
    {
      id: 'web-app-staging',
      project: 'web-app-staging',
      requests: 210000,
      dataTransferred: '3.2 GB'
    }
  ]

  const form = ref('line')
  const activeIndex = ref(null)
  const search = ref('')

  const FORMS = [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' }
  ]
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Data usage"
        description="What your projects consumed in the period, against the previous period."
      />
      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-3">
        <li
          v-for="figure in figures"
          :key="figure.id"
          class="flex min-w-0 flex-col"
        >
          <StatTile
            :label="figure.label"
            :value="figure.value"
            :format-value="figure.unit === 'bytes' ? formatBytes : formatCount"
            :delta="figure.delta"
            delta-label="vs previous 24 hours"
            :trend="figure.trend"
            :loading="loading"
          >
            <template #aside>
              <Hint :text="figure.description" />
            </template>
          </StatTile>
        </li>
      </ul>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Data transferred, this period vs previous</ChartCard.Title>
              <Hint
                text="Data delivered by every project in the selected period, drawn over the same span of the previous period."
              />
            </span>
            <ChartCard.Controls>
              <span
                data-wide
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="secondary"
                  size="small"
                  icon="pi pi-calculator"
                />
                <Tag
                  v-if="comparison.delta !== null"
                  :label="(comparison.delta > 0 ? '+' : '') + comparison.delta.toFixed(2) + '%'"
                  :severity="comparison.delta > 0 ? 'success' : 'danger'"
                  :icon="comparison.delta > 0 ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-left'"
                  size="small"
                />
                <ToggleGroup
                  v-model="form"
                  :options="FORMS"
                  size="small"
                  aria-label="Chart form for Data transferred, this period vs previous"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Data transferred, this period vs previous"
                />
              </Tooltip>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Data transferred, this period vs previous"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              v-model:active-index="activeIndex"
              :series="comparison.series"
              :labels="comparison.labels"
              :format-value="formatBytes"
              empty-title="No usage yet"
              empty-description="Usage appears here once a project serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar
                v-if="form === 'bar'"
                stacked
              />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend totals />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Data transferred by project</ChartCard.Title>
              <Hint text="The projects that delivered the most data in the period." />
            </span>
            <ChartCard.Controls>
              <span
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="secondary"
                  size="small"
                  icon="pi pi-calculator"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Data transferred by project"
                />
              </Tooltip>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Data transferred by project"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              :series="ranking.series"
              :labels="ranking.labels"
              orientation="horizontal"
              :format-value="formatBytes"
              :height="256"
              empty-title="No usage yet"
              empty-description="Usage appears here once a project serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar labeled />
              <Chart.Tooltip />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Usage by project</ChartCard.Title>
              <Hint text="Requests and data transferred per project in the period." />
            </span>
            <ChartCard.Controls>
              <span
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="secondary"
                  size="small"
                  icon="pi pi-calculator"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Usage by project"
                />
              </Tooltip>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Usage by project"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
              <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <div class="min-w-36 grow basis-(--container-3xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search projects"
                    aria-label="Search projects"
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>
              </div>

              <TableRoot
                v-model:global-filter="search"
                :data="rows"
                :columns="columns"
                row-key="id"
                enable-sorting
                paginated
                :page-size="5"
                :rows-per-page-options="[5, 10, 25]"
                header-kind="compact"
                bordered
                :loading="loading"
              >
                <template #empty>
                  <EmptyState
                    key="empty-state-1"
                    v-if="!rows.length"
                    size="small"
                    icon="pi pi-chart-line"
                    title="No usage yet"
                    description="Usage appears here once a project serves requests."
                  />
                  <EmptyState
                    key="empty-state-2"
                    v-else
                    size="small"
                    icon="pi pi-search"
                    title="No matching rows"
                    description="Change the search."
                  />
                </template>

                <template #cell-requests="{ row }">
                  <span class="tabular-nums">{{ formatCount(row.requests) }}</span>
                </template>
              </TableRoot>
            </div>
          </ChartCard.Content>
        </ChartCard>
      </div>
    </main>
  </div>
</template>
```
