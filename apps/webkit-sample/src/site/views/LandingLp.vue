<script setup lang="ts">
  import { shallowRef, watch } from 'vue'

  import SiteLayout from '../components/SiteLayout.vue'
  import { type LandingPage, loadLandingPage } from '../data/pages/lp'
  import SitePage from '../ui/SitePage.vue'

  interface Props {
    /** The landing page's slug under /site/lp. */
    slug: string
  }

  const props = defineProps<Props>()

  const page = shallowRef<LandingPage | null>(null)

  watch(
    () => props.slug,
    async (slug) => {
      const loaded = await loadLandingPage(slug)
      // a newer navigation may have landed while this one was loading
      if (slug === props.slug) page.value = loaded
    },
    { immediate: true }
  )
</script>

<template>
  <SiteLayout>
    <div
      v-if="page"
      :lang="page.lang"
      class="contents"
    >
      <SitePage :sections="page.sections" />
    </div>
  </SiteLayout>
</template>
