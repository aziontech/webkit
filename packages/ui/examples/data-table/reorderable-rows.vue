<script setup>
  import DataTable from '@aziontech/webkit/data-table'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import { ref } from 'vue'

  const rules = ref([
    { id: 'r1', name: 'Redirect legacy paths', behavior: 'Redirect', status: 'Active' },
    { id: 'r2', name: 'Cache static assets', behavior: 'Set cache policy', status: 'Active' },
    { id: 'r3', name: 'Block unknown bots', behavior: 'Deny', status: 'Active' },
    { id: 'r4', name: 'Add security headers', behavior: 'Add response header', status: 'Inactive' },
    { id: 'r5', name: 'Rewrite API version', behavior: 'Rewrite request', status: 'Active' }
  ])

  const columns = [
    { accessorKey: 'name', header: 'Rule', principal: true },
    { accessorKey: 'behavior', header: 'Behavior', grow: 2 },
    { accessorKey: 'status', header: 'Status', minWidth: 96 }
  ]
</script>

<template>
  <DataTable
    v-model:data="rules"
    :columns="columns"
    row-key="id"
    reorderable
    aria-label="Rules, in the order they run"
  >
    <template #cell-status="{ value }">
      <TableCellStatus
        :label="value"
        :severity="value === 'Active' ? 'success' : 'neutral'"
      />
    </template>
  </DataTable>
</template>
