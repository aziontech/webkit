<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { NETWORK_SHIELD_PAGE } from '../data/pages/network-shield.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="NETWORK_SHIELD_PAGE" />
  </SiteLayout>
</template>
