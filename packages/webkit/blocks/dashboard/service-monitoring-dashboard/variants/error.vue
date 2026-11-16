<script setup lang="ts">
  import { sampleIdleServices } from '../sample'
  import ServiceMonitoringDashboard from '../service-monitoring-dashboard.vue'
</script>

<template>
  <ServiceMonitoringDashboard
    :services="sampleIdleServices"
    error="Check your connection and retry."
  />
</template>
