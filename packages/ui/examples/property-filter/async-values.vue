<script setup>
  import DatePickerRoot from '@aziontech/webkit/date-picker-root'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { ref } from 'vue'

  const hosts = [
    { value: 'api.example.com', count: 1284 },
    { value: 'app.example.com', count: 932 },
    { value: 'docs.example.com', count: 411 },
    { value: 'example.com', count: 2390 },
    { value: 'status.example.org', count: 57 }
  ]

  const properties = [
    { key: 'host', label: 'Host' },
    { key: 'created', label: 'Created', type: 'date', customValue: true }
  ]

  const query = ref({ tokens: [], operation: 'and' })

  const isoDate = (date) =>
    [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-')

  const loadValues = (property, text) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (text === 'fail') reject(new Error('Unavailable'))
        else resolve(hosts.filter((host) => host.value.includes(text.toLowerCase())))
      }, 400)
    })
</script>

<template>
  <PropertyFilter
    v-model:query="query"
    :properties="properties"
    :load-values="loadValues"
    placeholder="Filter by Host or Created; type fail to see the error"
  >
    <template #value="{ property, apply }">
      <DatePickerRoot
        size="small"
        :placeholder="`Select ${property.label.toLowerCase()} date`"
        :show-apply="false"
        @update:model-value="(date) => date instanceof Date && apply(isoDate(date))"
      />
    </template>
  </PropertyFilter>
</template>
