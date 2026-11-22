# DashboardBreakdown (`dashboard/dashboard-breakdown`)

> A composition dashboard: how a total breaks down into its parts and how that mix moved over time, here the organization’s monthly spend by category. Under a page heading with the period Select and an Export button sits a row of four StatTiles, the total first and then its three largest categories, each with the change against the previous month and a 12-month sparkline; a rise reads as bad, so every tile is `inverse`. Below, a 12-column grid of ChartCards: the stacked Chart of spend by category over 12 months (Area or Bar from a ToggleGroup, crosshair, one tooltip for every category, a legend with range totals) beside a DonutChart of the current month’s split with the total in its center, and a ranked contributors DataTable across the full width: rank, the resource name behind its category glyph, the category Tag, the amount, its share of the total as a Progress with the percentage, and the change against last month as a Tag. Built from `PageHeader`, `StatTile`, `Chart`, `DonutChart`, `ChartCard`, `DataTable`, `Tag`, `Progress`, `Hint`, `ToggleGroup`, `Select`, `DropdownMenu`, `IconButton`, `Button` and `EmptyState`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/dashboard/dashboard-breakdown/dashboard-breakdown.vue` in `@aziontech/webkit`
- MCP: `get_block("dashboard/dashboard-breakdown")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Chart](../../components/chart.md), [ChartCard](../../components/chart-card.md), [DataTable](../../components/data-table.md), [DonutChart](../../components/donut-chart.md), [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Hint](../../components/hint.md), [IconButton](../../components/icon-button.md), [PageHeader](../../components/page-header.md), [Progress](../../components/progress.md), [Select](../../components/select.md), [StatTile](../../components/stat-tile.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), `use-locale`, `utils/csv`
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

composition dashboard; spend breakdown; cost by category; donut chart dashboard; stacked area chart; top contributors; mix over time; painel de composição; gastos por categoria; custos por categoria; total by category over time; spend by category

The page that answers "what is this total made of, and how did the mix move?". The block's example is
the organization's monthly spend: the total and its three largest categories first, then the mix over
12 months, the current month's split, and the resources that drive it, ranked. The same shape fits any
total that breaks down into exclusive parts (storage by type, requests by product, seats by team).

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use dashboard-breakdown when a total breaks into categories over time.
- One total splits into a small number of exclusive categories (up to six, plus Other).
- The reader needs both the current split and how it changed over time.
- The reader has to find the individual items that drive the largest share.

## When not to use

- The parts are not exclusive or do not sum to the total: use a multi-series line in
  `dashboard/dashboard-analytics` instead of a stack or a donut.
- The reader tracks progress against targets: use `dashboard/dashboard-executive-summary`.
- Changing the plan that drives the spend: use `account/account-change-plan-drawer`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Cost breakdown` with one sentence on what it shows. Its actions hold the period and the export.

### B. Period — `Select` (required)

The header `Select` is `variant="ghost"`: no border until hover, so it shares the header row with the outlined buttons beside it; a header never holds a field outline.

`Last 12 months` or `Last 6 months`, labelled `Period`. It scopes every region.

### C. Export — `Button` (optional)

`Export CSV` in the page heading downloads the whole breakdown (spend per category per month, `spend-by-category-last-12-months.csv`). Per-card exports live in each card's menu. Each export confirms with a success toast naming the file, or an error toast when it fails, and is disabled while loading and when the period failed or has no data.

### D. Total and top categories — `StatTile` (required)

Four tiles: `Total spend` first, then the three largest categories. Each shows the change against the
previous month and a 12-month sparkline. A rise in spend is bad, so every tile passes `inverse`.

### E. Metric definitions — `Hint` (required)

Each tile and card title carries a `Hint` (`Everything billed to the organization this month.`).

### F. Cards — `ChartCard` (required)

`Spend by category` and `Current split` share a row; `Top contributors` spans the full width.

### G. Area or Bar — `ToggleGroup` (optional)

Switches the stacked trend between Area and Bar. Labelled `Chart form for Spend by category`.

### H. More options — `DropdownMenu` (optional)

Per-card secondary actions such as `Export CSV`, behind the more-options button; it downloads that card's rows.

### I. More options trigger — `IconButton` (optional)

Opens the card's `DropdownMenu`. Icon-only, with an `aria-label` that names the card
(`More options for Spend by category`).

### J. Spend by category — `Chart` (required)

A stacked chart over 12 months, one series per category in the categorical role, with a crosshair, one
tooltip that lists every category for the hovered month, and a legend with range totals. A seventh
category folds into Other; never invent a hue.

### K. Current split — `DonutChart` (required)

This month's split with the total in its center (`This month`). Same category order and colors as the
stacked chart, so the two read as one.

### L. Top contributors — `DataTable` (required)

Rank, the resource behind its category glyph, the category, the amount, its share of the total and the
change against last month. Amounts and shares use tabular numbers and align right.

### M. Empty regions — `EmptyState` (required)

Each chart and the table keep their box with an empty state: `No spend in this range` /
`Nothing was billed to the organization in the selected period.`

### N. Category and change — `Tag` (required)

The category of each contributor, and its change against last month, are `Tag`s. A rise in spend reads
as bad in the change tag too.

### O. Share of total — `Progress` (required)

Each contributor's share as a `Progress` beside the percentage, with an `aria-label` naming the
resource (`web-app share of total`). The bar is a visual aid; the number is the value.

### P. Load failure — `Alert` (required)

When `error` is set, every card keeps its header and shows a danger `Alert` in place of its content: `Couldn't load <card>.` followed by the message, with Retry, which emits `retry`.

