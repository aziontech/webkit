<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { FINANCIAL_SERVICES_PAGE } from '../data/pages/financial-services.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="FINANCIAL_SERVICES_PAGE" />
  </SiteLayout>
</template>
