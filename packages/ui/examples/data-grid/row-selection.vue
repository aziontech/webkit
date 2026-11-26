<script setup>
  import Button from '@aziontech/ui/button'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import DataGrid from '@aziontech/ui/data-grid'
  import { ref } from 'vue'

  const rows = ref([
    { id: 'r1', host: 'app.example.com', ttl: 3600, proxied: true },
    { id: 'r2', host: 'api.example.com', ttl: 300, proxied: true },
    { id: 'r3', host: 'docs.example.com', ttl: 3600, proxied: false }
  ])
  const selection = ref([])
  const confirming = ref(false)
  let next = 4

  const columns = [
    { id: 'host', header: 'Host', width: 150 },
    { id: 'ttl', header: 'TTL (seconds)', type: 'number', align: 'end', width: 120 },
    { id: 'proxied', header: 'Proxied', type: 'boolean', width: 120 }
  ]

  const addRow = () => {
    rows.value = [...rows.value, { id: `r${next++}`, host: '', ttl: 3600, proxied: false }]
  }
  const confirmRemove = (event, remove) => {
    remove(event)
    confirming.value = false
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
        icon="az az-plus"
        variant="outline"
        size="small"
        @click="add"
      />
      <ConfirmDialog
        v-model:open="confirming"
        :title="selectedCount === 1 ? 'Delete 1 record' : `Delete ${selectedCount} records`"
        description="The selected DNS records stop answering as soon as they are deleted. This cannot be undone."
        :confirm-label="selectedCount === 1 ? 'Delete record' : 'Delete records'"
        variant="danger"
        @confirm="(event) => confirmRemove(event, remove)"
      >
        <template #trigger>
          <Button
            :label="
              selectedCount === 0
                ? 'Delete rows'
                : `Delete ${selectedCount} ${selectedCount === 1 ? 'row' : 'rows'}`
            "
            variant="danger"
            size="small"
            :disabled="selectedCount === 0"
          />
        </template>
      </ConfirmDialog>
    </template>
  </DataGrid>
</template>
