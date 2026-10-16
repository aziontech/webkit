<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { FIREWALL_PAGE } from '../data/pages/firewall.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="FIREWALL_PAGE" />
  </SiteLayout>
</template>
