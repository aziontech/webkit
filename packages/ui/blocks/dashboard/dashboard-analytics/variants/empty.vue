<script setup lang="ts">
  import DashboardAnalytics from '../dashboard-analytics.vue'
</script>

<template>
  <DashboardAnalytics
    :kpis="{}"
    :intervals="[]"
    :request-series="[]"
    :status-series="[]"
    :countries="[]"
    :hosts="[]"
    :changes="{ requests: null, statusCodes: null }"
  />
</template>
