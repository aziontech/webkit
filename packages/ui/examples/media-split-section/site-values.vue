<script setup>
  import Container from '@aziontech/webkit/container'
  import MediaSplitSection from '@aziontech/webkit/media-split-section'
  import Spacer from '@aziontech/webkit/spacer'

  const scene = {
    component: 'BrandGlobeScene'
  }

  const DESCRIPTION =
    'Quality, Drive, Accountability, and Innovation. They guide how we work every ' +
    'day: we set high standards and measure what we deliver, take on hard problems with persistence, own our commitments and mistakes, and use AI and new technology to solve problems in ' +
    'new ways. Together, they help us earn and keep the trust of our customers.'
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <MediaSplitSection
      eyebrow="Our values"
      title="Four values shape every role at Azion"
      :description="DESCRIPTION"
      size="large"
      :scene="scene"
    />

    <Spacer hatch />
  </Container>
</template>
