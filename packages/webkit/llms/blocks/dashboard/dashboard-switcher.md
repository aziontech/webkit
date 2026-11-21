# DashboardSwitcher (`dashboard/dashboard-switcher`)

> The dashboards hub: one page that switches between every dashboard of the account. A `PageHeader` named Dashboards sits over the controls row: a grouped `Select` of the dashboards (Platform, Security, Business and Yours) with a chart icon, a `FilterMenu` that sets the shared Period and counts it on its Filter button, and a Refresh `IconButton` in a `Tooltip` at the end. The applied period shows as a removable chip in `FilterMenu.ChipGroup`. Under the controls, a placeholder body for the chosen dashboard (in an app, render the real dashboard block there, and `dashboard-configurable` for Custom): four `StatTile`s with a `Hint` each and the comparison period, a `ChartCard` with the dashboard's `Chart` and its tooltip total, and a `ChartCard` with a ranked `BarList`. Switching the dashboard loads its body (Skeletons in place); changing the period or pressing Refresh refetches it, holding the previous render. A dashboard that owns its period (Executive summary, Spend, Project status) hides the shared filter and its chip and shows its own quarter `ToggleGroup` instead. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/dashboard/dashboard-switcher/dashboard-switcher.vue` in `@aziontech/webkit`
- MCP: `get_block("dashboard/dashboard-switcher")`
- Components: [Alert](../../components/alert.md), [BarList](../../components/bar-list.md), [Chart](../../components/chart.md), [ChartCard](../../components/chart-card.md), [FilterMenu](../../components/filter-menu.md), [Hint](../../components/hint.md), [IconButton](../../components/icon-button.md), [PageHeader](../../components/page-header.md), [Select](../../components/select.md), [StatTile](../../components/stat-tile.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), `use-locale`
- Skills: `webkit-data-viz`, `webkit-ui-states`, `webkit-navigation`

## Asked as

dashboards; dashboard switcher; dashboards hub; dashboard picker; choose a dashboard; observability dashboards; switch dashboard; shared period filter; painéis; seletor de painel; trocar de painel; tableros; selector de tablero

The dashboards hub. The reader comes here to look at one of several prepared views of the account (traffic, usage, edge health, threats, business figures, or a layout of their own) without hunting for each page in the navigation. One control picks the dashboard, one shared period scopes it, and the body under them is the chosen dashboard. Switching keeps the period, so comparing traffic and threats over the same 7 days is two clicks.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- An account has several dashboards that share one time scope, and the reader moves between them often.
- The set mixes platform, security and business views, so a grouped list beats a long navigation menu.
- Some dashboards report on their own calendar (a quarter, a billing cycle) and must say so instead of following the shared period.

## When not to use

- A single dashboard with its own page: use the dashboard block directly (`dashboard/dashboard-analytics`, `dashboard/dashboard-security`, and the rest of `dashboard`).
- A dashboard the reader arranges by hand: use `dashboard/dashboard-configurable` (it is the body of the Custom entry).
- An overview of the whole account with resources and recent activity: use `dashboard/dashboard-home`.

## Pick the dashboard by the shape of the data

| Data shape                                                                 | Block                                         |
| -------------------------------------------------------------------------- | --------------------------------------------- |
| Traffic volume and quality over one period (requests, status codes, hosts) | `dashboard/dashboard-analytics`               |
| Consumption per product or project against the previous period             | `dashboard/dashboard-analytics` (Usage)       |
| Blocked vs allowed requests, attack categories, source IPs                 | `dashboard/dashboard-security`                |
| Each request of known actors with the rule that decided it                 | `dashboard/dashboard-security` (ByActor)      |
| Open alerts to triage by severity                                          | `dashboard/dashboard-alerts`                  |
| Items waiting for a verdict from an asynchronous analysis                  | `dashboard/dashboard-scan-results`            |
| One total split into categories over time                                  | `dashboard/dashboard-breakdown`               |
| Many signals rolled up into one banded score                               | `dashboard/dashboard-health-score`            |
| Real-user web vitals                                                       | `dashboard/dashboard-health-score` (RealUser) |
| Latency percentiles, error rates and live state per service                | `dashboard/dashboard-service-monitoring`      |
| Cards each reader rearranges and resizes                                   | `dashboard/dashboard-configurable`            |
| The account's landing overview                                             | `dashboard/dashboard-home`                    |
| A one-page roll-up of business KPIs for leadership                         | `dashboard/dashboard-executive-summary`       |
| Several of these behind one picker and one shared period                   | `dashboard/dashboard-switcher`                |

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Dashboards` and one sentence that says what the views cover. The heading holds no action; the controls row below does.

### B. Dashboard picker — `Select` (required)

A medium `Select`, a fixed `--container-3xs` wide from `sm` (full width below), with a muted chart icon in the trigger's `prefix` slot and `aria-label="Dashboard"` on the trigger. Options are grouped with `Select.Group`: Platform, Security, Business, then Yours for the reader's own layout. `displayValue` prints the dashboard name, never its id.

### C. Shared period — `FilterMenu` (required)

A medium `FilterMenu` with one single-choice field, Period (Last hour, Last 24 hours, Last 7 days, Last 30 days). Its Filter button carries the count of applied filters; picking a period applies it at once. Hidden for a dashboard that owns its period. Never hand-build this filter from a `Popover`, a `Badge` and radios.

### D. Own period — `ToggleGroup` (optional)

When the chosen dashboard owns its period (Executive summary, Spend, Project status), a medium quarter `ToggleGroup` labelled `Quarter` takes the filter's place, so the reader always sees what the figures cover.

### E. Refresh — `IconButton`, `Tooltip` (required)

An outlined medium `IconButton` at the end of the row, named Refresh by its `Tooltip` and `aria-label`; it emits `refresh` and shows `loading` while the parent refetches (`loading` with `data` already shown).

### F. Applied period — `FilterMenu.ChipGroup` (required)

The applied period as a chip under the controls (`Period: Last 24 hours`), bound to the same model as the menu. Removing it returns the dashboard to the default period (Last 24 hours) and the chip leaves. Hidden with the filter.

### G. Dashboard body — `StatTile`, `Hint`, `ChartCard`, `Chart`, `BarList`, `Alert` (required)

The chosen dashboard, keyed by its id so switching remounts it: four `StatTile`s with a `Hint` each, the delta read against the comparison period (`vs previous 24 hours`, or `vs previous quarter`), then a `ChartCard` spanning 8 of 12 columns with the dashboard's `Chart` (stacked bars, areas or lines, a `Chart.Tooltip total` when it has more than one series, and a legend with totals) and a `ChartCard` spanning 4 with a ranked `BarList`. When the body fails to load, each card keeps its header and shows a danger `Alert` with Retry. Each body here is a placeholder with sample figures: in an app, render the matching dashboard block in its place (the bodies of `dashboard-analytics`, `dashboard-security`, `dashboard-scan-results`, `dashboard-breakdown` and the rest), and render `dashboard-configurable` for the Custom entry under Yours. Don't ship the placeholder bodies as the real dashboards.

## Data

The block takes its views and the selected view's data through props and emits every action; it fetches nothing. `DashboardSwitcherView`, `DashboardSwitcherFigure`, `DashboardSwitcherData`, `DashboardSwitcherFigureValue`, `DashboardSwitcherPeriod`, `DashboardSwitcherQuarter`, `DashboardSwitcherFormat`, `DashboardSwitcherMarkForm` and `DashboardSwitcherProps` are exported from `dashboard-switcher.vue`, and `sample.ts` holds the sample views and a generator of their figures that the block renders when `views` or `data` is left out (and never while `loading` or `error` is set).

| Prop / model      | Type                       | What it does                                                                                                     |
| ----------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `views`           | `DashboardSwitcherView[]`  | The dashboards in the picker, grouped by `group`, each with its figures, chart and breakdown titles and formats. |
| `data`            | `DashboardSwitcherData`    | The selected view's figure values by id, chart labels and series, and breakdown bars for the period.             |
| `loading`         | `boolean`                  | A request is in flight. With no `data` it is the first load (Skeletons); with `data` it is a refetch.            |
| `error`           | `string`                   | Why the view failed to load, shown after `Couldn't load requests over time.` in each card's danger `Alert`.      |
| `v-model:view`    | `string`                   | The selected view's `value`. Defaults to `traffic`.                                                              |
| `v-model:period`  | `DashboardSwitcherPeriod`  | The shared period, bound to the FilterMenu and its chip. Defaults to `24h`.                                      |
| `v-model:quarter` | `DashboardSwitcherQuarter` | The quarter of a view that owns its period. Defaults to `q4`.                                                    |

