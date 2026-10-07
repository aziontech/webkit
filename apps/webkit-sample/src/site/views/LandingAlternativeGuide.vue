<script setup lang="ts">
  import { computed } from 'vue'

  import SiteLayout from '../components/SiteLayout.vue'
  import type { AlternativeGuide } from '../data/alternative-guides'
  import { alternativeGuidePage } from '../data/pages/alternative-guide'
  import SitePage from '../ui/SitePage.vue'

  interface Props {
    /** The guide this landing page renders. */
    guide: AlternativeGuide
  }

  const props = defineProps<Props>()

  const sections = computed(() => alternativeGuidePage(props.guide))
</script>

<template>
  <SiteLayout>
    <div
      lang="pt-BR"
      class="contents"
    >
      <SitePage :sections="sections" />
    </div>
  </SiteLayout>
</template>
