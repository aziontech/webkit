<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { WEB_APPLICATION_FIREWALL_PAGE } from '../data/pages/web-application-firewall.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="WEB_APPLICATION_FIREWALL_PAGE" />
  </SiteLayout>
</template>