| Event     | Payload   | When                                |
| --------- | --------- | ----------------------------------- |
| `refresh` | `(event)` | Refresh at the end of the controls. |
| `retry`   | `(event)` | Retry in either card's error alert. |

To go live, render the block from a page that owns the request and refetch when the view, the period or the quarter changes:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import DashboardSwitcher, {
    type DashboardSwitcherPeriod,
    type DashboardSwitcherQuarter
  } from './dashboard-switcher.vue'

  const view = ref('traffic')
  const period = ref<DashboardSwitcherPeriod>('24h')
  const quarter = ref<DashboardSwitcherQuarter>('q4')
  const { data, pending, error, refresh } = useDashboard(view, period, quarter)
</script>

<template>
  <DashboardSwitcher
    v-model:view="view"
    v-model:period="period"
    v-model:quarter="quarter"
    :views="dashboards"
    :data="data"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @refresh="refresh"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep the period when the reader switches dashboards; reset only the hover state.
- Load the body on a switch (Skeletons in the final boxes) and refetch it on a period change or Refresh (previous render held), so the controls never jump.
- Hide the shared period for a dashboard that owns its own, and show that dashboard's control in the same place.

## Don't

- Don't list the dashboards as tabs; twelve views in four groups need the grouped picker.
- Don't keep a Period chip that the body ignores.
- Don't put a second period control inside a card.

## Copy

- **Title:** `Dashboards`.
- **Description:** one sentence on what the views cover. `Traffic, security and business views across every workload, plus a layout of your own.`
- **Groups:** one word. `Platform`, `Security`, `Business`, `Yours`.
- **Dashboard names:** a noun phrase in sentence case. `Edge health`, `Funnel and cohorts`.
- **Chip:** the field, then its value. `Period: Last 7 days`.
- **Comparison:** `vs previous 24 hours`, `vs previous quarter`.

## Accessibility

- The picker trigger is named `Dashboard`; the controls sit in a section labelled `Dashboard controls`, the body in a section named after the dashboard, with `aria-busy` while it loads or refetches.
- The period lives in `FilterMenu`, which names its applied count on the Filter button and gives every row and chip its own name.
- Refresh is an icon-only button with `aria-label="Refresh"`.

## States

- Default: Traffic over the last 24 hours.
- OwnPeriod: `v-model:view` set to Executive summary; the shared filter and chip are hidden and the quarter `ToggleGroup` shows.
- Loading: `loading` with no `data`; tiles, chart and list render their Skeletons.
- Error: `error`; the tiles show dashes and each card keeps its header with a danger `Alert` and Retry, which emits `retry`.
- Empty: `data` with no series and no bars; the tiles show dashes, the chart and the ranked list show their empty state (`No data in this period`).
- Refetching: `loading` while `data` is shown, after a period change or Refresh; the chart holds the previous render at reduced opacity and Refresh shows its spinner.

## Related

- `dashboard/dashboard-configurable` — the Custom entry, laid out by the reader.
- `dashboard/dashboard-analytics` (Default and Usage), `dashboard/dashboard-security` — the Traffic, Usage and Threats bodies on their own pages.
- `dashboard/dashboard-home` — the account overview.

## Variants

