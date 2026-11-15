<script setup>
  import Hero from '@aziontech/webkit/hero'
  import Texture from '@aziontech/webkit/texture'
</script>

<template>
  <Hero max-width="site">
    <template #background>
      <Texture
        variant="dots"
        size="medium"
      />
    </template>

    <Hero.Title
      align="center"
      eyebrow="Infrastructure"
      eyebrow-prefix="//"
      title="A global network built for fast applications"
    />
  </Hero>
</template>
