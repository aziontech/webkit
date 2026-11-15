<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
</script>

<template>
  <CallToAction
    kind="announcement"
    eyebrow="Edge Runtime"
    title="WebAssembly now runs in every edge location."
  >
    Rolling out to every account through October —
    <a
      class="text-link"
      href="https://example.com/changelog/webassembly-rollout"
      >the rollout schedule</a
    >
    lists the date each region switches over.
    <template #actions>
      <Button label="Read the announcement" />
    </template>
  </CallToAction>
</template>
