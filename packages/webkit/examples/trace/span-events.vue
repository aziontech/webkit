<script setup>
  import Trace from '@aziontech/webkit/trace'
  import { ref } from 'vue'

  const spans = [
    { id: 'root', name: 'image-resizer', service: 'Function', start: 0, duration: 412 },
    {
      id: 'origin',
      parentId: 'root',
      name: 'fetch-origin',
      service: 'Network',
      start: 16,
      duration: 186,
      events: [
        { at: 22, name: 'cache-miss' },
        { at: 61, name: 'connection-open' },
        { at: 148, name: 'first-byte' }
      ]
    },
    {
      id: 'decode',
      parentId: 'root',
      name: 'decode',
      service: 'Compute',
      start: 202,
      duration: 54
    },
    {
      id: 'encode',
      parentId: 'root',
      name: 'encode',
      service: 'Compute',
      start: 256,
      duration: 92,
      events: [{ at: 301, name: 'retry-quality-80' }]
    },
    {
      id: 'cache',
      parentId: 'root',
      name: 'put-cache',
      service: 'Storage',
      start: 348,
      duration: 38
    }
  ]

  const selected = ref('origin')
</script>

<template>
  <Trace
    v-model:selected-key="selected"
    :spans="spans"
    highlight-slowest
    aria-label="Trace of the test run"
  />
</template>
