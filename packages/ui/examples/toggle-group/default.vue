<script setup>
  import ToggleGroup from '@aziontech/ui/toggle-group'
  import { ref } from 'vue'

  const options = [
    { label: 'Overview', value: 'overview' },
    { label: 'Requests', value: 'requests' },
    { label: 'Errors', value: 'errors' },
    { label: 'Latency', value: 'latency' },
    { label: 'Bandwidth', value: 'bandwidth' }
  ]

  const selected = ref('overview')
</script>

<template>
  <ToggleGroup
    v-model="selected"
    :options="options"
    aria-label="Metrics view"
  />
</template>
