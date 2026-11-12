<script setup>
  import TableRoot from '@aziontech/webkit/table-root'
  import { ref } from 'vue'

  const accounts = [
    {
      id: 'org-1',
      name: 'Northwind Group',
      type: 'Organization',
      children: [
        {
          id: 'ws-1',
          name: 'Retail',
          type: 'Workspace',
          children: [
            { id: 'cl-1', name: 'Storefront', type: 'Client' },
            { id: 'cl-2', name: 'Checkout', type: 'Client' }
          ]
        },
        {
          id: 'ws-2',
          name: 'Media',
          type: 'Workspace',
          children: [{ id: 'cl-3', name: 'Video library', type: 'Client' }]
        }
      ]
    },
    { id: 'org-2', name: 'Contoso Labs', type: 'Organization' }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true },
    { accessorKey: 'type', header: 'Type', minWidth: 120 }
  ]

  const expanded = ref({ 'org-1': true })
  const selection = ref({})
</script>

<template>
  <TableRoot
    v-model:expanded="expanded"
    v-model:row-selection="selection"
    :data="accounts"
    :columns="columns"
    :get-sub-rows="(row) => row.children"
    row-key="id"
    enable-row-selection
    aria-label="Accounts"
  />
</template>
