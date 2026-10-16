<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { WEBSITE_BUNDLE_PAGE } from '../data/pages/website-bundle.js'
  import SitePage from '../ui/SitePage.vue'
  import { HERO_SECTIONS } from '../ui/sections'

  const runs = WEBSITE_BUNDLE_PAGE.reduce((all, entry) => {
    if (HERO_SECTIONS.has(entry.section) || all.length === 0) all.push([entry])
    else all[all.length - 1].push(entry)
    return all
  }, [])
</script>

<template>
  <SiteLayout>
    <SitePage
      v-for="(run, index) in runs"
      :key="`${run[0].section}-${index}`"
      :sections="run"
    />
  </SiteLayout>
</template>
