<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import CodeBlock from '@aziontech/webkit/code-block'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Skeleton from '@aziontech/webkit/skeleton'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import type { QueryEditorResult, QueryEditorResultRow } from '../types'

  export interface QueryResultsProps {
    /** What the last query returned; null before a run and while one runs. */
    results: QueryEditorResult | null
    /** A query is in flight. */
    running?: boolean
    /** The status line read by screen readers. */
    resultStatus: string
  }

  const props = withDefaults(defineProps<QueryResultsProps>(), { running: false })

  const emit = defineEmits<{
    run: [event: MouseEvent]
    download: [event: MouseEvent]
  }>()

  const resultColumns = computed<TableColumn[]>(() => {
    if (props.results?.type !== 'rows') return []
    return props.results.columns.map((key, index) => ({
      accessorKey: key,
      header: key,
      principal: index === 0
    }))
  })
  const resultView = ref('table')
  const resultViewOptions = [
    { label: 'Table', value: 'table' },
    { label: 'JSON', value: 'json' }
  ]
  const resultSearch = ref('')
  const resultRows = computed<QueryEditorResultRow[]>(() =>
    props.results?.type === 'rows' ? props.results.rows : []
  )
  const filteredResultRows = computed(() => {
    const term = resultSearch.value.trim().toLowerCase()
    if (!term) return resultRows.value
    return resultRows.value.filter((row) =>
      Object.entries(row)
        .filter(([key]) => key !== '__k')
        .some(([, value]) => String(value).toLowerCase().includes(term))
    )
  })
  const resultJson = computed(() =>
    JSON.stringify(
      resultRows.value.map(({ __k, ...rest }) => rest),
      null,
      2
    )
  )
</script>

<template>
  <div class="flex flex-col border-t-(length:--border-width-default) border-(--border-default)">
    <div
      class="flex flex-wrap items-center gap-(--spacing-xs) border-b border-(--border-default) p-(--spacing-xs)"
    >
      <span class="shrink-0 text-heading-2xs text-(--text-default)"> Results </span>
      <div
        class="flex min-w-36 grow basis-(--container-2xs) md:ms-(--spacing-sm) md:max-w-(--container-sm)"
      >
        <Input
          v-model="resultSearch"
          size="medium"
          class="w-full"
          placeholder="Search"
          aria-label="Search results"
          :disabled="!resultRows.length"
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
      <div class="ms-auto flex items-center gap-(--spacing-xs)">
        <ToggleGroup
          v-model="resultView"
          :options="resultViewOptions"
          aria-label="Result view"
        />
        <Tooltip content="Refresh results">
          <IconButton
            icon="az az-refresh"
            variant="outline"
            size="medium"
            aria-label="Refresh results"
            :loading="running"
            @click="(event: MouseEvent) => emit('run', event)"
          />
        </Tooltip>
        <Tooltip content="Download results">
          <IconButton
            icon="az az-download"
            variant="outline"
            size="medium"
            aria-label="Download results"
            :disabled="!resultRows.length"
            @click="(event: MouseEvent) => emit('download', event)"
          />
        </Tooltip>
        <Tooltip content="Toggle columns">
          <IconButton
            icon="az az-table"
            variant="outline"
            size="medium"
            aria-label="Toggle columns"
            :disabled="!resultRows.length"
          />
        </Tooltip>
      </div>
    </div>

    <div class="min-h-(--container-3xs)">
      <p
        role="status"
        class="sr-only"
      >
        {{ resultStatus }}
      </p>
      <div
        v-if="running"
        class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)"
        aria-busy="true"
      >
        <Skeleton
          v-for="line in 4"
          :key="line"
          height="2rem"
        />
      </div>
      <DataTable
        v-else-if="resultRows.length && resultView === 'table'"
        :data="filteredResultRows"
        :columns="resultColumns"
        row-key="__k"
        :bordered="false"
      >
        <template #footer>
          <DataTablePagination
            :page-size="50"
            :page-size-options="[10, 25, 50, 100]"
          />
        </template>
      </DataTable>
      <CodeBlock
        v-else-if="resultRows.length && resultView === 'json'"
        :code="resultJson"
        language="json"
        copy-aria-label="Copy the results as JSON"
        :bordered="false"
      />
      <div
        v-else-if="results && (results.type === 'message' || results.type === 'error')"
        class="p-(--spacing-md)"
      >
        <Alert
          :severity="results.type === 'error' ? 'danger' : 'success'"
          :label="results.text"
        />
      </div>
      <div
        v-else
        class="flex min-h-(--container-3xs) items-center justify-center p-(--spacing-lg)"
      >
        <EmptyState
          title="Ready to execute"
          description="Execute a query to see the results here."
        />
      </div>
    </div>
  </div>
</template>
