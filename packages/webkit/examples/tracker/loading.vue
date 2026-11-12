<script setup>
  import Tracker from '@aziontech/webkit/tracker'
</script>

<template>
  <div class="w-full max-w-(--container-xl) pt-(--spacing-xl)">
    <Tracker
      aria-label="Edge Application uptime, last 90 days"
      loading
    />
  </div>
</template>
