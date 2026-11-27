<script setup lang="ts">
  import ClosingCallToActionSection from '@aziontech/ui/closing-call-to-action-section'
  import HeroSection from '@aziontech/ui/hero-section'
  import MediaSplitStackSection, {
    type MediaSplitStackSectionBand
  } from '@aziontech/ui/media-split-stack-section'
  import NetworkSection, { type NetworkSectionBenefit } from '@aziontech/ui/network-section'

  const bands: MediaSplitStackSectionBand[] = [
    { title: 'Scene', description: 'A live scene.', scene: { component: 'SpinningGlobe' } },
    { title: 'Widget', description: 'The console.', widget: 'data-stream-source' },
    { title: 'Art', description: 'An illustration.', illustration: 'ai-applications' }
  ]

  const picture: MediaSplitStackSectionBand = {
    title: 'Picture',
    description: 'An image.',
    // @ts-expect-error a band takes art from the illustration registry, not a picture URL
    image: 'https://example.com/art.svg'
  }

  // @ts-expect-error a band needs a picture
  const bare: MediaSplitStackSectionBand = { title: 'Bare', description: 'No picture.' }

  const diagramScene: MediaSplitStackSectionBand = {
    title: 'Flow',
    description: 'A request flow.',
    // @ts-expect-error a request-flow diagram is not a media band scene
    scene: { component: 'Diagram' }
  }

  const benefits: NetworkSectionBenefit[] = [
    { title: 'Global', description: 'Everywhere.', icon: 'az az-globe' }
  ]

  // @ts-expect-error a network benefit carries its icon
  const plain: NetworkSectionBenefit = { title: 'Plain', description: 'No glyph.' }
</script>

<template>
  <HeroSection
    variant="title-band"
    title="Deliver content fast"
  />
  <!-- @vue-expect-error pixel-floor is removed -->
  <HeroSection
    variant="pixel-floor"
    title="Deliver content fast"
  />
  <ClosingCallToActionSection
    variant="panel"
    title="Build once. Run everywhere."
  />
  <!-- @vue-expect-error split is removed -->
  <ClosingCallToActionSection
    variant="split"
    title="Build once."
  />
  <MediaSplitStackSection :bands="[...bands, bare, diagramScene, picture]" />
  <NetworkSection
    variant="benefits"
    title="One network"
    :benefits="[...benefits, plain]"
  />
</template>