## Data

The block takes its figures and records through props and emits every action; it fetches nothing. `BreakdownDashboardProps` and the record types (`BreakdownDashboardKpis`, `BreakdownDashboardContributor`) are exported from `dashboard-breakdown.vue`, and `sample.ts` holds the sample year the block renders when a data prop is left out (and never while `loading` or `error` is set).

| Prop             | Type                              | What it does                                                                                                                           |
| ---------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `kpis`           | `BreakdownDashboardKpis`          | The value, delta and sparkline of each tile, by metric (`total`, `compute`, `database`, `storage`). A metric left out reads as a dash. |
| `labels`         | `string[]`                        | The month labels of Spend by category.                                                                                                 |
| `series`         | `ChartSeries[]`                   | Monthly spend, one series per category. `[]` shows the chart's empty state.                                                            |
| `split`          | `ChartSeries[]`                   | This month's spend by category, one value per series, for the donut.                                                                   |
| `contributors`   | `BreakdownDashboardContributor[]` | The Top contributors rows. `[]` shows No spend in this range.                                                                          |
| `loading`        | `boolean`                         | The period is loading; every tile, both charts and the table show their skeleton, and the exports disable.                             |
| `error`          | `string`                          | Why the period could not load; each card shows `Couldn't load <card>.` and this message in a danger `Alert` with Retry.                |
| `v-model:period` | `string`                          | The selected period (`12m`, `6m`, `ytd`); default `12m`. Refetch when it changes.                                                      |

| Event           | Payload         | When                                                                                                             |
| --------------- | --------------- | ---------------------------------------------------------------------------------------------------------------- |
| `retry`         | `(event)`       | Retry in any card's error alert.                                                                                 |
| `export`        | `(event, card)` | Export CSV in the header (`spend-by-category`) or a card menu; the block downloads the CSV of the data it shows. |
| `update:period` | `(value)`       | The reader picked another period.                                                                                |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import DashboardBreakdown from './dashboard-breakdown.vue'

  const period = ref('12m')
  const { data, pending, error, refresh } = useSpendBreakdown(period)
</script>

<template>
  <DashboardBreakdown
    v-model:period="period"
    :kpis="data?.kpis ?? {}"
    :labels="data?.labels ?? []"
    :series="data?.series ?? []"
    :split="data?.split ?? []"
    :contributors="data?.contributors ?? []"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep the category order and colors identical across tiles, stacked chart, donut and table.
- Put the total first in the tile row, then the parts.
- Show a percentage next to every share bar.
- Mark spend tiles as `inverse`.

## Don't

- Don't use a donut for more than six slices; fold the tail into Other.
- Don't stack series that overlap or do not sum to the total.
- Don't color categories with status tokens; a category is not a state.
- Don't drop the absolute amount and show only the share.

## Copy

- **Title:** `Cost breakdown`.
- **Description:** `How the organization’s spend splits across categories and the resources that drive it.`
- **Tile labels:** the category name only. `Total spend`, `Compute`, `Database`, `Storage`.
- **Card titles:** `Spend by category`, `Current split`, `Top contributors`.
- **Donut center label:** the period it shows. `This month`.
- **Empty state:** `No spend in this range` / `Nothing was billed to the organization in the selected period.`

