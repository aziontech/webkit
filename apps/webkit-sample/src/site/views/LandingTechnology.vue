<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { TECHNOLOGY_PAGE } from '../data/pages/technology.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="TECHNOLOGY_PAGE" />
  </SiteLayout>
</template>
