<script setup>
  import DataTable from '@aziontech/ui/data-table'
  import TableExportButton from '@aziontech/ui/table-export-button'

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
</script>

<template>
  <DataTable
    :data="rows"
    :columns="columns"
    row-key="id"
    bordered
  >
    <template #toolbar>
      <TableExportButton filename="workloads.csv" />
    </template>
  </DataTable>
</template>
