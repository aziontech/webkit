<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Card from '@aziontech/webkit/card'
  import type { ChartColor, ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Table from '@aziontech/webkit/table'
  import type { TagSeverity } from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  import { sampleSources, sampleSubmissions, sampleSummary, sampleVerdictSplit } from './sample'

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

  const search = ref('')
  const status = ref('all')
  const verdict = ref('all')
  const source = ref('all')

  const figures: {
    key: keyof ScanResultsSummary
    label: string
    description: string
  }[] = [
    {
      key: 'submitted',
      label: 'Submitted',
      description: 'Items sent for analysis in the selected period.'
    },
    {
      key: 'analyzing',
      label: 'In analysis',
      description: 'Items waiting for a verdict right now.'
    },
    {
      key: 'last24h',
      label: 'Last 24 hours',
      description: 'Items submitted in the last 24 hours.'
    },
    {
      key: 'flagged',
      label: 'Flagged',
      description: 'Items whose verdict marks them as harmful.'
    },
    {
      key: 'held',
      label: 'Held for a verdict',
      description: 'Deliveries paused until their analysis finishes.'
    },
    {
      key: 'alertsOpen',
      label: 'Open alerts',
      description: 'Items delivered before they were flagged that nobody has reviewed yet.'
    }
  ]

  const verdicts: Record<
    ScanResultsVerdict,
    { label: string; severity: TagSeverity; color: ChartColor }
  > = {
    clean: {
      label: 'Clean',
      severity: 'success',
      color: 'success'
    },
    suspicious: {
      label: 'Suspicious',
      severity: 'warning',
      color: 'warning'
    },
    flagged: {
      label: 'Flagged',
      severity: 'danger',
      color: 'danger'
    },
    pending: {
      label: 'Pending',
      severity: 'neutral',
      color: 'other'
    }
  }

  const sourceLabels: Record<ScanResultsSource, string> = {
    inline: 'Inline scan',
    api: 'API submission',
    upload: 'Manual upload',
    scheduled: 'Scheduled scan'
  }

  const statusOptions = [
    {
      value: 'all',
      label: 'Any status'
    },
    {
      value: 'analyzing',
      label: 'In analysis'
    },
    {
      value: 'completed',
      label: 'Completed'
    }
  ]

  const verdictOptions = [
    {
      value: 'all',
      label: 'Any verdict'
    },
    {
      value: 'clean',
      label: 'Clean'
    },
    {
      value: 'suspicious',
      label: 'Suspicious'
    },
    {
      value: 'flagged',
      label: 'Flagged'
    }
  ]

  const sourceOptions = [
    {
      value: 'all',
      label: 'Any source'
    },
    {
      value: 'inline',
      label: 'Inline scan'
    },
    {
      value: 'api',
      label: 'API submission'
    },
    {
      value: 'upload',
      label: 'Manual upload'
    },
    {
      value: 'scheduled',
      label: 'Scheduled scan'
    }
  ]

  const submissionColumns: TableColumn[] = [
    {
      accessorKey: 'name',
      id: 'name',
      header: 'Name',
      align: 'start',
      sortable: true,
      principal: true,
      grow: 2
    },
    {
      accessorKey: 'verdict',
      id: 'verdict',
      header: 'Verdict',
      align: 'start',
      sortable: true,
      minWidth: 112
    },
    {
      accessorKey: 'category',
      id: 'category',
      header: 'Category',
      align: 'start',
      sortable: true,
      minWidth: 112
    },
    {
      accessorKey: 'score',
      id: 'score',
      header: 'Score',
      align: 'end',
      sortable: true,
      minWidth: 80
    },
    {
      accessorKey: 'type',
      id: 'type',
      header: 'Type',
      align: 'start',
      sortable: true,
      minWidth: 128
    },
    {
      accessorKey: 'size',
      id: 'size',
      header: 'Size',
      align: 'end',
      sortable: true,
      minWidth: 88
    },
    {
      accessorKey: 'source',
      id: 'source',
      header: 'Source',
      align: 'start',
      sortable: true,
      minWidth: 128
    },
    {
      accessorKey: 'submitter',
      id: 'submitter',
      header: 'First submitter',
      align: 'start',
      sortable: true,
      minWidth: 128
    },
    {
      accessorKey: 'lastSeen',
      id: 'lastSeen',
      header: 'Last seen',
      align: 'start',
      sortable: true,
      minWidth: 136
    }
  ]

  const rows = computed(() =>
    submissions.value.filter(
      (row) =>
        (status.value === 'all' ||
          (status.value === 'analyzing') === (row.verdict === 'pending')) &&
        (verdict.value === 'all' || row.verdict === verdict.value) &&
        (source.value === 'all' || row.source === source.value)
    )
  )

  const { formatNumber } = useLocale()

  const count = (value: number) => formatNumber(value)

  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

  const UNITS = ['B', 'KB', 'MB', 'GB']

  const formatters = {
    count: (value: number) => count(value),
    compact: (value: number) => compact(value),
    score: (value: number | null) => (value === null ? '—' : String(value)),
    size: (value: number) => {
      let size = value
      let unit = 0
      while (size >= 1000 && unit < UNITS.length - 1) {
        size /= 1000
        unit += 1
      }
      return `${size.toFixed(unit ? 1 : 0)} ${UNITS[unit]}`
    }
  }
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
            icon="ai ai-refresh"
            variant="outline"
            size="medium"
            aria-label="Refresh"
            @click="(event: MouseEvent) => emit('refresh', event)"
          />
        </template>
      </PageHeader>

      <section aria-label="Summary">
        <ul
          class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <li
            v-for="figure in figures"
            :key="figure.key"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              :label="figure.label"
              :value="error ? null : (summary?.[figure.key] ?? null)"
              :format-value="formatters.compact"
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
        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Verdicts</ChartCard.Title>
              <Hint content="Every item analyzed in the period, by the verdict it received." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load verdicts. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <DonutChart
              v-else
              :series="verdictSplit"
              :format-value="formatters.compact"
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
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load sources. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <BarList
              v-else
              :items="sourceItems"
              :format-value="formatters.compact"
              empty-title="No items yet"
              :loading="loading"
              aria-label="Sources"
            />
          </ChartCard.Content>
        </ChartCard>

        <div class="lg:col-span-4">
          <Card title="Held and flagged">
            <template #default>
              <Alert
                v-if="error"
                severity="danger"
                :label="`Couldn't load held and flagged submissions. ${error}`"
                action-label="Retry"
                @action="(event) => emit('retry', event)"
              />
              <div
                v-else-if="loading || !summary"
                aria-busy="true"
                class="flex flex-col gap-(--spacing-sm)"
              >
                <Skeleton
                  width="90%"
                  height="1rem"
                />
                <Skeleton
                  width="30%"
                  height="1rem"
                />
                <Skeleton
                  width="80%"
                  height="1rem"
                />
                <Skeleton
                  width="40%"
                  height="1rem"
                />
              </div>
              <div
                v-else
                class="flex flex-col gap-(--spacing-md)"
              >
                <div class="flex flex-col items-start gap-(--spacing-2xs)">
                  <p class="text-pretty text-body-sm text-(--text-default)">
                    {{ formatters.count(summary.held) }} deliveries held for a verdict now,
                    {{ formatters.count(summary.heldLast24h) }} in the last 24 hours.
                  </p>
                  <Link
                    label="Held deliveries"
                    href="#held"
                    size="small"
                  />
                </div>
                <div class="flex flex-col items-start gap-(--spacing-2xs)">
                  <p class="text-pretty text-body-sm text-(--text-default)">
                    {{ formatters.count(summary.alertsOpen) }} open alerts of
                    {{ formatters.count(summary.alertsTotal) }} for items delivered before they were
                    flagged.
                  </p>
                  <Link
                    label="Early delivery alerts"
                    href="#alerts"
                    size="small"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>

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
            <Alert
              v-if="error"
              severity="danger"
              :label="`Couldn't load submissions. ${error}`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <div
              v-else-if="loading || submissions.length"
              class="flex min-w-0 flex-col gap-(--spacing-sm)"
            >
              <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <div class="min-w-36 grow basis-(--container-3xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search by name or submitter"
                    aria-label="Search by name or submitter"
                  >
                    <template #leading>
                      <i
                        class="ai ai-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>
                <div class="w-full sm:w-44">
                  <Select
                    v-model="status"
                    size="medium"
                    :display-value="
                      (value) =>
                        statusOptions.find((option) => option.value === value)?.label ??
                        String(value)
                    "
                  >
                    <Select.Trigger aria-label="Status" />
                    <Select.Content>
                      <Select.Item
                        v-for="option in statusOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                </div>
                <div class="w-full sm:w-44">
                  <Select
                    v-model="verdict"
                    size="medium"
                    :display-value="
                      (value) =>
                        verdictOptions.find((option) => option.value === value)?.label ??
                        String(value)
                    "
                  >
                    <Select.Trigger aria-label="Verdict" />
                    <Select.Content>
                      <Select.Item
                        v-for="option in verdictOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                </div>
                <div class="w-full sm:w-44">
                  <Select
                    v-model="source"
                    size="medium"
                    :display-value="
                      (value) =>
                        sourceOptions.find((option) => option.value === value)?.label ??
                        String(value)
                    "
                  >
                    <Select.Trigger aria-label="Source" />
                    <Select.Content>
                      <Select.Item
                        v-for="option in sourceOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                </div>
              </div>
              <DataTable
                v-model:global-filter="search"
                :data="rows"
                :columns="submissionColumns"
                row-key="id"
                sortable
                paginated
                :page-size="10"
                :page-size-options="[10, 25, 50]"
                density="compact"
                bordered
                :loading="loading"
              >
                <template #empty>
                  <EmptyState
                    size="small"
                    icon="ai ai-search"
                    title="No matching items"
                    description="Change the search or the filters."
                  />
                </template>
                <template #cell-name="{ row }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="ai ai-file shrink-0 text-body-lg text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate">{{ row.name }}</span>
                  </div>
                </template>
                <template #cell-verdict="{ row }">
                  <Table.CellStatus
                    :label="verdicts[row.verdict].label"
                    :severity="verdicts[row.verdict].severity"
                  />
                </template>
                <template #cell-score="{ row }">
                  <span class="tabular-nums">{{ formatters.score(row.score) }}</span>
                </template>
                <template #cell-size="{ row }">
                  <span class="tabular-nums">{{ formatters.size(row.size) }}</span>
                </template>
                <template #cell-source="{ row }">
                  {{ sourceLabels[row.source] }}
                </template>
                <template #cell-lastSeen="{ row }">
                  <time
                    class="tabular-nums"
                    :datetime="row.lastSeen"
                    >{{ row.lastSeen }}</time
                  >
                </template>
              </DataTable>
            </div>
            <EmptyState
              v-else
              size="small"
              icon="ai ai-file"
              title="No items yet"
              description="Items sent for analysis inline or through the API appear here."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
