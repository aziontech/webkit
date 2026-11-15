<script setup lang="ts">
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
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
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { type CsvColumn, downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref } from 'vue'

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
  const period = ref(fallbackPeriod.value)
  const periodLabel = (value: string) => periods.find((entry) => entry.value === value)?.label ?? ''
  const currentPeriod = computed(
    () => periods.find((entry) => entry.value === period.value) ?? fallbackPeriod
  )
  const periodComparison = computed(() => currentPeriod.value.comparison)
  const periodSlug = computed(() => currentPeriod.value.label.toLowerCase().replaceAll(' ', '-'))

  type FigureFormat = 'count' | 'bytes' | 'percentage'

  interface Figure {
    id: string
    label: string
    description: string
    value: number | null
    format: FigureFormat
    delta: number | null
    inverse: boolean
    trend: number[]
  }

  interface HostRow {
    id: string
    host: string
    service: string
    requests: number
  }

  interface Variation {
    label: string
    severity: TagSeverity
    icon: string
  }

  interface Variations {
    requests: Variation | null
    statusCodes: Variation | null
  }

  const loading = false

  const figures: Figure[] = [
    {
      id: 'requests',
      label: 'Requests',
      description: 'Sum of requests served by every service in the period.',
      value: null,
      format: 'count',
      delta: null,
      inverse: false,
      trend: []
    },
    {
      id: 'data-transferred',
      label: 'Data transferred',
      description: 'Sum of data delivered to users by every service in the period.',
      value: null,
      format: 'bytes',
      delta: null,
      inverse: false,
      trend: []
    },
    {
      id: 'success-rate',
      label: 'Success rate',
      description: 'Share of requests that ended in a 2xx or 3xx status.',
      value: null,
      format: 'percentage',
      delta: null,
      inverse: false,
      trend: []
    },
    {
      id: 'status-5xx',
      label: 'Status 5xx',
      description: 'Requests that ended in a server error. A rise is a regression.',
      value: null,
      format: 'count',
      delta: null,
      inverse: true,
      trend: []
    }
  ]

  const labels = [
    '11:00',
    '13:00',
    '15:00',
    '17:00',
    '19:00',
    '21:00',
    '23:00',
    '01:00',
    '03:00',
    '05:00',
    '07:00',
    '09:00'
  ]

  const requests: ChartSeries[] = []

  const statusCodes: ChartSeries[] = []

  const countries: string[] = []

  const countryRequests: ChartSeries[] = []

  const hosts: HostRow[] = []

  const hostColumns: TableColumn[] = [
    {
      id: 'host',
      accessorKey: 'host',
      header: 'Host',
      align: 'start',
      enableSorting: true,
      principal: true
    },
    {
      id: 'service',
      accessorKey: 'service',
      header: 'Service',
      align: 'start',
      enableSorting: true
    },
    {
      id: 'requests',
      accessorKey: 'requests',
      header: 'Requests',
      align: 'end',
      enableSorting: true
    }
  ]

  const variations: Variations = {
    requests: null,
    statusCodes: null
  }

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
    fields: string[]
    orderBy: string
  }

  const periodStart = '2026-11-13T11:00:00Z'
  const periodEnd = '2026-11-14T10:59:59Z'

  const cardQuery = (report: CardQuery) =>
    [
      'query {',
      `  ${report.dataset}(`,
      '    limit: 5000',
      '    aggregate: { sum: requests }',
      `    filter: { tsRange: { begin: "${periodStart}", end: "${periodEnd}" } }`,
      `    orderBy: [${report.orderBy}]`,
      '  ) {',
      ...report.fields.map((field) => `    ${field}`),
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

  type CardId = 'requests' | 'status-codes' | 'countries' | 'hosts'

  const queries: Record<CardId, CardQuery> = {
    requests: { dataset: 'httpMetrics', fields: ['ts', 'requests'], orderBy: 'ts_ASC' },
    'status-codes': {
      dataset: 'httpMetrics',
      fields: ['ts', 'status', 'requests'],
      orderBy: 'ts_ASC'
    },
    countries: {
      dataset: 'httpMetrics',
      fields: ['country', 'requests'],
      orderBy: 'requests_DESC'
    },
    hosts: {
      dataset: 'httpMetrics',
      fields: ['host', 'service', 'requests'],
      orderBy: 'requests_DESC'
    }
  }

  interface CardReport extends CardQuery {
    label: string
    description: string
    columns: CsvColumn[]
    rows: () => object[]
  }

  const seriesRows = (series: readonly ChartSeries[], axis: readonly (string | Date)[]) =>
    axis.map((label, index) => ({
      ts: label instanceof Date ? label.toISOString() : label,
      ...Object.fromEntries(series.map((entry) => [entry.id, entry.values[index] ?? '']))
    }))

  const expanded = ref(false)
  const expandedId = ref<CardId>('requests')
  const expandedReport = computed(() => reports[expandedId.value])

  const openExpanded = (id: CardId) => {
    expandedId.value = id
    expanded.value = true
  }

  const onCardOption = (id: CardId, value: string | number) => {
    const report = reports[id]
    if (value === 'query') {
      copyQuery(report)
      return
    }
    const filename = `${id}-${periodSlug.value}.csv`
    downloadCsv(filename, toCsv({ columns: report.columns, rows: report.rows() }))
    toast.success('CSV exported.', { description: filename })
  }

  const reports: Record<CardId, CardReport> = {
    requests: {
      ...queries.requests,
      label: 'Requests over time',
      description: 'Sum of requests served by every service, per interval.',
      columns: [
        { id: 'ts', header: 'Time' },
        { id: 'requests', header: 'Requests' }
      ],
      rows: () => seriesRows(requests, labels)
    },
    'status-codes': {
      ...queries['status-codes'],
      label: 'Status codes',
      description: 'Sum of requests per status class. Switch to Bar to stack the classes.',
      columns: [
        { id: 'ts', header: 'Time' },
        { id: '2xx', header: 'Status 2xx' },
        { id: '3xx', header: 'Status 3xx' },
        { id: '4xx', header: 'Status 4xx' },
        { id: '5xx', header: 'Status 5xx' }
      ],
      rows: () => seriesRows(statusCodes, labels)
    },
    countries: {
      ...queries.countries,
      label: 'Requests by country',
      description: 'Sum of requests per country of origin, top countries first.',
      columns: [
        { id: 'country', header: 'Country' },
        { id: 'requests', header: 'Requests' }
      ],
      rows: () =>
        countries.map((country, index) => ({
          country,
          requests: countryRequests[0]?.values[index] ?? ''
        }))
    },
    hosts: {
      ...queries.hosts,
      label: 'Top hosts',
      description: 'Hosts that served the most requests in the period, with their service.',
      columns: [
        { id: 'host', header: 'Host' },
        { id: 'service', header: 'Service' },
        { id: 'requests', header: 'Requests' }
      ],
      rows: () => hosts
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
              <Select.Option
                v-for="option in periods"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
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
              <ChartCard.Title>Requests over time</ChartCard.Title>
              <Hint text="Sum of requests served by every service, per interval." />
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
                  icon="pi pi-calculator"
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
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Requests over time"
                  @click="openExpanded('requests')"
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('requests', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
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
                    disabled
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              v-model:active-index="activeIndex"
              :series="requests"
              :labels="labels"
              :format-value="formatters.count"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
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
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Status codes</ChartCard.Title>
              <Hint text="Sum of requests per status class. Switch to Bar to stack the classes." />
            </span>
            <ChartCard.Action>
              <span
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="pi pi-calculator"
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
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Status codes"
                  @click="openExpanded('status-codes')"
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('status-codes', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
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
                    disabled
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              v-model:active-index="activeIndex"
              :series="statusCodes"
              :labels="labels"
              :format-value="formatters.count"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
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
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Requests by country</ChartCard.Title>
              <Hint text="Sum of requests per country of origin, top countries first." />
            </span>
            <ChartCard.Action>
              <span
                class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
              >
                <Tag
                  label="Sum"
                  severity="neutral"
                  size="small"
                  icon="pi pi-calculator"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Requests by country"
                  @click="openExpanded('countries')"
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('countries', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
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
                    disabled
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              :series="countryRequests"
              :labels="countries"
              orientation="horizontal"
              :format-value="formatters.count"
              :height="240"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
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

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Top hosts</ChartCard.Title>
              <Hint text="Hosts that served the most requests in the period, with their service." />
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
                  icon="pi pi-calculator"
                />
              </span>
              <Tooltip text="Expand">
                <IconButton
                  icon="pi pi-window-maximize"
                  kind="transparent"
                  size="small"
                  aria-label="Expand Top hosts"
                  @click="openExpanded('hosts')"
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('hosts', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
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
                    disabled
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
              <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <div class="min-w-36 grow basis-(--container-3xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search hosts or services"
                    aria-label="Search hosts or services"
                  >
                    <template #prefix>
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
                :data="hosts"
                :columns="hostColumns"
                row-key="id"
                enable-sorting
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
                    icon="pi pi-chart-line"
                    title="No traffic yet"
                    description="Metrics appear here once a service serves requests."
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
                  <span class="tabular-nums">{{ formatters.count(row.requests) }}</span>
                </template>
              </TableRoot>
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
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <DialogTitle>{{ expandedReport.label }}</DialogTitle>
            <DialogDescription>{{ expandedReport.description }}</DialogDescription>
          </div>
        </PanelHeader>
        <PanelContent>
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
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
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
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
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
              :labels="countries"
              orientation="horizontal"
              :format-value="formatters.count"
              :height="420"
              empty-title="No traffic yet"
              empty-description="Metrics appear here once a service serves requests."
              :aria-label="expandedReport.label"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar labeled />
              <Chart.Tooltip />
            </Chart>
            <TableRoot
              v-else
              :data="hosts"
              :columns="hostColumns"
              row-key="id"
              enable-sorting
              paginated
              :page-size="10"
              density="compact"
              bordered
            >
              <template #empty>
                <EmptyState
                  size="small"
                  icon="pi pi-chart-line"
                  title="No traffic yet"
                  description="Metrics appear here once a service serves requests."
                />
              </template>

              <template #cell-requests="{ row }">
                <span class="tabular-nums">{{ formatters.count(row.requests) }}</span>
              </template>
            </TableRoot>
          </div>
        </PanelContent>
      </DialogContent>
    </Dialog>
  </div>
</template>
