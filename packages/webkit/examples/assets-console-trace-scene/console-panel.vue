<script setup>
  import ConsoleTraceScene from '@aziontech/webkit/assets/console-trace-scene'
  import ConsolePanel from '@aziontech/webkit/console-panel'

  const tabs = [
    { value: 'trace', title: 'Trace' },
    { value: 'logs', title: 'Logs' },
    { value: 'path', title: 'Request path' }
  ]
</script>

<template>
  <ConsolePanel
    eyebrow="Observability"
    title="Inspect every run end to end"
    description="Spans, logs and the path the request took, traced on the platform itself."
    :tabs="tabs"
  >
    <template #scene="{ tab }">
      <ConsoleTraceScene :tab="tab" />
    </template>
  </ConsolePanel>
</template>
