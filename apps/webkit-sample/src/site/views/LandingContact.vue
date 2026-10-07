<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { CONTACT_PAGE } from '../data/pages/contact.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="CONTACT_PAGE" />
  </SiteLayout>
</template>
