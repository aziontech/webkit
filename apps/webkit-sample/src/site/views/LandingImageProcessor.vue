<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { IMAGE_PROCESSOR_PAGE } from '../data/pages/image-processor.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="IMAGE_PROCESSOR_PAGE" />
  </SiteLayout>
</template>
