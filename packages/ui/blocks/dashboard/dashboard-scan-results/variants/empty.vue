<script setup lang="ts">
  import DashboardScanResults from '../dashboard-scan-results.vue'
  import { sampleEmptySummary } from '../sample'
</script>

<template>
  <DashboardScanResults
    :summary="sampleEmptySummary"
    :verdict-split="[]"
    :sources="[]"
    :submissions="[]"
  />
</template>
