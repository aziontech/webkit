<script setup lang="ts">
  import StateEdgeErrorPage, { type StateEdgeErrorPagePath } from '../state-edge-error-page.vue'

  const path: StateEdgeErrorPagePath = {
    visitor: { status: 'Working', severity: 'success' },
    azion: { status: 'Working', severity: 'success' },
    application: { status: 'Timed out', severity: 'danger' }
  }
</script>

<template>
  <StateEdgeErrorPage
    :code="504"
    reason="Gateway timeout"
    title="The site's application took too long to answer"
    cause="Azion reached the application that serves this site, but it did not send a response in time."
    advice="Try again in a few minutes; the application may be busy. If it keeps happening, let the site owner know and quote the request ID below."
    :path="path"
  />
</template>
