<script setup>
  import Alert from '@aziontech/ui/alert'
  import Link from '@aziontech/ui/link'
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-md)">
    <Alert severity="info">
      Requests are now served from 4 new data centers.
      <Link
        inline
        href="/docs/edge-locations"
        >See the full list</Link
      >.
    </Alert>
    <Alert severity="warning">
      This workload is close to its request limit. Review the
      <Link
        inline
        href="/billing/usage"
        >usage report</Link
      >
      or
      <Link
        inline
        href="/billing/plans"
        >upgrade the plan</Link
      >
      to avoid throttling.
    </Alert>
  </div>
</template>
