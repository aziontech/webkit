<script setup lang="ts">
  import DashboardAlerts from '../dashboard-alerts.vue'
</script>

<template>
  <DashboardAlerts
    :kpis="{}"
    :labels="[]"
    :series="[]"
    :open-by-level="[]"
    :types="[]"
    :entities="[]"
    :alerts="[]"
  />
</template>
