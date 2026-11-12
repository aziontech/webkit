<script setup>
  import Trace from '@aziontech/webkit/trace'
  import { ref } from 'vue'

  const spans = [
    {
      id: 'root',
      name: 'image-resizer',
      service: 'Function',
      start: 0,
      duration: 1240,
      status: 'error',
      message: 'The run failed because the origin did not answer.'
    },
    {
      id: 'parse',
      parentId: 'root',
      name: 'parse-request',
      service: 'Compute',
      start: 4,
      duration: 11
    },
    {
      id: 'origin',
      parentId: 'root',
      name: 'fetch-origin',
      service: 'Network',
      start: 15,
      duration: 1201,
      status: 'error',
      message: 'No response within the 1 s read budget.'
    },
    {
      id: 'dns',
      parentId: 'origin',
      name: 'dns-lookup',
      service: 'Network',
      start: 15,
      duration: 12
    },
    {
      id: 'tls',
      parentId: 'origin',
      name: 'tls-handshake',
      service: 'Security',
      start: 27,
      duration: 34
    },
    {
      id: 'response',
      parentId: 'origin',
      name: 'origin-response',
      service: 'Network',
      start: 61,
      duration: 1155,
      status: 'error',
      message: 'Read timed out after 1,000 ms.'
    }
  ]

  const selected = ref('response')
</script>

<template>
  <Trace
    v-model:selected="selected"
    :spans="spans"
    aria-label="Trace of the failed run"
  />
</template>
