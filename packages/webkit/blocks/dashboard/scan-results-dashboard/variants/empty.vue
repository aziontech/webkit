<script setup lang="ts">
  import { sampleEmptySummary } from '../sample'
  import ScanResultsDashboard from '../scan-results-dashboard.vue'
</script>

<template>
  <ScanResultsDashboard
    :summary="sampleEmptySummary"
    :verdict-split="[]"
    :sources="[]"
    :submissions="[]"
  />
</template>
