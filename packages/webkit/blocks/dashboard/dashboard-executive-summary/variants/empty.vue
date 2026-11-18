<script setup lang="ts">
  import { ref } from 'vue'

  import DashboardExecutiveSummary from '../dashboard-executive-summary.vue'

  const quarter = ref('Q3 2025')
</script>

<template>
  <DashboardExecutiveSummary
    v-model:quarter="quarter"
    :kpis="{}"
    :goals="[]"
    :labels="[]"
    :trends="{}"
    :notes="[]"
  />
</template>
