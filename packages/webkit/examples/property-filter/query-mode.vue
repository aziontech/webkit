<script setup>
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { matchesQuery } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  const events = Array.from({ length: 40 }, (_, i) => ({
    id: String(i + 1),
    level: ['Info', 'Warning', 'Error', 'Info'][i % 4],
    method: ['GET', 'POST', 'GET', 'DELETE', 'GET'][i % 5],
    status: [200, 404, 500, 200, 301][i % 5],
    host: ['shop.example.com', 'api.example.com'][i % 2]
  }))

  const properties = [
    {
      key: 'level',
      label: 'Level',
      options: [{ value: 'Info' }, { value: 'Warning' }, { value: 'Error' }]
    },
    {
      key: 'method',
      label: 'Method',
      options: [{ value: 'GET' }, { value: 'POST' }, { value: 'DELETE' }]
    },
    { key: 'status', label: 'Status code', type: 'number' },
    {
      key: 'host',
      label: 'Host',
      options: [{ value: 'shop.example.com' }, { value: 'api.example.com' }]
    }
  ]

  const text = ref('level = Error AND method = GET')
  const applied = ref({
    tokens: [
      { propertyKey: 'level', operator: '=', value: 'Error' },
      { propertyKey: 'method', operator: '=', value: 'GET' }
    ],
    operation: 'and'
  })

  const matches = computed(
    () => events.filter((event) => matchesQuery(event, applied.value, properties)).length
  )

  const apply = ({ query }) => {
    if (query) applied.value = query
  }
</script>

<template>
  <PropertyFilter
    v-model:text="text"
    mode="query"
    :properties="properties"
    :total-count="matches"
    aria-label="Query events"
    @submit="apply"
  />
</template>
