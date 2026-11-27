<script setup lang="ts">
  import DashboardAlerts from '../dashboard-alerts.vue'
</script>

<template>
  <DashboardAlerts
    :kpis="{
      open: { value: 0, delta: null },
      'critical-high': { value: 0, delta: null },
      raised: { value: 0, delta: null },
      'false-positives': { value: 0, delta: null }
    }"
    :labels="[]"
    :series="[]"
    :open-by-level="[]"
    :types="[]"
    :entities="[]"
    :alerts="[]"
  />
</template>
