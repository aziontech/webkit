<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { SOLUTIONS_PAGE } from '../data/pages/solutions.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="SOLUTIONS_PAGE" />
  </SiteLayout>
</template>
