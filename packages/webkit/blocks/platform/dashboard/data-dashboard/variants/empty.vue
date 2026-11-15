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
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
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

  const { formatNumber } = useLocale()

  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

  interface ProjectRow {
    id: string
    project: string
    requests: number
    dataTransferred: string
  }

  interface SeriesData {
    labels: string[]
    series: ChartSeries[]
  }

  const formatCount = (value: number) => compact(value)

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

  const comparison: SeriesData & { delta: number | null } = {
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

  const ranking: SeriesData = { labels: [], series: [] }

  const columns: TableColumn[] = [
    {
      id: 'project',
      accessorKey: 'project',
      header: 'Project',
      align: 'start',
      enableSorting: true,
      principal: true
    },
    {
      id: 'requests',
      accessorKey: 'requests',
      header: 'Requests',
      align: 'end',
      enableSorting: true,
      principal: false
    },
    {
      id: 'dataTransferred',
      accessorKey: 'dataTransferred',
      header: 'Data transferred',
      align: 'end',
      enableSorting: true,
      principal: false
    }
  ]

  const rows: ProjectRow[] = []

  const form = ref('line')
  const activeIndex = ref<number | null>(null)
  const search = ref('')

  const FORMS = [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' }
  ]

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
  const expandedId = ref<CardId>('comparison')
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
    comparison: {
      ...queries.comparison,
      label: 'Data transferred, this period vs previous',
      description:
        'Data delivered by every project in the selected period, drawn over the same span of the previous period.',
      columns: [
        { id: 'ts', header: 'Time' },
        { id: 'current', header: 'This period' },
        { id: 'previous', header: 'Previous period' }
      ],
      rows: () => seriesRows(comparison.series, comparison.labels)
    },
    projects: {
      ...queries.projects,
      label: 'Data transferred by project',
      description: 'The projects that delivered the most data in the period.',
      columns: [
        { id: 'project', header: 'Project' },
        { id: 'dataTransferred', header: 'Data transferred' }
      ],
      rows: () =>
        ranking.labels.map((project, index) => ({
          project,
          dataTransferred: ranking.series[0]?.values[index] ?? ''
        }))
    },
    usage: {
      ...queries.usage,
      label: 'Usage by project',
      description: 'Requests and data transferred per project in the period.',
      columns: [
        { id: 'project', header: 'Project' },
        { id: 'requests', header: 'Requests' },
        { id: 'dataTransferred', header: 'Data transferred' }
      ],
      rows: () => rows
    }
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
                  severity="neutral"
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
                  @click="openExpanded('comparison')"
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
            <Chart
              v-model:active-index="activeIndex"
              :series="comparison.series"
              :labels="comparison.labels"
              :format-value="formatBytes"
              empty-title="No usage yet"
              empty-description="Usage appears here once a project serves requests."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar
                v-if="form === 'bar'"
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
              <ChartCard.Title>Data transferred by project</ChartCard.Title>
              <Hint text="The projects that delivered the most data in the period." />
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
                  aria-label="Expand Data transferred by project"
                  @click="openExpanded('projects')"
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
            <Chart
              :series="ranking.series"
              :labels="ranking.labels"
              orientation="horizontal"
              :format-value="formatBytes"
              :height="256"
              empty-title="No usage yet"
              empty-description="Usage appears here once a project serves requests."
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
                  aria-label="Expand Usage by project"
                  @click="openExpanded('usage')"
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
            <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
              <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <div class="min-w-36 grow basis-(--container-3xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search projects"
                    aria-label="Search projects"
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
                :data="rows"
                :columns="columns"
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
                    v-if="!rows.length"
                    size="small"
                    icon="pi pi-chart-line"
                    title="No usage yet"
                    description="Usage appears here once a project serves requests."
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
                  <span class="tabular-nums">{{ formatCount(row.requests) }}</span>
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
            <template v-if="expandedId === 'comparison'">
              <div>
                <ToggleGroup
                  v-model="form"
                  :options="FORMS"
                  size="small"
                  :aria-label="`Chart form for ${expandedReport.label}`"
                />
              </div>
              <Chart
                :series="comparison.series"
                :labels="comparison.labels"
                :format-value="formatBytes"
                :height="420"
                empty-title="No usage yet"
                empty-description="Usage appears here once a project serves requests."
                :aria-label="expandedReport.label"
              >
                <Chart.Grid />
                <Chart.Axis kind="y" />
                <Chart.Axis kind="x" />
                <Chart.Bar
                  v-if="form === 'bar'"
                  stacked
                />
                <Chart.Line v-else />
                <Chart.Crosshair />
                <Chart.Tooltip />
                <Chart.Legend total />
              </Chart>
            </template>
            <Chart
              v-else-if="expandedId === 'projects'"
              :series="ranking.series"
              :labels="ranking.labels"
              orientation="horizontal"
              :format-value="formatBytes"
              :height="420"
              empty-title="No usage yet"
              empty-description="Usage appears here once a project serves requests."
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
              :data="rows"
              :columns="columns"
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
                  title="No usage yet"
                  description="Usage appears here once a project serves requests."
                />
              </template>

              <template #cell-requests="{ row }">
                <span class="tabular-nums">{{ formatCount(row.requests) }}</span>
              </template>
            </TableRoot>
          </div>
        </PanelContent>
      </DialogContent>
    </Dialog>
  </div>
</template>
