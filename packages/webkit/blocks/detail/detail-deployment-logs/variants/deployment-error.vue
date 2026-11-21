<script setup lang="ts">
  import DeploymentPage from '../parts/deployment-page.vue'
  import { sampleDeploymentFailedSteps } from '../sample'
</script>

<template>
  <DeploymentPage
    severity="danger"
    message="A rule with the same behavior is already bound to this service, so the manifest was refused. Nothing was published, and the service keeps serving its previous deployment."
    redeployable
    author="John Smith"
    created-at="November 06, 2026, 10:30:58 AM"
    created-ago="1 hour ago"
    :status="{ severity: 'danger', label: 'Error' }"
    duration="48s"
    environment="Preview"
    :trigger="{ label: 'Console', icon: 'az az-desktop', command: 'Console (UI)' }"
    storage-prefix="20260730140211"
    :steps="sampleDeploymentFailedSteps"
  />
</template>
