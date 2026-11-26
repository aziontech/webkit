<script setup>
  import Container from '@aziontech/webkit/container'
  import HeroSection from '@aziontech/webkit/hero-section'
  import Spacer from '@aziontech/webkit/spacer'

  const primaryAction = {
    label: 'Start for free',
    href: 'https://console.azion.com/signup/'
  }

  const secondaryAction = {
    label: 'Docs',
    href: 'https://www.azion.com/en/documentation/',
    trailing: true
  }
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <HeroSection
      variant="title-band"
      size="large"
      eyebrow="Cache"
      title="Deliver content fast, worldwide"
      description="Serve cached content close to users. Cut origin load and keep applications fast during traffic spikes."
      :primary-action="primaryAction"
      :secondary-action="secondaryAction"
    />

    <Spacer hatch />
  </Container>
</template>
