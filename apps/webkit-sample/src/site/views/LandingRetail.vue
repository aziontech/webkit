<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { RETAIL_PAGE } from '../data/pages/retail.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="RETAIL_PAGE" />
  </SiteLayout>
</template>
