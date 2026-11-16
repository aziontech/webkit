<script setup lang="ts">
  import { ref } from 'vue'

  import ExecutiveSummaryDashboard from '../executive-summary-dashboard.vue'

  const quarter = ref('Q3 2025')
</script>

<template>
  <ExecutiveSummaryDashboard
    v-model:quarter="quarter"
    error="Check your connection and retry."
  />
</template>
