<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import type { ChartLabel, ChartSeries } from '@aziontech/webkit/chart'
  import Hint from '@aziontech/webkit/hint'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref, watch } from 'vue'

  import { type FigureFormat, hostColumns, trafficCards, trafficFigures } from './analytics-cards'
  import {
    chartForms,
    comparedPeriod,
    comparedPeriods,
    fixedFormatter,
    hiddenForStatusForm,
    metricFormatters,
    metricQuery,
    periodSlug,
    runCardOption,
    seriesRows,
    statusForms
  } from './analytics-report'
  import ExpandedDialog from './parts/expanded-dialog.vue'
  import ExpandedTable from './parts/expanded-table.vue'
  import MetricCard, { type MetricCardVariation } from './parts/metric-card.vue'
  import PeriodHeader from './parts/period-header.vue'
  import SearchTable from './parts/search-table.vue'
  import SeriesChart from './parts/series-chart.vue'
  import {
    sampleChanges,
    sampleCountries,
    sampleHosts,
    sampleIntervals,
    sampleKpis,
    sampleRange,
    sampleRequestSeries,
    sampleStatusSeries
  } from './sample'

  /** The four figures of the KPI row, in the order they render. */
  export type AnalyticsDashboardKpiId =
    'requests' | 'data-transferred' | 'success-rate' | 'status-5xx'

  /** The measured part of one KPI tile. */
  export interface AnalyticsDashboardKpi {
    /** The figure for the period; null reads as a dash. */
    value: number | null
    /** Change against the previous period, in percent; null hides the delta. */
    delta: number | null
    /** The sparkline, one value per interval, null for an interval with no data; empty hides it. */
    trend: (number | null)[]
  }

  /** The KPI figures by tile; a tile left out reads as a dash. */
  export type AnalyticsDashboardKpis = Partial<
    Record<AnalyticsDashboardKpiId, AnalyticsDashboardKpi>
  >

  /** Requests from one country of origin. */
  export interface AnalyticsDashboardCountry {
    /** Country name, the bar label. */
    country: string
    /** Requests from it in the period. */
    requests: number
  }

  /** One row of the Top hosts table. */
  export interface AnalyticsDashboardHost {
    /** Stable row key. */
    id: string
    /** The hostname that served the requests. */
    host: string
    /** The service behind the host. */
    service: string
    /** Requests served in the period. */
    requests: number
  }

  /** Change of each time-series total against the previous period, in percent. */
  export interface AnalyticsDashboardChanges {
    /** Change of the Requests over time total; null hides the tag. */
    requests: number | null
    /** Change of the Status codes total; null hides the tag. */
    statusCodes: number | null
  }

  /** The window the period covers, as ISO timestamps, written into each copied query. */
  export interface AnalyticsDashboardRange {
    /** Start of the window. */
    begin: string
    /** End of the window. */
    end: string
  }

  /** A card that opens in the expanded dialog. */
  export type AnalyticsDashboardCardId = 'requests' | 'status-codes' | 'countries' | 'hosts'

  export interface AnalyticsDashboardProps {
    /** The KPI figures for the period. Left out, the sample renders. */
    kpis?: AnalyticsDashboardKpis
    /** One label per interval of the two time series: a string, a number or a Date. */
    intervals?: ChartLabel[]
    /** Series of the Requests over time card, one value per interval. */
    requestSeries?: ChartSeries[]
    /** Series of the Status codes card, one per status class. */
    statusSeries?: ChartSeries[]
    /** Rows of the Requests by country card, top countries first. */
    countries?: AnalyticsDashboardCountry[]
    /** Rows of the Top hosts table. */
    hosts?: AnalyticsDashboardHost[]
    /** Change tags in the headers of the two time-series cards. */
    changes?: AnalyticsDashboardChanges
    /** The window of the period, written into the queries the card menus copy. */
    range?: AnalyticsDashboardRange
    /** The card whose expanded dialog is open on first render; empty opens none. */
    defaultExpanded?: AnalyticsDashboardCardId | ''
    /** The figures for the period are loading; every tile, chart and the table hold a skeleton. */
    loading?: boolean
    /** Why the period could not load; each card shows it in a danger alert with Retry. */
    error?: string
    /** The period is reloading over figures already shown: the data stays and every chart holds its previous render at reduced opacity. */
    refetching?: boolean
  }

  const props = withDefaults(defineProps<AnalyticsDashboardProps>(), {
    kpis: undefined,
    intervals: undefined,
    requestSeries: undefined,
    statusSeries: undefined,
    countries: undefined,
    hosts: undefined,
    changes: undefined,
    range: undefined,
    defaultExpanded: '',
    loading: false,
    error: '',
    refetching: false
  })

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

  const period = defineModel<string>('period', { default: '24h' })

  const currentPeriod = computed(() => comparedPeriod(period.value))

  const failed = computed(() => props.error !== '')
  const blank = computed(() => props.loading || failed.value)
  const fallback = <T,>(value: T | undefined, sample: T, empty: T): T =>
    value ?? (blank.value ? empty : sample)

  const kpiValues = computed(() => fallback(props.kpis, sampleKpis, {}))
  const figures = computed(() =>
    trafficFigures.map((definition) => ({
      ...definition,
      ...(kpiValues.value[definition.id] ?? { value: null, delta: null, trend: [] })
    }))
  )

  const labels = computed(() => fallback(props.intervals, sampleIntervals, []))
  const requests = computed(() => fallback(props.requestSeries, sampleRequestSeries, []))
  const statusCodes = computed(() => fallback(props.statusSeries, sampleStatusSeries, []))
  const countryRows = computed(() => fallback(props.countries, sampleCountries, []))
  const countryLabels = computed(() => countryRows.value.map((row) => row.country))
  const countryRequests = computed<ChartSeries[]>(() =>
    countryRows.value.length
      ? [
          {
            id: 'requests',
            name: 'Requests by country',
            values: countryRows.value.map((row) => row.requests)
          }
        ]
      : []
  )
  const hosts = computed(() => fallback(props.hosts, sampleHosts, []))
  const range = computed(() => props.range ?? sampleRange)

  const { formatNumber } = useLocale()
  const fixed = fixedFormatter(formatNumber)

  const variation = (change: number | null): MetricCardVariation | null =>
    change === null
      ? null
      : {
          label: `${change >= 0 ? '+' : ''}${fixed(change, 2)}%`,
          severity: change >= 0 ? 'success' : 'danger',
          icon: change >= 0 ? 'az az-arrow-up-right' : 'az az-arrow-down-right'
        }
  const variations = computed(() => {
    const changes = fallback(props.changes, sampleChanges, { requests: null, statusCodes: null })
    return { requests: variation(changes.requests), statusCodes: variation(changes.statusCodes) }
  })

  const metric = metricFormatters(formatNumber)
  const formatters: Record<FigureFormat, (value: number) => string> = {
    count: metric.count,
    bytes: metric.bytes,
    percentage: (value) => `${fixed(value, 0)}%`
  }

  const requestsForm = ref('line')
  const statusForm = ref('bar')
  const statusHidden = ref<string[]>([])
  watch(
    [statusForm, statusCodes],
    ([form, series]) => (statusHidden.value = hiddenForStatusForm(form, series)),
    { immediate: true }
  )
  const activeIndex = ref<number | null>(null)
  const search = ref('')

  const cardRows: Record<AnalyticsDashboardCardId, () => object[]> = {
    requests: () => seriesRows(requests.value, labels.value),
    'status-codes': () => seriesRows(statusCodes.value, labels.value),
    countries: () => countryRows.value,
    hosts: () => hosts.value
  }
  const cardEmpty = (id: AnalyticsDashboardCardId) =>
    ({ requests, 'status-codes': statusCodes, countries: countryRows, hosts })[id].value.length ===
    0

  const card = (id: AnalyticsDashboardCardId) => ({
    title: trafficCards[id].label,
    hint: trafficCards[id].description,
    blank: blank.value,
    exportDisabled: blank.value || cardEmpty(id),
    error: props.error
  })

  const empty = {
    emptyTitle: 'No traffic yet',
    emptyDescription: 'Metrics appear here once a service serves requests.'
  }

  const expanded = ref(props.defaultExpanded !== '')
  const expandedId = ref<AnalyticsDashboardCardId>(props.defaultExpanded || 'requests')
  const expandedReport = computed(() => trafficCards[expandedId.value])
  const cardForms: Partial<Record<AnalyticsDashboardCardId, typeof chartForms>> = {
    requests: chartForms,
    'status-codes': statusForms
  }
  const expandedForms = computed(() => cardForms[expandedId.value] ?? [])

  const openExpanded = (id: AnalyticsDashboardCardId) => {
    expandedId.value = id
    expanded.value = true
  }

  const onCardOption = (id: AnalyticsDashboardCardId, value: string | number) => {
    const report = trafficCards[id]
    runCardOption(value, {
      query: metricQuery({
        dataset: 'workloadMetrics',
        measure: 'requests',
        limit: report.limit,
        groupBy: report.groupBy,
        orderBy: report.orderBy,
        begin: range.value.begin,
        end: range.value.end
      }),
      filename: `${id}-${periodSlug(currentPeriod.value)}.csv`,
      columns: report.columns,
      rows: cardRows[id]
    })
  }

  const expandedForm = computed({
    get: () => (expandedId.value === 'status-codes' ? statusForm.value : requestsForm.value),
    set: (value: string) => {
      if (expandedId.value === 'status-codes') statusForm.value = value
      else requestsForm.value = value
    }
  })
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PeriodHeader
        v-model:period="period"
        title="Analytics"
        description="Requests, data transferred and errors your services handled in the period."
        :options="comparedPeriods"
        :refetching="refetching"
      />
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load analytics. ${error}`"
        action-label="Retry"
        data-testid="dashboard-analytics__error"
        @action="(event: MouseEvent) => emit('retry', event)"
      />
      <div
        :data-updating="refetching || undefined"
        class="data-[updating]:[&_[data-testid$=__sparkline]]:opacity-60"
      >
        <StatTileGroup
          aria-label="Key figures"
          :aria-busy="refetching || undefined"
        >
          <StatTile
            v-for="figure in figures"
            :key="figure.id"
            :label="figure.label"
            :value="figure.value"
            :format-value="formatters[figure.format]"
            :delta="figure.delta"
            :delta-label="currentPeriod.comparison"
            :inverse="figure.inverse"
            :trend="figure.trend"
            :loading="loading"
            :error="error"
          >
            <template #aside>
              <Hint :content="figure.description" />
            </template>
          </StatTile>
        </StatTileGroup>
      </div>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <MetricCard
          v-model:form="requestsForm"
          :span="12"
          v-bind="card('requests')"
          :variation="variations.requests"
          :forms="chartForms"
          wide
          @expand="openExpanded('requests')"
          @select="(_event, value) => onCardOption('requests', value)"
        >
          <SeriesChart
            v-model:active-index="activeIndex"
            :series="requests"
            :labels="labels"
            :format-value="formatters.count"
            :bar="requestsForm === 'bar'"
            shape="area"
            :loading="loading"
            :refetching="refetching"
            v-bind="empty"
          />
        </MetricCard>

        <MetricCard
          v-model:form="statusForm"
          :span="6"
          v-bind="card('status-codes')"
          :variation="variations.statusCodes"
          :forms="statusForms"
          @expand="openExpanded('status-codes')"
          @select="(_event, value) => onCardOption('status-codes', value)"
        >
          <SeriesChart
            v-model:active-index="activeIndex"
            v-model:hidden-series="statusHidden"
            :series="statusCodes"
            :labels="labels"
            :format-value="formatters.count"
            :bar="statusForm !== 'line'"
            stacked
            :loading="loading"
            :refetching="refetching"
            v-bind="empty"
          />
        </MetricCard>

        <MetricCard
          :span="6"
          v-bind="card('countries')"
          @expand="openExpanded('countries')"
          @select="(_event, value) => onCardOption('countries', value)"
        >
          <SeriesChart
            ranking
            :series="countryRequests"
            :labels="countryLabels"
            :format-value="formatters.count"
            :height="240"
            :loading="loading"
            :refetching="refetching"
            v-bind="empty"
          />
        </MetricCard>

        <MetricCard
          :span="12"
          v-bind="card('hosts')"
          wide
          @expand="openExpanded('hosts')"
          @select="(_event, value) => onCardOption('hosts', value)"
        >
          <SearchTable
            v-model:search="search"
            :rows="hosts"
            :columns="hostColumns"
            search-label="Search hosts or services"
            :format-count="formatters.count"
            :loading="loading"
            :aria-busy="refetching || undefined"
            v-bind="empty"
          />
        </MetricCard>
      </div>
    </div>
    <ExpandedDialog
      v-model:open="expanded"
      v-model:form="expandedForm"
      :title="expandedReport.label"
      :description="expandedReport.description"
      :forms="expandedForms"
    >
      <SeriesChart
        key="chart-1"
        v-if="expandedId === 'requests'"
        :series="requests"
        :labels="labels"
        :format-value="formatters.count"
        :bar="requestsForm === 'bar'"
        shape="area"
        :height="420"
        :refetching="refetching"
        :aria-label="expandedReport.label"
        v-bind="empty"
      />
      <SeriesChart
        key="chart-2"
        v-else-if="expandedId === 'status-codes'"
        v-model:hidden-series="statusHidden"
        :series="statusCodes"
        :labels="labels"
        :format-value="formatters.count"
        :bar="statusForm !== 'line'"
        stacked
        :height="420"
        :refetching="refetching"
        :aria-label="expandedReport.label"
        v-bind="empty"
      />
      <SeriesChart
        key="chart-3"
        v-else-if="expandedId === 'countries'"
        ranking
        :series="countryRequests"
        :labels="countryLabels"
        :format-value="formatters.count"
        :height="420"
        :refetching="refetching"
        :aria-label="expandedReport.label"
        v-bind="empty"
      />
      <ExpandedTable
        v-else
        :rows="hosts"
        :columns="hostColumns"
        :format-count="formatters.count"
        v-bind="empty"
      />
    </ExpandedDialog>
  </div>
</template>
