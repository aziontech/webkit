<script setup>
  import RuntimeApiScene from '@aziontech/webkit/assets/runtime-api-scene'
  import HeroBand from '@aziontech/webkit/hero-band'
</script>

<template>
  <HeroBand
    kind="centered-band"
    eyebrow="Functions"
    title="Run JavaScript on every request"
    description="The Web APIs you already know, in scope inside every Function."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
  >
    <template #bottom>
      <RuntimeApiScene class="max-w-(--container-2xl)" />
    </template>
  </HeroBand>
</template>
