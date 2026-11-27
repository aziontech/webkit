<script setup>
  import Backdrop from '@aziontech/ui/backdrop'
  import Hero from '@aziontech/ui/hero-root'
  import HeroTitle from '@aziontech/ui/hero-title'
</script>

<template>
  <Hero
    variant="band"
    size="large"
    max-width="site"
  >
    <template #background>
      <Backdrop variant="map" />
    </template>
    <HeroTitle
      eyebrow="Network"
      eyebrow-prefix="//"
      title="Close to every user, by default"
      description="Requests land on the nearest location and stay there."
      size="large"
    />
  </Hero>
</template>