## Accessibility

- The period `Select` has `aria-label="Period"`; icon-only controls name their card.
- The donut has an `aria-label` (`Current split`) and its legend lists every category with its value.
- Each `Progress` names its resource; the percentage is visible text, not only the bar.
- Amounts and shares use `tabular-nums`.

## States

- Default: the populated breakdown for the period (`v-model:period`).
- Loading: `loading` is set; every tile, both charts and the table hold their place with a `Skeleton`.
- Empty: nothing billed in the period (`kpis` is `{}` and every list is `[]`); tiles show a dash with no delta or trend, the exports disable, and the stacked chart, donut and table each keep their box with an `EmptyState` that names the reason.
- Error: the request for the period failed (`error` is set); tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load, carries the message and offers Retry.

## Related

- `dashboard/dashboard-executive-summary` — targets and trends instead of parts.
- `dashboard/dashboard-analytics` — non-exclusive series as lines.
- `account/account-change-plan-drawer` — where a reader acts on the spend.
- `DonutChart` / `Chart` — share now, mix over time.

## Variants

- `Default` — primary (the code below)
- `Loading` — While the first response loads, every tile, both charts and the table hold their place with a Skeleton, so the grid does not reflow when data arrives.
- `Empty` — Nothing was billed in the selected period. The tiles show a dash with no delta or trend, and the stacked chart, the donut and the table each keep their box with an EmptyState that names the reason.
- `Error` — The request for the period failed: the tiles read as dashes, and every card keeps its header with a danger Alert that names what did not load and offers Retry.

