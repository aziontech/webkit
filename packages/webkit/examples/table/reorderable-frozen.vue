<script setup>
  import Table from '@aziontech/webkit/table'
  import { ref } from 'vue'

  const rules = ref([
    {
      id: 'r1',
      name: 'Redirect legacy paths',
      phase: 'Request',
      behavior: 'Redirect',
      criteria: 'Path starts with /old',
      status: 'Active'
    },
    {
      id: 'r2',
      name: 'Cache static assets',
      phase: 'Request',
      behavior: 'Set cache policy',
      criteria: 'Extension is css, js or png',
      status: 'Active'
    },
    {
      id: 'r3',
      name: 'Block unknown bots',
      phase: 'Request',
      behavior: 'Deny',
      criteria: 'Bot score below 30',
      status: 'Active'
    },
    {
      id: 'r4',
      name: 'Add security headers',
      phase: 'Response',
      behavior: 'Add response header',
      criteria: 'Every response',
      status: 'Inactive'
    }
  ])

  const columns = [
    { accessorKey: 'name', header: 'Rule', frozen: 'start', width: 220 },
    { accessorKey: 'phase', header: 'Phase', minWidth: 112 },
    { accessorKey: 'behavior', header: 'Behavior', minWidth: 200 },
    { accessorKey: 'criteria', header: 'Criteria', minWidth: 240 },
    { accessorKey: 'status', header: 'Status', minWidth: 112 }
  ]
</script>

<template>
  <Table
    v-model:data="rules"
    :columns="columns"
    row-key="id"
    reorderable
    enable-row-selection
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
