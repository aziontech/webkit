<script setup lang="ts">
  import DashboardServiceMonitoring from '../dashboard-service-monitoring.vue'
  import { sampleIdleServices } from '../sample'
</script>

<template>
  <DashboardServiceMonitoring
    :services="sampleIdleServices"
    error="Check your connection and retry."
  />
</template>
