<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { SECURITY_PAGE } from '../data/pages/security.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="SECURITY_PAGE" />
  </SiteLayout>
</template>
