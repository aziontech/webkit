<script setup>
  import MediaSplitBand from '@aziontech/webkit/media-split-band'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const scene = {
    component: 'BrandGlobeScene'
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <MediaSplitBand
      eyebrow="Our values"
      title="Four values shape every role at Azion"
      description="Quality, Drive, Accountability, and Innovation. They guide how we work every day: we set high standards and measure what we deliver, take on hard problems with persistence, own our commitments and mistakes, and use AI and new technology to solve problems in new ways. Together, they help us earn and keep the trust of our customers."
      size="large"
      :scene="scene"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
