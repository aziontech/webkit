<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <CallToAction
    variant="announcement"
    eyebrow="Edge Runtime"
    title="WebAssembly now runs in every data center."
  >
    Rolling out to every account through October —
    <Link
      inline
      href="https://example.com/changelog/webassembly-rollout"
      >the rollout schedule</Link
    >
    lists the date each region switches over.
    <template #actions>
      <Button label="Read the announcement" />
    </template>
  </CallToAction>
</template>
