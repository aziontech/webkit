<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { SQL_DATABASE_PAGE } from '../data/pages/sql-database.js'
  import SitePage from '../ui/SitePage.vue'
</script>

<template>
  <SiteLayout>
    <SitePage :sections="SQL_DATABASE_PAGE" />
  </SiteLayout>
</template>
