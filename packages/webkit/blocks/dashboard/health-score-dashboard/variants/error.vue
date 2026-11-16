<script setup lang="ts">
  import { ref } from 'vue'

  import HealthScoreDashboard, { type HealthScorePeriod } from '../health-score-dashboard.vue'

  const period = ref<HealthScorePeriod>('Last hour')
</script>

<template>
  <HealthScoreDashboard
    v-model:period="period"
    error="Check your connection and retry."
  />
</template>
