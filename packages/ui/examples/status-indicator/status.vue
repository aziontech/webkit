<script setup>
  import StatusIndicator from '@aziontech/ui/status-indicator'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-3)">
    <StatusIndicator
      severity="success"
      label="Healthy"
    />
    <StatusIndicator
      severity="info"
      label="Updating"
    />
    <StatusIndicator
      severity="neutral"
      label="Stopped"
    />
    <StatusIndicator
      severity="warning"
      label="Degraded"
    />
    <StatusIndicator
      severity="danger"
      label="Failed"
    />
  </div>
</template>
