<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { BOT_MANAGER_PAGE } from '../data/pages/bot-manager.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="BOT_MANAGER_PAGE" />
  </SiteLayout>
</template>
