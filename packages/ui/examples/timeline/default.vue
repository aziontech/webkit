<script setup>
  import Timeline from '@aziontech/ui/timeline'
</script>

<template>
  <Timeline aria-label="Ticket activity">
    <Timeline.Item
      title="SLA breached"
      description="First response was due 2 hours after the ticket was opened."
      severity="danger"
      icon="az az-clock"
      actor="System"
      time="2026-11-21T15:30:00Z"
    />
    <Timeline.Item
      title="Status changed to Pending"
      actor="Sam Lee"
      time="2026-11-21T14:05:00Z"
    />
    <Timeline.Item
      title="Assigned to Sam Lee"
      actor="Jane Doe"
      time="2026-11-21T13:10:00Z"
      icon="az az-user-plus"
    >
      Moved from the Billing queue: the customer asks about a refund for a duplicate charge.
    </Timeline.Item>
    <Timeline.Item
      title="Ticket opened"
      description="Duplicate charge on the November invoice."
      actor="Alex Morgan"
      time="2026-11-21T13:00:00Z"
    />
  </Timeline>
</template>
