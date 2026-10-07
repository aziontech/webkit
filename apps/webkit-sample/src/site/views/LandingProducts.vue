<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { PRODUCTS_PAGE } from '../data/pages/products.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="PRODUCTS_PAGE" />
  </SiteLayout>
</template>
