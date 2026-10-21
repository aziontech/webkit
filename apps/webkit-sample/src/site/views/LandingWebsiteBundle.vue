<script setup>
  import SiteLayout from '../components/SiteLayout.vue'
  import { WEBSITE_BUNDLE_PAGE } from '../data/pages/website-bundle.js'
  import { HERO_SECTIONS } from '../ui/sections'
  import SitePage from '../ui/SitePage.vue'

  const isHero = (entry) => HERO_SECTIONS.has(entry.section)

  const runs = WEBSITE_BUNDLE_PAGE.reduce((all, entry) => {
    const last = all.at(-1)
    if (!last || (isHero(entry) && !last.every(isHero))) all.push([entry])
    else last.push(entry)
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
