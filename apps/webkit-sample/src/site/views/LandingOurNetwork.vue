<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { OUR_NETWORK_PAGE } from '../data/pages/our-network.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="OUR_NETWORK_PAGE" />
  </SiteLayout>
</template>
