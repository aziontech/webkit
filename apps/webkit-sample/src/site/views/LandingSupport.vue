<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { SUPPORT_PAGE } from '../data/pages/support.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="SUPPORT_PAGE" />
  </SiteLayout>
</template>
