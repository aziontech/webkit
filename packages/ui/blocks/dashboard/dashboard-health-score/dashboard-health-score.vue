<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import BarList, { type BarListItem } from '@aziontech/ui/bar-list'
  import Chart, { type ChartSeries } from '@aziontech/ui/chart'
  import ChartCard from '@aziontech/ui/chart-card'
  import Hint from '@aziontech/ui/hint'
  import PageHeader from '@aziontech/ui/page-header'
  import Select from '@aziontech/ui/select'
  import Skeleton from '@aziontech/ui/skeleton'
  import Tag, { type TagSeverity } from '@aziontech/ui/tag'
  import type { TrackerItem } from '@aziontech/ui/tracker'
  import { useLocale } from '@aziontech/ui/use-locale'
  import { computed, ref } from 'vue'

  import HourlyScoreCard from './parts/hourly-score-card.vue'
  import OpenIncidentsCard from './parts/open-incidents-card.vue'
  import {
    sampleApplications,
    sampleHourly,
    sampleIncidents,
    sampleLocations,
    sampleOverall
  } from './sample'

  /** The period every region reads. */
  export type HealthScorePeriod = 'Last hour' | 'Last 24 hours' | 'Last 7 days'

  /** A score band in words with its color. */
  export interface HealthScoreBand {
    /** Good, Fair or Poor. */
    label: string
    /** The band color. */
    severity: TagSeverity
  }

  /** The overall score of the period. */
  export interface HealthScoreOverall {
    /** Average score out of 100; null when the period has no samples. */
    score: number | null
    /** The band of the score; null when the period has no samples. */
    band: HealthScoreBand | null
    /** The cause of most poor samples, lowercase; empty hides the line. */
    cause: string
    /** One label per point of the chart. */
    labels: string[]
    /** The score line over the period. */
    series: ChartSeries[]
  }

  /** One application row of the Hourly score tracker. */
  export interface HealthScoreHourlyRow {
    /** Stable key. */
    id: string
    /** Application name. */
    name: string
    /** The band of the application over the period. */
    band: HealthScoreBand
    /** One block per hour, colored by its band. */
    blocks: TrackerItem[]
  }

  /** One open incident. */
  export interface HealthScoreIncident {
    /** Stable key, used in the incident link. */
    id: string
    /** The application or location affected. */
    name: string
    /** Application or Location. */
    scope: string
    /** Icon class of the scope. */
    icon: string
    /** Devices affected. */
    devices: number
    /** Share of the samples affected, in percent. */
    share: number
    /** What causes the poor samples. */
    cause: string
    /** When it opened, as an ISO date. */
    opened: string
    /** When it opened, as shown. */
    openedLabel: string
    /** The band of the affected samples. */
    band: HealthScoreBand
  }

  export interface HealthScoreDashboardProps {
    /** The overall score and its line. Left out, the sample renders. */
    overall?: HealthScoreOverall
    /** Score per application, with its top cause in the name. Left out, the sample renders. */
    applications?: BarListItem[]
    /** Score per location, with its top cause in the name. Left out, the sample renders. */
    locations?: BarListItem[]
    /** One tracker row per application. Left out, the sample renders. */
    hourly?: HealthScoreHourlyRow[]
    /** The incidents still open; pass an empty list when none is. Left out, the sample renders. */
    incidents?: HealthScoreIncident[]
    /** The period is loading. */
    loading?: boolean
    /** Why the period could not load, shown after what did not load in each danger alert. */
    error?: string
  }

  const props = withDefaults(defineProps<HealthScoreDashboardProps>(), {
    overall: undefined,
    applications: undefined,
    locations: undefined,
    hourly: undefined,
    incidents: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
  }>()

  const period = defineModel<HealthScorePeriod>('period', { default: 'Last 24 hours' })

  const blocked = computed(() => props.loading || props.error !== '')
  const noScore: HealthScoreOverall = { score: null, band: null, cause: '', labels: [], series: [] }
  const overall = computed(() => props.overall ?? (blocked.value ? noScore : sampleOverall))
  const applications = computed(
    () => props.applications ?? (blocked.value ? [] : sampleApplications)
  )
  const locations = computed(() => props.locations ?? (blocked.value ? [] : sampleLocations))
  const hourly = computed(() => props.hourly ?? (blocked.value ? [] : sampleHourly))
  const incidents = computed(() => props.incidents ?? (blocked.value ? [] : sampleIncidents))

  const activeIndex = ref<number | null>(null)

  const periods: { label: HealthScorePeriod; phrase: string }[] = [
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

  const phrase = computed(
    () => periods.find((option) => option.label === period.value)?.phrase ?? ''
  )

  const { formatNumber } = useLocale()
  const fixed = (value: number, digits: number) =>
    formatNumber(value, { minimumFractionDigits: digits, maximumFractionDigits: digits })
  const formatScore = (value: number) => fixed(value, 0)
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Experience score"
        description="How people experience each application: the overall score, the score per application and location, each hour of the period and the incidents still open."
      >
        <template #actions>
          <div class="shrink-0">
            <Select
              variant="ghost"
              v-model="period"
              size="medium"
            >
              <Select.Trigger aria-label="Period" />
              <Select.Content>
                <Select.Item
                  v-for="option in periods"
                  :key="option.label"
                  :value="option.label"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
          </div>
        </template>
      </PageHeader>
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load the experience score. ${error}`"
        action-label="Retry"
        data-testid="dashboard-health-score__error"
        @action="(event: MouseEvent) => emit('retry', event)"
      />

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Overall score</ChartCard.Title>
              <Hint
                content="Average of every sample in the period, out of 100. Good is 80 or more, fair 50 to 79, poor under 50."
              />
            </span>
            <ChartCard.Action>
              <Tag
                v-if="overall.band && !loading"
                :label="overall.band.label"
                :severity="overall.band.severity"
                size="small"
              />
            </ChartCard.Action>
          </ChartCard.Header>
          <ChartCard.Content>
            <p
              v-if="error"
              class="text-body-sm text-(--text-muted)"
            >
              Not available.
            </p>
            <div
              v-else
              class="grid grid-cols-1 items-center gap-(--spacing-lg) md:grid-cols-[minmax(0,12rem)_1fr]"
            >
              <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                <Skeleton
                  v-if="loading"
                  width="60%"
                  height="2rem"
                />
                <p
                  v-else
                  class="flex items-baseline gap-(--spacing-2xs) tabular-nums"
                  dir="ltr"
                  data-testid="dashboard-health-score__score"
                >
                  <template v-if="overall.score === null">
                    <span
                      aria-hidden="true"
                      class="text-heading-lg text-(--text-muted)"
                      >–</span
                    >
                    <span class="sr-only">No score</span>
                  </template>
                  <template v-else>
                    <span class="text-heading-lg text-(--text-default)">{{
                      formatScore(overall.score)
                    }}</span>
                    <span class="text-body-md text-(--text-muted)">/ 100</span>
                  </template>
                </p>
                <p
                  v-if="overall.cause && !loading"
                  class="text-pretty text-body-sm text-(--text-muted)"
                >
                  Top cause: {{ overall.cause }}
                </p>
              </div>
              <Chart
                v-model:active-index="activeIndex"
                :series="overall.series"
                :labels="overall.labels"
                :min="0"
                :max="100"
                :format-value="formatScore"
                :height="200"
                :empty-title="'No samples in ' + phrase"
                empty-description="Scores appear once devices report their first samples. Select a longer period."
                :loading="loading"
              >
                <Chart.Grid />
                <Chart.Axis type="y" />
                <Chart.Axis
                  type="x"
                  :ticks="6"
                />
                <Chart.Line curve="monotone" />
                <Chart.Crosshair />
                <Chart.Tooltip />
              </Chart>
            </div>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Score per application</ChartCard.Title>
              <Hint content="Lowest first, with the cause of most poor samples." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <p
              v-if="error"
              class="text-body-sm text-(--text-muted)"
            >
              Not available.
            </p>
            <BarList
              v-else
              :items="applications"
              sort="ascending"
              :format-value="formatScore"
              :empty-title="'No application samples in ' + phrase"
              :loading="loading"
              aria-label="Score per application"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Score per location</ChartCard.Title>
              <Hint content="Lowest first, with the cause of most poor samples." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <p
              v-if="error"
              class="text-body-sm text-(--text-muted)"
            >
              Not available.
            </p>
            <BarList
              v-else
              :items="locations"
              sort="ascending"
              :color="2"
              :format-value="formatScore"
              :empty-title="'No location samples in ' + phrase"
              :loading="loading"
              aria-label="Score per location"
            />
          </ChartCard.Content>
        </ChartCard>

        <HourlyScoreCard
          :hourly="hourly"
          :loading="loading"
          :error="error"
          :phrase="phrase"
        />
      </div>

      <OpenIncidentsCard
        :incidents="incidents"
        :loading="loading"
        :error="error"
        :phrase="phrase"
      />
    </div>
  </div>
</template>
