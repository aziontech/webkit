<script setup>
  import Button from '@aziontech/webkit/button'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import { ref } from 'vue'

  const columns = [
    { id: 'name', label: 'Name', locked: true },
    { id: 'domain', label: 'Domain' },
    { id: 'status', label: 'Status' }
  ]

  const preferences = ref({ density: 'compact' })
</script>

<template>
  <CollectionPreferences
    v-model:preferences="preferences"
    :columns="columns"
    :sections="['columns', 'density']"
    container="drawer"
  >
    <template #trigger="{ open }">
      <Button
        label="Table settings"
        icon="pi pi-cog"
        kind="outlined"
        size="medium"
        @click="open"
      />
    </template>
  </CollectionPreferences>
</template>
