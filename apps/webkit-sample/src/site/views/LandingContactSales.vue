<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { CONTACT_SALES_PAGE } from '../data/pages/contact-sales.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="CONTACT_SALES_PAGE" />
  </SiteLayout>
</template>
