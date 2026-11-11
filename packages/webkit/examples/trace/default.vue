<script setup>
  import Trace from '@aziontech/webkit/trace'
  import { ref } from 'vue'

  const spans = [
    { id: 'root', name: 'image-resizer', service: 'Function', start: 0, duration: 412 },
    {
      id: 'parse',
      parentId: 'root',
      name: 'parse-request',
      service: 'Compute',
      start: 4,
      duration: 12
    },
    {
      id: 'origin',
      parentId: 'root',
      name: 'fetch-origin',
      service: 'Network',
      start: 16,
      duration: 186
    },
    {
      id: 'dns',
      parentId: 'origin',
      name: 'dns-lookup',
      service: 'Network',
      start: 16,
      duration: 14
    },
    {
      id: 'tls',
      parentId: 'origin',
      name: 'tls-handshake',
      service: 'Security',
      start: 30,
      duration: 31
    },
    {
      id: 'response',
      parentId: 'origin',
      name: 'origin-response',
      service: 'Network',
      start: 61,
      duration: 141
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
      duration: 92
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

  const selected = ref('')
</script>

<template>
  <Trace
    v-model:selected="selected"
    :spans="spans"
    aria-label="Trace of the test run"
  />
</template>
