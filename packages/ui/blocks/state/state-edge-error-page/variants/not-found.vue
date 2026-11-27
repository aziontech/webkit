<script setup lang="ts">
  import StateEdgeErrorPage, { type StateEdgeErrorPagePath } from '../state-edge-error-page.vue'

  const path: StateEdgeErrorPagePath = {
    visitor: { status: 'Working', severity: 'success' },
    azion: { status: 'Working', severity: 'success' },
    application: { status: 'Not found', severity: 'warning' }
  }
</script>

<template>
  <StateEdgeErrorPage
    :code="404"
    reason="Not found"
    title="This page does not exist"
    cause="The site's application has no page at this address. The link may be old, or the address may have a typo."
    advice="Check the address, or go to the site's home page and look for the page from there."
    :path="path"
    recovery="home"
  />
</template>
