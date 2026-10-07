<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { COMPLIANCE_PAGE } from '../data/pages/compliance.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="COMPLIANCE_PAGE" />
  </SiteLayout>
</template>
