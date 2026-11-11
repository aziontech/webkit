<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const loading = false
  const comparison = 'vs last quarter'
  const quarter = ref('Q3 2025')
  const quarters = ['Q3 2026', 'Q2 2026', 'Q1 2026', 'Q4 2025', 'Q3 2025']

  const figures = [
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

  const trends = [
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
    cost: (value) => `${value.toFixed(4)}`
  }

  const emit = defineEmits(['retry'])
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex flex-col gap-(--layout-group-gap)">
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
              <Alert
                severity="danger"
                :label="`Couldn't load ${trend.title.toLowerCase()}. Check your connection and retry.`"
                action-label="Retry"
                @action="emit('retry')"
              />
            </ChartCard.Content>
          </ChartCard>
        </section>

        <div class="flex min-w-0 flex-col gap-(--spacing-md) xl:col-span-4">
          <Card :title="quarter + ' goals'">
            <template #content>
              <Alert
                severity="danger"
                :label="`Couldn't load ${quarter} goals. Check your connection and retry.`"
                action-label="Retry"
                @action="emit('retry')"
              />
            </template>
          </Card>

          <Card title="Commentary">
            <template #content>
              <Alert
                severity="danger"
                label="Couldn't load commentary. Check your connection and retry."
                action-label="Retry"
                @action="emit('retry')"
              />
            </template>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>
