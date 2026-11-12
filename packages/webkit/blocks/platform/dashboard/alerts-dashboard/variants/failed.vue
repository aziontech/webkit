<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { ref } from 'vue'

  const loading = false
  const comparison = 'vs previous period'
  const period = ref('30d')
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

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const formatters: Record<string, (value: number) => string> = {
    count: (value: number) => compact.format(value),
    percentage: (value: number) => `${value.toFixed(0)}%`
  }

  const emit = defineEmits<{ retry: [] }>()
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
                (value: string) => periods.find((option) => option.value === value)?.label ?? value
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
            <Alert
              severity="danger"
              label="Couldn't load alerts per day. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <div class="lg:col-span-4">
          <Card title="Open by severity">
            <template #content>
              <Alert
                severity="danger"
                label="Couldn't load open alerts by severity. Check your connection and retry."
                action-label="Retry"
                @action="emit('retry')"
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
            <Alert
              severity="danger"
              label="Couldn't load alerts by type. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
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
            <Alert
              severity="danger"
              label="Couldn't load highest risk. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
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
            <Alert
              severity="danger"
              label="Couldn't load open alerts. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
