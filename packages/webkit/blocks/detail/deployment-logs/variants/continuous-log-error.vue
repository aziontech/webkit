<script setup lang="ts">
  import DeploymentLogs from '../deployment-logs.vue'
  import { sampleFailedSteps } from '../sample'
</script>

<template>
  <DeploymentLogs
    :steps="sampleFailedSteps"
    duration="42s"
    view="complete"
  />
</template>
