<script setup>
  import FeatureTiles from '@aziontech/webkit/feature-tiles'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const tiles = [
    {
      illustration: 'no-idle-no-waste',
      scale: 0.7,
      title: 'No idle. No waste',
      description:
        'Azion bills for actual consumption. You pay for what your applications use, not for infrastructure sitting idle waiting for demand.'
    },
    {
      illustration: 'stay-in-control',
      scale: 1,
      title: 'Stay in control',
      description:
        'Scale without losing control of your bill. Track consumption, set spending limits, and keep costs predictable as your applications grow.'
    },
    {
      illustration: 'white-gloves-when-it-matters',
      scale: 0.8,
      title: 'White-glove when it matters',
      description:
        'Self-service when you want it, experts when you need them. Azion specialists and partners help you build, migrate, optimize, and scale.'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <FeatureTiles
      kind="illustrated"
      anchor="why-pricing"
      :tiles="tiles"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
