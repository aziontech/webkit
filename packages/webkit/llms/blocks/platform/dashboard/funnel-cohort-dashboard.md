# FunnelCohortDashboard (`platform/dashboard/funnel-cohort-dashboard`)

> A funnel and cohort dashboard: how people move through the steps from a first visit to a paid plan, and how well each weekly sign-up cohort is retained. The page opens with a heading and one global filter bar, a period and a segment `Select`, so every region renders the same slice. Below it, a row of five `StatTile`s (visitors, sign-ups, activated, paid and overall conversion, each against the previous period with a sparkline) sits over a 12-column grid of `ChartCard`s. The conversion funnel spans the grid: a horizontal, labeled `Chart.Bar` of the steps beside a `TableRoot` that states each step’s users, its share of visitors and the drop-off from the step before. Cohort retention shares the next row: a multi-series `Chart.Line` of retention by week since sign-up, one series per weekly cohort, and a cohort `TableRoot` with each cohort’s size and its week 1 to week 6 retention in tabular figures, where a dash marks a week that has not ended. There is no heatmap: the retention matrix is a plain table, not colored cells. Each card header carries a title with a `Hint` and a menu with Export CSV. Built from `PageHeader`, `Select`, `StatTile`, `ChartCard`, `Chart`, `TableRoot`, `EmptyState`, `Hint`, `DropdownMenu`, `IconButton` and `Button`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/dashboard/funnel-cohort-dashboard/funnel-cohort-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/dashboard/funnel-cohort-dashboard")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Chart](../../../components/chart.md), [ChartCard](../../../components/chart-card.md), [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [Hint](../../../components/hint.md), [IconButton](../../../components/icon-button.md), [PageHeader](../../../components/page-header.md), [Select](../../../components/select.md), [StatTile](../../../components/stat-tile.md), `TableRoot`
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

funnel dashboard; conversion funnel; cohort retention; retention heatmap; signup to paid; growth dashboard; funil de conversão; retenção por coorte; painel de funil

The growth page: how people move through the steps from a first visit to a paid plan, where they drop
off, and how well each weekly sign-up cohort keeps coming back. One global filter bar (period and
segment) drives every region, so the funnel, the tiles and the cohorts always describe the same slice
of users.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- A sequence of steps where each one is a subset of the one before (visit, sign-up, activation, paid).
- Retention by cohort: groups that started in the same week, measured at the same offsets after.
- The reader compares segments by switching one filter and watching every region move.

## When not to use

