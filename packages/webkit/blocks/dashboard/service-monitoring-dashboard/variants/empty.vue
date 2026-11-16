<script setup lang="ts">
  import { sampleIdleServices } from '../sample'
  import ServiceMonitoringDashboard from '../service-monitoring-dashboard.vue'
</script>

<template>
  <ServiceMonitoringDashboard
    :services="sampleIdleServices"
    :latency="{ labels: [], series: [] }"
    :error-rate="{ labels: [], series: [] }"
    :alerts="[]"
  />
</template>
