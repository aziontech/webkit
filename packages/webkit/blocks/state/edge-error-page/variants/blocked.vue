<script setup lang="ts">
  import EdgeErrorPage, { type EdgeErrorPagePath } from '../edge-error-page.vue'

  const path: EdgeErrorPagePath = {
    visitor: { status: 'Working', severity: 'success' },
    azion: { status: 'Blocked', severity: 'warning' },
    application: { status: 'Not reached', severity: 'neutral' }
  }
</script>

<template>
  <EdgeErrorPage
    :code="403"
    reason="Forbidden"
    title="This site's firewall blocked your request"
    cause="The site's owner set rules on Azion to protect the site, and your request matched one of them, so it never reached the site's application."
    advice="If you think this is a mistake, contact the site owner and quote the request ID below. Turning off a VPN or a browser extension may also help."
    :path="path"
    recovery="home"
  />
</template>