- `Default` — primary (the code below)
- `OwnPeriod` — Executive summary chosen: a dashboard that owns its period, so the shared Filter and its Period chip are hidden and a quarter `ToggleGroup` takes their place in the controls row; the tiles compare against the previous quarter and the chart runs week by week.
- `Loading` — The body of the chosen dashboard while it loads: the controls stay usable, the tiles, the chart and the ranked list render their own Skeleton in their final boxes, so nothing reflows when the data arrives.
- `Error` — The chosen dashboard could not load: the tiles show dashes and the chart and ranked-list cards keep their headers with a danger `Alert` and Retry, which refetches the body.
- `Empty` — The period has no data: the tiles show dashes, the chart and the ranked list show their empty state (`No data in this period`), and the controls stay usable to widen the period.

Each variant is the same screen in another state: `get_block("dashboard/dashboard-switcher", { variant })`, or the file under `blocks/dashboard/dashboard-switcher/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Chart, { type ChartLabel, type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import FilterMenu, {
    type FilterMenuField,
    type FilterMenuModel
  } from '@aziontech/webkit/filter-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref, watch } from 'vue'

  import { sampleViewData, sampleViews } from './sample'

  /** The period a platform view reads. */
  export type DashboardSwitcherPeriod = '1h' | '24h' | '7d' | '30d'
  /** The quarter a view with its own period reads. */
  export type DashboardSwitcherQuarter = 'q2' | 'q3' | 'q4'
  /** How a figure is formatted. */
  export type DashboardSwitcherFormat = 'count' | 'bytes' | 'ms' | 'percent' | 'usd'
  /** How the main chart draws its series. */
  export type DashboardSwitcherMarkForm = 'area' | 'bar' | 'line'

  /** One key figure of a view. */
  export interface DashboardSwitcherFigure {
    /** Stable key, matched in the figure values. */
    id: string
    /** Tile label. */
    label: string
    /** Definition shown in the hint. */
    hint: string
    /** How the value is formatted. */
    format: DashboardSwitcherFormat
    /** A rise is bad. */
    inverse?: boolean
  }

  /** One dashboard in the switcher. */
  export interface DashboardSwitcherView {
    /** Stable key, the selected value. */
    value: string
    /** Name in the switcher. */
    label: string
    /** Group in the switcher. */
    group: string
    /** The view reads quarters instead of the shared period. */
    ownPeriod?: boolean
    /** The key figures. */
    figures: DashboardSwitcherFigure[]
    /** The main chart. */
    chart: {
      title: string
      hint: string
      form: DashboardSwitcherMarkForm
      format: DashboardSwitcherFormat
    }
    /** The breakdown card. */
    breakdown: { title: string; hint: string; format: DashboardSwitcherFormat }
  }

  /** The value of one key figure. */
  export interface DashboardSwitcherFigureValue {
    /** The figure; null shows a dash. */
    value: number | null
    /** Change against the previous period, in percent; null hides it. */
    delta: number | null
    /** The figure over the period, for the sparkline, null for an interval with no data. */
    trend: (number | null)[]
  }

  /** The data of the selected view for the period. */
  export interface DashboardSwitcherData {
    /** Figure values by figure id; a missing id shows a dash. */
    figures: Record<string, DashboardSwitcherFigureValue>
    /** One label per point of the chart. */
    labels: ChartLabel[]
    /** The chart series. */
    series: ChartSeries[]
    /** The breakdown bars. */
    breakdown: BarListItem[]
  }

  export interface DashboardSwitcherProps {
    /** The dashboards in the switcher. Left out, the sample views render. */
    views?: DashboardSwitcherView[]
    /** The data of the selected view. Left out, the sample renders. */
    data?: DashboardSwitcherData
    /** A request is in flight: with no data it is the first load, with data a refresh. */
    loading?: boolean
    /** Why the view could not load, shown after what did not load in each danger alert. */
    error?: string
  }

  const props = withDefaults(defineProps<DashboardSwitcherProps>(), {
    views: undefined,
    data: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
  }>()

  const view = defineModel<string>('view', { default: 'traffic' })
  const period = defineModel<DashboardSwitcherPeriod>('period', { default: '24h' })
  const quarter = defineModel<DashboardSwitcherQuarter>('quarter', { default: 'q4' })

  const views = computed(() => props.views ?? sampleViews)
  const active = computed(
    () => views.value.find((entry) => entry.value === view.value) ?? views.value[0]
  )
  const data = computed<DashboardSwitcherData | null>(
    () =>
      props.data ??
      (props.loading || props.error
        ? null
        : sampleViewData(active.value.value, period.value, quarter.value))
  )
  const firstLoad = computed(() => props.loading && data.value === null)
  const refetching = computed(() => props.loading && data.value !== null)

  const groups = computed(() =>
    [...new Set(views.value.map((entry) => entry.group))].map((label) => ({
      label,
      views: views.value.filter((entry) => entry.group === label)
    }))
  )
  const viewLabel = (value: string) =>
    views.value.find((entry) => entry.value === value)?.label ?? ''

  const periods: Array<{ value: DashboardSwitcherPeriod; label: string; comparison: string }> = [
    { value: '1h', label: 'Last hour', comparison: 'vs previous hour' },
    { value: '24h', label: 'Last 24 hours', comparison: 'vs previous 24 hours' },
    { value: '7d', label: 'Last 7 days', comparison: 'vs previous 7 days' },
    { value: '30d', label: 'Last 30 days', comparison: 'vs previous 30 days' }
  ]

  const defaultPeriod: DashboardSwitcherPeriod = '24h'

  const quarters: ToggleGroupOption[] = [
    { label: 'Q2 2026', value: 'q2' },
    { label: 'Q3 2026', value: 'q3' },
    { label: 'Q4 2026', value: 'q4' }
  ]

  const filterFields: FilterMenuField[] = [
    {
      id: 'period',
      label: 'Period',
      type: 'single',
      options: periods.map((entry) => ({ value: entry.value, label: entry.label }))
    }
  ]
  const filters = ref<FilterMenuModel>({ period: [period.value] })
  const pickedPeriod = (model: FilterMenuModel): DashboardSwitcherPeriod => {
    const picked = model.period?.[0]
    return periods.find((entry) => entry.value === picked)?.value ?? defaultPeriod
  }
  watch(filters, (next) => {
    period.value = pickedPeriod(next)
  })
  watch(period, (next) => {
    if (pickedPeriod(filters.value) !== next) filters.value = { ...filters.value, period: [next] }
  })
  const periodInfo = computed(
    () => periods.find((entry) => entry.value === period.value) ?? periods[1]
  )

  const { formatNumber } = useLocale()
  const fixed = (value: number, digits: number) =>
    formatNumber(value, { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const formatCount = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

  const formatters: Record<DashboardSwitcherFormat, (value: number) => string> = {
    count: formatCount,
    bytes: (value) => {
      const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
      let scaled = value
      let unit = 0
      while (scaled >= 1000 && unit < units.length - 1) {
        scaled /= 1000
        unit += 1
      }
      return `${fixed(scaled, scaled >= 100 ? 0 : 1)} ${units[unit]}`
    },
    ms: (value) => `${Math.round(value)} ms`,
    percent: (value) => `${fixed(value, value < 1 ? 2 : 1)}%`,
    usd: (value) =>
      formatNumber(value, {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      })
  }

  const figureValue = (id: string) => data.value?.figures[id]

  const activeIndex = ref<number | null>(null)
  watch(view, () => {
    activeIndex.value = null
  })
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Dashboards"
        description="Traffic, security and business views across every workload, plus a layout of your own."
      />

      <section
        aria-label="Dashboard controls"
        class="flex min-w-0 flex-col gap-(--spacing-xs)"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
          <div class="w-full min-w-0 sm:w-(--container-3xs)">
            <Select
              v-model="view"
              size="medium"
              :display-value="viewLabel"
            >
              <Select.Trigger aria-label="Dashboard">
                <template #leading>
                  <i
                    class="az az-chart-bar text-(--text-muted)"
                    aria-hidden="true"
                  />
                </template>
              </Select.Trigger>
              <Select.Content>
                <Select.Group
                  v-for="group in groups"
                  :key="group.label"
                  :label="group.label"
                >
                  <Select.Item
                    v-for="option in group.views"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Group>
              </Select.Content>
            </Select>
          </div>

          <FilterMenu
            v-if="!active.ownPeriod"
            v-model="filters"
            :fields="filterFields"
            size="medium"
            class="shrink-0"
          />

          <ToggleGroup
            v-else
            v-model="quarter"
            :options="quarters"
            size="medium"
            aria-label="Quarter"
          />

          <div class="ms-auto flex shrink-0 items-center">
            <Tooltip content="Refresh">
              <IconButton
                icon="az az-refresh"
                variant="outline"
                size="medium"
                aria-label="Refresh"
                :loading="refetching"
                @click="(event: MouseEvent) => emit('refresh', event)"
              />
            </Tooltip>
          </div>
        </div>

        <FilterMenu.ChipGroup
          v-if="!active.ownPeriod"
          v-model="filters"
          :fields="filterFields"
        />
      </section>

      <section
        :key="active.value"
        :aria-label="active.label"
        :aria-busy="loading || undefined"
        class="flex min-w-0 flex-col gap-(--spacing-md)"
      >
        <ul
          aria-label="Key figures"
          class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4"
        >
          <li
            v-for="figure in active.figures"
            :key="figure.id"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              :label="figure.label"
              :value="figureValue(figure.id)?.value ?? null"
              :format-value="formatters[figure.format]"
              :delta="figureValue(figure.id)?.delta ?? null"
              :delta-label="active.ownPeriod ? 'vs previous quarter' : periodInfo.comparison"
              :inverse="figure.inverse"
              :trend="figureValue(figure.id)?.trend ?? []"
              :loading="firstLoad"
            >
              <template #aside>
                <Hint :content="figure.hint" />
              </template>
            </StatTile>
          </li>
        </ul>

        <div
          class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
        >
          <ChartCard :span="8">
            <ChartCard.Header>
              <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
                <ChartCard.Title>{{ active.chart.title }}</ChartCard.Title>
                <Hint :content="active.chart.hint" />
              </span>
            </ChartCard.Header>
            <ChartCard.Content>
              <Alert
                v-if="error"
                severity="danger"
                :label="`Couldn't load ${active.chart.title.toLowerCase()}. ${error}`"
                action-label="Retry"
                @action="(event) => emit('retry', event)"
              />
              <Chart
                v-else
                v-model:active-index="activeIndex"
                :series="data?.series ?? []"
                :labels="data?.labels ?? []"
                :format-value="formatters[active.chart.format]"
                time-zone="UTC"
                :loading="firstLoad"
                :refetching="refetching"
                empty-title="No data in this period"
                empty-description="Widen the period to see more."
              >
                <Chart.Grid />
                <Chart.Axis type="y" />
                <Chart.Axis type="x" />
                <Chart.Bar
                  v-if="active.chart.form === 'bar'"
                  stacked
                />
                <Chart.Area v-else-if="active.chart.form === 'area'" />
                <Chart.Line v-else />
                <Chart.Crosshair />
                <Chart.Tooltip :total="(data?.series.length ?? 0) > 1" />
                <Chart.Legend total />
              </Chart>
            </ChartCard.Content>
          </ChartCard>

          <ChartCard :span="4">
            <ChartCard.Header>
              <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
                <ChartCard.Title>{{ active.breakdown.title }}</ChartCard.Title>
                <Hint :content="active.breakdown.hint" />
              </span>
            </ChartCard.Header>
            <ChartCard.Content>
              <Alert
                v-if="error"
                severity="danger"
                :label="`Couldn't load ${active.breakdown.title.toLowerCase()}. ${error}`"
                action-label="Retry"
                @action="(event) => emit('retry', event)"
              />
              <BarList
                v-else
                :items="data?.breakdown ?? []"
                :format-value="formatters[active.breakdown.format]"
                :loading="firstLoad"
                empty-title="No data in this period"
                :aria-label="active.breakdown.title"
              />
            </ChartCard.Content>
          </ChartCard>
        </div>
      </section>
    </div>
  </div>
