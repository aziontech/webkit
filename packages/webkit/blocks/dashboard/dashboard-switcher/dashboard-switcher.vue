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
    /** The figure over the period, for the sparkline. */
    trend: number[]
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
      return `${scaled.toFixed(scaled >= 100 ? 0 : 1)} ${units[unit]}`
    },
    ms: (value) => `${Math.round(value)} ms`,
    percent: (value) => `${value.toFixed(value < 1 ? 2 : 1)}%`,
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
                    class="ai ai-chart-bar text-(--text-muted)"
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
                icon="ai ai-refresh"
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
