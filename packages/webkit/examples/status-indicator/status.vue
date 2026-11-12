<script setup>
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-3)">
    <StatusIndicator
      severity="success"
      label="Status"
    />
    <StatusIndicator
      severity="info"
      label="Status"
    />
    <StatusIndicator
      severity="neutral"
      label="Status"
    />
    <StatusIndicator
      severity="warning"
      label="Status"
    />
    <StatusIndicator
      severity="alt"
      label="Status"
    />
    <StatusIndicator
      severity="danger"
      label="Status"
    />
  </div>
</template>
