<script setup>
  import Hero from '@aziontech/webkit/hero'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) lg:grid-cols-3">
    <Hero
      kind="screen"
      align="top"
      max-width="full"
      offset="75dvh"
    >
      <Hero.Title
        centered
        eyebrow="Top"
        eyebrow-prefix="//"
        title="Content at the top"
      />
    </Hero>
    <Hero
      kind="screen"
      align="center"
      max-width="full"
      offset="75dvh"
    >
      <Hero.Title
        centered
        eyebrow="Center"
        eyebrow-prefix="//"
        title="Content centered"
      />
    </Hero>
    <Hero
      kind="screen"
      align="bottom"
      max-width="full"
      offset="75dvh"
    >
      <Hero.Title
        centered
        eyebrow="Bottom"
        eyebrow-prefix="//"
        title="Content at the bottom"
      />
    </Hero>
  </div>
</template>
