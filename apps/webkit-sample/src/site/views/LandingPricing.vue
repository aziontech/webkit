<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { PRICING_PAGE } from '../data/pages/pricing.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="PRICING_PAGE" />
  </SiteLayout>
</template>
