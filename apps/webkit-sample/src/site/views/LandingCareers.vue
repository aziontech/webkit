<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { CAREERS_JOBS_PAGE } from '../data/pages/careers-jobs.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="CAREERS_JOBS_PAGE" />
  </SiteLayout>
</template>
