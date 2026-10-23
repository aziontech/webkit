<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { ABOUT_PAGE } from '../data/pages/about.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="ABOUT_PAGE" />
  </SiteLayout>
</template>
