<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { KV_STORE_PAGE } from '../data/pages/kv-store.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="KV_STORE_PAGE" />
  </SiteLayout>
</template>
