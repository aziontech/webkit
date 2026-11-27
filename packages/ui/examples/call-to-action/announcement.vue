<script setup>
  import Button from '@aziontech/ui/button'
  import CallToAction from '@aziontech/ui/call-to-action'
  import Link from '@aziontech/ui/link'
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
