<script setup lang="ts">
  import StateEdgeErrorPage, { type StateEdgeErrorPagePath } from '../state-edge-error-page.vue'

  const path: StateEdgeErrorPagePath = {
    visitor: { status: 'Working', severity: 'success' },
    azion: { status: 'Rate limited', severity: 'warning' },
    application: { status: 'Not reached', severity: 'neutral' }
  }
</script>

<template>
  <StateEdgeErrorPage
    :code="429"
    reason="Too many requests"
    title="Too many requests from your connection"
    cause="Your connection sent more requests in a short time than this site allows, so Azion paused them for a moment."
    advice="Wait a minute, then try again. If you keep seeing this, contact the site owner and quote the request ID below."
    :path="path"
  />
</template>
