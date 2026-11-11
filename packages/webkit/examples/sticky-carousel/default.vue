<script setup>
  import StickyCarousel from '@aziontech/webkit/sticky-carousel'

  const items = [
    { title: 'One platform', description: 'Code, data and security deploy together.' },
    { title: 'No regions', description: 'Everything runs everywhere by default.' },
    { title: 'No cold starts', description: 'Isolates start in under a millisecond.' },
    { title: 'Open standards', description: 'Web APIs, so code moves in and out freely.' },
    { title: 'Predictable bills', description: 'Pay for requests, not for idle servers.' },
    { title: 'Support that answers', description: 'Engineers on call, not ticket queues.' }
  ]
</script>

<template>
  <StickyCarousel
    eyebrow="Why teams move"
    title="Six reasons teams run on one platform"
    description="Scroll the page: the row pins under the header and slides until the last card is in view."
    :items="items"
  />
</template>
