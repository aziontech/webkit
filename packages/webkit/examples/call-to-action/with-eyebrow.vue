<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
</script>

<template>
  <CallToAction
    eyebrow="Get started"
    title="Run your first application at the edge today."
    description="Deploy once and it runs in every location on the network — no servers to size, no credit card to start."
  >
    <template #actions>
      <Button label="Start for free" />
      <Button
        kind="outlined"
        label="Talk to a specialist"
      />
    </template>
  </CallToAction>
</template>
