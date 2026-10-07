<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { CACHE_PAGE } from '../data/pages/cache.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="CACHE_PAGE" />
  </SiteLayout>
</template>