</template>
```

## `sample.ts`

```ts
import type { BarListItem } from '@aziontech/webkit/bar-list'
import type { ChartColor, ChartSeries } from '@aziontech/webkit/chart'

import type {
  DashboardSwitcherData,
  DashboardSwitcherFormat,
  DashboardSwitcherPeriod,
  DashboardSwitcherQuarter,
  DashboardSwitcherView
} from './dashboard-switcher.vue'

interface SampleFigure {
  id: string
  label: string
  hint: string
  base: number
  format: DashboardSwitcherFormat
  delta: number
  inverse?: boolean
}

interface SampleSeries {
  id: string
  name: string
  base: number
  color?: ChartColor
}

interface SampleSpec extends Omit<DashboardSwitcherView, 'figures' | 'chart' | 'breakdown'> {
  figures: SampleFigure[]
  chart: DashboardSwitcherView['chart'] & { series: SampleSeries[] }
  breakdown: DashboardSwitcherView['breakdown'] & { items: BarListItem[] }
}

const specs: SampleSpec[] = [
  {
    value: 'traffic',
    label: 'Traffic',
    group: 'Platform',
    figures: [
      {
        id: 'requests',
        label: 'Requests',
        hint: 'Requests served by every workload.',
        base: 4_820_000,
        format: 'count',
        delta: 6.4
      },
      {
        id: 'data',
        label: 'Data transferred',
        hint: 'Bytes delivered to users.',
        base: 912_000_000_000,
        format: 'bytes',
        delta: 3.1
      },
      {
        id: 'cache',
        label: 'Cache hit ratio',
        hint: 'Share of requests served from cache.',
        base: 87.4,
        format: 'percent',
        delta: 1.2
      },
      {
        id: 'errors',
        label: '5xx errors',
        hint: 'Requests that ended with a server error.',
        base: 1_240,
        format: 'count',
        delta: -8.5,
        inverse: true
      }
    ],
    chart: {
      title: 'Requests over time',
      hint: 'Requests per interval, cached and served by the origin.',
      form: 'area',
      format: 'count',
      series: [
        { id: 'cached', name: 'Cached', base: 168_000 },
        { id: 'origin', name: 'Origin', base: 32_000 }
      ]
    },
    breakdown: {
      title: 'Top hosts',
      hint: 'Hosts that served the most requests in the period.',
      format: 'count',
      items: [
        { name: 'www.example.com', value: 2_140_000 },
        { name: 'api.example.com', value: 1_380_000 },
        { name: 'app.example.com', value: 820_000 },
        { name: 'docs.example.com', value: 310_000 },
        { name: 'status.example.com', value: 170_000 }
      ]
    }
  },
  {
    value: 'usage',
    label: 'Usage',
    group: 'Platform',
    figures: [
      {
        id: 'bandwidth',
        label: 'Bandwidth',
        hint: 'Bytes billed for delivery.',
        base: 1_420_000_000_000,
        format: 'bytes',
        delta: 4.8
      },
      {
        id: 'invocations',
        label: 'Function invocations',
        hint: 'Times a function ran.',
        base: 2_310_000,
        format: 'count',
        delta: 9.2
      },
      {
        id: 'storage',
        label: 'Storage',
        hint: 'Bytes stored across buckets at the end of the period.',
        base: 318_000_000_000,
        format: 'bytes',
        delta: 2.4
      },
      {
        id: 'images',
        label: 'Images processed',
        hint: 'Images resized or converted on request.',
        base: 486_000,
        format: 'count',
        delta: -1.6
      }
    ],
    chart: {
      title: 'Bandwidth over time',
      hint: 'Bytes billed per interval, by delivery tier.',
      form: 'bar',
      format: 'bytes',
      series: [
        { id: 'standard', name: 'Standard', base: 44_000_000_000 },
        { id: 'premium', name: 'Premium', base: 15_000_000_000 }
      ]
    },
    breakdown: {
      title: 'Usage by workload',
      hint: 'Bandwidth billed per workload in the period.',
      format: 'bytes',
      items: [
        { name: 'acme-store', value: 640_000_000_000 },
        { name: 'docs-site', value: 310_000_000_000 },
        { name: 'site-assets', value: 260_000_000_000 },
        { name: 'staging', value: 120_000_000_000 },
        { name: 'production-api', value: 90_000_000_000 }
      ]
    }
  },
  {
    value: 'health',
    label: 'Edge health',
    group: 'Platform',
    figures: [
      {
        id: 'availability',
        label: 'Availability',
        hint: 'Share of health checks that passed.',
        base: 99.96,
        format: 'percent',
        delta: 0.02
      },
      {
        id: 'latency',
        label: 'p95 latency',
        hint: 'Time to first byte for 95 percent of requests.',
        base: 182,
        format: 'ms',
        delta: -4.1,
        inverse: true
      },
      {
        id: 'error-rate',
        label: 'Error rate',
        hint: 'Share of requests that ended with a 5xx.',
        base: 0.08,
        format: 'percent',
        delta: -12.0,
        inverse: true
      },
      {
        id: 'alerts',
        label: 'Open alerts',
        hint: 'Alerts firing now.',
        base: 3,
        format: 'count',
        delta: 50.0,
        inverse: true
      }
    ],
    chart: {
      title: 'Latency over time',
      hint: 'Time to first byte per interval, median and 95th percentile.',
      form: 'line',
      format: 'ms',
      series: [
        { id: 'p50', name: 'p50', base: 64 },
        { id: 'p95', name: 'p95', base: 182 }
      ]
    },
    breakdown: {
      title: 'Slowest regions',
      hint: 'p95 latency per region in the period.',
      format: 'ms',
      items: [
        { name: 'South America', value: 241 },
        { name: 'Asia Pacific', value: 228 },
        { name: 'Africa', value: 214 },
        { name: 'Europe', value: 156 },
        { name: 'North America', value: 132 }
      ]
    }
  },
  {
    value: 'score',
    label: 'Health score',
    group: 'Platform',
    figures: [
      {
        id: 'score',
        label: 'Health score',
        hint: 'Weighted score of availability, latency and errors, out of 100.',
        base: 92,
        format: 'count',
        delta: 2.2
      },
      {
        id: 'healthy',
        label: 'Healthy workloads',
        hint: 'Workloads scoring 90 or more.',
        base: 41,
        format: 'count',
        delta: 5.1
      },
      {
        id: 'degraded',
        label: 'Degraded workloads',
        hint: 'Workloads scoring under 90.',
        base: 6,
        format: 'count',
        delta: -14.3,
        inverse: true
      },
      {
        id: 'incidents',
        label: 'Incidents',
        hint: 'Incidents opened in the period.',
        base: 2,
        format: 'count',
        delta: 0
      }
    ],
    chart: {
      title: 'Score over time',
      hint: 'Average health score per interval.',
      form: 'line',
      format: 'count',
      series: [{ id: 'score', name: 'Health score', base: 92 }]
    },
    breakdown: {
      title: 'Lowest scores',
      hint: 'Workloads with the lowest health score in the period.',
      format: 'count',
      items: [
        { name: 'staging', value: 71 },
        { name: 'production-api', value: 84 },
        { name: 'site-assets', value: 88 },
        { name: 'docs-site', value: 93 },
        { name: 'acme-store', value: 96 }
      ]
    }
  },
  {
    value: 'threats',
    label: 'Threats',
    group: 'Security',
    figures: [
      {
        id: 'threats',
        label: 'Threats blocked',
        hint: 'Requests the firewall blocked.',
        base: 38_400,
        format: 'count',
        delta: 12.6,
        inverse: true
      },
      {
        id: 'bots',
        label: 'Bot requests',
        hint: 'Requests classified as automated.',
        base: 214_000,
        format: 'count',
        delta: 4.3,
        inverse: true
      },
      {
        id: 'challenged',
        label: 'Challenged',
        hint: 'Requests sent a challenge before being served.',
        base: 9_800,
        format: 'count',
        delta: -2.1
      },
      {
        id: 'ddos',
        label: 'DDoS events',
        hint: 'Volumetric attacks mitigated.',
        base: 1,
        format: 'count',
        delta: 0
      }
    ],
    chart: {
      title: 'Threats over time',
      hint: 'Requests per interval by firewall decision.',
      form: 'bar',
      format: 'count',
      series: [
        { id: 'blocked', name: 'Blocked', base: 1_600, color: 'danger' },
        { id: 'challenged', name: 'Challenged', base: 410, color: 'warning' }
      ]
    },
    breakdown: {
      title: 'Attack families',
      hint: 'Blocked requests per attack family.',
      format: 'count',
      items: [
        { name: 'SQL injection', value: 14_200 },
        { name: 'Cross-site scripting', value: 9_600 },
        { name: 'Path traversal', value: 6_100 },
        { name: 'Remote file inclusion', value: 4_800 },
        { name: 'Scanner', value: 3_700 }
      ]
    }
  },
  {
    value: 'activity',
    label: 'Activity outcomes',
    group: 'Security',
    figures: [
      {
        id: 'requests',
        label: 'Requests',
        hint: 'Requests the rules evaluated.',
        base: 18_600,
        format: 'count',
        delta: 7.9
      },
      {
        id: 'allowed',
        label: 'Allowed',
        hint: 'Requests the rules let through.',
        base: 16_900,
        format: 'count',
        delta: 8.4
      },
      {
        id: 'blocked',
        label: 'Blocked',
        hint: 'Requests the rules refused.',
        base: 1_420,
        format: 'count',
        delta: 3.6,
        inverse: true
      },
      {
        id: 'held',
        label: 'Held',
        hint: 'Requests held for a person to approve.',
        base: 280,
        format: 'count',
        delta: -6.0,
        inverse: true
      }
    ],
    chart: {
      title: 'Outcomes over time',
      hint: 'Requests per interval by the outcome the rules decided.',
      form: 'bar',
      format: 'count',
      series: [
        { id: 'allowed', name: 'Allowed', base: 700, color: 'success' },
        { id: 'blocked', name: 'Blocked', base: 60, color: 'danger' },
        { id: 'held', name: 'Held', base: 12, color: 'warning' }
      ]
    },
    breakdown: {
      title: 'Actors',
      hint: 'Requests per actor, every outcome included.',
      format: 'count',
      items: [
        { name: 'billing-agent', value: 6_400 },
        { name: 'support-agent', value: 5_200 },
        { name: 'Jane Doe', value: 3_100 },
        { name: 'deploy-bot', value: 2_600 },
        { name: 'Alex Morgan', value: 1_300 }
      ]
    }
  },
  {
    value: 'scans',
    label: 'Scan results',
    group: 'Security',
    figures: [
      {
        id: 'findings',
        label: 'Open findings',
        hint: 'Findings not yet resolved.',
        base: 64,
        format: 'count',
        delta: -9.8,
        inverse: true
      },
      {
        id: 'critical',
        label: 'Critical',
        hint: 'Open findings rated critical.',
        base: 3,
        format: 'count',
        delta: -25.0,
        inverse: true
      },
      {
        id: 'scanned',
        label: 'Assets scanned',
        hint: 'Assets covered by the last scan.',
        base: 412,
        format: 'count',
        delta: 2.0
      },
      {
        id: 'fixed',
        label: 'Fixed',
        hint: 'Findings resolved in the period.',
        base: 27,
        format: 'count',
        delta: 17.4
      }
    ],
    chart: {
      title: 'Findings over time',
      hint: 'Open findings per interval by severity.',
      form: 'area',
      format: 'count',
      series: [
        { id: 'high', name: 'High', base: 18, color: 'severity-high' },
        { id: 'medium', name: 'Medium', base: 29, color: 'severity-medium' },
        { id: 'low', name: 'Low', base: 14, color: 'severity-low' }
      ]
    },
    breakdown: {
      title: 'Findings by asset',
      hint: 'Open findings per asset.',
      format: 'count',
      items: [
        { name: 'api.example.com', value: 21 },
        { name: 'app.example.com', value: 17 },
        { name: 'www.example.com', value: 12 },
        { name: 'docs.example.com', value: 8 },
        { name: 'status.example.com', value: 6 }
      ]
    }
  },
  {
    value: 'summary',
    label: 'Executive summary',
    group: 'Business',
    ownPeriod: true,
    figures: [
      {
        id: 'revenue',
        label: 'Revenue',
        hint: 'Recognized revenue in the quarter.',
        base: 4_200_000,
        format: 'usd',
        delta: 11.2
      },
      {
        id: 'customers',
        label: 'Active customers',
        hint: 'Accounts with traffic in the quarter.',
        base: 1_840,
        format: 'count',
        delta: 6.8
      },
      {
        id: 'churn',
        label: 'Churn',
        hint: 'Share of accounts that left in the quarter.',
        base: 1.9,
        format: 'percent',
        delta: -10.5,
        inverse: true
      },
      {
        id: 'nps',
        label: 'NPS',
        hint: 'Net promoter score from the quarterly survey.',
        base: 48,
        format: 'count',
        delta: 4.3
      }
    ],
    chart: {
      title: 'Revenue over the quarter',
      hint: 'Recognized revenue per week, new and expansion.',
      form: 'bar',
      format: 'usd',
      series: [
        { id: 'new', name: 'New', base: 210_000 },
        { id: 'expansion', name: 'Expansion', base: 110_000 }
      ]
    },
    breakdown: {
      title: 'Revenue by plan',
      hint: 'Recognized revenue per plan in the quarter.',
      format: 'usd',
      items: [
        { name: 'Enterprise', value: 2_600_000 },
        { name: 'Business', value: 1_100_000 },
        { name: 'Pro', value: 420_000 },
        { name: 'Starter', value: 80_000 }
      ]
    }
  },
  {
    value: 'spend',
    label: 'Spend',
    group: 'Business',
    ownPeriod: true,
    figures: [
      {
        id: 'spend',
        label: 'Total spend',
        hint: 'Charges accrued in the quarter.',
        base: 182_000,
        format: 'usd',
        delta: 5.4,
        inverse: true
      },
      {
        id: 'forecast',
        label: 'Forecast',
        hint: 'Projected charges at the end of the quarter.',
        base: 196_000,
        format: 'usd',
        delta: 3.2,
        inverse: true
      },
      {
        id: 'budget',
        label: 'Budget used',
        hint: 'Share of the quarterly budget spent.',
        base: 72,
        format: 'percent',
        delta: 4.0,
        inverse: true
      },
      {
        id: 'savings',
        label: 'Savings',
        hint: 'Charges avoided by committed use.',
        base: 21_400,
        format: 'usd',
        delta: 8.1
      }
    ],
    chart: {
      title: 'Spend over the quarter',
      hint: 'Charges per week by category.',
      form: 'bar',
      format: 'usd',
      series: [
        { id: 'delivery', name: 'Delivery', base: 7_400 },
        { id: 'compute', name: 'Compute', base: 4_900 },
        { id: 'storage', name: 'Storage', base: 1_700 }
      ]
    },
    breakdown: {
      title: 'Spend by category',
      hint: 'Charges per category in the quarter.',
      format: 'usd',
      items: [
        { name: 'Delivery', value: 96_000 },
        { name: 'Compute', value: 63_000 },
        { name: 'Storage', value: 22_000 },
        { name: 'Support', value: 1_000 }
      ]
    }
  },
  {
    value: 'funnel',
    label: 'Funnel and cohorts',
    group: 'Business',
    figures: [
      {
        id: 'visits',
        label: 'Visits',
        hint: 'Sessions that reached the landing page.',
        base: 128_000,
        format: 'count',
        delta: 5.6
      },
      {
        id: 'signups',
        label: 'Sign-ups',
        hint: 'Visitors who created an account.',
        base: 3_420,
        format: 'count',
        delta: 9.1
      },
      {
        id: 'activated',
        label: 'Activated',
        hint: 'Accounts that deployed a first workload.',
        base: 1_180,
        format: 'count',
        delta: 4.7
      },
      {
        id: 'conversion',
        label: 'Conversion',
        hint: 'Share of visits that activated.',
        base: 0.92,
        format: 'percent',
        delta: -0.8
      }
    ],
    chart: {
      title: 'Sign-ups over time',
      hint: 'Sign-ups and activations per interval.',
      form: 'line',
      format: 'count',
      series: [
        { id: 'signups', name: 'Sign-ups', base: 140 },
        { id: 'activated', name: 'Activated', base: 49 }
      ]
    },
    breakdown: {
      title: 'Funnel steps',
      hint: 'People at each step of the funnel.',
      format: 'count',
      items: [
        { name: 'Visited', value: 128_000 },
        { name: 'Signed up', value: 3_420 },
        { name: 'Verified email', value: 2_610 },
        { name: 'Activated', value: 1_180 },
        { name: 'Upgraded', value: 214 }
      ]
    }
  },
  {
    value: 'project',
    label: 'Project status',
    group: 'Business',
    ownPeriod: true,
    figures: [
      {
        id: 'projects',
        label: 'Active projects',
        hint: 'Projects with work in the quarter.',
        base: 14,
        format: 'count',
        delta: 7.7
      },
      {
        id: 'on-track',
        label: 'On track',
        hint: 'Projects meeting their milestones.',
        base: 10,
        format: 'count',
        delta: 11.1
      },
      {
        id: 'at-risk',
        label: 'At risk',
        hint: 'Projects behind a milestone.',
        base: 3,
        format: 'count',
        delta: -25.0,
        inverse: true
      },
      {
        id: 'done',
        label: 'Milestones done',
        hint: 'Milestones closed in the quarter.',
        base: 38,
        format: 'count',
        delta: 18.8
      }
    ],
    chart: {
      title: 'Milestones over the quarter',
      hint: 'Milestones closed and opened per week.',
      form: 'bar',
      format: 'count',
      series: [
        { id: 'closed', name: 'Closed', base: 3 },
        { id: 'opened', name: 'Opened', base: 2 }
      ]
    },
    breakdown: {
      title: 'Open milestones by team',
      hint: 'Milestones still open per team.',
      format: 'count',
      items: [
        { name: 'Platform', value: 9 },
        { name: 'Security', value: 7 },
        { name: 'Billing', value: 5 },
        { name: 'Docs', value: 3 }
      ]
    }
  },
  {
    value: 'custom',
    label: 'Custom',
    group: 'Yours',
    figures: [
      {
        id: 'requests',
        label: 'Requests',
        hint: 'Requests served by every workload.',
        base: 4_820_000,
        format: 'count',
        delta: 6.4
      },
      {
        id: 'threats',
        label: 'Threats blocked',
        hint: 'Requests the firewall blocked.',
        base: 38_400,
        format: 'count',
        delta: 12.6,
        inverse: true
      },
      {
        id: 'latency',
        label: 'p95 latency',
        hint: 'Time to first byte for 95 percent of requests.',
        base: 182,
        format: 'ms',
        delta: -4.1,
        inverse: true
      },
      {
        id: 'spend',
        label: 'Spend',
        hint: 'Charges accrued in the period.',
        base: 6_100,
        format: 'usd',
        delta: 5.4,
        inverse: true
      }
    ],
    chart: {
      title: 'Requests and threats',
      hint: 'Requests and blocked threats per interval.',
      form: 'line',
      format: 'count',
      series: [
        { id: 'requests', name: 'Requests', base: 200_000 },
        { id: 'threats', name: 'Threats blocked', base: 1_600 }
      ]
    },
    breakdown: {
      title: 'Top countries',
      hint: 'Countries that sent the most requests in the period.',
      format: 'count',
      items: [
        { name: 'United States', value: 1_920_000 },
        { name: 'Germany', value: 640_000 },
        { name: 'Japan', value: 520_000 },
        { name: 'Brazil', value: 410_000 },
        { name: 'India', value: 380_000 }
      ]
    }
  }
]

