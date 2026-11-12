<script setup>
  import MediaSplitBand from '@aziontech/webkit/media-split-band'
</script>

<template>
  <MediaSplitBand
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
  <MediaSplitBand
    eyebrow="Cache"
    title="Serve repeat requests from the nearest location"
    description="Cached responses never travel back to your origin, so it handles a fraction of the traffic."
    diagram="cache"
  />
</template>
