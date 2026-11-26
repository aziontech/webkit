<script setup>
  import Timeline from '@aziontech/webkit/timeline'
</script>

<template>
  <div class="grid w-full gap-(--spacing-lg) md:grid-cols-2">
    <Timeline aria-label="Severities with dot markers">
      <Timeline.Item
        title="Tag added: billing"
        severity="neutral"
        time="2026-11-21T13:00:00Z"
      />
      <Timeline.Item
        title="Priority raised to high"
        severity="info"
        time="2026-11-21T13:10:00Z"
      />
      <Timeline.Item
        title="Ticket solved"
        severity="success"
        time="2026-11-21T13:20:00Z"
      />
      <Timeline.Item
        title="SLA due in 30 minutes"
        severity="warning"
        time="2026-11-21T13:30:00Z"
      />
      <Timeline.Item
        title="SLA breached"
        severity="danger"
        time="2026-11-21T13:40:00Z"
      />
    </Timeline>
    <Timeline aria-label="Severities with icon markers">
      <Timeline.Item
        title="Tag added: billing"
        severity="neutral"
        icon="az az-tag"
        time="2026-11-21T13:00:00Z"
      />
      <Timeline.Item
        title="Priority raised to high"
        severity="info"
        icon="az az-info"
        time="2026-11-21T13:10:00Z"
      />
      <Timeline.Item
        title="Ticket solved"
        severity="success"
        icon="az az-circle-check"
        time="2026-11-21T13:20:00Z"
      />
      <Timeline.Item
        title="SLA due in 30 minutes"
        severity="warning"
        icon="az az-triangle-alert"
        time="2026-11-21T13:30:00Z"
      />
      <Timeline.Item
        title="SLA breached"
        severity="danger"
        icon="az az-circle-x"
        time="2026-11-21T13:40:00Z"
      />
    </Timeline>
  </div>
</template>
