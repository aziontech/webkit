<script setup lang="ts">
  import DataTable from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import { computed, ref } from 'vue'

  import type { ScanResultsSubmission } from '../dashboard-scan-results.vue'
  import {
    formatScanScore,
    formatScanSize,
    scanColumns,
    scanSourceLabels,
    scanSourceOptions,
    scanStatusOptions,
    scanVerdictOptions,
    scanVerdicts
  } from '../scan-results-config'
  import FilterSelect from './filter-select.vue'

  export interface SubmissionsTableProps {
    /** Every submission of the period, filtered here. */
    submissions: ScanResultsSubmission[]
    /** The period is loading. */
    loading: boolean
  }

  const props = defineProps<SubmissionsTableProps>()

  const search = ref('')
  const status = ref('all')
  const verdict = ref('all')
  const source = ref('all')

  const rows = computed(() =>
    props.submissions.filter(
      (row) =>
        (status.value === 'all' ||
          (status.value === 'analyzing') === (row.verdict === 'pending')) &&
        (verdict.value === 'all' || row.verdict === verdict.value) &&
        (source.value === 'all' || row.source === source.value)
    )
  )
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
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
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
      <FilterSelect
        v-model="status"
        label="Status"
        :options="scanStatusOptions"
      />
      <FilterSelect
        v-model="verdict"
        label="Verdict"
        :options="scanVerdictOptions"
      />
      <FilterSelect
        v-model="source"
        label="Source"
        :options="scanSourceOptions"
      />
    </div>
    <DataTable
      v-model:global-filter="search"
      :data="rows"
      :columns="scanColumns"
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
          icon="az az-search"
          title="No matching items"
          description="Change the search or the filters."
        />
      </template>
      <template #cell-name="{ row }">
        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
          <i
            class="az az-file shrink-0 text-body-lg text-(--text-muted)"
            aria-hidden="true"
          />
          <span class="truncate">{{ row.name }}</span>
        </div>
      </template>
      <template #cell-verdict="{ row }">
        <TableCellStatus
          :label="scanVerdicts[row.verdict].label"
          :severity="scanVerdicts[row.verdict].severity"
        />
      </template>
      <template #cell-score="{ row }">
        <span class="tabular-nums">{{ formatScanScore(row.score) }}</span>
      </template>
      <template #cell-size="{ row }">
        <span class="tabular-nums">{{ formatScanSize(row.size) }}</span>
      </template>
      <template #cell-source="{ row }">
        {{ scanSourceLabels[row.source] }}
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
</template>