Each variant is the same screen in another state: `get_block("dashboard/dashboard-breakdown", { variant })`, or the file under `blocks/dashboard/dashboard-breakdown/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { toast } from '@aziontech/webkit/toast'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref } from 'vue'

  import ContributorsTable from './parts/contributors-table.vue'
  import SpendCard from './parts/spend-card.vue'
  import { sampleContributors, sampleKpis, sampleLabels, sampleSeries, sampleSplit } from './sample'

  /** A summary tile. */
  export type BreakdownDashboardMetric = 'total' | 'compute' | 'database' | 'storage'

  /** The figure a summary tile shows. */
  export interface BreakdownDashboardKpi {
    /** Spend this month in USD; null reads as a dash. */
    value: number | null
    /** Percent change against last month; null hides the delta. */
    delta: number | null
    /** Monthly spend over the range, drawn as the tile sparkline, null for an interval with no data. */
    trend: (number | null)[]
  }

  /** The figures of the summary tiles, by metric; a metric left out reads as a dash. */
  export type BreakdownDashboardKpis = Partial<
    Record<BreakdownDashboardMetric, BreakdownDashboardKpi>
  >

  /** One row of Top contributors. */
  export interface BreakdownDashboardContributor {
    /** Stable key. */
    id: string
    /** Position by spend, 1 for the largest. */
    rank: number
    /** The resource name. */
    name: string
    /** Icon class of the resource kind. */
    icon: string
    /** The spend category it bills to. */
    category: string
    /** Spend this month in USD. */
    amount: number
    /** Percent of the total spend. */
    share: number
    /** Percent change against last month. */
    change: number
  }

  /** A card whose data can be exported as CSV. */
  export type BreakdownDashboardCard = 'spend-by-category' | 'current-split' | 'top-contributors'

  export interface BreakdownDashboardProps {
    /** The summary tile figures. Left out, the sample renders. */
    kpis?: BreakdownDashboardKpis
    /** The month labels of Spend by category. Left out, the sample renders. */
    labels?: string[]
    /** Monthly spend, one series per category. Left out, the sample renders. */
    series?: ChartSeries[]
    /** This month's spend by category, one value per series. Left out, the sample renders. */
    split?: ChartSeries[]
    /** The resources that cost the most this month. Left out, the sample renders. */
    contributors?: BreakdownDashboardContributor[]
    /** The period is loading: every tile, chart and the table show their skeleton. */
    loading?: boolean
    /** Why the period could not load, after the name of each card in its danger alert. */
    error?: string
  }

  const props = withDefaults(defineProps<BreakdownDashboardProps>(), {
    kpis: undefined,
    labels: undefined,
    series: undefined,
    split: undefined,
    contributors: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
    export: [event: Event, card: BreakdownDashboardCard]
  }>()

  const period = defineModel<string>('period', { default: '12m' })

  const comparison = 'vs previous month'

  const tiles: { metric: BreakdownDashboardMetric; label: string; description: string }[] = [
    {
      metric: 'total',
      label: 'Total spend',
      description: 'Everything billed to the organization this month.'
    },
    {
      metric: 'compute',
      label: 'Compute',
      description: 'Spend on compute this month, the share of the total it carries.'
    },
    {
      metric: 'database',
      label: 'Database',
      description: 'Spend on database this month, the share of the total it carries.'
    },
    {
      metric: 'storage',
      label: 'Storage',
      description: 'Spend on storage this month, the share of the total it carries.'
    }
  ]

  const blocked = computed(() => props.loading || props.error !== '')
  const kpis = computed(() => props.kpis ?? (blocked.value ? {} : sampleKpis))
  const labels = computed(() => props.labels ?? (blocked.value ? [] : sampleLabels))
  const series = computed(() => props.series ?? (blocked.value ? [] : sampleSeries))
  const split = computed(() => props.split ?? (blocked.value ? [] : sampleSplit))
  const contributors = computed(
    () => props.contributors ?? (blocked.value ? [] : sampleContributors)
  )
  const exportable = computed(
    () =>
      !blocked.value &&
      (series.value.length > 0 || split.value.length > 0 || contributors.value.length > 0)
  )

  const periods = [
    {
      label: 'Last 12 months',
      value: '12m'
    },
    {
      label: 'Last 6 months',
      value: '6m'
    },
    {
      label: 'This year',
      value: 'ytd'
    }
  ]

  const forms = [
    {
      label: 'Area',
      value: 'area'
    },
    {
      label: 'Bar',
      value: 'bar'
    }
  ]

  const { formatNumber } = useLocale()

  const spendFormat = (value: number) =>
    formatNumber(value, {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    })

  const formatters = {
    spend: (value: number) => spendFormat(value)
  }

  const trendForm = ref('area')

  const csvColumns = (headers: Record<string, string>): CsvColumn[] =>
    Object.entries(headers).map(([id, header]) => ({ id, header }))

  interface CsvReport {
    columns: () => CsvColumn[]
    rows: () => object[]
  }

  const reports: Record<BreakdownDashboardCard, CsvReport> = {
    'spend-by-category': {
      columns: () => [
        ...csvColumns({ month: 'Month' }),
        ...series.value.map((entry) => ({ id: entry.id, header: entry.name }))
      ],
      rows: () =>
        labels.value.map((month, index) => ({
          month,
          ...Object.fromEntries(series.value.map((entry) => [entry.id, entry.values[index] ?? '']))
        }))
    },
    'current-split': {
      columns: () => csvColumns({ category: 'Category', amount: 'Spend (USD)' }),
      rows: () =>
        split.value.map((entry) => ({ category: entry.name, amount: entry.values[0] ?? '' }))
    },
    'top-contributors': {
      columns: () =>
        csvColumns({
          rank: 'Rank',
          name: 'Resource',
          category: 'Category',
          amount: 'Spend (USD)',
          share: 'Share (%)',
          change: 'Change (%)'
        }),
      rows: () => contributors.value
    }
  }

  const periodSlug = computed(() =>
    (periods.find((option) => option.value === period.value)?.label ?? 'period')
      .toLowerCase()
      .replaceAll(' ', '-')
  )

  const exportCsv = (event: Event, card: BreakdownDashboardCard) => {
    emit('export', event, card)
    const filename = `${card}-${periodSlug.value}.csv`
    try {
      const report = reports[card]
      downloadCsv(filename, toCsv({ columns: report.columns(), rows: report.rows() }))
      toast.success('CSV exported.', { description: filename })
    } catch {
      toast.error('The CSV could not be exported.', { description: 'Try again in a moment.' })
    }
  }

  const onCardOption = (event: Event, card: BreakdownDashboardCard, value: string | number) => {
    if (value === 'export') exportCsv(event, card)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--spacing-lg)">
      <PageHeader
        title="Cost breakdown"
        description="How the organization’s spend splits across categories and the resources that drive it."
      >
        <template #actions>
          <div class="w-full md:w-48">
            <Select
              variant="ghost"
              v-model="period"
              size="medium"
              :display-value="
                (value) => periods.find((option) => option.value === value)?.label ?? String(value)
              "
            >
              <Select.Trigger aria-label="Period" />
              <Select.Content>
                <Select.Item
                  v-for="option in periods"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </div>
          <Button
            label="Export CSV"
            icon="az az-download"
            variant="outline"
            size="medium"
            :disabled="!exportable"
            @click="(event: MouseEvent) => exportCsv(event, 'spend-by-category')"
          />
        </template>
      </PageHeader>

      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
        <li
          v-for="tile in tiles"
          :key="tile.metric"
          class="flex min-w-0 flex-col"
        >
          <StatTile
            :label="tile.label"
            :value="kpis[tile.metric]?.value ?? null"
            :format-value="formatters.spend"
            :delta="kpis[tile.metric]?.delta ?? null"
            :delta-label="comparison"
            inverse
            :trend="kpis[tile.metric]?.trend ?? []"
            :loading="loading"
            :error="error"
          >
            <template #aside>
              <Hint :content="tile.description" />
            </template>
          </StatTile>
        </li>
      </ul>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <SpendCard
          v-model:form="trendForm"
          :span="8"
          title="Spend by category"
          hint="Monthly spend stacked by category; the top edge is the total. Legend totals sum the whole range."
          :forms="forms"
          :exportable="exportable"
          :error="error"
          @select="(event, value) => onCardOption(event, 'spend-by-category', value)"
          @retry="(event) => emit('retry', event)"
        >
          <Chart
            :series="series"
            :labels="labels"
            :format-value="formatters.spend"
            empty-title="No spend in this range"
            empty-description="Nothing was billed to the organization in the selected period."
            :loading="loading"
          >
            <Chart.Grid />
            <Chart.Axis type="y" />
            <Chart.Axis type="x" />
            <Chart.Bar
              v-if="trendForm === 'bar'"
              stacked
            />
            <Chart.Area
              v-else
              stacked
            />
            <Chart.Crosshair />
            <Chart.Tooltip />
            <Chart.Legend total />
          </Chart>
        </SpendCard>

        <SpendCard
          :span="4"
          title="Current split"
          hint="This month’s spend by category, with the total in the center."
          :exportable="exportable"
          :error="error"
          @select="(event, value) => onCardOption(event, 'current-split', value)"
          @retry="(event) => emit('retry', event)"
        >
          <DonutChart
            :series="split"
            :format-value="formatters.spend"
            total-label="This month"
            empty-title="No spend in this range"
            empty-description="Nothing was billed to the organization in the selected period."
            :loading="loading"
            aria-label="Current split"
          />
        </SpendCard>

        <SpendCard
          :span="12"
          title="Top contributors"
          hint="The resources that cost the most this month, their share of the total and the change against last month."
          :exportable="exportable"
          :error="error"
          @select="(event, value) => onCardOption(event, 'top-contributors', value)"
          @retry="(event) => emit('retry', event)"
        >
          <ContributorsTable
            :contributors="contributors"
            :loading="loading"
          />
        </SpendCard>
      </div>
    </div>
  </div>
</template>
```

