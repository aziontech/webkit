<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { CONTACT_UNDER_ATTACK_PAGE } from '../data/pages/contact-under-attack.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="CONTACT_UNDER_ATTACK_PAGE" />
  </SiteLayout>
</template>
