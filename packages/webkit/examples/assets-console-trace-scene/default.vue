<script setup>
  import ConsoleTraceScene from '@aziontech/webkit/assets/console-trace-scene'
  import MediaTabs from '@aziontech/webkit/media-tabs'

  const documents = [
    {
      value: 'trace',
      title: 'Trace',
      description:
        'The run as a waterfall: each step placed against the invocation it belongs to, nested where it nested.'
    },
    {
      value: 'logs',
      title: 'Logs',
      description: 'Structured output on the same clock as the trace, searchable in place.'
    },
    {
      value: 'path',
      title: 'Request path',
      description:
        'The workload, application, function and connector it travelled, each with the time spent there.'
    }
  ]
</script>

<template>
  <MediaTabs
    :items="documents"
    size="small"
    :autoplay-interval="5200"
  >
    <template #media="{ index, active }">
      <ConsoleTraceScene
        :tab="documents[index].value"
        :active="active"
        class="size-full"
      />
    </template>
  </MediaTabs>
</template>