## `sample.ts`

```ts
import type { ChartSeries } from '@aziontech/webkit/chart'

import type {
  BreakdownDashboardContributor,
  BreakdownDashboardKpis
} from './dashboard-breakdown.vue'

export const sampleKpis: BreakdownDashboardKpis = {
  total: {
    value: 38500,
    delta: 4.05,
    trend: [27600, 28100, 29000, 29900, 31000, 31700, 32700, 33700, 34700, 35600, 37000, 38500]
  },
  compute: {
    value: 16900,
    delta: 4.32,
    trend: [11800, 12100, 12400, 12900, 13300, 13700, 14200, 14600, 15100, 15500, 16200, 16900]
  },
  database: {
    value: 9400,
    delta: 3.3,
    trend: [7200, 7300, 7500, 7600, 7800, 8000, 8100, 8300, 8600, 8800, 9100, 9400]
  },
  storage: {
    value: 6000,
    delta: 3.45,
    trend: [4100, 4300, 4400, 4600, 4800, 5000, 5100, 5300, 5500, 5600, 5800, 6000]
  }
}

export const sampleLabels: string[] = [
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov'
]

export const sampleSeries: ChartSeries[] = [
  {
    id: 'compute',
    name: 'Compute',
    values: [11800, 12100, 12400, 12900, 13300, 13700, 14200, 14600, 15100, 15500, 16200, 16900]
  },
  {
    id: 'database',
    name: 'Database',
    values: [7200, 7300, 7500, 7600, 7800, 8000, 8100, 8300, 8600, 8800, 9100, 9400]
  },
  {
    id: 'storage',
    name: 'Storage',
    values: [4100, 4300, 4400, 4600, 4800, 5000, 5100, 5300, 5500, 5600, 5800, 6000]
  },
  {
    id: 'networking',
    name: 'Networking',
    values: [3000, 2900, 3100, 3200, 3400, 3300, 3500, 3700, 3600, 3800, 3900, 4100]
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    values: [1500, 1500, 1600, 1600, 1700, 1700, 1800, 1800, 1900, 1900, 2000, 2100]
  }
]

export const sampleSplit: ChartSeries[] = [
  {
    id: 'compute',
    name: 'Compute',
    values: [16900]
  },
  {
    id: 'database',
    name: 'Database',
    values: [9400]
  },
  {
    id: 'storage',
    name: 'Storage',
    values: [6000]
  },
  {
    id: 'networking',
    name: 'Networking',
    values: [4100]
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    values: [2100]
  }
]

export const sampleContributors: BreakdownDashboardContributor[] = [
  {
    id: 'web-app',
    rank: 1,
    name: 'web-app',
    icon: 'az az-server',
    category: 'Compute',
    amount: 6200,
    share: 16.1,
    change: 5.08
  },
  {
    id: 'worker-pool',
    rank: 2,
    name: 'worker-pool',
    icon: 'az az-server',
    category: 'Compute',
    amount: 5900,
    share: 15.3,
    change: 5.36
  },
  {
    id: 'orders-db',
    rank: 3,
    name: 'orders-db',
    icon: 'az az-database',
    category: 'Database',
    amount: 5400,
    share: 14,
    change: 5.88
  },
  {
    id: 'api-service',
    rank: 4,
    name: 'api-service',
    icon: 'az az-server',
    category: 'Compute',
    amount: 4800,
    share: 12.5,
    change: 2.13
  },
  {
    id: 'analytics-warehouse',
    rank: 5,
    name: 'analytics-warehouse',
    icon: 'az az-database',
    category: 'Database',
    amount: 4000,
    share: 10.4,
    change: 0
  },
  {
    id: 'media-files',
    rank: 6,
    name: 'media-files',
    icon: 'az az-folder',
    category: 'Storage',
    amount: 3700,
    share: 9.6,
    change: 8.82
  },
  {
    id: 'public-egress',
    rank: 7,
    name: 'public-egress',
    icon: 'az az-globe',
    category: 'Networking',
    amount: 2600,
    share: 6.8,
    change: 4
  },
  {
    id: 'backups',
    rank: 8,
    name: 'backups',
    icon: 'az az-folder',
    category: 'Storage',
    amount: 2300,
    share: 6,
    change: -4.17
  },
  {
    id: 'logs-pipeline',
    rank: 9,
    name: 'logs-pipeline',
    icon: 'az az-chart-line',
    category: 'Monitoring',
    amount: 2100,
    share: 5.5,
    change: 5
  },
  {
    id: 'load-balancer',
    rank: 10,
    name: 'load-balancer',
    icon: 'az az-globe',
    category: 'Networking',
    amount: 1500,
    share: 3.9,
    change: 7.14
  }
]
```

