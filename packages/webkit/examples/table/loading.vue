<script setup>
  import TableRoot from '@aziontech/webkit/table-root'

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
  <TableRoot
    :data="rows"
    :columns="columns"
    row-key="id"
    loading
    bordered
  />
</template>
