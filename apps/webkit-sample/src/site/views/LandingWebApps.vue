<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { WEB_APPS_PAGE } from '../data/pages/web-apps.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="WEB_APPS_PAGE" />
  </SiteLayout>
</template>
