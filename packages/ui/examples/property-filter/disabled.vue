<script setup>
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { ref } from 'vue'

  const properties = [
    { key: 'status', label: 'Status', options: [{ value: 'Active' }, { value: 'Inactive' }] },
    { key: 'name', label: 'Name' }
  ]

  const query = ref({
    tokens: [
      { propertyKey: 'status', operator: '=', value: 'Active' },
      { operator: ':', value: 'acme' }
    ],
    operation: 'and'
  })
</script>

<template>
  <PropertyFilter
    v-model:query="query"
    :properties="properties"
    disabled
  />
</template>
