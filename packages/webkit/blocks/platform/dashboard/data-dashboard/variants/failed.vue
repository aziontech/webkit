<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
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

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const formatCount = (value: number) => compact.format(value)

  const formatBytes = (value: number) => {
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
      value: null,
      delta: null,
      trend: []
    },
    {
      id: 'data-transferred',
      label: 'Data transferred',
      description: 'Data delivered to clients, in and out, by every project in the period.',
      unit: 'bytes',
      value: null,
      delta: null,
      trend: []
    },
    {
      id: 'jobs-run',
      label: 'Jobs run',
      description: 'Background jobs that ran to completion in the period.',
      unit: 'count',
      value: null,
      delta: null,
      trend: []
    },
    {
      id: 'images-processed',
      label: 'Images processed',
      description: 'Images resized, cropped or converted in the period.',
      unit: 'count',
      value: null,
      delta: null,
      trend: []
    },
    {
      id: 'requests-inspected',
      label: 'Requests inspected',
      description: 'Requests checked against security rules in the period.',
      unit: 'count',
      value: null,
      delta: null,
      trend: []
    },
    {
      id: 'logs-exported',
      label: 'Logs exported',
      description: 'Log data sent to external destinations in the period.',
      unit: 'bytes',
      value: null,
      delta: null,
      trend: []
    }
  ]

  const comparison: { delta: number | null; labels: string[]; series: unknown[] } = {
    delta: null,
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
    series: []
  }

  const form = ref('line')
  const FORMS = [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' }
  ]

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

  interface CardQuery {
    dataset: string
    fields: string[]
    orderBy: string
  }

  const periodStart = '2026-11-13T00:00:00Z'
  const periodEnd = '2026-11-13T23:59:59Z'

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

  type CardId = 'comparison' | 'projects' | 'usage'

  const queries: Record<CardId, CardQuery> = {
    comparison: {
      dataset: 'usageMetrics',
      fields: ['ts', 'dataTransferred', 'previousDataTransferred'],
      orderBy: 'ts_ASC'
    },
    projects: {
      dataset: 'usageMetrics',
      fields: ['project', 'dataTransferred'],
      orderBy: 'dataTransferred_DESC'
    },
    usage: {
      dataset: 'usageMetrics',
      fields: ['project', 'requests', 'dataTransferred'],
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
        title="Data usage"
        description="What your projects consumed in the period, against the previous period."
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
            :delta-label="periodComparison"
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
            <ChartCard.Action>
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
                  disabled
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('comparison', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Data transferred, this period vs previous"
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
              label="Couldn't load data transferred for this period. Check your connection and retry."
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Data transferred by project</ChartCard.Title>
              <Hint text="The projects that delivered the most data in the period." />
            </span>
            <ChartCard.Action>
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
                  disabled
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('projects', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Data transferred by project"
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
              label="Couldn't load data transferred by project. Check your connection and retry."
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Usage by project</ChartCard.Title>
              <Hint text="Requests and data transferred per project in the period." />
            </span>
            <ChartCard.Action>
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
                  disabled
                />
              </Tooltip>
              <DropdownMenu
                placement="bottom-end"
                @select="(_event, value) => onCardOption('usage', value)"
              >
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    aria-label="More options for Usage by project"
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
              label="Couldn't load usage by project. Check your connection and retry."
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
