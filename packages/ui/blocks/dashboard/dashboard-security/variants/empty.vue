<script setup lang="ts">
  import DashboardSecurity from '../dashboard-security.vue'
  import { sampleEmptySummary } from '../sample'
</script>

<template>
  <DashboardSecurity
    :summary="sampleEmptySummary"
    :matched-requests="{ labels: [], series: [] }"
    :categories="[]"
    :countries="[]"
    :source-ips="[]"
    :attention="[]"
  />
</template>
