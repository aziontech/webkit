<script setup>
  import Banner from '@aziontech/webkit/banner'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Banner
    eyebrow="Edge Runtime"
    title="WebAssembly now runs in every edge location."
  >
    <template #actions>
      <Button label="Read the announcement" />
    </template>
    <template #aside>
      Rolling out to every account through October —
      <a
        class="text-link"
        href="/changelog/webassembly-rollout"
        >the rollout schedule</a
      >
      lists the date each region switches over.
    </template>
  </Banner>
</template>
