<script setup>
  import MediaSplitSection from '@aziontech/webkit/media-split-section'
</script>

<template>
  <MediaSplitSection
    eyebrow="Real-Time Events"
    title="Filter every request as it happens"
    description="Narrow the event stream by status, path or country, and read the matching requests seconds after they arrive."
    widget="real-time-events-filter"
    :primary-action="{
      label: 'Learn more',
      href: '/en/products/real-time-events/',
      trailing: true
    }"
  />
  <MediaSplitSection
    eyebrow="Real-Time Metrics"
    title="Read every status code as it lands"
    description="Chart status codes per application and spot a failing deploy seconds after it ships."
    illustration="real-time-metrics-status-codes"
    illustration-aria-label="A chart of response status codes over time"
  />
</template>
