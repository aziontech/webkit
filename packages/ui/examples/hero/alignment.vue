<script setup>
  import Hero from '@aziontech/webkit/hero'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-md) lg:grid-cols-3">
    <Hero
      variant="screen"
      align="start"
      max-width="full"
      offset="40dvh"
    >
      <Hero.Title
        align="center"
        eyebrow="Top"
        eyebrow-prefix="//"
        title="Content at the top"
      />
    </Hero>
    <Hero
      variant="screen"
      align="center"
      max-width="full"
      offset="40dvh"
    >
      <Hero.Title
        align="center"
        eyebrow="Center"
        eyebrow-prefix="//"
        title="Content centered"
      />
    </Hero>
    <Hero
      variant="screen"
      align="end"
      max-width="full"
      offset="40dvh"
    >
      <Hero.Title
        align="center"
        eyebrow="Bottom"
        eyebrow-prefix="//"
        title="Content at the bottom"
      />
    </Hero>
  </div>
</template>
