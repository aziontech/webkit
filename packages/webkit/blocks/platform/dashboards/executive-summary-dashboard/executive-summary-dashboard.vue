<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import Progress from '@aziontech/webkit/progress'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const loading = false
  const comparison = 'vs last quarter'
  const quarter = ref('Q3 2026')
  const activeIndex = ref(null)

  const quarters = ['Q3 2026', 'Q2 2026', 'Q1 2026', 'Q4 2025', 'Q3 2025']

  const figures = [
    {
      id: 'revenue',
      label: 'Revenue',
      description: 'Recognized revenue for the quarter.',
      value: 4820000,
      format: 'currency',
      delta: 5.7,
      inverse: false
    },
    {
      id: 'active-users',
      label: 'Monthly active users',
      description: 'People who signed in at least once in the last month of the quarter.',
      value: 128400,
      format: 'count',
      delta: 5.1,
      inverse: false
    },
    {
      id: 'retention',
      label: 'Net revenue retention',
      description: 'Revenue kept from existing customers, expansion included, over twelve months.',
      value: 112,
      format: 'percentage',
      delta: 1.8,
      inverse: false
    },
    {
      id: 'nps',
      label: 'NPS',
      description: 'Net promoter score from the quarterly customer survey.',
      value: 47,
      format: 'score',
      delta: 6.8,
      inverse: false
    },
    {
      id: 'uptime',
      label: 'Uptime',
      description: 'Share of minutes every public service answered, averaged over the quarter.',
      value: 99.97,
      format: 'uptime',
      delta: 0.02,
      inverse: false
    },
    {
      id: 'cost-per-request',
      label: 'Cost per request',
      description: 'Infrastructure spend divided by requests served. A rise is a regression.',
      value: 0.00217,
      format: 'cost',
      delta: -7.1,
      inverse: true
    }
  ]

  const goals = [
    {
      id: 'revenue',
      label: 'Quarterly revenue',
      current: 4820000,
      target: 5000000,
      format: 'currency',
      status: {
        label: 'On track',
        severity: 'success'
      }
    },
    {
      id: 'active-users',
      label: 'Monthly active users',
      current: 128400,
      target: 140000,
      format: 'count',
      status: {
        label: 'At risk',
        severity: 'warning'
      }
    },
    {
      id: 'retention',
      label: 'Net revenue retention',
      current: 112,
      target: 110,
      format: 'percentage',
      status: {
        label: 'On track',
        severity: 'success'
      }
    },
    {
      id: 'nps',
      label: 'NPS',
      current: 47,
      target: 50,
      format: 'score',
      status: {
        label: 'On track',
        severity: 'success'
      }
    },
    {
      id: 'enterprise-deals',
      label: 'Enterprise deals closed',
      current: 18,
      target: 30,
      format: 'score',
      status: {
        label: 'Off track',
        severity: 'danger'
      }
    }
  ]

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

  const trends = [
    {
      id: 'revenue',
      title: 'Revenue',
      description: 'Recognized revenue per month.',
      mark: 'area',
      format: 'currency',
      min: 0,
      change: {
        label: '+25.2%',
        severity: 'success',
        icon: 'pi pi-arrow-up-right'
      },
      series: [
        {
          id: 'revenue',
          name: 'Revenue',
          values: [
            1310000, 1340000, 1420000, 1380000, 1410000, 1470000, 1490000, 1520000, 1550000,
            1570000, 1610000, 1640000
          ]
        }
      ]
    },
    {
      id: 'active-users',
      title: 'Monthly active users',
      description: 'People who signed in at least once in the month.',
      mark: 'area',
      format: 'count',
      min: 0,
      change: {
        label: '+30.8%',
        severity: 'success',
        icon: 'pi pi-arrow-up-right'
      },
      series: [
        {
          id: 'active-users',
          name: 'Monthly active users',
          values: [
            98200, 101400, 104000, 103100, 107900, 111500, 114600, 117300, 122200, 124000, 126100,
            128400
          ]
        }
      ]
    },
    {
      id: 'retention',
      title: 'Net revenue retention',
      description: 'Trailing twelve months, measured at month end.',
      mark: 'line',
      format: 'percentage',
      min: 100,
      change: {
        label: '+5.7%',
        severity: 'success',
        icon: 'pi pi-arrow-up-right'
      },
      series: [
        {
          id: 'retention',
          name: 'Net revenue retention',
          values: [106, 106, 107, 107, 108, 109, 109, 110, 110, 111, 111, 112]
        }
      ]
    },
    {
      id: 'nps',
      title: 'NPS',
      description: 'Net promoter score from the monthly pulse survey.',
      mark: 'line',
      format: 'score',
      min: 0,
      change: {
        label: '+23.7%',
        severity: 'success',
        icon: 'pi pi-arrow-up-right'
      },
      series: [
        {
          id: 'nps',
          name: 'NPS',
          values: [38, 39, 41, 40, 42, 43, 42, 44, 44, 45, 46, 47]
        }
      ]
    },
    {
      id: 'uptime',
      title: 'Uptime',
      description: 'Share of minutes every public service answered.',
      mark: 'line',
      format: 'uptime',
      min: 99.8,
      change: {
        label: '+0.05%',
        severity: 'success',
        icon: 'pi pi-arrow-up-right'
      },
      series: [
        {
          id: 'uptime',
          name: 'Uptime',
          values: [
            99.94, 99.96, 99.91, 99.97, 99.98, 99.95, 99.99, 99.95, 99.91, 99.98, 99.94, 99.99
          ]
        }
      ]
    },
    {
      id: 'cost-per-request',
      title: 'Cost per request',
      description: 'Infrastructure spend divided by requests served.',
      mark: 'line',
      format: 'cost',
      min: 0,
      change: {
        label: '−25.0%',
        severity: 'success',
        icon: 'pi pi-arrow-down-right'
      },
      series: [
        {
          id: 'cost-per-request',
          name: 'Cost per request',
          values: [
            0.0028, 0.0028, 0.0027, 0.0027, 0.0026, 0.0025, 0.0024, 0.0023, 0.0023, 0.0022, 0.0022,
            0.0021
          ]
        }
      ]
    }
  ]

  const notes = [
    {
      id: 'note-04',
      author: 'Maria Santos',
      initials: 'MS',
      role: 'Head of Finance',
      date: '2026-09-30',
      dateLabel: 'Sep 30, 2026',
      body: 'Revenue closed at 96% of the goal. Two enterprise renewals slipped into October; both are signed and land in Q4.'
    },
    {
      id: 'note-03',
      author: 'David Kim',
      initials: 'DK',
      role: 'VP of Product',
      date: '2026-09-26',
      dateLabel: 'Sep 26, 2026',
      body: 'Monthly active users grew 5.1% after the new onboarding shipped in August. First-week activation rose from 41% to 48%.'
    },
    {
      id: 'note-02',
      author: 'Priya Nair',
      initials: 'PN',
      role: 'Head of Customer Success',
      date: '2026-09-19',
      dateLabel: 'Sep 19, 2026',
      body: 'NPS reached 47, the highest in a year. Detractors still cite slow replies on weekends, so a weekend support rotation starts in October.'
    },
    {
      id: 'note-01',
      author: 'Lucas Moreau',
      initials: 'LM',
      role: 'VP of Engineering',
      date: '2026-09-12',
      dateLabel: 'Sep 12, 2026',
      body: 'Cost per request fell 7.1% after batch jobs moved to off-peak capacity. Uptime held at 99.97%, with one 14-minute incident on Aug 21.'
    }
  ]

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2
  })

  const formatters = {
    currency: (value) => money.format(value),
    count: (value) => compact.format(value),
    percentage: (value) => `${value.toFixed(0)}%`,
    uptime: (value) => `${value.toFixed(2)}%`,
    score: (value) => value.toFixed(0),
    cost: (value) => `$${value.toFixed(4)}`
  }
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex flex-col gap-(--layout-group-gap)">
      <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
        <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
          <h1 class="text-balance text-heading-sm text-(--text-default)">Executive summary</h1>
          <p class="text-pretty text-body-sm text-(--text-muted)">
            Headline results for the quarter, progress on its goals, twelve-month trends and notes
            from the leads.
          </p>
        </div>
        <div class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto">
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
        </div>
      </header>

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
                empty-description="Nothing was reported in this period. Choose a later quarter."
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
              <Item.List v-else-if="notes.length">
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
    </main>
  </div>
</template>
