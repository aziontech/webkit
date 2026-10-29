<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { CAREERS_HOME_PAGE } from '../data/pages/careers-home.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="CAREERS_HOME_PAGE" />
  </SiteLayout>
</template>
