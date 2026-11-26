<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Timeline from '@aziontech/webkit/timeline'
</script>

<template>
  <Timeline aria-label="Audit trail of the production firewall">
    <Timeline.Item
      title="Rule “Block bad bots” enabled"
      actor="Jane Doe"
      time="2026-11-21T10:15:00Z"
    >
      <template #marker>
        <Avatar
          label="Jane Doe"
          size="small"
        />
      </template>
    </Timeline.Item>
    <Timeline.Item
      title="API key rotated"
      actor="Sam Lee"
      time="2026-11-20T09:30:00Z"
    >
      <template #marker>
        <Avatar
          label="Sam Lee"
          size="small"
        />
      </template>
    </Timeline.Item>
    <Timeline.Item
      title="Firewall created"
      actor="Priya Patel"
      time="2026-11-18T08:00:00Z"
    >
      <template #marker>
        <Avatar
          label="Priya Patel"
          size="small"
        />
      </template>
    </Timeline.Item>
  </Timeline>
</template>
