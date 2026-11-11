<script setup>
  import Switch from '@aziontech/webkit/switch'
  import Table from '@aziontech/webkit/table'
  import { onBeforeUnmount, ref, watch } from 'vue'

  const AUTO_REFRESH_MS = 30_000
  const STATES = ['Active', 'Pending', 'Active', 'Failed']

  const deploymentsAt = (round) =>
    ['storefront', 'image-optimizer', 'docs-portal', 'checkout-api'].map((name, index) => ({
      id: String(index + 1),
      name,
      status: STATES[(index + round) % STATES.length]
    }))

  const severityOf = (status) =>
    ({ Active: 'success', Failed: 'danger', Pending: 'warning' })[status] ?? 'secondary'

  const columns = [
    { accessorKey: 'name', header: 'Deployment', principal: true },
    { accessorKey: 'status', header: 'Status', minWidth: 96 }
  ]

  const rows = ref(deploymentsAt(0))
  const updatedAt = ref(new Date())
  const refreshing = ref(false)
  const autoRefresh = ref(false)
  let round = 0
  let timer

  const refresh = async () => {
    if (refreshing.value) return
    refreshing.value = true
    await new Promise((resolve) => setTimeout(resolve, 600))
    round += 1
    rows.value = deploymentsAt(round)
    updatedAt.value = new Date()
    refreshing.value = false
  }

  const stopTimer = () => {
    clearInterval(timer)
    timer = undefined
  }

  watch(autoRefresh, (on) => {
    stopTimer()
    if (!on) return
    timer = setInterval(() => {
      if (document.visibilityState === 'visible') refresh()
    }, AUTO_REFRESH_MS)
  })

  onBeforeUnmount(stopTimer)
</script>

<template>
  <Table
    :data="rows"
    :columns="columns"
    row-key="id"
    aria-label="Deployments"
    @refresh="refresh"
  >
    <template #title>Deployments</template>
    <template #toolbar>
      <div class="flex min-w-0 items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)">
        <span class="shrink-0">Updated</span>
        <Table.CellTime :value="updatedAt" />
      </div>
      <div class="flex items-center gap-(--spacing-xs) text-body-sm text-(--text-default)">
        <Switch
          v-model="autoRefresh"
          aria-label="Auto-refresh every 30 seconds"
        />
        <span aria-hidden="true">Auto-refresh</span>
      </div>
      <Table.RefreshButton :loading="refreshing" />
    </template>
    <template #cell-status="{ value }">
      <Table.CellStatus
        :label="value"
        :severity="severityOf(value)"
      />
    </template>
  </Table>
</template>
