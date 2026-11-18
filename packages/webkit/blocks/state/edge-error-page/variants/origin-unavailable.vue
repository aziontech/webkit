<script setup lang="ts">
  import EdgeErrorPage, { type EdgeErrorPagePath } from '../edge-error-page.vue'

  const path: EdgeErrorPagePath = {
    visitor: { status: 'Working', severity: 'success' },
    edge: { status: 'Working', severity: 'success' },
    origin: { status: 'Unavailable', severity: 'warning' }
  }
</script>

<template>
  <EdgeErrorPage
    :code="503"
    reason="Service unavailable"
    title="This site is temporarily unavailable"
    cause="The server that hosts this site is down for maintenance or is too busy to answer right now."
    advice="Wait a few minutes and try again. The site usually comes back on its own; nothing you did caused this."
    :path="path"
  />
</template>
