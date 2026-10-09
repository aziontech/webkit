<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { BLOG_PAGE } from '../data/pages/blog.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="BLOG_PAGE" />
  </SiteLayout>
</template>
