<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { DDOS_PROTECTION_PAGE } from '../data/pages/ddos-protection.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="DDOS_PROTECTION_PAGE" />
  </SiteLayout>
</template>
