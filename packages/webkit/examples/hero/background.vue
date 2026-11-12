<script setup>
  import Hero from '@aziontech/webkit/hero'
  import TextureMaterial from '@aziontech/webkit/texture-material'
</script>

<template>
  <Hero max-width="site">
    <template #background>
      <TextureMaterial
        kind="dots"
        size="medium"
      />
    </template>

    <Hero.Title
      centered
      eyebrow="Infrastructure"
      eyebrow-prefix="//"
      title="A global network built for fast applications"
    />
  </Hero>
</template>
