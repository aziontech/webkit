<script setup lang="ts">
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Card from '@aziontech/webkit/card'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import SeverityTag, { type SeverityTagLevel } from '@aziontech/webkit/severity-tag'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  type FigureFormat = 'count' | 'percentage'
  type AlertStatus = 'Open' | 'Investigating'

  interface Figure {
    id: string
    label: string
    description: string
    value: number | null
    delta: number | null
    inverse: boolean
    format: FigureFormat
  }

  interface LevelCount {
    id: SeverityTagLevel
    count: number
  }

  interface Entity {
    id: string
    name: string
    type: string
    score: number
    level: SeverityTagLevel
    alerts: number
  }

  interface AlertRow {
    id: string
    level: SeverityTagLevel
    rank: number
    title: string
    entity: string
    opened: string
    status: AlertStatus
  }

  const loading = false
  const comparison = 'vs previous period'
  const period = ref('30d')
  const activeIndex = ref<number | null>(null)
  const openTotal = 0

  const periods = [
    {
      value: '7d',
      label: 'Last 7 days'
    },
    {
      value: '30d',
      label: 'Last 30 days'
    },
    {
      value: '90d',
      label: 'Last 90 days'
    }
  ]

  const periodPhrase = computed(
    () =>
      periods.find((option) => option.value === period.value)?.label.toLowerCase() ?? 'this period'
  )

  const figures: Figure[] = [
    {
      id: 'open',
      label: 'Open',
      description: 'Alerts nobody has closed yet, at any severity.',
      value: null,
      delta: null,
      inverse: true,
      format: 'count'
    },
    {
      id: 'critical-high',
      label: 'Critical or high open',
      description: 'Open alerts at the two highest severity levels.',
      value: null,
      delta: null,
      inverse: true,
      format: 'count'
    },
    {
      id: 'raised',
      label: 'Alerts in the period',
      description: 'Every alert raised in the period, open or closed.',
      value: null,
      delta: null,
      inverse: true,
      format: 'count'
    },
    {
      id: 'false-positives',
      label: 'False positives',
      description: 'Share of the alerts closed in the period that were marked as false positives.',
      value: null,
      delta: null,
      inverse: true,
      format: 'percentage'
    }
  ]

  const labels = [
    'Oct 12',
    'Oct 13',
    'Oct 14',
    'Oct 15',
    'Oct 16',
    'Oct 17',
    'Oct 18',
    'Oct 19',
    'Oct 20',
    'Oct 21',
    'Oct 22',
    'Oct 23',
    'Oct 24',
    'Oct 25',
    'Oct 26',
    'Oct 27',
    'Oct 28',
    'Oct 29',
    'Oct 30',
    'Oct 31',
    'Nov 1',
    'Nov 2',
    'Nov 3',
    'Nov 4',
    'Nov 5',
    'Nov 6',
    'Nov 7',
    'Nov 8',
    'Nov 9',
    'Nov 10'
  ]

  const series: ChartSeries[] = []

  const openByLevel: LevelCount[] = []

  const types: BarListItem[] = []

  const entities: Entity[] = []

  const entityColumns: TableColumn[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Entity',
      align: 'start',
      principal: true,
      grow: 2
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Type',
      align: 'start',
      minWidth: 136
    },
    {
      id: 'score',
      accessorKey: 'score',
      header: 'Risk score',
      align: 'start',
      sortable: true,
      minWidth: 160
    },
    {
      id: 'alerts',
      accessorKey: 'alerts',
      header: 'Open alerts',
      align: 'end',
      sortable: true,
      minWidth: 104
    }
  ]

  const alerts: AlertRow[] = []

  const alertColumns: TableColumn[] = [
    {
      id: 'severity',
      accessorKey: 'rank',
      header: 'Severity',
      align: 'start',
      sortable: true,
      minWidth: 120
    },
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Alert',
      align: 'start',
      principal: true,
      grow: 2
    },
    {
      id: 'entity',
      accessorKey: 'entity',
      header: 'Entity',
      align: 'start',
      minWidth: 160
    },
    {
      id: 'opened',
      accessorKey: 'opened',
      header: 'Opened',
      align: 'start',
      minWidth: 136
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      align: 'start',
      minWidth: 128
    }
  ]

  const statusSeverity: Record<AlertStatus, TagSeverity> = {
    Open: 'neutral',
    Investigating: 'info'
  }

  const { formatNumber } = useLocale()

  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

  const formatters: Record<FigureFormat, (value: number) => string> = {
    count: (value) => compact(value),
    percentage: (value) => `${value.toFixed(0)}%`
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Alerts"
        description="What is open, how severe it is, what kind it is and who is involved."
      >
        <template #actions>
          <div class="w-44 shrink-0">
            <Select
              v-model="period"
              size="medium"
              :display-value="
                (value) => periods.find((option) => option.value === value)?.label ?? String(value)
              "
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
          </div>
        </template>
      </PageHeader>

      <section aria-label="Summary">
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
              :delta-label="comparison"
              :inverse="figure.inverse"
              :loading="loading"
            >
              <template #aside>
                <Hint :content="figure.description" />
              </template>
            </StatTile>
          </li>
        </ul>
      </section>

      <div
        class="grid grid-cols-1 items-stretch gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="8">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Alerts per day</ChartCard.Title>
              <Hint content="Alerts raised each day, stacked by severity level." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              v-model:active-index="activeIndex"
              :series="series"
              :labels="labels"
              :format-value="formatters.count"
              :height="240"
              empty-title="No alerts in this period"
              :empty-description="`Nothing was raised in the ${periodPhrase}. Select a longer period.`"
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis type="y" />
              <Chart.Axis
                type="x"
                :ticks="6"
              />
              <Chart.Bar stacked />
              <Chart.Crosshair />
              <Chart.Tooltip />
              <Chart.Legend />
            </Chart>
          </ChartCard.Content>
        </ChartCard>

        <div class="lg:col-span-4">
          <Card title="Open by severity">
            <template #default>
              <ul
                v-if="loading"
                aria-busy="true"
                class="flex flex-col gap-(--spacing-md)"
              >
                <li
                  v-for="index in 5"
                  :key="index"
                  class="flex items-center justify-between gap-(--spacing-sm)"
                >
                  <Skeleton
                    width="30%"
                    height="1.25rem"
                  />
                  <Skeleton
                    width="20%"
                    height="1rem"
                  />
                </li>
              </ul>
              <ul
                v-else-if="openByLevel.length"
                class="flex flex-col gap-(--spacing-md)"
              >
                <li
                  v-for="level in openByLevel"
                  :key="level.id"
                  class="flex items-center justify-between gap-(--spacing-sm)"
                >
                  <SeverityTag :severity="level.id" />
                  <span class="flex items-baseline gap-(--spacing-xs) tabular-nums">
                    <span class="text-body-md text-(--text-default)">{{ level.count }}</span>
                    <span class="w-10 text-end text-body-sm text-(--text-muted)"
                      >{{ Math.round((level.count / openTotal) * 100) }}%</span
                    >
                  </span>
                </li>
              </ul>
              <EmptyState
                v-else
                size="small"
                icon="ai ai-circle-check"
                title="No open alerts"
                description="Every alert raised in the period has been closed."
              />
            </template>
          </Card>
        </div>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>By type</ChartCard.Title>
              <Hint
                content="Alerts raised in the period, by the kind of behavior that raised them."
              />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <BarList
              :items="types"
              :format-value="formatters.count"
              empty-title="No alerts in this period"
              :loading="loading"
              aria-label="Alerts by type"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="8">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Highest risk</ChartCard.Title>
              <Hint
                content="The entities with the highest risk score, from the severity and number of their open alerts."
              />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <DataTable
              v-if="loading || entities.length"
              :data="entities"
              :columns="entityColumns"
              row-key="id"
              sortable
              density="compact"
              bordered
              :loading="loading"
            >
              <template #cell-type="{ row }">
                <Tag
                  :label="row.type"
                  severity="neutral"
                  size="small"
                />
              </template>
              <template #cell-score="{ row }">
                <div class="flex min-w-0 items-center gap-(--spacing-sm)">
                  <span class="w-8 shrink-0 text-end tabular-nums">{{ row.score }}</span>
                  <SeverityTag
                    :severity="row.level"
                    size="small"
                  />
                </div>
              </template>
              <template #cell-alerts="{ row }">
                <span class="tabular-nums">{{ row.alerts }}</span>
              </template>
            </DataTable>
            <EmptyState
              v-else
              size="small"
              icon="ai ai-users"
              title="No entities at risk yet"
              description="Entities appear here once an alert names them."
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Open alerts</ChartCard.Title>
              <Hint content="Every open alert, most severe first." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <DataTable
              v-if="loading || alerts.length"
              :data="alerts"
              :columns="alertColumns"
              row-key="id"
              sortable
              paginated
              :page-size="10"
              :page-size-options="[10, 25, 50]"
              density="compact"
              bordered
              :loading="loading"
            >
              <template #cell-severity="{ row }">
                <SeverityTag
                  :severity="row.level"
                  size="small"
                />
              </template>
              <template #cell-status="{ row }">
                <TableCellStatus
                  :label="row.status"
                  :severity="statusSeverity[row.status]"
                />
              </template>
            </DataTable>
            <EmptyState
              v-else
              size="small"
              icon="ai ai-bell"
              title="No open alerts"
              description="Alerts appear here when a detection rule matches. Select a longer period to see closed ones."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