## `parts/contributors-table.vue`

```ts
<script setup lang="ts">
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Progress from '@aziontech/webkit/progress'
  import Tag from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import type { BreakdownDashboardContributor } from '../dashboard-breakdown.vue'

  export interface ContributorsTableProps {
    /** The resources that cost the most this month. */
    contributors: BreakdownDashboardContributor[]
    /** The rows are loading. */
    loading: boolean
  }

  defineProps<ContributorsTableProps>()

  const contributorColumns: TableColumn[] = [
    {
      accessorKey: 'rank',
      header: 'Rank',
      align: 'start',
      sortable: true,
      minWidth: 64
    },
    {
      accessorKey: 'name',
      header: 'Name',
      align: 'start',
      sortable: true,
      principal: true,
      grow: 2
    },
    {
      accessorKey: 'category',
      header: 'Category',
      align: 'start',
      sortable: true,
      minWidth: 120
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      align: 'end',
      sortable: true,
      minWidth: 104
    },
    {
      accessorKey: 'share',
      header: 'Share of total',
      align: 'start',
      sortable: true,
      minWidth: 160
    },
    {
      accessorKey: 'change',
      header: 'Change',
      align: 'end',
      sortable: true,
      minWidth: 104
    }
  ]

  const { formatNumber } = useLocale()

  const formatters = {
    amount: (value: number) =>
      formatNumber(value, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    share: (value: number) => `${value.toFixed(1)}%`,
    change: (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }
</script>

<template>
  <DataTable
    :data="contributors"
    :columns="contributorColumns"
    row-key="id"
    sortable
    density="compact"
    bordered
    :loading="loading"
  >
    <template #empty>
      <EmptyState
        size="small"
        icon="az az-chart-bar"
        title="No spend in this range"
        description="Nothing was billed to the organization in the selected period."
      />
    </template>

    <template #cell-rank="{ row }">
      <span class="tabular-nums text-(--text-muted)">{{ row.rank }}</span>
    </template>

    <template #cell-name="{ row }">
      <div class="flex min-w-0 items-center gap-(--spacing-xs)">
        <i
          :class="row.icon"
          class="shrink-0 text-body-lg text-(--text-muted)"
          aria-hidden="true"
        />
        <span class="truncate">{{ row.name }}</span>
      </div>
    </template>

    <template #cell-category="{ row }">
      <Tag
        :label="row.category"
        severity="neutral"
        size="small"
      />
    </template>

    <template #cell-amount="{ row }">
      <span class="tabular-nums">{{ formatters.amount(row.amount) }}</span>
    </template>

    <template #cell-share="{ row }">
      <div class="flex w-full min-w-0 items-center gap-(--spacing-sm)">
        <div class="w-16 shrink-0">
          <Progress
            :value="row.share"
            size="small"
            :aria-label="row.name + ' share of total'"
          />
        </div>
        <span class="tabular-nums">{{ formatters.share(row.share) }}</span>
      </div>
    </template>

    <template #cell-change="{ row }">
      <Tag
        :label="formatters.change(row.change)"
        :severity="row.change > 0 ? 'danger' : row.change < 0 ? 'success' : 'neutral'"
        :icon="
          row.change > 0
            ? 'az az-arrow-up-right'
            : row.change < 0
              ? 'az az-arrow-down-right'
              : 'az az-minus'
        "
        size="small"
      />
    </template>
  </DataTable>
</template>
```

