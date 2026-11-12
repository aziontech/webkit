<script setup>
  import TableRoot from '@aziontech/webkit/table-root'

  const rows = Array.from({ length: 10000 }, (_, i) => ({
    id: String(i + 1),
    request: `req-${String(i + 1).padStart(5, '0')}`,
    status: [200, 200, 304, 404, 500][i % 5],
    path: ['/', '/api/items', '/assets/app.js', '/login', '/health'][i % 5],
    duration: `${(i * 7) % 900} ms`
  }))

  const columns = [
    { accessorKey: 'request', header: 'Request', principal: true },
    { accessorKey: 'status', header: 'Status', minWidth: 80 },
    { accessorKey: 'path', header: 'Path' },
    { accessorKey: 'duration', header: 'Duration', align: 'end', minWidth: 96 }
  ]
</script>

<template>
  <TableRoot
    :data="rows"
    :columns="columns"
    virtual
    max-height="480px"
    bordered
  />
</template>
