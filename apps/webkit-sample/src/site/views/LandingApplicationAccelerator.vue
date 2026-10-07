<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { APPLICATION_ACCELERATOR_PAGE } from '../data/pages/application-accelerator.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="APPLICATION_ACCELERATOR_PAGE" />
  </SiteLayout>
</template>
