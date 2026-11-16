<script setup>
  import g2Symbol from '@aziontech/webkit/assets/g2-symbol-color.svg'
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
      image: g2Symbol,
      imageAlt: 'G2',
      imageFramed: true,
      title: 'Recognized by the people who use it',
      description: 'Rated a Leader in Edge Computing by G2 users, season after season.',
      action: { label: 'Read the reviews', href: '/en/about-us/' }
    }
  ]
</script>

<template>
  <MediaSplitStackSection :bands="bands" />
</template>
