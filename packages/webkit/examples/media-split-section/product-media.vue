<script setup>
  import g2Symbol from '@aziontech/webkit/assets/g2-symbol-color.svg'
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
    eyebrow="Recognition"
    title="Recognized by the people who use it"
    description="Rated a Leader in Edge Computing by G2 users, season after season."
    :image="{ src: g2Symbol, alt: 'G2', framed: true }"
  />
</template>
