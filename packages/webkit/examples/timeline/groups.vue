<script setup>
  import Timeline from '@aziontech/webkit/timeline'
</script>

<template>
  <Timeline aria-label="Deployment history of acme-store">
    <Timeline.Group label="November 21, 2026">
      <Timeline.Item
        title="Deployed to production"
        description="Release 2.4.1 is live on app.example.com."
        severity="success"
        icon="az az-circle-check"
        actor="Priya Patel"
        time="2026-11-21T16:20:00Z"
      />
      <Timeline.Item
        title="Deploy to production failed"
        description="The build step exited with code 1."
        severity="danger"
        icon="az az-circle-x"
        actor="Priya Patel"
        time="2026-11-21T15:45:00Z"
      />
    </Timeline.Group>
    <Timeline.Group label="November 20, 2026">
      <Timeline.Item
        title="Deployed to staging"
        description="Release 2.4.1 is ready to review on staging.example.com."
        severity="info"
        icon="az az-git-merge"
        actor="John Smith"
        time="2026-11-20T18:02:00Z"
      />
      <Timeline.Item
        title="Environment variable changed"
        description="API_BASE_URL now points to https://api.example.com."
        actor="John Smith"
        time="2026-11-20T17:40:00Z"
      />
    </Timeline.Group>
  </Timeline>
</template>
