<script setup lang="ts">
  import BarList from '@aziontech/webkit/bar-list'
  import CardBox from '@aziontech/webkit/card-box'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import InputText from '@aziontech/webkit/input-text'
  import Link from '@aziontech/webkit/link'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import {
    ALL,
    formatters,
    matchSubmissions,
    optionLabel,
    scanResults,
    SOURCE_OPTIONS,
    sourceOf,
    STATUS_OPTIONS,
    SUBMISSION_COLUMNS,
    VERDICT_OPTIONS,
    verdictOf
  } from '../../lib/data/dashboards/scan-results'

  interface Props {
    period: string
    comparison: string
    loading?: boolean
    refetching?: boolean
    empty?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    refetching: false,
    empty: false
  })

  const search = ref('')
  const status = ref(ALL)
  const verdict = ref(ALL)
  const source = ref(ALL)

  const results = computed(() => scanResults(props.period, { empty: props.empty }))
  const summary = computed(() => results.value.summary)
  const rows = computed(() =>
    matchSubmissions(results.value.submissions, {
      status: status.value,
      verdict: verdict.value,
      source: source.value
    })
  )

  const filters = [
    { id: 'status', label: 'Status', model: status, options: STATUS_OPTIONS },
    { id: 'verdict', label: 'Verdict', model: verdict, options: VERDICT_OPTIONS },
    { id: 'source', label: 'Source', model: source, options: SOURCE_OPTIONS }
  ].map((filter) => ({ ...filter, displayValue: optionLabel(filter.options) }))
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <section aria-label="Summary">
      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <li
          v-for="figure in results.figures"
          :key="figure.id"
          class="flex min-w-0 flex-col"
        >
          <StatTile
            :label="figure.label"
            :value="figure.value"
            :format-value="formatters.compact"
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
      <ChartCard :span="4">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Verdicts</ChartCard.Title>
            <Hint text="Every item analyzed in the period, by the verdict it received." />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <DonutChart
            :series="results.verdictSplit"
            :format-value="formatters.compact"
            size="small"
            total-label="Items"
            empty-title="No verdict yet"
            empty-description="Verdicts appear once the first item finishes its analysis."
            :loading="loading"
            :refetching="refetching"
            aria-label="Verdicts"
          />
        </ChartCard.Content>
      </ChartCard>

      <ChartCard :span="4">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Sources</ChartCard.Title>
            <Hint
              text="Where the items came from: scanned inline as they pass through a workload, sent through the Azion API, uploaded in Console or picked up by a scheduled Object Storage scan."
            />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <BarList
            :items="results.sourceItems"
            :format-value="formatters.compact"
            empty-title="No item yet"
            :loading="loading"
            aria-label="Sources"
          />
        </ChartCard.Content>
      </ChartCard>

      <div class="grid min-w-0 lg:col-span-4">
        <CardBox title="Held and flagged">
          <template #content>
            <div
              v-if="loading"
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
              <div class="flex flex-col items-start gap-(--spacing-xxs)">
                <p class="text-pretty text-body-sm text-(--text-default)">
                  {{ formatters.count(summary.held) }} deliveries held for a verdict now,
                  {{ formatters.count(summary.heldLast24h) }} in the last 24 hours.
                </p>
                <Link
                  label="Held deliveries"
                  href="#held"
                  size="small"
                  :show-icon="false"
                />
              </div>
              <div class="flex flex-col items-start gap-(--spacing-xxs)">
                <p class="text-pretty text-body-sm text-(--text-default)">
                  {{ formatters.count(summary.alertsOpen) }} open alerts of
                  {{ formatters.count(summary.alertsTotal) }} for items delivered before they were
                  flagged.
                </p>
                <Link
                  label="Early delivery alerts"
                  href="#alerts"
                  size="small"
                  :show-icon="false"
                />
              </div>
            </div>
          </template>
        </CardBox>
      </div>

      <ChartCard :span="12">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Submissions</ChartCard.Title>
            <Hint
              text="Every item sent for analysis, newest first, with its verdict and where it came from."
            />
          </span>
        </ChartCard.Header>
        <ChartCard.Content>
          <div
            v-if="loading || results.submissions.length"
            class="flex min-w-0 flex-col gap-(--spacing-sm)"
          >
            <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
              <div class="min-w-36 grow basis-(--container-3xs)">
                <InputText
                  v-model="search"
                  size="medium"
                  placeholder="Search by name or submitter"
                  aria-label="Search by name or submitter"
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-search"
                      aria-hidden="true"
                    />
                  </template>
                </InputText>
              </div>
              <div
                v-for="filter in filters"
                :key="filter.id"
                class="w-full sm:w-44"
              >
                <Select
                  v-model="filter.model.value"
                  size="medium"
                  :display-value="filter.displayValue"
                >
                  <Select.Trigger :aria-label="filter.label" />
                  <Select.Content>
                    <Select.Option
                      v-for="option in filter.options"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </div>
            </div>
            <TableRoot
              v-model:global-filter="search"
              :data="rows"
              :columns="SUBMISSION_COLUMNS"
              row-key="id"
              enable-sorting
              paginated
              :page-size="10"
              :rows-per-page-options="[10, 25, 50]"
              header-kind="compact"
              border
              :loading="loading"
            >
              <template #empty>
                <EmptyState
                  size="small"
                  icon="pi pi-search"
                  title="No matching items"
                  description="Change the search or the filters."
                />
              </template>
              <template #cell-name="{ row }">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    class="pi pi-file shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate">{{ row.name }}</span>
                </div>
              </template>
              <template #cell-verdict="{ row }">
                <Tag
                  :label="verdictOf(row.verdict).label"
                  :severity="verdictOf(row.verdict).severity"
                  size="small"
                />
              </template>
              <template #cell-score="{ row }">
                <span class="tabular-nums">{{ formatters.score(row.score) }}</span>
              </template>
              <template #cell-size="{ row }">
                <span class="tabular-nums">{{ formatters.size(row.size) }}</span>
              </template>
              <template #cell-source="{ row }">
                {{ sourceOf(row.source) }}
              </template>
              <template #cell-lastSeen="{ row }">
                <time
                  class="tabular-nums"
                  :datetime="String(row.lastSeen)"
                  >{{ row.lastSeen }}</time
                >
              </template>
            </TableRoot>
          </div>
          <EmptyState
            v-else
            size="small"
            icon="pi pi-file"
            title="No item yet"
            description="Items scanned inline or sent through the Azion API appear here."
          />
        </ChartCard.Content>
      </ChartCard>
    </div>
  </div>
</template>
