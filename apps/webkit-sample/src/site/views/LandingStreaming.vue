<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { STREAMING_PAGE } from '../data/pages/streaming.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="STREAMING_PAGE" />
  </SiteLayout>
</template>
