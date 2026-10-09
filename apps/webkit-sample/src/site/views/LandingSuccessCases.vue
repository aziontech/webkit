<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { SUCCESS_CASES_PAGE } from '../data/pages/success-cases.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="SUCCESS_CASES_PAGE" />
  </SiteLayout>
</template>
