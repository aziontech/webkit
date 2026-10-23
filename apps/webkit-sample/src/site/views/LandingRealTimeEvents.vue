<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { REAL_TIME_EVENTS_PAGE } from '../data/pages/real-time-events.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="REAL_TIME_EVENTS_PAGE" />
  </SiteLayout>
</template>
