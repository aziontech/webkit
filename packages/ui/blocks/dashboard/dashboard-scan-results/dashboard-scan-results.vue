<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import type { ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed } from 'vue'

  import HeldFlaggedCard from './parts/held-flagged-card.vue'
  import SubmissionsTable from './parts/submissions-table.vue'
  import { sampleSources, sampleSubmissions, sampleSummary, sampleVerdictSplit } from './sample'
  import { scanFigures } from './scan-results-config'
  /** The verdict an item received; pending while its analysis runs. */
  export type ScanResultsVerdict = 'clean' | 'suspicious' | 'flagged' | 'pending'
  /** Where an item came from. */
  export type ScanResultsSource = 'inline' | 'api' | 'upload' | 'scheduled'

  /** One row of the Submissions table. */
  export interface ScanResultsSubmission {
    /** Stable key. */
    id: string
    /** File name. */
    name: string
    /** The verdict it received. */
    verdict: ScanResultsVerdict
    /** What the analysis classified it as; a dash while pending. */
    category: string
    /** Risk score from 0 to 100; null while pending. */
    score: number | null
    /** File type in words. */
    type: string
    /** Size in bytes. */
    size: number
    /** Where it came from. */
    source: ScanResultsSource
    /** Who sent it first. */
    submitter: string
    /** When it was seen last, as an ISO-like date and time. */
    lastSeen: string
  }

  /** The figures of the summary tiles and the Held and flagged card. */
  export interface ScanResultsSummary {
    /** Items sent for analysis in the period. */
    submitted: number
    /** Items waiting for a verdict now. */
    analyzing: number
    /** Items submitted in the last 24 hours. */
    last24h: number
    /** Items flagged as harmful. */
    flagged: number
    /** Deliveries held for a verdict now. */
    held: number
    /** Deliveries held in the last 24 hours. */
    heldLast24h: number
    /** Early delivery alerts nobody has reviewed. */
    alertsOpen: number
    /** Every early delivery alert in the period. */
    alertsTotal: number
  }

  export interface ScanResultsDashboardProps {
    /** The summary figures. Left out, the sample renders. */
    summary?: ScanResultsSummary
    /** One donut slice per verdict. Left out, the sample renders. */
    verdictSplit?: ChartSeries[]
    /** One bar per source. Left out, the sample renders. */
    sources?: BarListItem[]
    /** The Submissions rows, filtered in the browser; pass an empty list when none exists. Left out, the sample renders. */
    submissions?: ScanResultsSubmission[]
    /** The period is loading. */
    loading?: boolean
    /** Why the period could not load, shown after what did not load in each danger alert. */
    error?: string
  }

  const props = withDefaults(defineProps<ScanResultsDashboardProps>(), {
    summary: undefined,
    verdictSplit: undefined,
    sources: undefined,
    submissions: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
  }>()

  const blocked = computed(() => props.loading || props.error !== '')
  const summary = computed<ScanResultsSummary | null>(
    () => props.summary ?? (blocked.value ? null : sampleSummary)
  )
  const verdictSplit = computed(
    () => props.verdictSplit ?? (blocked.value ? [] : sampleVerdictSplit)
  )
  const sourceItems = computed(() => props.sources ?? (blocked.value ? [] : sampleSources))
  const submissions = computed(() => props.submissions ?? (blocked.value ? [] : sampleSubmissions))

  const { formatNumber } = useLocale()

  const formatCount = (value: number) => formatNumber(value)

  const formatCompact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Scan results"
        description="Items sent for analysis inline and through the API, their verdicts, the deliveries held for a verdict and the items delivered before they were flagged."
      >
        <template #actions>
          <IconButton
            icon="az az-refresh"
            variant="outline"
            size="medium"
            aria-label="Refresh"
            @click="(event: MouseEvent) => emit('refresh', event)"
          />
        </template>
      </PageHeader>
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load the scan results. ${error}`"
        action-label="Retry"
        data-testid="dashboard-scan-results__error"
        @action="(event: MouseEvent) => emit('retry', event)"
      />

      <section aria-label="Summary">
        <ul
          class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <li
            v-for="figure in scanFigures"
            :key="figure.key"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              :label="figure.label"
              :value="error ? null : (summary?.[figure.key] ?? null)"
              :format-value="formatCompact"
              :loading="loading"
              :error="error"
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
        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Verdicts</ChartCard.Title>
              <Hint content="Every item analyzed in the period, by the verdict it received." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <p
              v-if="error"
              class="text-body-sm text-(--text-muted)"
            >
              Not available.
            </p>
            <DonutChart
              v-else
              :series="verdictSplit"
              :format-value="formatCompact"
              size="small"
              total-label="Items"
              empty-title="No verdict yet"
              empty-description="Verdicts appear once the first item finishes its analysis."
              :loading="loading"
              aria-label="Verdicts"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Sources</ChartCard.Title>
              <Hint
                content="Where the items came from: scanned inline, sent through the API, uploaded by hand or picked up by a scheduled scan."
              />
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
              :items="sourceItems"
              :format-value="formatCompact"
              empty-title="No items yet"
              :loading="loading"
              aria-label="Sources"
            />
          </ChartCard.Content>
        </ChartCard>

        <HeldFlaggedCard
          :summary="summary"
          :loading="loading"
          :error="error"
          :format-count="formatCount"
        />

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Submissions</ChartCard.Title>
              <Hint
                content="Every item sent for analysis, newest first, with its verdict and where it came from."
              />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <p
              v-if="error"
              class="text-body-sm text-(--text-muted)"
            >
              Not available.
            </p>
            <SubmissionsTable
              v-else-if="loading || submissions.length"
              :submissions="submissions"
              :loading="loading"
            />
            <EmptyState
              v-else
              size="small"
              icon="az az-file"
              title="No items yet"
              description="Items sent for analysis inline or through the API appear here."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
