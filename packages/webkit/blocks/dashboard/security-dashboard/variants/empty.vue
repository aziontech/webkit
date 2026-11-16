<script setup lang="ts">
  import { sampleEmptySummary } from '../sample'
  import SecurityDashboard from '../security-dashboard.vue'
</script>

<template>
  <SecurityDashboard
    :summary="sampleEmptySummary"
    :matched-requests="{ labels: [], series: [] }"
    :categories="[]"
    :countries="[]"
    :source-ips="[]"
    :attention="[]"
  />
</template>
