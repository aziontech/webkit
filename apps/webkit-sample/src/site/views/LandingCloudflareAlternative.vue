<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { CLOUDFLARE_ALTERNATIVE_PAGE } from '../data/pages/cloudflare-alternative.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="CLOUDFLARE_ALTERNATIVE_PAGE" />
  </SiteLayout>
</template>
