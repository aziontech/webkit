<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { PERFORMANCE_PAGE } from '../data/pages/performance.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="PERFORMANCE_PAGE" />
  </SiteLayout>
</template>
