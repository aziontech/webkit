<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import Card from '@aziontech/webkit/card'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import SeverityTag from '@aziontech/webkit/severity-tag'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const loading = false
  const comparison = 'vs previous period'
  const period = ref('30d')
  const activeIndex = ref(null)
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

  const figures = [
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

  const series = []

  const openByLevel = []

  const types = []

  const entities = []

  const entityColumns = [
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
      enableSorting: true,
      minWidth: 160
    },
    {
      id: 'alerts',
      accessorKey: 'alerts',
      header: 'Open alerts',
      align: 'end',
      enableSorting: true,
      minWidth: 104
    }
  ]

  const alerts = []

  const alertColumns = [
    {
      id: 'severity',
      accessorKey: 'rank',
      header: 'Severity',
      align: 'start',
      enableSorting: true,
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

  const statusSeverity = {
    Open: 'secondary',
    Investigating: 'info'
  }

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const formatters = {
    count: (value) => compact.format(value),
    percentage: (value) => `${value.toFixed(0)}%`
  }
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex flex-col gap-(--layout-group-gap)">
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
                (value) => periods.find((option) => option.value === value)?.label ?? value
              "
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
                <Hint :text="figure.description" />
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
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Alerts per day</ChartCard.Title>
              <Hint text="Alerts raised each day, stacked by severity level." />
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
              empty-description="Nothing was raised in the last 30 days. Select a longer period."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis
                kind="x"
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
            <template #content>
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
                icon="pi pi-check-circle"
                title="No open alerts"
                description="Every alert raised in the period has been closed."
              />
            </template>
          </Card>
        </div>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>By type</ChartCard.Title>
              <Hint text="Alerts raised in the period, by the kind of behavior that raised them." />
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
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Highest risk</ChartCard.Title>
              <Hint
                text="The entities with the highest risk score, from the severity and number of their open alerts."
              />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <TableRoot
              v-if="loading || entities.length"
              :data="entities"
              :columns="entityColumns"
              row-key="id"
              enable-sorting
              header-kind="compact"
              bordered
              :loading="loading"
            >
              <template #cell-type="{ row }">
                <Tag
                  :label="row.type"
                  severity="secondary"
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
            </TableRoot>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-users"
              title="No entities at risk yet"
              description="Entities appear here once an alert names them."
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Open alerts</ChartCard.Title>
              <Hint text="Every open alert, most severe first." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <TableRoot
              v-if="loading || alerts.length"
              :data="alerts"
              :columns="alertColumns"
              row-key="id"
              enable-sorting
              paginated
              :page-size="10"
              :rows-per-page-options="[10, 25, 50]"
              header-kind="compact"
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
                <Tag
                  :label="row.status"
                  :severity="statusSeverity[row.status]"
                  size="small"
                />
              </template>
            </TableRoot>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-bell"
              title="No open alerts"
              description="Alerts appear here when a detection rule matches. Select a longer period to see closed ones."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </main>
  </div>
</template>
