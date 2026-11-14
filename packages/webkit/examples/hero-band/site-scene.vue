<script setup>
  import ConsoleApplicationScene from '@aziontech/webkit/assets/console-application-scene'
  import HeroBand from '@aziontech/webkit/hero-band'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const primaryAction = {
    label: 'Start for free',
    href: 'https://console.azion.com/signup/'
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <HeroBand
      kind="centered"
      eyebrow="Applications"
      title="Build, route and secure from one page"
      description="Every application setting lives on one page of the console."
      :primary-action="primaryAction"
    >
      <template #bottom>
        <ConsoleApplicationScene :width="760" />
      </template>
    </HeroBand>

    <SectionGap hatch />
  </SectionContainer>
</template>
