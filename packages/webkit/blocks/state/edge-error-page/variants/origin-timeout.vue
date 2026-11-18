<script setup lang="ts">
  import EdgeErrorPage, { type EdgeErrorPagePath } from '../edge-error-page.vue'

  const path: EdgeErrorPagePath = {
    visitor: { status: 'Working', severity: 'success' },
    edge: { status: 'Working', severity: 'success' },
    origin: { status: 'Timed out', severity: 'danger' }
  }
</script>

<template>
  <EdgeErrorPage
    :code="504"
    reason="Gateway timeout"
    title="The site's server took too long to answer"
    cause="Azion's edge reached the server that hosts this site, but it did not send a response in time."
    advice="Try again in a few minutes; the server may be busy. If it keeps happening, let the site owner know and quote the request ID below."
    :path="path"
  />
</template>
