<script setup>
  import Button from '@aziontech/webkit/button'
  import DataTable from '@aziontech/webkit/data-table'
  import { ref } from 'vue'

  const rows = [
    { id: '1001', name: 'Workload Alpha', status: 'Active', modified: 'Jan 1, 2026, 09:00 AM' },
    { id: '1002', name: 'Workload Bravo', status: 'Inactive', modified: 'Jan 2, 2026, 09:00 AM' },
    { id: '1003', name: 'Workload Charlie', status: 'Degraded', modified: 'Jan 3, 2026, 09:00 AM' }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'modified', header: 'Last Modified', grow: 2 }
  ]

  const tableEl = ref(null)
  const saved = ref(null)
  const state = ref(null)

  const save = () => {
    saved.value = tableEl.value?.getState() ?? null
  }
  const restore = () => {
    if (saved.value) tableEl.value?.setState(saved.value)
  }
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <div class="flex gap-(--spacing-xs)">
      <Button
        label="Save view"
        variant="secondary"
        size="small"
        @click="save"
      />
      <Button
        label="Restore view"
        variant="secondary"
        size="small"
        :disabled="!saved"
        @click="restore"
      />
    </div>
    <DataTable
      ref="tableEl"
      v-model:state="state"
      :data="rows"
      :columns="columns"
      row-key="id"
      sortable
      bordered
    />
  </div>
</template>
