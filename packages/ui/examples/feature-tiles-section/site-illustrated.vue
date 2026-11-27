<script setup>
  import Container from '@aziontech/ui/container'
  import FeatureTilesSection from '@aziontech/ui/feature-tiles-section'
  import Spacer from '@aziontech/ui/spacer'

  const tiles = [
    {
      illustration: 'no-idle-no-waste',
      scale: 0.7,
      title: 'No idle. No waste',
      description:
        'Azion bills for actual consumption. You pay for what your applications use, not for infrastructure sitting idle waiting for demand.'
    },
    {
      illustration: 'traffic-and-cost-bar-chart',
      scale: 1,
      title: 'Stay in control',
      description:
        'Scale without losing control of your bill. Track consumption, set spending limits, and keep costs predictable as your applications grow.'
    },
    {
      illustration: 'chat-and-headset-tiles',
      scale: 0.8,
      title: 'White-glove when it matters',
      description:
        'Self-service when you want it, experts when you need them. Azion specialists and partners help you build, migrate, optimize, and scale.'
    }
  ]
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <FeatureTilesSection
      variant="illustrated"
      anchor="why-pricing"
      :tiles="tiles"
    />

    <Spacer hatch />
  </Container>
</template>
