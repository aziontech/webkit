<script setup>
  import StatusCode from '@aziontech/webkit/status-code'
  import Table from '@aziontech/webkit/table'
  import { onBeforeUnmount, ref } from 'vue'

  const PAGE = 50
  const TOTAL = 200
  const paths = ['/', '/api/products', '/assets/app.js', '/api/orders', '/docs']
  const methods = ['GET', 'GET', 'GET', 'POST', 'GET']
  const statuses = [200, 200, 304, 503, 404]

  const page = (from) =>
    Array.from({ length: PAGE }, (_, i) => {
      const n = from + i
      return {
        id: `req-${n}`,
        time: `12:${String(59 - (Math.floor(n / 60) % 60)).padStart(2, '0')}:${String(59 - (n % 60)).padStart(2, '0')}`,
        method: methods[n % 5],
        status: statuses[n % 5],
        path: paths[n % 5]
      }
    })

  const rows = ref(page(0))
  const loadingMore = ref(false)
  let timer

  const loadMore = () => {
    loadingMore.value = true
    timer = setTimeout(() => {
      rows.value = [...rows.value, ...page(rows.value.length)]
      loadingMore.value = false
    }, 600)
  }

  onBeforeUnmount(() => clearTimeout(timer))

  const columns = [
    { accessorKey: 'time', header: 'Time', minWidth: 96 },
    { accessorKey: 'status', header: 'Status', minWidth: 120 },
    { accessorKey: 'path', header: 'Path', grow: 3, principal: true }
  ]
</script>

<template>
  <Table
    :data="rows"
    :columns="columns"
    :more-rows="rows.length < TOTAL"
    :loading-more="loadingMore"
    virtual
    max-height="420px"
    density="compact"
    bordered
    aria-label="Requests to app.example.com"
    @load-more="loadMore"
  >
    <template #cell-status="{ row }">
      <StatusCode
        :code="row.status"
        :method="row.method"
      />
    </template>
  </Table>
</template>
