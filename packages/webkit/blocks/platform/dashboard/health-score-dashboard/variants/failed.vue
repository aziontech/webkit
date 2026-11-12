<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const loading = false
  const period = ref('Last hour')
  const periods = [
    {
      label: 'Last hour',
      phrase: 'the last hour'
    },
    {
      label: 'Last 24 hours',
      phrase: 'the last 24 hours'
    },
    {
      label: 'Last 7 days',
      phrase: 'the last 7 days'
    }
  ]

  const overall = {
    score: null,
    band: null,
    cause: '',
    series: []
  }

  const emit = defineEmits(['retry'])
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Experience score"
        description="How people experience each application: the overall score, the score per application and location, each hour of the period and the incidents still open."
      >
        <template #actions>
          <div class="w-44 shrink-0">
            <Select
              v-model="period"
              size="medium"
            >
              <Select.Trigger aria-label="Period" />
              <Select.Content>
                <Select.Option
                  v-for="option in periods"
                  :key="option.label"
                  :value="option.label"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </div>
        </template>
      </PageHeader>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Overall score</ChartCard.Title>
              <Hint
                text="Average of every sample in the period, out of 100. Good is 80 or more, fair 50 to 79, poor under 50."
              />
            </span>
            <ChartCard.Controls>
              <Tag
                v-if="overall.band && !loading"
                :label="overall.band.label"
                :severity="overall.band.severity"
                size="small"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load overall score. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Score per application</ChartCard.Title>
              <Hint text="Lowest first, with the cause of most poor samples." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load score per application. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Score per location</ChartCard.Title>
              <Hint text="Lowest first, with the cause of most poor samples." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load score per location. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Hourly score</ChartCard.Title>
              <Hint text="One block per hour for each application, colored by its band." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load hourly score. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>
      </div>

      <Card title="Open incidents">
        <template #content>
          <Alert
            severity="danger"
            label="Couldn't load open incidents. Check your connection and retry."
            action-label="Retry"
            @action="emit('retry')"
          />
        </template>
      </Card>
    </main>
  </div>
</template>
