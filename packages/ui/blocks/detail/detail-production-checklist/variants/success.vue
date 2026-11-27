<script setup lang="ts">
  import DetailProductionChecklist from '../detail-production-checklist.vue'
  import { sampleCompletedSteps } from '../sample'
</script>

<template>
  <DetailProductionChecklist :steps="sampleCompletedSteps" />
</template>
