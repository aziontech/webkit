<script setup>
  import ConsoleApplicationScene from '@aziontech/ui/assets/console-application-scene'
  import Container from '@aziontech/ui/container'
  import HeroSection from '@aziontech/ui/hero-section'
  import Spacer from '@aziontech/ui/spacer'

  const primaryAction = {
    label: 'Start for free',
    href: 'https://console.azion.com/signup/'
  }
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <HeroSection
      variant="center"
      eyebrow="Applications"
      title="Build, route and secure from one page"
      description="Every application setting lives on one page of the console."
      :primary-action="primaryAction"
    >
      <template #bottom>
        <ConsoleApplicationScene :width="760" />
      </template>
    </HeroSection>

    <Spacer hatch />
  </Container>
</template>
