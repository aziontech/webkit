<script setup lang="ts">
  import DeploymentPage from '../parts/deployment-page.vue'
  import { sampleDeploymentSteps } from '../sample'
</script>

<template>
  <DeploymentPage
    severity="success"
    message="Published to the production environment of web-app in 1m 1s. Live at https://web-app-mh2saq.example.com."
    live
    author="Taylor Reed"
    created-at="October 29, 2026, 11:30:58 AM"
    created-ago="1 week ago"
    :status="{ severity: 'success', label: 'Ready' }"
    duration="1m 1s"
    environment="Production"
    :trigger="{ label: 'CLI', icon: 'az az-code', command: 'platform deploy --auto --local' }"
    storage-prefix="20260722112530"
    :steps="sampleDeploymentSteps"
  />
</template>
