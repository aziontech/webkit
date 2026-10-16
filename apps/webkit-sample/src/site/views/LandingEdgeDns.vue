<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { EDGE_DNS_PAGE } from '../data/pages/edge-dns.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="EDGE_DNS_PAGE" />
  </SiteLayout>
</template>
