<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { PARTNERS_PAGE } from '../data/pages/partners.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="PARTNERS_PAGE" />
  </SiteLayout>
</template>
