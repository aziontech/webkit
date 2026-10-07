<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { HOME_PAGE } from '../data/pages/home.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout nav-overlay>
    <SitePage :sections="HOME_PAGE" />
  </SiteLayout>
</template>
