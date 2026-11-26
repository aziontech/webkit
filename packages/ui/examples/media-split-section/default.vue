<script setup>
  import MediaSplitSection from '@aziontech/ui/media-split-section'

  const DESCRIPTION =
    'Quality, Drive, Accountability, and Innovation. They guide how we work every ' +
    'day: we set high standards and measure what we deliver, take on hard problems with persistence, own our commitments and mistakes, and use AI and new technology to solve problems in ' +
    'new ways. Together, they help us earn and keep the trust of our customers.'
</script>

<template>
  <MediaSplitSection
    eyebrow="Our values"
    title="Four values shape every role at Azion"
    :description="DESCRIPTION"
    size="large"
    :scene="{ component: 'BrandGlobeScene' }"
  />
</template>
