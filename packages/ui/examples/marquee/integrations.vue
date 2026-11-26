<script setup>
  import Marquee from '@aziontech/ui/marquee'
</script>

<template>
  <Marquee
    label="Stream to the tools you already run"
    aria-label="Data Stream connectors"
    :marks="['datadog', 'splunk', 'bigquery', 'amazon-kinesis', 'amazon-s3', 'elastic', 'kafka']"
  />
</template>
