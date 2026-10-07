<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { VERCEL_ALTERNATIVE_PAGE } from '../data/pages/vercel-alternative.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="VERCEL_ALTERNATIVE_PAGE" />
  </SiteLayout>
</template>
