<script setup lang="ts">
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import { matchesText } from '@aziontech/webkit/use-collection'
  import { computed } from 'vue'

  export interface SearchTableProps {
    /** The rows; each has an id and a requests count. */
    rows: object[]
    /** The table columns. */
    columns: TableColumn[]
    /** Placeholder and accessible name of the search field. */
    searchLabel: string
    /** Writes the requests count of a row. */
    formatCount: (value: number) => string
    /** The rows are loading. */
    loading?: boolean
    /** Title of the empty state when there are no rows; empty never shows it. */
    emptyTitle?: string
    /** Description of the empty state when there are no rows. */
    emptyDescription?: string
    /** The options of the filter toggle beside the search; empty hides it. */
    filters?: ToggleGroupOption[]
    /** Accessible name of the filter toggle. */
    filterLabel?: string
  }

  const props = withDefaults(defineProps<SearchTableProps>(), {
    loading: false,
    emptyTitle: '',
    emptyDescription: '',
    filters: () => [],
    filterLabel: ''
  })

  const search = defineModel<string>('search', { default: '' })
  const filter = defineModel<string>('filter', { default: 'all' })

  const onFilter = (value: string | number | undefined) => {
    filter.value = value === undefined ? 'all' : String(value)
  }

  const noMatch = () =>
    props.filters.length ? 'Change the search or the status class.' : 'Change the search.'
  const matchingRows = computed(() =>
    props.rows.filter((row) =>
      matchesText(
        row,
        search.value,
        props.columns.flatMap((column) => column.accessorKey ?? [])
      )
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
          :placeholder="searchLabel"
          :aria-label="searchLabel"
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
      <ToggleGroup
        v-if="filters.length"
        :model-value="filter"
        :options="filters"
        size="medium"
        :aria-label="filterLabel"
        @update:model-value="onFilter"
      />
    </div>

    <div class="min-w-0">
      <DataTable
        :data="matchingRows"
        :columns="columns"
        row-key="id"
        sortable
        density="compact"
        stackable
        bordered
        :loading="loading"
      >
        <template #empty>
          <EmptyState
            key="empty-state-1"
            v-if="emptyTitle && !rows.length"
            size="small"
            icon="az az-chart-line"
            :title="emptyTitle"
            :description="emptyDescription"
          />
          <EmptyState
            key="empty-state-2"
            v-else
            size="small"
            icon="az az-search"
            title="No matching rows"
            :description="noMatch()"
          />
        </template>

        <template #cell-requests="{ row }">
          <span class="tabular-nums">{{
            formatCount('requests' in row ? Number(row.requests) : 0)
          }}</span>
        </template>
        <template #footer>
          <DataTablePagination
            :page-size="5"
            :page-size-options="[5, 10, 25]"
          />
        </template>
      </DataTable>
    </div>
  </div>
</template>
