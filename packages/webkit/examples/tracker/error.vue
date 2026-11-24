<script setup>
  import Tracker from '@aziontech/webkit/tracker'
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <Tracker
      aria-label="Application uptime, last 90 days"
      error="Uptime could not be loaded. Try again in a moment."
    />
  </div>
</template>
