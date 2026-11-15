<script setup>
  import DataTable from '@aziontech/webkit/data-table'
  import StatusCode from '@aziontech/webkit/status-code'
  import Table from '@aziontech/webkit/table'
  import { onBeforeUnmount, ref, watch } from 'vue'

  const paths = ['/', '/api/products', '/api/cart', '/assets/app.js', '/api/orders']
  const methods = ['GET', 'GET', 'POST', 'GET', 'POST']
  const statuses = [200, 200, 201, 304, 503]

  const request = (n) => ({
    id: `req-${n}`,
    sequence: n,
    method: methods[n % 5],
    status: statuses[n % 5],
    path: paths[n % 5]
  })

  let next = 20
  const rows = ref(Array.from({ length: 20 }, (_, i) => request(19 - i)))
  const live = ref(false)
  let timer

  watch(live, (on) => {
    clearInterval(timer)
    if (on) timer = setInterval(() => (rows.value = [request(next++), ...rows.value]), 1500)
  })

  onBeforeUnmount(() => clearInterval(timer))

  const columns = [
    { accessorKey: 'sequence', header: 'Request', minWidth: 96 },
    { accessorKey: 'status', header: 'Status', minWidth: 120 },
    { accessorKey: 'path', header: 'Path', grow: 3, principal: true }
  ]
</script>

<template>
  <DataTable
    v-model:live="live"
    :data="rows"
    :columns="columns"
    max-height="420px"
    density="compact"
    bordered
    aria-label="Requests to app.example.com"
  >
    <template #title>Requests</template>
    <template #toolbar>
      <Table.LiveButton />
    </template>
    <template #cell-status="{ row }">
      <StatusCode
        :code="row.status"
        :method="row.method"
      />
    </template>
  </DataTable>
</template>
