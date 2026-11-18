<script setup lang="ts">
  import EdgeErrorPage, { type EdgeErrorPagePath } from '../edge-error-page.vue'

  const path: EdgeErrorPagePath = {
    visitor: { status: 'Working', severity: 'success' },
    azion: { status: 'Working', severity: 'success' },
    application: { status: 'Error', severity: 'danger' }
  }
</script>

<template>
  <EdgeErrorPage
    :code="500"
    reason="Internal server error"
    title="The site's application ran into an error"
    cause="Azion passed your request on, and the application that serves this site answered with an error while building the page."
    advice="Try again in a moment. If it keeps happening, let the site owner know and quote the request ID below."
    :path="path"
  />
</template>
