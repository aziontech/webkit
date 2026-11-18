<script setup lang="ts">
  import SitePage, { type SitePageSection } from '@aziontech/webkit/site-page'

  import entry from './page-entry.json'

  const sections: SitePageSection[] = [entry]
</script>

<template>
  <SitePage :sections="sections" />
</template>
