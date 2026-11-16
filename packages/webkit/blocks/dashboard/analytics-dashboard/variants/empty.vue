<script setup lang="ts">
  import AnalyticsDashboard from '../analytics-dashboard.vue'
</script>

<template>
  <AnalyticsDashboard
    :kpis="{}"
    :intervals="[]"
    :request-series="[]"
    :status-series="[]"
    :countries="[]"
    :hosts="[]"
    :changes="{ requests: null, statusCodes: null }"
  />
</template>
