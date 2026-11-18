<script setup lang="ts">
  import DetailDeploymentLogs from '../detail-deployment-logs.vue'
  import { sampleSucceededSteps } from '../sample'
</script>

<template>
  <DetailDeploymentLogs
    :steps="sampleSucceededSteps"
    duration="42s"
    view="complete"
  />
</template>
