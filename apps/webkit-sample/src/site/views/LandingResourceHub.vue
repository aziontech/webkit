<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { RESOURCE_HUB_PAGE } from '../data/pages/resource-hub.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="RESOURCE_HUB_PAGE" />
  </SiteLayout>
</template>
