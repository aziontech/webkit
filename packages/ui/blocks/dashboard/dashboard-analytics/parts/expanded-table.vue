<script setup lang="ts">
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import EmptyState from '@aziontech/webkit/empty-state'

  export interface ExpandedTableProps {
    /** The rows; each has an id and a requests count. */
    rows: object[]
    /** The table columns. */
    columns: TableColumn[]
    /** Writes the requests count of a row. */
    formatCount: (value: number) => string
    /** Title of the empty state. */
    emptyTitle: string
    /** Description of the empty state. */
    emptyDescription: string
  }

  defineProps<ExpandedTableProps>()
</script>

<template>
  <DataTable
    :data="rows"
    :columns="columns"
    row-key="id"
    sortable
    density="compact"
    bordered
  >
    <template #empty>
      <EmptyState
        size="small"
        icon="az az-chart-line"
        :title="emptyTitle"
        :description="emptyDescription"
      />
    </template>

    <template #cell-requests="{ row }">
      <span class="tabular-nums">{{
        formatCount('requests' in row ? Number(row.requests) : 0)
      }}</span>
    </template>
    <template #footer>
      <DataTablePagination :page-size="10" />
    </template>
  </DataTable>
</template>
