<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { AI_GATEWAY_PAGE } from '../data/pages/ai-gateway.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="AI_GATEWAY_PAGE" />
  </SiteLayout>
</template>
