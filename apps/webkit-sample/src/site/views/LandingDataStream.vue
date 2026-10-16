<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { DATA_STREAM_PAGE } from '../data/pages/data-stream.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="DATA_STREAM_PAGE" />
  </SiteLayout>
</template>
