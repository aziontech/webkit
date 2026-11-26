<script setup>
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
</script>

<template>
  <CallToAction
    title="Run your first application at the edge today."
    description="Deploy once and it runs in every location on the network — no servers to size, no credit card to start."
  >
    <template #actions>
      <Button label="Start for free" />
      <Button
        variant="outline"
        label="Talk to sales"
      />
    </template>
  </CallToAction>
</template>