export const sampleViews: DashboardSwitcherView[] = specs.map((spec) => ({
  value: spec.value,
  label: spec.label,
  group: spec.group,
  ...(spec.ownPeriod ? { ownPeriod: true } : {}),
  figures: spec.figures.map(({ base: _base, delta: _delta, ...figure }) => figure),
  chart: {
    title: spec.chart.title,
    hint: spec.chart.hint,
    form: spec.chart.form,
    format: spec.chart.format
  },
  breakdown: {
    title: spec.breakdown.title,
    hint: spec.breakdown.hint,
    format: spec.breakdown.format
  }
}))

const periodFactor: Record<DashboardSwitcherPeriod, number> = {
  '1h': 1 / 24,
  '24h': 1,
  '7d': 7,
  '30d': 30
}

const timelines: Record<DashboardSwitcherPeriod, { points: number; stepHours: number }> = {
  '1h': { points: 12, stepHours: 1 / 12 },
  '24h': { points: 24, stepHours: 1 },
  '7d': { points: 28, stepHours: 6 },
  '30d': { points: 30, stepHours: 24 }
}

const quarterFactor: Record<DashboardSwitcherQuarter, number> = { q2: 0.86, q3: 0.94, q4: 1 }

const scalesWithPeriod: ReadonlySet<DashboardSwitcherFormat> = new Set(['count', 'bytes', 'usd'])

