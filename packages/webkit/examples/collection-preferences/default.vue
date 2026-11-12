<script setup>
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import { ref } from 'vue'

  const columns = [
    { id: 'name', label: 'Name', locked: true },
    { id: 'status', label: 'Status' },
    { id: 'region', label: 'Region' },
    { id: 'requests', label: 'Requests' }
  ]

  const preferences = ref({
    pageSize: 25,
    columns: [
      { id: 'name', visible: true },
      { id: 'status', visible: true },
      { id: 'region', visible: false },
      { id: 'requests', visible: true }
    ],
    wrapLines: false,
    striped: false,
    density: 'comfortable'
  })
</script>

<template>
  <CollectionPreferences
    v-model:preferences="preferences"
    :columns="columns"
    :page-size-options="[10, 25, 50, 100]"
  />
</template>
