<script setup>
  import Table from '@aziontech/webkit/table'
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
  <Table
    v-model:data="rules"
    :columns="columns"
    row-key="id"
    reorderable
    aria-label="Rules, in the order they run"
  >
    <template #cell-status="{ value }">
      <Table.CellStatus
        :label="value"
        :severity="value === 'Active' ? 'success' : 'secondary'"
      />
    </template>
  </Table>
</template>
