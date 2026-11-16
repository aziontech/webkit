<script setup lang="ts">
  import ProductionChecklist from '../production-checklist.vue'
  import { sampleCompletedSteps } from '../sample'
</script>

<template>
  <ProductionChecklist :steps="sampleCompletedSteps" />
</template>
