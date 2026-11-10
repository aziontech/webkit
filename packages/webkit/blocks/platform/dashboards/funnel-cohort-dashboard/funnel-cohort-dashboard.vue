<script setup>
  import Button from '@aziontech/webkit/button'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot from '@aziontech/webkit/table-root'
  import { computed, ref } from 'vue'

  const loading = false

  const periods = [
    {
      value: '30d',
      label: 'Last 30 days',
      comparison: 'vs previous 30 days'
    },
    {
      value: '6w',
      label: 'Last 6 weeks',
      comparison: 'vs previous 6 weeks'
    },
    {
      value: '90d',
      label: 'Last 90 days',
      comparison: 'vs previous 90 days'
    }
  ]

  const segments = [
    {
      value: 'all',
      label: 'All users'
    },
    {
      value: 'self-serve',
      label: 'Self-serve'
    },
    {
      value: 'sales-assisted',
      label: 'Sales-assisted'
    },
    {
      value: 'partners',
      label: 'Partner referrals'
    }
  ]

  const segmentsWithData = ['all', 'self-serve', 'sales-assisted']

  const figures = [
    {
      id: 'visitors',
      label: 'Visitors',
      description: 'Unique people who visited the product site in the period.',
      value: 48200,
      format: 'number',
      delta: 8.2,
      trend: [7600, 7900, 8100, 7800, 8300, 8500]
    },
    {
      id: 'sign-ups',
      label: 'Sign-ups',
      description: 'Visitors who created an account in the period.',
      value: 6748,
      format: 'number',
      delta: 4.1,
      trend: [1084, 1136, 1052, 1210, 1098, 1168]
    },
    {
      id: 'activated',
      label: 'Activated',
      description: 'New accounts that created their first project.',
      value: 3914,
      format: 'number',
      delta: -2.6,
      trend: [630, 660, 610, 700, 640, 674]
    },
    {
      id: 'paid',
      label: 'Paid',
      description: 'Activated accounts that started a paid plan.',
      value: 1135,
      format: 'number',
      delta: 5.3,
      trend: [180, 192, 176, 204, 188, 195]
    },
    {
      id: 'conversion',
      label: 'Overall conversion',
      description:
        'Paid accounts as a share of visitors, from the first visit to the first payment.',
      value: 2.35,
      format: 'share',
      delta: -2.7,
      trend: [2.37, 2.43, 2.17, 2.62, 2.27, 2.29]
    }
  ]

  const stages = ['Visited', 'Signed up', 'Activated', 'Paid']

  const funnel = [
    {
      id: 'users',
      name: 'Users',
      values: [48200, 6748, 3914, 1135]
    }
  ]

  const steps = [
    {
      id: 'visited',
      step: 'Visited',
      users: 48200,
      share: 100,
      dropoff: null,
      from: ''
    },
    {
      id: 'signed-up',
      step: 'Signed up',
      users: 6748,
      share: 14,
      dropoff: 86,
      from: 'Visited'
    },
    {
      id: 'activated',
      step: 'Activated',
      users: 3914,
      share: 8.12,
      dropoff: 42,
      from: 'Signed up'
    },
    {
      id: 'paid',
      step: 'Paid',
      users: 1135,
      share: 2.35,
      dropoff: 71,
      from: 'Activated'
    }
  ]

  const stepColumns = [
    {
      id: 'step',
      accessorKey: 'step',
      header: 'Step',
      align: 'start',
      principal: true
    },
    {
      id: 'users',
      accessorKey: 'users',
      header: 'Users',
      align: 'end'
    },
    {
      id: 'share',
      accessorKey: 'share',
      header: 'Of visitors',
      align: 'end',
      minWidth: 112
    },
    {
      id: 'dropoff',
      accessorKey: 'dropoff',
      header: 'Drop-off',
      align: 'end',
      minWidth: 208
    }
  ]

  const weeks = [
    {
      key: 'week1',
      label: 'Week 1',
      slot: 'cell-week1'
    },
    {
      key: 'week2',
      label: 'Week 2',
      slot: 'cell-week2'
    },
    {
      key: 'week3',
      label: 'Week 3',
      slot: 'cell-week3'
    },
    {
      key: 'week4',
      label: 'Week 4',
      slot: 'cell-week4'
    },
    {
      key: 'week5',
      label: 'Week 5',
      slot: 'cell-week5'
    },
    {
      key: 'week6',
      label: 'Week 6',
      slot: 'cell-week6'
    }
  ]

  const weekLabels = weeks.map((week) => week.label)

  const cohorts = [
    {
      id: 'sep-28',
      cohort: 'Sep 28',
      size: 1084,
      week1: 58,
      week2: 41,
      week3: 34,
      week4: 30,
      week5: 27,
      week6: 25
    },
    {
      id: 'oct-5',
      cohort: 'Oct 5',
      size: 1136,
      week1: 61,
      week2: 45,
      week3: 38,
      week4: 33,
      week5: 30,
      week6: null
    },
    {
      id: 'oct-12',
      cohort: 'Oct 12',
      size: 1052,
      week1: 55,
      week2: 39,
      week3: 32,
      week4: 28,
      week5: null,
      week6: null
    },
    {
      id: 'oct-19',
      cohort: 'Oct 19',
      size: 1210,
      week1: 66,
      week2: 52,
      week3: 45,
      week4: null,
      week5: null,
      week6: null
    },
    {
      id: 'oct-26',
      cohort: 'Oct 26',
      size: 1098,
      week1: 70,
      week2: 57,
      week3: null,
      week4: null,
      week5: null,
      week6: null
    },
    {
      id: 'nov-2',
      cohort: 'Nov 2',
      size: 1168,
      week1: 72,
      week2: null,
      week3: null,
      week4: null,
      week5: null,
      week6: null
    }
  ]

  const retention = [
    {
      id: 'sep-28',
      name: 'Sep 28 cohort',
      values: [58, 41, 34, 30, 27, 25]
    },
    {
      id: 'oct-5',
      name: 'Oct 5 cohort',
      values: [61, 45, 38, 33, 30, null]
    },
    {
      id: 'oct-12',
      name: 'Oct 12 cohort',
      values: [55, 39, 32, 28, null, null]
    },
    {
      id: 'oct-19',
      name: 'Oct 19 cohort',
      values: [66, 52, 45, null, null, null]
    },
    {
      id: 'oct-26',
      name: 'Oct 26 cohort',
      values: [70, 57, null, null, null, null]
    },
    {
      id: 'nov-2',
      name: 'Nov 2 cohort',
      values: [72, null, null, null, null, null]
    }
  ]

  const cohortColumns = [
    {
      id: 'cohort',
      accessorKey: 'cohort',
      header: 'Cohort',
      align: 'start',
      principal: true
    },
    {
      id: 'size',
      accessorKey: 'size',
      header: 'Users',
      align: 'end'
    },
    {
      id: 'week1',
      accessorKey: 'week1',
      header: 'Week 1',
      align: 'end'
    },
    {
      id: 'week2',
      accessorKey: 'week2',
      header: 'Week 2',
      align: 'end'
    },
    {
      id: 'week3',
      accessorKey: 'week3',
      header: 'Week 3',
      align: 'end'
    },
    {
      id: 'week4',
      accessorKey: 'week4',
      header: 'Week 4',
      align: 'end'
    },
    {
      id: 'week5',
      accessorKey: 'week5',
      header: 'Week 5',
      align: 'end'
    },
    {
      id: 'week6',
      accessorKey: 'week6',
      header: 'Week 6',
      align: 'end'
    }
  ]

  const grouped = new Intl.NumberFormat('en-US')
  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const formatters = {
    number: (value) => grouped.format(value),
    compact: (value) => compact.format(value),
    percent: (value) => (value === null ? '—' : `${value.toFixed(0)}%`),
    share: (value) => `${value.toFixed(1)}%`,
    drop: (value) => `−${value.toFixed(1)}%`
  }

  const period = ref('6w')
  const segment = ref('all')

  const optionLabel = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''
  const periodLabel = optionLabel(periods)
  const segmentLabel = optionLabel(segments)
  const comparison = computed(
    () => periods.find((option) => option.value === period.value)?.comparison ?? ''
  )

  const matches = computed(() => segmentsWithData.includes(segment.value))
  const view = computed(() =>
    matches.value
      ? { figures, funnel, steps, retention, cohorts }
      : {
          figures: figures.map((figure) => ({ ...figure, value: null, delta: null, trend: [] })),
          funnel: [],
          steps: [],
          retention: [],
          cohorts: []
        }
  )

  const activeIndex = ref(null)

  const clearFilters = () => {
    period.value = '6w'
    segment.value = 'all'
  }
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-lg) p-(--spacing-lg)">
    <PageHeader
      title="Funnel and retention"
      description="How visitors move from a first visit to a paid plan, and how many of each weekly sign-up cohort keep coming back."
    />

    <div
      role="group"
      aria-label="Filters"
      class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)"
    >
      <div class="min-w-36 grow basis-(--container-3xs) sm:grow-0">
        <Select
          v-model="period"
          size="medium"
          class="w-full"
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
      </div>
      <div class="min-w-36 grow basis-(--container-3xs) sm:grow-0">
        <Select
          v-model="segment"
          size="medium"
          class="w-full"
          :display-value="segmentLabel"
        >
          <Select.Trigger aria-label="Segment" />
          <Select.Content>
            <Select.Option
              v-for="option in segments"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
    </div>

    <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <li
        v-for="figure in view.figures"
        :key="figure.id"
        class="flex min-w-0 flex-col"
      >
        <StatTile
          :label="figure.label"
          :value="figure.value"
          :format-value="formatters[figure.format]"
          :delta="figure.delta"
          :delta-label="comparison"
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
            <ChartCard.Title>Conversion funnel</ChartCard.Title>
            <Hint
              text="Unique users who reached each step in the period, in order, with the share lost between steps."
            />
          </span>
          <ChartCard.Controls>
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Conversion funnel"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="export"
                  label="Export CSV"
                />
              </DropdownMenu.Group>
            </DropdownMenu>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <div
            :data-empty="(!loading && !view.steps.length) || null"
            class="grid min-w-0 grid-cols-1 items-start gap-(--spacing-md) xl:grid-cols-2 data-empty:xl:grid-cols-1"
          >
            <Chart
              :series="view.funnel"
              :labels="stages"
              orientation="horizontal"
              :format-value="formatters.compact"
              :height="200"
              empty-title="No visitors match these filters"
              empty-description="Choose another segment or widen the period."
              :loading="loading"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Bar labeled />
              <Chart.Tooltip />
              <template #empty-actions>
                <Button
                  label="Clear filters"
                  kind="outlined"
                  size="small"
                  @click="clearFilters"
                />
              </template>
            </Chart>

            <TableRoot
              v-if="loading || view.steps.length"
              :data="view.steps"
              :columns="stepColumns"
              row-key="id"
              header-kind="compact"
              border
              :loading="loading"
            >
              <template #cell-users="{ row }">
                <span class="tabular-nums">{{ formatters.number(row.users) }}</span>
              </template>
              <template #cell-share="{ row }">
                <span class="tabular-nums">{{ formatters.share(row.share) }}</span>
              </template>
              <template #cell-dropoff="{ row }">
                <span
                  v-if="row.dropoff === null"
                  class="text-(--text-muted)"
                  >—</span
                >
                <span
                  v-else
                  class="tabular-nums"
                  >{{ formatters.drop(row.dropoff) }} from {{ row.from }}</span
                >
              </template>
            </TableRoot>
          </div>
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="6">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Retention by cohort</ChartCard.Title>
            <Hint
              text="Share of each weekly sign-up cohort still active in each week since sign-up."
            />
          </span>
          <ChartCard.Controls>
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Retention by cohort"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="export"
                  label="Export CSV"
                />
              </DropdownMenu.Group>
            </DropdownMenu>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <Chart
            v-model:active-index="activeIndex"
            :series="view.retention"
            :labels="weekLabels"
            :max="100"
            :format-value="formatters.percent"
            empty-title="No cohorts match these filters"
            empty-description="Choose another segment or widen the period."
            :loading="loading"
          >
            <Chart.Grid />
            <Chart.Axis kind="y" />
            <Chart.Axis kind="x" />
            <Chart.Line markers />
            <Chart.Crosshair />
            <Chart.Tooltip />
            <Chart.Legend />
            <template #empty-actions>
              <Button
                label="Clear filters"
                kind="outlined"
                size="small"
                @click="clearFilters"
              />
            </template>
          </Chart>
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="6">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Weekly cohorts</ChartCard.Title>
            <Hint
              text="Users who signed up each week, and the share of them active in each week since. A dash marks a week that has not ended yet."
            />
          </span>
          <ChartCard.Controls>
            <DropdownMenu placement="bottom-end">
              <DropdownMenu.Trigger>
                <IconButton
                  icon="pi pi-ellipsis-h"
                  kind="transparent"
                  size="small"
                  aria-label="More options for Weekly cohorts"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Option
                  value="export"
                  label="Export CSV"
                />
              </DropdownMenu.Group>
            </DropdownMenu>
          </ChartCard.Controls>
        </ChartCard.Header>
        <ChartCard.Content>
          <TableRoot
            :data="view.cohorts"
            :columns="cohortColumns"
            row-key="id"
            header-kind="compact"
            border
            :loading="loading"
          >
            <template #empty>
              <EmptyState
                size="small"
                icon="pi pi-filter-slash"
                title="No cohorts match these filters"
                description="Choose another segment or widen the period."
              >
                <template #actions>
                  <Button
                    label="Clear filters"
                    kind="outlined"
                    size="small"
                    @click="clearFilters"
                  />
                </template>
              </EmptyState>
            </template>
            <template #cell-size="{ row }">
              <span class="tabular-nums">{{ formatters.number(row.size) }}</span>
            </template>
            <template
              v-for="week in weeks"
              :key="week.key"
              #[week.slot]="{ row }"
            >
              <span
                :data-pending="row[week.key] === null || null"
                class="tabular-nums data-pending:text-(--text-muted)"
              >
                {{ formatters.percent(row[week.key]) }}
              </span>
            </template>
          </TableRoot>
        </ChartCard.Content>
      </ChartCard>
    </div>
  </div>
</template>
