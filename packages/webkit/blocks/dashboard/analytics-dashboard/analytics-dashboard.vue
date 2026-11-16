<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Chart, { type ChartLabel, type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref } from 'vue'

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
    /** The sparkline, one value per interval; empty hides it. */
    trend: number[]
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
    error: ''
  })

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

  const period = defineModel<string>('period', { default: '24h' })

  const fallbackPeriod = {
    value: '24h',
    label: 'Last 24 hours',
    comparison: 'vs previous 24 hours'
  }
  const periods = [
    { value: '1h', label: 'Last hour', comparison: 'vs previous hour' },
    fallbackPeriod,
    { value: '7d', label: 'Last 7 days', comparison: 'vs previous 7 days' },
    { value: '30d', label: 'Last 30 days', comparison: 'vs previous 30 days' }
  ]
  const periodLabel = (value: string) => periods.find((entry) => entry.value === value)?.label ?? ''
  const currentPeriod = computed(
    () => periods.find((entry) => entry.value === period.value) ?? fallbackPeriod
  )
  const periodComparison = computed(() => currentPeriod.value.comparison)
  const periodSlug = computed(() => currentPeriod.value.label.toLowerCase().replaceAll(' ', '-'))

  type FigureFormat = 'count' | 'bytes' | 'percentage'

  interface FigureDefinition {
    id: AnalyticsDashboardKpiId
    label: string
    description: string
    format: FigureFormat
    inverse: boolean
  }

  interface Variation {
    label: string
    severity: TagSeverity
    icon: string
  }

  const failed = computed(() => props.error !== '')
  const blank = computed(() => props.loading || failed.value)
  const fallback = <T,>(value: T | undefined, sample: T, empty: T): T =>
    value ?? (blank.value ? empty : sample)

  const definitions: FigureDefinition[] = [
    {
      label: 'Requests',
      id: 'requests',
      description: 'Sum of requests served by every service in the period.',
      format: 'count',
      inverse: false
    },
    {
      label: 'Data transferred',
      id: 'data-transferred',
      description: 'Sum of data delivered to users by every service in the period.',
      format: 'bytes',
      inverse: false
    },
    {
      label: 'Success rate',
      id: 'success-rate',
      description: 'Share of requests that ended in a 2xx or 3xx status.',
      format: 'percentage',
      inverse: false
    },
    {
      label: 'Status 5xx',
      id: 'status-5xx',
      description: 'Requests that ended in a server error. A rise is a regression.',
      format: 'count',
      inverse: true
    }
  ]

  const kpiValues = computed(() => fallback(props.kpis, sampleKpis, {}))
  const figures = computed(() =>
    definitions.map((definition) => ({
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

  const variation = (change: number | null): Variation | null =>
    change === null
      ? null
      : {
          label: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
          severity: change >= 0 ? 'success' : 'danger',
          icon: change >= 0 ? 'ai ai-arrow-up-right' : 'ai ai-arrow-down-right'
        }
  const variations = computed(() => {
    const changes = fallback(props.changes, sampleChanges, { requests: null, statusCodes: null })
    return { requests: variation(changes.requests), statusCodes: variation(changes.statusCodes) }
  })

  const hostColumns: TableColumn[] = [
    {
      accessorKey: 'host',
      id: 'host',
      header: 'Host',
      align: 'start',
      sortable: true,
      principal: true
    },
    {
      accessorKey: 'service',
      id: 'service',
      header: 'Service',
      align: 'start',
      sortable: true
    },
    {
      accessorKey: 'requests',
      id: 'requests',
      header: 'Requests',
      align: 'end',
      sortable: true
    }
  ]

  const forms: ToggleGroupOption[] = [
    {
      label: 'Line',
      value: 'line'
    },
    {
      label: 'Bar',
      value: 'bar'
    }
  ]

  const { formatNumber } = useLocale()

  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

  const formatters: Record<FigureFormat, (value: number) => string> = {
    count: (value) => compact(value),
    bytes: (value) => {
      const steps = ['B', 'KB', 'MB', 'GB', 'TB']
      let current = value
      let index = 0
      while (current >= 1000 && index < steps.length - 1) {
        current /= 1000
        index += 1
      }
      return `${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} ${steps[index]}`
    },
    percentage: (value) => `${value.toFixed(0)}%`
  }

  const requestsForm = ref('line')
  const statusForm = ref('line')
  const activeIndex = ref<number | null>(null)
  const search = ref('')

  interface CardQuery {
    dataset: string
    limit: number
    groupBy: string[]
    orderBy: string
  }

  const apiTime = (iso: string) => iso.replace(/(\.\d+)?Z$/, '')

  const cardQuery = (report: CardQuery) =>
    [
      'query {',
      `  ${report.dataset}(`,
      `    limit: ${report.limit}`,
      `    filter: { tsRange: { begin: "${apiTime(range.value.begin)}", end: "${apiTime(range.value.end)}" } }`,
      '    aggregate: { sum: requests }',
      `    groupBy: [${report.groupBy.join(', ')}]`,
      `    orderBy: [${report.orderBy}]`,
      '  ) {',
      ...[...report.groupBy, 'sum'].map((field) => `    ${field}`),
      '  }',
      '}'
    ].join('\n')

  const copyQuery = async (report: CardQuery) => {
    try {
      await globalThis.navigator.clipboard.writeText(cardQuery(report))
      toast.success('Query copied.', {
        description: 'Paste it into any GraphQL client that sends your token.'
      })
    } catch {
      toast.error('The query could not be copied.')
    }
  }

  const queries: Record<AnalyticsDashboardCardId, CardQuery> = {
    requests: { dataset: 'workloadMetrics', limit: 10000, groupBy: ['ts'], orderBy: 'ts_ASC' },
    'status-codes': {
      dataset: 'workloadMetrics',
      limit: 10000,
      groupBy: ['ts', 'status'],
      orderBy: 'ts_ASC'
    },
    countries: {
      dataset: 'workloadMetrics',
      limit: 10,
      groupBy: ['geolocCountryName'],
      orderBy: 'sum_DESC'
    },
    hosts: {
      dataset: 'workloadMetrics',
      limit: 1000,
      groupBy: ['host', 'configurationId'],
      orderBy: 'sum_DESC'
    }
  }

  interface CardReport extends CardQuery {
    label: string
    description: string
    columns: CsvColumn[]
    rows: () => object[]
    empty: () => boolean
  }

  const seriesRows = (series: readonly ChartSeries[], axis: readonly ChartLabel[]) =>
    axis.map((label, index) => ({
      ts: label instanceof Date ? label.toISOString() : label,
      ...Object.fromEntries(series.map((entry) => [entry.id, entry.values[index] ?? '']))
    }))

  const expanded = ref(props.defaultExpanded !== '')
  const expandedId = ref<AnalyticsDashboardCardId>(props.defaultExpanded || 'requests')
  const expandedReport = computed(() => reports[expandedId.value])

  const openExpanded = (id: AnalyticsDashboardCardId) => {
    expandedId.value = id
    expanded.value = true
  }

  const exportDisabled = (id: AnalyticsDashboardCardId) => blank.value || reports[id].empty()

  const onCardOption = (id: AnalyticsDashboardCardId, value: string | number) => {
    const report = reports[id]
    if (value === 'query') {
      copyQuery(report)
      return
    }
    const filename = `${id}-${periodSlug.value}.csv`
    downloadCsv(filename, toCsv({ columns: report.columns, rows: report.rows() }))
    toast.success('CSV exported.', { description: filename })
  }

  const reports: Record<AnalyticsDashboardCardId, CardReport> = {
    requests: {
      ...queries.requests,
      label: 'Requests over time',
      description: 'Sum of requests served by every service, per interval.',
      columns: [
        { header: 'Time', id: 'ts' },
        { header: 'Requests', id: 'requests' }
      ],
      rows: () => seriesRows(requests.value, labels.value),
      empty: () => requests.value.length === 0
    },
    'status-codes': {
      ...queries['status-codes'],
      label: 'Status codes',
      description: 'Sum of requests per status class. Switch to Bar to stack the classes.',
      columns: [
        { header: 'Time', id: 'ts' },
        { header: 'Status 2xx', id: '2xx' },
        { header: 'Status 3xx', id: '3xx' },
        { header: 'Status 4xx', id: '4xx' },
        { header: 'Status 5xx', id: '5xx' }
      ],
      rows: () => seriesRows(statusCodes.value, labels.value),
      empty: () => statusCodes.value.length === 0
    },
    countries: {
      ...queries.countries,
      label: 'Requests by country',
      description: 'Sum of requests per country of origin, top countries first.',
      columns: [
        { header: 'Country', id: 'country' },
        { header: 'Requests', id: 'requests' }
      ],
      rows: () => countryRows.value,
      empty: () => countryRows.value.length === 0
    },
    hosts: {
      ...queries.hosts,
      label: 'Top hosts',
      description: 'Hosts that served the most requests in the period, with their service.',
      columns: [
        { header: 'Host', id: 'host' },
        { header: 'Service', id: 'service' },
        { header: 'Requests', id: 'requests' }
      ],
      rows: () => hosts.value,
      empty: () => hosts.value.length === 0
    }
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
      <PageHeader
        title="Analytics"
        description="Requests, data transferred and errors your services handled in the period."
      >
        <template #actions>
          <Select
            v-model="period"
            size="medium"
            :display-value="periodLabel"
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
        </template>
      </PageHeader>
      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
        <li
          v-for="figure in figures"
          :key="figure.id"
          class="flex min-w-0 flex-col"
        >
          <StatTile
            :label="figure.label"
            :value="figure.value"
            :format-value="formatters[figure.format]"
            :delta="figure.delta"
            :delta-label="periodComparison"
            :inverse="figure.inverse"
            :trend="figure.trend"
            :loading="loading"
          >
            <template #aside>
              <Hint :content="figure.description" />
            </template>
          </StatTile>
        </li>
      </ul>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Requests over time</ChartCard.Title>
              <Hint content="Sum of requests served by every service, per interval." />
            </span>
            <ChartCard.Action>
              <span
                data-wide
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="ai ai-calculator"
                />
                <Tag
                  v-if="variations.requests"
                  :label="variations.requests.label"
                  :severity="variations.requests.severity"
                  :icon="variations.requests.icon"
                  size="small"
                />
                <ToggleGroup
                  v-model="requestsForm"
                  :options="forms"
                  size="small"
                  aria-label="Chart form for Requests over time"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="ai ai-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Requests over time"
                  :disabled="blank"
                  @click="openExpanded('requests')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('requests', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Requests over time"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                    :disabled="exportDisabled('requests')"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="failed"
              severity="danger"
              :label="`Couldn't load requests over time. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <Chart
              v-else
              v-model:active-index="activeIndex"
              :series="requests"
              :labels="labels"
              :format-value="formatters.count"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar v-if="requestsForm === 'bar'" />
              <Chart.Area v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend total />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Status codes</ChartCard.Title>
              <Hint
                content="Sum of requests per status class. Switch to Bar to stack the classes."
              />
            </span>
            <ChartCard.Action>
              <span
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="ai ai-calculator"
                />
                <Tag
                  v-if="variations.statusCodes"
                  :label="variations.statusCodes.label"
                  :severity="variations.statusCodes.severity"
                  :icon="variations.statusCodes.icon"
                  size="small"
                />
                <ToggleGroup
                  v-model="statusForm"
                  :options="forms"
                  size="small"
                  aria-label="Chart form for Status codes"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="ai ai-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Status codes"
                  :disabled="blank"
                  @click="openExpanded('status-codes')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('status-codes', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Status codes"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                    :disabled="exportDisabled('status-codes')"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="failed"
              severity="danger"
              :label="`Couldn't load status codes. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <Chart
              v-else
              v-model:active-index="activeIndex"
              :series="statusCodes"
              :labels="labels"
              :format-value="formatters.count"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar
                v-if="statusForm === 'bar'"
                stacked
              />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend total />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Requests by country</ChartCard.Title>
              <Hint content="Sum of requests per country of origin, top countries first." />
            </span>
            <ChartCard.Action>
              <span
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="ai ai-calculator"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="ai ai-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Requests by country"
                  :disabled="blank"
                  @click="openExpanded('countries')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('countries', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Requests by country"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                    :disabled="exportDisabled('countries')"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="failed"
              severity="danger"
              :label="`Couldn't load requests by country. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <Chart
              v-else
              :series="countryRequests"
              :labels="countryLabels"
              orientation="horizontal"
              :format-value="formatters.count"
              :height="240"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar show-labels />
              <Chart.Tooltip />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Top hosts</ChartCard.Title>
              <Hint
                content="Hosts that served the most requests in the period, with their service."
              />
            </span>
            <ChartCard.Action>
              <span
                data-wide
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="ai ai-calculator"
                />
              </span>
              <Tooltip content="Expand">
                <IconButton
                  icon="ai ai-window-maximize"
                  variant="ghost"
                  size="small"
                  aria-label="Expand Top hosts"
                  :disabled="blank"
                  @click="openExpanded('hosts')"
                />
              </Tooltip>
              <DropdownMenu
                side="bottom"
                align="end"
                @select="(_event, value) => onCardOption('hosts', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="ai ai-ellipsis"
                    variant="ghost"
                    size="small"
                    aria-label="More options for Top hosts"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Item
                    value="query"
                    label="Copy query"
                  />
                  <DropdownMenu.Item
                    value="export"
                    label="Export CSV"
                    :disabled="exportDisabled('hosts')"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="failed"
              severity="danger"
              :label="`Couldn't load top hosts. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <div
              v-else
              class="flex min-w-0 flex-col gap-(--spacing-sm)"
            >
              <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <div class="min-w-36 grow basis-(--container-3xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search hosts or services"
                    aria-label="Search hosts or services"
                  >
                    <template #leading>
                      <i
                        class="ai ai-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>
              </div>

              <DataTable
                v-model:global-filter="search"
                :data="hosts"
                :columns="hostColumns"
                row-key="id"
                sortable
                paginated
                :page-size="5"
                :page-size-options="[5, 10, 25]"
                density="compact"
                bordered
                :loading="loading"
              >
                <template #empty>
                  <EmptyState
                    key="empty-state-1"
                    v-if="!hosts.length"
                    size="small"
                    icon="ai ai-chart-line"
                    title="No traffic yet"
                    description="Metrics appear here once a service serves requests."
                  />
                  <EmptyState
                    key="empty-state-2"
                    v-else
                    size="small"
                    icon="ai ai-search"
                    title="No matching rows"
                    description="Change the search."
                  />
                </template>

                <template #cell-requests="{ row }">
                  <span class="tabular-nums">{{ formatters.count(row.requests) }}</span>
                </template>
              </DataTable>
            </div>
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
    <Dialog
      v-model:open="expanded"
      size="large"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DialogTitle>{{ expandedReport.label }}</DialogTitle>
            <DialogDescription>{{ expandedReport.description }}</DialogDescription>
          </div>
        </PanelHeader>
        <PanelBody>
          <div class="flex min-w-0 flex-col gap-(--spacing-md)">
            <div v-if="expandedId === 'requests' || expandedId === 'status-codes'">
              <ToggleGroup
                v-model="expandedForm"
                :options="forms"
                size="small"
                :aria-label="`Chart form for ${expandedReport.label}`"
              />
            </div>
            <Chart
              key="chart-1"
              v-if="expandedId === 'requests'"
              :series="requests"
              :labels="labels"
              :format-value="formatters.count"
              :height="420"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :aria-label="expandedReport.label"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar v-if="requestsForm === 'bar'" />
              <Chart.Area v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend total />
            </Chart>
            <Chart
              key="chart-2"
              v-else-if="expandedId === 'status-codes'"
              :series="statusCodes"
              :labels="labels"
              :format-value="formatters.count"
              :height="420"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :aria-label="expandedReport.label"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar
                v-if="statusForm === 'bar'"
                stacked
              />
              <Chart.Line v-else />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend total />
            </Chart>
            <Chart
              key="chart-3"
              v-else-if="expandedId === 'countries'"
              :series="countryRequests"
              :labels="countryLabels"
              orientation="horizontal"
              :format-value="formatters.count"
              :height="420"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :aria-label="expandedReport.label"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis type="x" />
              <Chart.Bar show-labels />
              <Chart.Tooltip />
            </Chart>
            <DataTable
              v-else
              :data="hosts"
              :columns="hostColumns"
              row-key="id"
              sortable
              paginated
              :page-size="10"
              density="compact"
              bordered
            >
              <template #empty>
                <EmptyState
                  size="small"
                  icon="ai ai-chart-line"
                  title="No traffic yet"
                  description="Metrics appear here once a service serves requests."
                />
              </template>

              <template #cell-requests="{ row }">
                <span class="tabular-nums">{{ formatters.count(row.requests) }}</span>
              </template>
            </DataTable>
          </div>
        </PanelBody>
      </DialogContent>
    </Dialog>
  </div>
</template>
