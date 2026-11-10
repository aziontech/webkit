<script setup>
  import Message from '@aziontech/webkit/message'
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <Message severity="info">
      Requests are now served from 4 new edge locations.
      <a href="/docs/edge-locations">See the full list</a>.
    </Message>
    <Message severity="warning">
      This workload is close to its request limit. Review the
      <a href="/billing/usage">usage report</a>
      or
      <a href="/billing/plans">upgrade the plan</a>
      to avoid throttling.
    </Message>
  </div>
</template>
