<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { RECOGNITIONS_PAGE } from '../data/pages/recognitions.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="RECOGNITIONS_PAGE" />
  </SiteLayout>
</template>
