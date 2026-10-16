<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { LOAD_BALANCER_PAGE } from '../data/pages/load-balancer.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="LOAD_BALANCER_PAGE" />
  </SiteLayout>
</template>
