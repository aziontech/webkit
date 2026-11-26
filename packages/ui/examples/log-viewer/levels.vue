<script setup>
  import LogViewer from '@aziontech/ui/log-viewer'
  import { ref } from 'vue'

  const lines = [
    {
      id: '1',
      time: '0 ms',
      level: 'info',
      type: 'text',
      message: 'Request received: GET /api/orders'
    },
    {
      id: '2',
      time: '2 ms',
      level: 'debug',
      type: 'text',
      message: 'Arguments: {"region":"us-east"}'
    },
    {
      id: '3',
      time: '14 ms',
      level: 'info',
      type: 'text',
      message: 'Cache miss for orders:us-east'
    },
    {
      id: '4',
      time: '186 ms',
      level: 'warn',
      type: 'text',
      message: 'Origin answered in 172 ms, above the 150 ms target'
    },
    {
      id: '5',
      time: '190 ms',
      level: 'debug',
      type: 'text',
      message: 'Stored 24 orders in the cache for 300 s'
    },
    {
      id: '6',
      time: '204 ms',
      level: 'error',
      type: 'text',
      message: 'Webhook to https://hooks.example.com/orders failed: 503'
    },
    {
      id: '7',
      time: '1.21 s',
      level: 'info',
      type: 'text',
      message: 'Response sent: 200 in 1.21 s'
    }
  ]
  const levels = ['debug', 'info', 'warn', 'error']
  const level = ref('')
  const search = ref('')
</script>

<template>
  <LogViewer
    :lines="lines"
    :levels="levels"
    v-model:level="level"
    v-model:search="search"
  >
    <LogViewer.Header />
    <LogViewer.Content />
  </LogViewer>
</template>
