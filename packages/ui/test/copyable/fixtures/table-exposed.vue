<script setup lang="ts">
  import DataTable, { type TableColumn, type TableExposed } from '@aziontech/webkit/data-table'
  import { ref } from 'vue'

  interface Domain {
    id: string
    name: string
  }

  const domains: Domain[] = [{ id: 'd1', name: 'storefront' }]
  const columns: TableColumn[] = [{ accessorKey: 'name', header: 'Name' }]
  const table = ref<TableExposed<Domain> | null>(null)

  const exportSelected = (): void => {
    void table.value?.exportCsv({ filename: 'domains.csv', rows: domains })
  }
  const resetSearch = (): void => {
    const state = table.value?.getSnapshot()
    table.value?.setSnapshot({ ...state, globalFilter: '' })
    table.value?.clearFilters()
    table.value?.reload()
    // @ts-expect-error the raw TanStack instance is not on the ref
    table.value?.getCoreRowModel()
  }
</script>

<template>
  <DataTable
    ref="table"
    :data="domains"
    :columns="columns"
  />
  <button
    type="button"
    @click="exportSelected"
  >
    Export
  </button>
  <button
    type="button"
    @click="resetSearch"
  >
    Reset
  </button>
</template>
