<script setup>
  import Alert from '@aziontech/webkit/alert'
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <Alert severity="info">
      Requests are now served from 4 new edge locations.
      <a href="/docs/edge-locations">See the full list</a>.
    </Alert>
    <Alert severity="warning">
      This workload is close to its request limit. Review the
      <a href="/billing/usage">usage report</a>
      or
      <a href="/billing/plans">upgrade the plan</a>
      to avoid throttling.
    </Alert>
  </div>
</template>
