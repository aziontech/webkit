<script setup>
  import Button from '@aziontech/webkit/button'
  import DataGrid from '@aziontech/webkit/data-grid'
  import { ref } from 'vue'

  const rows = ref([
    { id: 'r1', host: 'app.example.com', ttl: 3600, proxied: true },
    { id: 'r2', host: 'api.example.com', ttl: 300, proxied: true },
    { id: 'r3', host: 'docs.example.com', ttl: 3600, proxied: false }
  ])
  const selection = ref([])
  let next = 4

  const columns = [
    { id: 'host', header: 'Host', width: 220 },
    { id: 'ttl', header: 'TTL (seconds)', type: 'number', align: 'end', width: 140 },
    { id: 'proxied', header: 'Proxied', type: 'boolean', width: 120 }
  ]

  const addRow = () => {
    rows.value = [...rows.value, { id: `r${next++}`, host: '', ttl: 3600, proxied: false }]
  }
  const removeRows = (event, removed) => {
    const ids = new Set(removed.map((row) => row.id))
    rows.value = rows.value.filter((row) => !ids.has(row.id))
    selection.value = []
  }
</script>

<template>
  <DataGrid
    v-model="rows"
    v-model:selected-keys="selection"
    :columns="columns"
    aria-label="DNS records"
    selectable
    @row-add="addRow"
    @row-remove="removeRows"
  >
    <template #toolbar="{ add, remove, selectedCount }">
      <Button
        label="Add row"
        icon="ai ai-plus"
        variant="outline"
        size="small"
        @click="add"
      />
      <Button
        label="Delete rows"
        variant="outline"
        size="small"
        :disabled="selectedCount === 0"
        @click="remove"
      />
    </template>
  </DataGrid>
</template>