- Parts of a total that do not happen in order: use `platform/dashboard/composition-dashboard`.
- Plain traffic over time: use `platform/dashboard/analytics-dashboard`.
- Configuring the onboarding steps themselves: use `platform/account/onboarding-form`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Funnel and retention` with one sentence on what it measures.

### B. Period and segment — `Select` (required)

One filter bar labelled `Filters` with a period (`Last 30 days`, `Last 6 weeks`, `Last 90 days`) and a
segment (`All users`, `Self-serve`, `Sales-assisted`, `Partner referrals`). The bar stays usable while
the page loads.

### C. Step tiles — `StatTile` (required)

Five tiles: `Visitors`, `Sign-ups`, `Activated`, `Paid`, `Overall conversion`, each against the
previous period with a sparkline.

### D. Definitions — `Hint` (required)

On every tile and card title. The funnel `Hint` states the counting rule:
`Unique users who reached each step in the period, in order, with the share lost between steps.`

### E. Cards — `ChartCard` (required)

`Conversion funnel` spans the grid; `Retention by cohort` and `Weekly cohorts` share the next row.

### F. More options — `DropdownMenu` (optional)

`Export CSV` in each card header.

### G. More options trigger — `IconButton` (optional)

Icon-only, `aria-label="More options for Conversion funnel"` and so on per card.

### H. Funnel and retention charts — `Chart` (required)

The funnel is a horizontal, labeled `Chart.Bar` of the steps in order, never re-sorted by size.
Retention is a multi-series `Chart.Line` by week since sign-up, one series per weekly cohort
(`Sep 28 cohort` …) in categorical order.

### I. Clear filters — `Button` (required in the empty state)

In each chart's and table's empty actions, `Clear filters` resets the period and the segment. It is the
only recovery when the filters match nothing.

### J. Step and cohort tables — `TableRoot` (required)

Beside the funnel, a table states each step's users, share of visitors and drop-off from the step
before. The cohort table lists each cohort's size and its week 1 to week 6 retention in tabular
figures, where a dash marks a week that has not ended. The retention matrix is a plain table, not a
heatmap.

### K. Empty regions — `EmptyState` (required)

`No visitors match these filters` / `Select another segment or widen the period.` and
`No cohorts match these filters`, each with `Clear filters`.

## Do

- Keep the funnel steps in their real order and show both the count and the drop-off.
- Use a dash, not zero, for a week that has not ended yet.
- Let one filter bar drive every region.
- Name the filters as the reason when nothing matches.

## Don't

- Don't color a retention matrix as a heatmap; a plain table with tabular figures is easier to compare.
- Don't sort the funnel by size.
- Don't add filters inside cards.
- Don't plot more than six cohorts as lines; fold the rest or narrow the period.

## Copy

- **Title:** `Funnel and retention`.
- **Description:** `How visitors move from a first visit to a paid plan, and how many of each weekly sign-up cohort keep coming back.`
- **Step names:** the state the user reached, one or two words. `Sign-ups`, `Activated`, `Paid`.
- **Cohort names:** the start date. `Oct 5 cohort`.
- **Column headers:** `Week 1` … `Week 6`.
- **Empty state:** `No visitors match these filters` / `Select another segment or widen the period.`, action `Clear filters`.

## Accessibility

- The filter bar is labelled `Filters`; each `Select` has an `aria-label` (`Period`, `Segment`).
- Funnel bars are labeled with their values, and the step table states the same numbers as text.
- Figures use `tabular-nums`.
- The `Weekly cohorts` `Hint` explains the dash (`A dash marks a week that has not ended yet.`), so the symbol is never unexplained.

## States

- Default: the funnel and cohorts for the selected period and segment.
- Loading: every tile, both charts and both tables hold their place with a `Skeleton`; the filter bar stays usable.
- Empty: the filters match nothing; tiles show a dash with no delta or trend, and each card keeps its box with an `EmptyState` that names the filters and offers `Clear filters`.
- Failed: the request for the period failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/composition-dashboard` — parts of a whole without order.
- `platform/dashboard/executive-summary-dashboard` — the headline conversion beside other results.
- `platform/account/onboarding-form` — the steps a new user goes through.

## Variants

- `Default` — primary (the code below)
- `Loading` — While the first response loads, every tile, both charts and both tables hold their place with a Skeleton, so the grid does not reflow when data arrives. The filter bar stays usable.
- `Empty` — The filters match nothing. The tiles show a dash with no delta or trend, and each card keeps its box with an EmptyState that names the filters as the reason and offers Clear filters, which resets the period and the segment.
- `Failed` — The request for the period failed: the tiles read as dashes, and every card keeps its header with a danger Alert that names what did not load and offers Retry.

