<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { WORKLOADS_PAGE } from '../data/pages/workloads.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="WORKLOADS_PAGE" />
  </SiteLayout>
</template>
