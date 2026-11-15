<script setup lang="ts">
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
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

  const loading = true

  const figures: Figure[] = [
    {
      id: 'requests',
      label: 'Requests',
      description: 'Sum of requests served by every service in the period.',
      value: 48920000,
      format: 'count',
      delta: -1.83,
      inverse: false,
      trend: [
        2029738, 1799252, 1910217, 1633835, 1757364, 1722765, 2157932, 2151290, 2283541, 2397218,
        2545994, 2347243
      ]
    },
    {
      id: 'data-transferred',
      label: 'Data transferred',
      description: 'Sum of data delivered to users by every service in the period.',
      value: 222000000000,
      format: 'bytes',
      delta: -13.26,
      inverse: false,
      trend: [
        7464097327, 8703777359, 8853256007, 10189608468, 10484778433, 10611102405, 9993797117,
        9768346098, 10386911277, 8642195236, 7365365394, 8004529693
      ]
    },
    {
      id: 'success-rate',
      label: 'Success rate',
      description: 'Share of requests that ended in a 2xx or 3xx status.',
      value: 98,
      format: 'percentage',
      delta: 0.42,
      inverse: false,
      trend: [99, 99, 99, 99, 98, 98, 97, 97, 97, 97, 97, 99]
    },
    {
      id: 'status-5xx',
      label: 'Status 5xx',
      description: 'Requests that ended in a server error. A rise is a regression.',
      value: 158600,
      format: 'count',
      delta: -5.47,
      inverse: true,
      trend: [4580, 5509, 4940, 5670, 7151, 9279, 8251, 8242, 8497, 6207, 5685, 5352]
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

  const requests: ChartSeries[] = [
    {
      id: 'requests',
      name: 'Requests',
      values: [
        2278608, 2368220, 2548427, 2385746, 2112152, 2214745, 1795004, 1575175, 1640830, 1634383,
        1933593, 2144294
      ]
    }
  ]

  const statusCodes: ChartSeries[] = [
    {
      id: '2xx',
      name: 'Status 2xx',
      values: [
        1524883, 1531611, 1348641, 1583433, 1898319, 1802251, 1954175, 1996970, 1957306, 1701833,
        1509664, 1620625
      ]
    },
    {
      id: '3xx',
      name: 'Status 3xx',
      values: [
        266730, 270925, 287218, 296721, 286635, 245627, 230388, 201140, 188038, 184104, 197071,
        244404
      ]
    },
    {
      id: '4xx',
      name: 'Status 4xx',
      values: [40942, 51712, 52096, 55261, 61739, 68992, 75656, 80310, 74603, 63564, 63640, 45548]
    },
    {
      id: '5xx',
      name: 'Status 5xx',
      values: [4709, 5417, 4551, 5950, 5281, 8024, 8695, 9676, 8359, 7225, 6456, 5222]
    }
  ]

  const countries: string[] = ['United States', 'Brazil', 'Germany', 'India', 'Mexico', 'Argentina']

  const countryRequests: ChartSeries[] = [
    {
      id: 'requests',
      name: 'Requests by country',
      values: [1048210, 531620, 118930, 92480, 69870, 48420]
    }
  ]

  const hosts: HostRow[] = [
    {
      id: 'www.example.com',
      host: 'www.example.com',
      service: 'Storefront',
      requests: 1284310
    },
    {
      id: 'api.example.com',
      host: 'api.example.com',
      service: 'Checkout API',
      requests: 712480
    },
    {
      id: 'shop.example.com',
      host: 'shop.example.com',
      service: 'Storefront',
      requests: 498210
    },
    {
      id: 'docs.example.com',
      host: 'docs.example.com',
      service: 'Docs',
      requests: 231640
    },
    {
      id: 'status.example.com',
      host: 'status.example.com',
      service: 'Status page',
      requests: 96120
    },
    {
      id: 'cdn.example.com',
      host: 'cdn.example.com',
      service: 'Media',
      requests: 61870
    },
    {
      id: 'blog.example.com',
      host: 'blog.example.com',
      service: 'Docs',
      requests: 28940
    }
  ]

  const hostColumns: TableColumn[] = [
    {
      id: 'host',
      accessorKey: 'host',
      header: 'Host',
      align: 'start',
      sortable: true,
      principal: true
    },
    {
      id: 'service',
      accessorKey: 'service',
      header: 'Service',
      align: 'start',
      sortable: true
    },
    {
      id: 'requests',
      accessorKey: 'requests',
      header: 'Requests',
      align: 'end',
      sortable: true
    }
  ]

  const variations: Variations = {
    requests: {
      label: '+10.03%',
      severity: 'success',
      icon: 'ai ai-arrow-up-right'
    },
    statusCodes: {
      label: '+14.66%',
      severity: 'success',
      icon: 'ai ai-arrow-up-right'
    }
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

  const onCardOption = (id: CardId, value: string | number) => {
    if (value === 'query') copyQuery(queries[id])
  }
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
                  disabled
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
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
                  disabled
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
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
                  disabled
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
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
                  disabled
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
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
  </div>
</template>
