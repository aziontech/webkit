<script setup lang="ts">
  import DetailDeploymentLogs from '../detail-deployment-logs.vue'
  import { sampleFailedSteps } from '../sample'
</script>

<template>
  <DetailDeploymentLogs
    :steps="sampleFailedSteps"
    duration="42s"
  />
</template>
