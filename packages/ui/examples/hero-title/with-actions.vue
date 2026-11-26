<script setup>
  import Button from '@aziontech/webkit/button'
  import HeroTitle from '@aziontech/webkit/hero-title'
</script>

<template>
  <HeroTitle
    eyebrow="Edge platform"
    eyebrow-prefix="//"
    title-highlight="Build anything."
    title="Run it everywhere."
    description="Ship applications, security and observability from one platform."
  >
    <template #actions>
      <Button label="Start for free" />
      <Button
        variant="outline"
        label="Talk to sales"
      />
    </template>
  </HeroTitle>
</template>
