<script setup lang="ts">
  import DeploymentPage from '../parts/deployment-page.vue'
</script>

<template>
  <DeploymentPage
    severity="info"
    message="Queued for the production environment of web-app. The deployment starts as soon as a runner is free."
    author="Taylor Reed"
    created-at="November 5, 2026, 9:12:40 AM"
    created-ago="2 minutes ago"
    :status="{ severity: 'warning', label: 'Queued' }"
    environment="Production"
    :trigger="{ label: 'CLI', icon: 'az az-code', command: 'platform deploy --auto --local' }"
    storage-prefix="20261105091240"
  />
</template>
