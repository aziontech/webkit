<script setup>
  import ConsoleTraceScene from '@aziontech/webkit/assets/console-trace-scene'
  import ConsoleShowcaseSection from '@aziontech/webkit/console-showcase-section'

  const tabs = [
    { value: 'trace', title: 'Trace' },
    { value: 'logs', title: 'Logs' },
    { value: 'path', title: 'Request path' }
  ]
</script>

<template>
  <ConsoleShowcaseSection
    eyebrow="Observability"
    title="Inspect every run end to end"
    description="Spans, logs and the path the request took, traced on the platform itself."
    :tabs="tabs"
  >
    <template #scene="{ tab }">
      <ConsoleTraceScene
        :tab="tab"
        :width="1200"
      />
    </template>
  </ConsoleShowcaseSection>
</template>
