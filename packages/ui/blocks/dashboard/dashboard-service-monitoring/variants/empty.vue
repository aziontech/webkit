<script setup lang="ts">
  import DashboardServiceMonitoring from '../dashboard-service-monitoring.vue'
  import { sampleIdleServices } from '../sample'
</script>

<template>
  <DashboardServiceMonitoring
    :services="sampleIdleServices"
    :latency="{ labels: [], series: [] }"
    :error-rate="{ labels: [], series: [] }"
    :alerts="[]"
  />
</template>
