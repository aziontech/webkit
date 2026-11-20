<script setup>
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'

  const columns = [
    { id: 'name', label: 'Name', locked: true },
    { id: 'status', label: 'Status' }
  ]
</script>

<template>
  <CollectionPreferences
    :columns="columns"
    :page-size-options="[10, 25, 50]"
    disabled
  />
</template>
