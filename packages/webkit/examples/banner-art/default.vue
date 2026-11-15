<script setup>
  import BannerArt from '@aziontech/webkit/banner-art'
  import Hero from '@aziontech/webkit/hero-root'
  import HeroTitle from '@aziontech/webkit/hero-title'
</script>

<template>
  <Hero
    variant="band"
    size="large"
    max-width="site"
  >
    <template #background>
      <BannerArt variant="map" />
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
