<script setup>
  import LogViewer from '@aziontech/webkit/log-viewer'

  const lines = [
    { id: '1', time: '0.000s', level: 'info', type: 'text', message: 'Request received' },
    {
      id: '2',
      time: '0.012s',
      level: 'warn',
      type: 'text',
      message: 'Cache miss for /assets/app.js'
    },
    { id: '3', time: '0.048s', level: 'info', type: 'text', message: 'Response sent: 200' }
  ]
</script>

<template>
  <div class="h-[320px]">
    <LogViewer
      :lines="lines"
      :levels="['info', 'warn']"
      disabled
      class="h-full"
    >
      <LogViewer.Header />
      <LogViewer.Content />
    </LogViewer>
  </div>
</template>
