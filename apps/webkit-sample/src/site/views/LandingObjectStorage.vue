<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { OBJECT_STORAGE_PAGE } from '../data/pages/object-storage.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="OBJECT_STORAGE_PAGE" />
  </SiteLayout>
</template>