## `parts/spend-card.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'

  export interface SpendCardProps {
    /** Columns of the 12-column grid the card spans. */
    span: number
    /** The card title; its lower case names the card in the error alert. */
    title: string
    /** One sentence on what the card shows. */
    hint: string
    /** The chart forms of the header toggle; empty hides it. */
    forms?: ToggleGroupOption[]
    /** Export CSV can run. */
    exportable: boolean
    /** Why the period could not load; shows a danger alert with Retry. */
    error: string
  }

  withDefaults(defineProps<SpendCardProps>(), { forms: () => [] })

  const emit = defineEmits<{
    select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
    retry: [event: MouseEvent]
  }>()

  const form = defineModel<string>('form', { default: '' })

  defineSlots<{ default(): unknown }>()
</script>

<template>
  <ChartCard :span="span">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>{{ title }}</ChartCard.Title>
        <Hint :content="hint" />
      </span>
      <ChartCard.Action>
        <ToggleGroup
          v-if="forms.length"
          v-model="form"
          :options="forms"
          size="small"
          :aria-label="`Chart form for ${title}`"
        />
        <DropdownMenu
          side="bottom"
          align="end"
          @select="(event, value) => emit('select', event, value)"
        >
          <DropdownMenu.Trigger>
            <IconButton
              icon="az az-ellipsis"
              variant="ghost"
              size="small"
              :aria-label="`More options for ${title}`"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="export"
              label="Export CSV"
              :disabled="!exportable"
            />
          </DropdownMenu.Group>
        </DropdownMenu>
      </ChartCard.Action>
    </ChartCard.Header>
    <ChartCard.Content>
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load ${title.toLowerCase()}. ${error}`"
        action-label="Retry"
        @action="(event: MouseEvent) => emit('retry', event)"
      />
      <slot v-else />
    </ChartCard.Content>
  </ChartCard>
</template>
```
