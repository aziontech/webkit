<script setup>
  import MediaSplitStackSection from '@aziontech/webkit/media-split-stack-section'

  const bands = [
    {
      widget: 'data-stream-source',
      title: 'Unified data collection',
      description:
        'Collect event data from Applications, Functions, WAF Events, and Activity History from one configuration.',
      action: { label: 'Learn more', href: '/en/products/data-stream/' }
    },
    {
      illustration: 'real-time-metrics-error-rate',
      illustrationLabel: 'A chart of the error rate over time',
      title: 'Error rates as they happen',
      description:
        'Chart the error rate of every application and catch a failing deploy seconds after it ships.',
      action: { label: 'Learn more', href: '/en/products/real-time-metrics/' }
    }
  ]
</script>

<template>
  <MediaSplitStackSection :bands="bands" />
</template>
