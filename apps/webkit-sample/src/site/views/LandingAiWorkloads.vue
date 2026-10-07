<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { AI_WORKLOADS_PAGE } from '../data/pages/ai-workloads.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="AI_WORKLOADS_PAGE" />
  </SiteLayout>
</template>