Each variant is the same screen in another state: `get_pattern("platform/dashboard/funnel-cohort-dashboard", { variant })`, or the file under `blocks/platform/dashboard/funnel-cohort-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot from '@aziontech/webkit/table-root'
  import { computed, ref } from 'vue'

  const loading = false

  const periods = [
    {
      value: '30d',
      label: 'Last 30 days',
      comparison: 'vs previous 30 days'
    },
    {
      value: '6w',
      label: 'Last 6 weeks',
      comparison: 'vs previous 6 weeks'
    },
    {
      value: '90d',
      label: 'Last 90 days',
      comparison: 'vs previous 90 days'
    }
  ]

  const segments = [
    {
      value: 'all',
      label: 'All users'
    },
    {
      value: 'self-serve',
      label: 'Self-serve'
    },
    {
      value: 'sales-assisted',
      label: 'Sales-assisted'
    },
    {
      value: 'partners',
      label: 'Partner referrals'
    }
  ]

  const segmentsWithData = ['all', 'self-serve', 'sales-assisted']

  const figures = [
    {
      id: 'visitors',
      label: 'Visitors',
      description: 'Unique people who visited the product site in the period.',
      value: 48200,
      format: 'number',
      delta: 8.2,
      trend: [7600, 7900, 8100, 7800, 8300, 8500]
    },
    {
      id: 'sign-ups',
      label: 'Sign-ups',
      description: 'Visitors who created an account in the period.',
      value: 6748,
      format: 'number',
      delta: 4.1,
      trend: [1084, 1136, 1052, 1210, 1098, 1168]
    },
    {
      id: 'activated',
      label: 'Activated',
      description: 'New accounts that created their first project.',
      value: 3914,
      format: 'number',
      delta: -2.6,
      trend: [630, 660, 610, 700, 640, 674]
    },
    {
      id: 'paid',
      label: 'Paid',
      description: 'Activated accounts that started a paid plan.',
      value: 1135,
      format: 'number',
      delta: 5.3,
      trend: [180, 192, 176, 204, 188, 195]
    },
    {
      id: 'conversion',
      label: 'Overall conversion',
      description:
        'Paid accounts as a share of visitors, from the first visit to the first payment.',
      value: 2.35,
      format: 'share',
      delta: -2.7,
      trend: [2.37, 2.43, 2.17, 2.62, 2.27, 2.29]
    }
  ]

  const stages = ['Visited', 'Signed up', 'Activated', 'Paid']

  const funnel = [
    {
      id: 'users',
      name: 'Users',
      values: [48200, 6748, 3914, 1135]
    }
  ]

  const steps = [
    {
      id: 'visited',
      step: 'Visited',
      users: 48200,
      share: 100,
      dropoff: null,
      from: ''
    },
    {
      id: 'signed-up',
      step: 'Signed up',
      users: 6748,
      share: 14,
      dropoff: 86,
      from: 'Visited'
    },
    {
      id: 'activated',
      step: 'Activated',
      users: 3914,
      share: 8.12,
      dropoff: 42,
      from: 'Signed up'
    },
    {
      id: 'paid',
      step: 'Paid',
      users: 1135,
      share: 2.35,
      dropoff: 71,
      from: 'Activated'
    }
  ]

  const stepColumns = [
    {
      id: 'step',
      accessorKey: 'step',
      header: 'Step',
      align: 'start',
      principal: true
    },
    {
      id: 'users',
      accessorKey: 'users',
      header: 'Users',
      align: 'end'
    },
    {
      id: 'share',
      accessorKey: 'share',
      header: 'Of visitors',
      align: 'end',
      minWidth: 112
    },
    {
      id: 'dropoff',
      accessorKey: 'dropoff',
      header: 'Drop-off',
      align: 'end',
      minWidth: 208
    }
  ]

  const weeks = [
    {
      key: 'week1',
      label: 'Week 1',
      slot: 'cell-week1'
    },
    {
      key: 'week2',
      label: 'Week 2',
      slot: 'cell-week2'
    },
    {
      key: 'week3',
      label: 'Week 3',
      slot: 'cell-week3'
    },
    {
      key: 'week4',
      label: 'Week 4',
      slot: 'cell-week4'
    },
    {
      key: 'week5',
      label: 'Week 5',
      slot: 'cell-week5'
    },
    {
      key: 'week6',
      label: 'Week 6',
      slot: 'cell-week6'
    }
  ]

  const weekLabels = weeks.map((week) => week.label)

  const cohorts = [
    {
      id: 'sep-28',
      cohort: 'Sep 28',
      size: 1084,
      week1: 58,
      week2: 41,
      week3: 34,
      week4: 30,
      week5: 27,
      week6: 25
    },
    {
      id: 'oct-5',
      cohort: 'Oct 5',
      size: 1136,
      week1: 61,
      week2: 45,
      week3: 38,
      week4: 33,
      week5: 30,
      week6: null
    },
    {
      id: 'oct-12',
      cohort: 'Oct 12',
      size: 1052,
      week1: 55,
      week2: 39,
      week3: 32,
      week4: 28,
      week5: null,
      week6: null
    },
    {
      id: 'oct-19',
      cohort: 'Oct 19',
      size: 1210,
      week1: 66,
      week2: 52,
      week3: 45,
      week4: null,
      week5: null,
      week6: null
    },
    {
      id: 'oct-26',
      cohort: 'Oct 26',
      size: 1098,
      week1: 70,
      week2: 57,
      week3: null,
      week4: null,
      week5: null,
      week6: null
    },
    {
      id: 'nov-2',
      cohort: 'Nov 2',
      size: 1168,
      week1: 72,
      week2: null,
      week3: null,
      week4: null,
      week5: null,
      week6: null
    }
  ]

  const retention = [
    {
      id: 'sep-28',
      name: 'Sep 28 cohort',
      values: [58, 41, 34, 30, 27, 25]
    },
    {
      id: 'oct-5',
      name: 'Oct 5 cohort',
      values: [61, 45, 38, 33, 30, null]
    },
    {
      id: 'oct-12',
      name: 'Oct 12 cohort',
      values: [55, 39, 32, 28, null, null]
    },
    {
      id: 'oct-19',
      name: 'Oct 19 cohort',
      values: [66, 52, 45, null, null, null]
    },
    {
      id: 'oct-26',
      name: 'Oct 26 cohort',
      values: [70, 57, null, null, null, null]
    },
    {
      id: 'nov-2',
      name: 'Nov 2 cohort',
      values: [72, null, null, null, null, null]
    }
  ]

  const cohortColumns = [
    {
      id: 'cohort',
      accessorKey: 'cohort',
      header: 'Cohort',
      align: 'start',
      principal: true
    },
    {
      id: 'size',
      accessorKey: 'size',
      header: 'Users',
      align: 'end'
    },
    {
      id: 'week1',
      accessorKey: 'week1',
      header: 'Week 1',
      align: 'end'
    },
    {
      id: 'week2',
      accessorKey: 'week2',
      header: 'Week 2',
      align: 'end'
    },
    {
      id: 'week3',
      accessorKey: 'week3',
      header: 'Week 3',
      align: 'end'
    },
    {
      id: 'week4',
      accessorKey: 'week4',
      header: 'Week 4',
      align: 'end'
    },
    {
      id: 'week5',
      accessorKey: 'week5',
      header: 'Week 5',
      align: 'end'
    },
    {
      id: 'week6',
      accessorKey: 'week6',
      header: 'Week 6',
      align: 'end'
    }
  ]

  const grouped = new Intl.NumberFormat('en-US')
  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const formatters = {
    number: (value) => grouped.format(value),
    compact: (value) => compact.format(value),
    percent: (value) => (value === null ? '—' : `${value.toFixed(0)}%`),
    share: (value) => `${value.toFixed(1)}%`,
    drop: (value) => `−${value.toFixed(1)}%`
  }

  const period = ref('6w')
  const segment = ref('all')

  const optionLabel = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''
  const periodLabel = optionLabel(periods)
  const segmentLabel = optionLabel(segments)
  const comparison = computed(
    () => periods.find((option) => option.value === period.value)?.comparison ?? ''
  )

  const matches = computed(() => segmentsWithData.includes(segment.value))
  const view = computed(() =>
    matches.value
      ? { figures, funnel, steps, retention, cohorts }
      : {
          figures: figures.map((figure) => ({ ...figure, value: null, delta: null, trend: [] })),
          funnel: [],
          steps: [],
          retention: [],
          cohorts: []
        }
  )

  const activeIndex = ref(null)

  const clearFilters = () => {
    period.value = '6w'
    segment.value = 'all'
  }
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-lg) p-(--spacing-lg)">
    <PageHeader
      title="Funnel and retention"
      description="How visitors move from a first visit to a paid plan, and how many of each weekly sign-up cohort keep coming back."
    />

    <div
      role="group"
      aria-label="Filters"
      class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)"
    >
      <div class="min-w-36 grow basis-(--container-3xs) sm:grow-0">
        <Select
          v-model="period"
          size="medium"
          class="w-full"
          :display-value="periodLabel"
        >
          <Select.Trigger aria-label="Period" />
          <Select.Content>
            <Select.Option
              v-for="option in periods"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
      <div class="min-w-36 grow basis-(--container-3xs) sm:grow-0">
        <Select
          v-model="segment"
          size="medium"
          class="w-full"
          :display-value="segmentLabel"
        >
          <Select.Trigger aria-label="Segment" />
          <Select.Content>
            <Select.Option
              v-for="option in segments"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
    </div>

    <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <li
        v-for="figure in view.figures"
        :key="figure.id"
        class="flex min-w-0 flex-col"
      >
        <StatTile
          :label="figure.label"
          :value="figure.value"
          :format-value="formatters[figure.format]"
          :delta="figure.delta"
          :delta-label="comparison"
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
            <ChartCard.Title>Conversion funnel</ChartCard.Title>
            <Hint
              text="Unique users who reached each step in the period, in order, with the share lost between steps."
            />
          </span>
          <ChartCard.Controls>
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Conversion funnel"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="export"
                  label="Export CSV"
                />
              </DropdownMenu.Group>
            </DropdownMenu>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <div
            :data-empty="(!loading && !view.steps.length) || null"
            class="grid min-w-0 grid-cols-1 items-start gap-(--spacing-md) xl:grid-cols-2 data-empty:xl:grid-cols-1"
          >
            <Chart
              :series="view.funnel"
              :labels="stages"
              orientation="horizontal"
              :format-value="formatters.compact"
              :height="200"
              empty-title="No visitors match these filters"
              empty-description="Select another segment or widen the period."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar labeled />
              <Chart.Tooltip />
              <template #empty-actions>
                <Button
                  label="Clear filters"
                  kind="outlined"
                  size="small"
                  @click="clearFilters"
                />
              </template>
            </Chart>

            <TableRoot
              v-if="loading || view.steps.length"
              :data="view.steps"
              :columns="stepColumns"
              row-key="id"
              header-kind="compact"
              bordered
              :loading="loading"
            >
              <template #cell-users="{ row }">
                <span class="tabular-nums">{{ formatters.number(row.users) }}</span>
              </template>
              <template #cell-share="{ row }">
                <span class="tabular-nums">{{ formatters.share(row.share) }}</span>
              </template>
              <template #cell-dropoff="{ row }">
                <span
                  v-if="row.dropoff === null"
                  class="text-(--text-muted)"
                  >—</span
                >
                <span
                  v-else
                  class="tabular-nums"
                  >{{ formatters.drop(row.dropoff) }} from {{ row.from }}</span
                >
              </template>
            </TableRoot>
          </div>
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="6">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Retention by cohort</ChartCard.Title>
            <Hint
              text="Share of each weekly sign-up cohort still active in each week since sign-up."
            />
          </span>
          <ChartCard.Controls>
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Retention by cohort"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
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
            :series="view.retention"
            :labels="weekLabels"
            :max="100"
            :format-value="formatters.percent"
            empty-title="No cohorts match these filters"
            empty-description="Select another segment or widen the period."
            :loading="loading"
          >
            <Chart.Grid />
            <Chart.Axis kind="y" />
            <Chart.Axis kind="x" />
            <Chart.Line markers />
            <Chart.Crosshair />
            <Chart.Tooltip />
            <Chart.Legend />
            <template #empty-actions>
              <Button
                label="Clear filters"
                kind="outlined"
                size="small"
                @click="clearFilters"
              />
            </template>
          </Chart>
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="6">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Weekly cohorts</ChartCard.Title>
            <Hint
              text="Users who signed up each week, and the share of them active in each week since. A dash marks a week that has not ended yet."
            />
          </span>
          <ChartCard.Controls>
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Weekly cohorts"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="export"
                  label="Export CSV"
                />
              </DropdownMenu.Group>
            </DropdownMenu>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <TableRoot
            :data="view.cohorts"
            :columns="cohortColumns"
            row-key="id"
            header-kind="compact"
            bordered
            :loading="loading"
          >
            <template #empty>
              <EmptyState
                size="small"
                icon="pi pi-filter-slash"
                title="No cohorts match these filters"
                description="Select another segment or widen the period."
              >
                <template #actions>
                  <Button
                    label="Clear filters"
                    kind="outlined"
                    size="small"
                    @click="clearFilters"
                  />
                </template>
              </EmptyState>
            </template>
            <template #cell-size="{ row }">
              <span class="tabular-nums">{{ formatters.number(row.size) }}</span>
            </template>
            <template
              v-for="week in weeks"
              :key="week.key"
              #[week.slot]="{ row }"
            >
              <span
                :data-pending="row[week.key] === null || null"
                class="tabular-nums data-pending:text-(--text-muted)"
              >
                {{ formatters.percent(row[week.key]) }}
              </span>
            </template>
          </TableRoot>
        </ChartCard.Content>
      </ChartCard>
    </div>
  </div>
</template>
```
