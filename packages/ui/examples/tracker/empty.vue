<script setup>
  import Tracker from '@aziontech/ui/tracker'
</script>

<template>
  <div class="w-full max-w-(--container-xl) pt-(--spacing-xl)">
    <Tracker
      aria-label="Application uptime, last 90 days"
      :items="[]"
    />
  </div>
</template>
