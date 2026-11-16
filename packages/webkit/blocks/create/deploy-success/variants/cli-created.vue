<script setup lang="ts">
  import DeploySuccess from '../deploy-success.vue'
  import { sampleCliNextSteps, sampleCliResources } from '../sample'
</script>

<template>
  <DeploySuccess
    title="Resource created"
    description="The resource is ready. Nothing serves it yet. Deploy it from Next steps."
    :deployment="null"
    :resources="sampleCliResources"
    :next-steps="sampleCliNextSteps"
    get-started="analytics-app"
  />
</template>
