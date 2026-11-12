<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Chart, { type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Progress from '@aziontech/webkit/progress'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  type MetricFormat = 'currency' | 'count' | 'percentage' | 'uptime' | 'score' | 'cost'

  interface Figure {
    id: string
    label: string
    description: string
    value: number | null
    format: MetricFormat
    delta: number | null
    inverse: boolean
  }

  interface StatusTag {
    label: string
    severity: TagSeverity
  }

  interface Goal {
    id: string
    label: string
    current: number
    target: number
    format: MetricFormat
    status: StatusTag
  }

  interface TrendChange extends StatusTag {
    icon: string
  }

  interface Trend {
    id: string
    title: string
    description: string
    mark: 'area' | 'line'
    format: MetricFormat
    min: number
    change: TrendChange | null
    series: ChartSeries[]
  }

  interface Note {
    id: string
    author: string
    initials: string
    role: string
    date: string
    dateLabel: string
    body: string
  }

  const loading = false
  const comparison = 'vs last quarter'
  const quarter = ref('Q3 2025')
  const activeIndex = ref<number | null>(null)

  const quarters = ['Q3 2026', 'Q2 2026', 'Q1 2026', 'Q4 2025', 'Q3 2025']

  const figures: Figure[] = [
    {
      id: 'revenue',
      label: 'Revenue',
      description: 'Recognized revenue for the quarter.',
      value: null,
      format: 'currency',
      delta: null,
      inverse: false
    },
    {
      id: 'active-users',
      label: 'Monthly active users',
      description: 'People who signed in at least once in the last month of the quarter.',
      value: null,
      format: 'count',
      delta: null,
      inverse: false
    },
    {
      id: 'retention',
      label: 'Net revenue retention',
      description: 'Revenue kept from existing customers, expansion included, over twelve months.',
      value: null,
      format: 'percentage',
      delta: null,
      inverse: false
    },
    {
      id: 'nps',
      label: 'NPS',
      description: 'Net promoter score from the quarterly customer survey.',
      value: null,
      format: 'score',
      delta: null,
      inverse: false
    },
    {
      id: 'uptime',
      label: 'Uptime',
      description: 'Share of minutes every public service answered, averaged over the quarter.',
      value: null,
      format: 'uptime',
      delta: null,
      inverse: false
    },
    {
      id: 'cost-per-request',
      label: 'Cost per request',
      description: 'Infrastructure spend divided by requests served. A rise is a regression.',
      value: null,
      format: 'cost',
      delta: null,
      inverse: true
    }
  ]

  const goals: Goal[] = []

  const months = [
    'Oct 2025',
    'Nov 2025',
    'Dec 2025',
    'Jan 2026',
    'Feb 2026',
    'Mar 2026',
    'Apr 2026',
    'May 2026',
    'Jun 2026',
    'Jul 2026',
    'Aug 2026',
    'Sep 2026'
  ]

  const trends: Trend[] = [
    {
      id: 'revenue',
      title: 'Revenue',
      description: 'Recognized revenue per month.',
      mark: 'area',
      format: 'currency',
      min: 0,
      change: null,
      series: []
    },
    {
      id: 'active-users',
      title: 'Monthly active users',
      description: 'People who signed in at least once in the month.',
      mark: 'area',
      format: 'count',
      min: 0,
      change: null,
      series: []
    },
    {
      id: 'retention',
      title: 'Net revenue retention',
      description: 'Trailing twelve months, measured at month end.',
      mark: 'line',
      format: 'percentage',
      min: 100,
      change: null,
      series: []
    },
    {
      id: 'nps',
      title: 'NPS',
      description: 'Net promoter score from the monthly pulse survey.',
      mark: 'line',
      format: 'score',
      min: 0,
      change: null,
      series: []
    },
    {
      id: 'uptime',
      title: 'Uptime',
      description: 'Share of minutes every public service answered.',
      mark: 'line',
      format: 'uptime',
      min: 99.8,
      change: null,
      series: []
    },
    {
      id: 'cost-per-request',
      title: 'Cost per request',
      description: 'Infrastructure spend divided by requests served.',
      mark: 'line',
      format: 'cost',
      min: 0,
      change: null,
      series: []
    }
  ]

  const notes: Note[] = []

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2
  })

  const formatters: Record<MetricFormat, (value: number) => string> = {
    currency: (value) => money.format(value),
    count: (value) => compact.format(value),
    percentage: (value) => `${value.toFixed(0)}%`,
    uptime: (value) => `${value.toFixed(2)}%`,
    score: (value) => value.toFixed(0),
    cost: (value) => `${value.toFixed(4)}`
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Executive summary"
        description="Headline results for the quarter, progress on its goals, twelve-month trends and notes from the leads."
      >
        <template #actions>
          <div class="w-36">
            <Select
              v-model="quarter"
              size="medium"
            >
              <Select.Trigger aria-label="Quarter" />
              <Select.Content>
                <Select.Option
                  v-for="option in quarters"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </Select.Option>
              </Select.Content>
            </Select>
          </div>
          <Button
            label="Export"
            kind="outlined"
            size="medium"
            icon="pi pi-download"
          />
        </template>
      </PageHeader>

      <section aria-label="Scorecard">
        <ul
          class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
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

      <div class="grid grid-cols-1 items-start gap-(--spacing-md) xl:grid-cols-12">
        <section
          aria-label="Trends"
          class="grid min-w-0 grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] md:grid-cols-2 md:[--chart-grid-columns:2] xl:col-span-8"
        >
          <ChartCard
            v-for="trend in trends"
            :key="trend.id"
            :span="1"
          >
            <ChartCard.Header>
              <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
                <ChartCard.Title>{{ trend.title }}</ChartCard.Title>
                <Hint :text="trend.description" />
              </span>
              <ChartCard.Controls>
                <Tag
                  v-if="trend.change && !loading"
                  :label="trend.change.label"
                  :severity="trend.change.severity"
                  :icon="trend.change.icon"
                  size="small"
                />
              </ChartCard.Controls>
            </ChartCard.Header>
            <ChartCard.Content>
              <Chart
                v-model:active-index="activeIndex"
                :series="trend.series"
                :labels="months"
                :min="trend.min"
                :format-value="formatters[trend.format]"
                :height="160"
                :empty-title="'No results for ' + quarter"
                empty-description="Nothing was reported in this period. Select a later quarter."
                :loading="loading"
              >
                <Chart.Grid />
                <Chart.Axis kind="y" />
                <Chart.Axis
                  kind="x"
                  :ticks="4"
                />
                <Chart.Area v-if="trend.mark === 'area'" />
                <Chart.Line v-else />
                <Chart.Crosshair />
                <Chart.Tooltip />
              </Chart>
            </ChartCard.Content>
          </ChartCard>
        </section>

        <div class="flex min-w-0 flex-col gap-(--spacing-md) xl:col-span-4">
          <Card :title="quarter + ' goals'">
            <template #content>
              <ul
                v-if="loading"
                aria-busy="true"
                class="flex flex-col gap-(--spacing-md)"
              >
                <li
                  v-for="index in 5"
                  :key="index"
                  class="flex flex-col gap-(--spacing-xs)"
                >
                  <Skeleton
                    width="60%"
                    height="1rem"
                  />
                  <Skeleton height="0.5rem" />
                  <Skeleton
                    width="40%"
                    height="0.75rem"
                  />
                </li>
              </ul>
              <ul
                v-else-if="goals.length"
                class="flex flex-col gap-(--spacing-md)"
              >
                <li
                  v-for="goal in goals"
                  :key="goal.id"
                  class="flex flex-col gap-(--spacing-xs)"
                >
                  <div class="flex min-w-0 items-center justify-between gap-(--spacing-sm)">
                    <span class="truncate text-label-md text-(--text-default)">{{
                      goal.label
                    }}</span>
                    <Tag
                      :label="goal.status.label"
                      :severity="goal.status.severity"
                      size="small"
                    />
                  </div>
                  <Progress
                    :value="goal.current"
                    :max="goal.target"
                    size="small"
                    :aria-label="goal.label"
                    :aria-valuetext="
                      formatters[goal.format](goal.current) +
                      ' of ' +
                      formatters[goal.format](goal.target)
                    "
                  />
                  <div
                    class="flex items-center justify-between gap-(--spacing-sm) text-body-sm text-(--text-muted)"
                  >
                    <span class="tabular-nums">
                      {{ formatters[goal.format](goal.current) }} of
                      {{ formatters[goal.format](goal.target) }}
                    </span>
                    <span class="tabular-nums"
                      >{{ Math.round((goal.current / goal.target) * 100) }}%</span
                    >
                  </div>
                </li>
              </ul>
              <EmptyState
                v-else
                size="small"
                icon="pi pi-flag"
                :title="'No goal results for ' + quarter"
                description="Progress appears once the quarter reports its first month."
              />
            </template>
          </Card>

          <Card
            title="Commentary"
            :padded="false"
          >
            <template #content>
              <Item.List
                key="item.list-1"
                v-if="loading"
                aria-busy="true"
              >
                <Item
                  v-for="index in 3"
                  :key="index"
                  size="small"
                  role="listitem"
                >
                  <Item.Media>
                    <Skeleton
                      kind="circle"
                      width="2rem"
                      height="2rem"
                    />
                  </Item.Media>
                  <Item.Content>
                    <div class="flex flex-col gap-(--spacing-xs)">
                      <Skeleton
                        width="45%"
                        height="1rem"
                      />
                      <Skeleton height="2.5rem" />
                    </div>
                  </Item.Content>
                </Item>
              </Item.List>
              <Item.List
                key="item.list-2"
                v-else-if="notes.length"
              >
                <Item
                  v-for="note in notes"
                  :key="note.id"
                  size="small"
                  role="listitem"
                >
                  <Item.Media>
                    <Avatar
                      :label="note.initials"
                      size="medium"
                    />
                  </Item.Media>
                  <Item.Content>
                    <Item.Title>{{ note.author }}</Item.Title>
                    <Item.Description>
                      {{ note.role }} · <time :datetime="note.date">{{ note.dateLabel }}</time>
                    </Item.Description>
                    <p class="mt-(--spacing-xs) text-pretty text-body-sm text-(--text-default)">
                      {{ note.body }}
                    </p>
                  </Item.Content>
                </Item>
              </Item.List>
              <EmptyState
                v-else
                size="small"
                icon="pi pi-comment"
                :title="'No notes for ' + quarter"
                description="Leads add notes here when they review the quarter."
              />
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
