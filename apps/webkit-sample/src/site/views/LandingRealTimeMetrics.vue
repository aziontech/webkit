<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { REAL_TIME_METRICS_PAGE } from '../data/pages/real-time-metrics.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="REAL_TIME_METRICS_PAGE" />
  </SiteLayout>
</template>
