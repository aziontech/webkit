<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { APPLICATIONS_PAGE } from '../data/pages/applications.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="APPLICATIONS_PAGE" />
  </SiteLayout>
</template>
