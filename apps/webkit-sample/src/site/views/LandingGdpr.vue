<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { GDPR_PAGE } from '../data/pages/gdpr.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="GDPR_PAGE" />
  </SiteLayout>
</template>
