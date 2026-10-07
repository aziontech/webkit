<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { AI_INFERENCE_PAGE } from '../data/pages/ai-inference.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="AI_INFERENCE_PAGE" />
  </SiteLayout>
</template>
