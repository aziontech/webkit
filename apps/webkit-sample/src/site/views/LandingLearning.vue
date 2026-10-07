<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { LEARNING_PAGE } from '../data/pages/learning.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="LEARNING_PAGE" />
  </SiteLayout>
</template>
