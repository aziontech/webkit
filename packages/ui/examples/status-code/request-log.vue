<script setup>
  import DataTable from '@aziontech/ui/data-table'
  import StatusCode from '@aziontech/ui/status-code'

  const rows = [
    { id: 'r1', time: '12:04:31', method: 'GET', status: 200, path: '/', duration: '38 ms' },
    {
      id: 'r2',
      time: '12:04:29',
      method: 'GET',
      status: 304,
      path: '/assets/app.js',
      duration: '4 ms'
    },
    {
      id: 'r3',
      time: '12:04:27',
      method: 'POST',
      status: 503,
      path: '/api/orders',
      duration: '1.2 s'
    },
    {
      id: 'r4',
      time: '12:04:22',
      method: 'GET',
      status: 200,
      path: '/api/products',
      duration: '61 ms'
    },
    {
      id: 'r5',
      time: '12:04:19',
      method: 'DELETE',
      status: 404,
      path: '/api/carts/42',
      duration: '12 ms'
    },
    { id: 'r6', time: '12:04:15', method: 'GET', status: 200, path: '/docs', duration: '45 ms' }
  ]

  const columns = [
    { accessorKey: 'time', header: 'Time', minWidth: 96 },
    { accessorKey: 'status', header: 'Status', minWidth: 120 },
    { accessorKey: 'path', header: 'Path', grow: 3, principal: true },
    { accessorKey: 'duration', header: 'Duration', minWidth: 96, align: 'end' }
  ]
</script>

<template>
  <DataTable
    :data="rows"
    :columns="columns"
    density="compact"
    aria-label="Requests to app.example.com"
  >
    <template #cell-status="{ row }">
      <StatusCode
        :code="row.status"
        :method="row.method"
      />
    </template>
  </DataTable>
</template>
