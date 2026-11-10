<script setup>
  import Banner from '@aziontech/webkit/banner'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Banner
    eyebrow="Edge Runtime"
    title="WebAssembly now runs in every edge location."
    description="Ship the same binary everywhere — no regions to pick and no cold starts to budget for."
  >
    <template #actions>
      <Button label="Read the announcement" />
    </template>
  </Banner>
</template>