const end = Date.UTC(2026, 10, 14, 12)

const wave = (seed: number, index: number) =>
  1 + 0.22 * Math.sin(index * 0.7 + seed) + 0.08 * Math.cos(index * 1.9 + seed * 2)

const seedOf = (text: string) =>
  [...text].reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0) % 97

export const sampleViewData = (
  view: string,
  period: DashboardSwitcherPeriod,
  quarter: DashboardSwitcherQuarter
): DashboardSwitcherData => {
  const spec = specs.find((entry) => entry.value === view) ?? specs[0]
  const scale = spec.ownPeriod ? (quarterFactor[quarter] ?? 1) : periodFactor[period]
  const { points, stepHours } = timelines[period]
  const step = stepHours * 3_600_000
  const labels = spec.ownPeriod
    ? Array.from({ length: 13 }, (_, index) => `Week ${index + 1}`)
    : Array.from({ length: points }, (_, index) => new Date(end - (points - 1 - index) * step))
  const per = spec.ownPeriod ? 1 : stepHours
  const seriesFactor =
    scalesWithPeriod.has(spec.chart.format) && !spec.ownPeriod ? Math.max(per, 1 / 12) : 1
  const series: ChartSeries[] = spec.chart.series.map((entry) => {
    const seed = seedOf(`${spec.value}:${entry.id}`)
    return {
      id: entry.id,
      name: entry.name,
      ...(entry.color ? { color: entry.color } : {}),
      values: Array.from(
        { length: labels.length },
        (_, index) => Math.round(entry.base * seriesFactor * wave(seed, index) * 100) / 100
      )
    }
  })
  return {
    figures: Object.fromEntries(
      spec.figures.map((figure) => {
        const seed = seedOf(`${spec.value}:${figure.id}`)
        const factor = scalesWithPeriod.has(figure.format) ? scale : 1
        return [
          figure.id,
          {
            value: figure.base * factor,
            delta: figure.delta,
            trend: Array.from({ length: 12 }, (_, index) =>
              Math.round(figure.base * wave(seed, index) * 100)
            )
          }
        ]
      })
    ),
    labels,
    series,
    breakdown: spec.breakdown.items.map((item) => ({
      ...item,
      value: scalesWithPeriod.has(spec.breakdown.format)
        ? Math.round(item.value * scale)
        : item.value
    }))
  }
}
```
