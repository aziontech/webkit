<script setup>
  import Button from '@aziontech/webkit/button'
  import DataGrid from '@aziontech/webkit/data-grid'
  import { ref } from 'vue'

  const rows = ref([
    { id: 'r1', host: 'app.example.com', ttl: 3600, proxied: true },
    { id: 'r2', host: 'api.example.com', ttl: 300, proxied: true },
    { id: 'r3', host: 'docs.example.com', ttl: 3600, proxied: false }
  ])
  const selection = ref({})
  let next = 4

  const columns = [
    { id: 'host', header: 'Host', width: 220 },
    { id: 'ttl', header: 'TTL (seconds)', type: 'number', align: 'end', width: 140 },
    { id: 'proxied', header: 'Proxied', type: 'boolean', width: 120 }
  ]

  const addRow = () => {
    rows.value = [...rows.value, { id: `r${next++}`, host: '', ttl: 3600, proxied: false }]
  }
  const deleteRows = (event, removed) => {
    const ids = new Set(removed.map((row) => row.id))
    rows.value = rows.value.filter((row) => !ids.has(row.id))
    selection.value = {}
  }
</script>

<template>
  <DataGrid
    v-model="rows"
    v-model:row-selection="selection"
    :columns="columns"
    aria-label="DNS records"
    enable-row-selection
    @row-add="addRow"
    @row-delete="deleteRows"
  >
    <template #toolbar="{ add, remove, selectedCount }">
      <Button
        label="Add row"
        icon="pi pi-plus"
        kind="outlined"
        size="small"
        @click="add"
      />
      <Button
        label="Delete rows"
        kind="outlined"
        size="small"
        :disabled="selectedCount === 0"
        @click="remove"
      />
    </template>
  </DataGrid>
</template>
