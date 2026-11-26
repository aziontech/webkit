<script setup lang="ts">
  import StateEdgeErrorPage, { type StateEdgeErrorPagePath } from '../state-edge-error-page.vue'

  const path: StateEdgeErrorPagePath = {
    visitor: { status: 'Working', severity: 'success' },
    azion: { status: 'Working', severity: 'success' },
    application: { status: 'Unavailable', severity: 'warning' }
  }
</script>

<template>
  <StateEdgeErrorPage
    :code="503"
    reason="Service unavailable"
    title="This site is temporarily unavailable"
    cause="The application that serves this site is down for maintenance or is too busy to answer right now."
    advice="Wait a few minutes and try again. The site usually comes back on its own; nothing you did caused this."
    :path="path"
  />
</template>
