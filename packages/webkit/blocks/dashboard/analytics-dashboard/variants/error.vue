<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
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

  const loading = false

  const figures = [
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

  const variations: Record<
    'requests' | 'statusCodes',
    { label: string; severity: TagSeverity; icon?: string } | null
  > = {
    requests: null,
    statusCodes: null
  }

  const forms = [
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

  const formatters: Record<string, (value: number) => string> = {
    count: (value: number) => compact(value),
    bytes: (value: number) => {
      const steps = ['B', 'KB', 'MB', 'GB', 'TB']
      let current = value
      let index = 0
      while (current >= 1000 && index < steps.length - 1) {
        current /= 1000
        index += 1
      }
      return `${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} ${steps[index]}`
    },
    percentage: (value: number) => `${value.toFixed(0)}%`
  }

  const requestsForm = ref('line')
  const statusForm = ref('line')
  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

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
                    disabled
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load requests over time. Check your connection and retry."
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
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
                    disabled
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load status codes. Check your connection and retry."
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
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
                    disabled
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load requests by country. Check your connection and retry."
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
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
                    disabled
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load top hosts. Check your connection and retry."
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
