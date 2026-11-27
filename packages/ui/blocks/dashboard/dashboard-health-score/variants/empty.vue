<script setup lang="ts">
  import { ref } from 'vue'

  import DashboardHealthScore, { type HealthScorePeriod } from '../dashboard-health-score.vue'

  const period = ref<HealthScorePeriod>('Last hour')
</script>

<template>
  <DashboardHealthScore
    v-model:period="period"
    :overall="{ score: null, band: null, cause: '', labels: [], series: [] }"
    :applications="[]"
    :locations="[]"
    :hourly="[]"
    :incidents="[]"
  />
</template>
