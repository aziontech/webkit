<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { FUNCTIONS_PAGE } from '../data/pages/functions.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="FUNCTIONS_PAGE" />
  </SiteLayout>
</template>
