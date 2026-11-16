<script setup lang="ts">
  import DeploymentLogs from '../deployment-logs.vue'
  import { sampleSucceededSteps } from '../sample'
</script>

<template>
  <DeploymentLogs
    :steps="sampleSucceededSteps"
    duration="42s"
  />
</template>
