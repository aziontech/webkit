<script setup lang="ts">
  import EdgeErrorPage, { type EdgeErrorPagePath } from '../edge-error-page.vue'

  const path: EdgeErrorPagePath = {
    visitor: { status: 'Working', severity: 'success' },
    edge: { status: 'Working', severity: 'success' },
    origin: { status: 'Error', severity: 'danger' }
  }
</script>

<template>
  <EdgeErrorPage
    :code="500"
    reason="Internal server error"
    title="The site's server ran into an error"
    cause="Azion's edge passed your request on, and the server that hosts this site answered with an error while building the page."
    advice="Try again in a moment. If it keeps happening, let the site owner know and quote the request ID below."
    :path="path"
  />
</template>
