<script setup>
  import Trace from '@aziontech/ui/trace'
  import { ref } from 'vue'

  const spans = [
    { id: 'root', name: 'report-export', service: 'Function', start: 0, duration: 4820 },
    {
      id: 'auth',
      parentId: 'root',
      name: 'verify-token',
      service: 'Security',
      start: 3,
      duration: 9
    },
    {
      id: 'config',
      parentId: 'root',
      name: 'read-config',
      service: 'Storage',
      start: 12,
      duration: 21
    },
    {
      id: 'dns',
      parentId: 'root',
      name: 'dns-lookup',
      service: 'Network',
      start: 33,
      duration: 14
    },
    {
      id: 'query',
      parentId: 'root',
      name: 'query-orders',
      service: 'Database',
      start: 47,
      duration: 4190
    },
    {
      id: 'render',
      parentId: 'root',
      name: 'render-csv',
      service: 'Compute',
      start: 4237,
      duration: 512
    },
    {
      id: 'upload',
      parentId: 'root',
      name: 'put-object',
      service: 'Storage',
      start: 4749,
      duration: 68
    }
  ]

  const range = ref([0, 120])
  const selected = ref('')
</script>

<template>
  <Trace
    v-model:range="range"
    v-model:selected-key="selected"
    :spans="spans"
    zoomable
    aria-label="Trace of the report export"
  />
</template>
