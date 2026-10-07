<script setup lang="ts">
  import AzionAlternativeGuide from '../components/AzionAlternativeGuide.vue'
  import SiteLayout from '../components/SiteLayout.vue'
  import type { AlternativeGuide } from '../data/alternative-guides'

  interface Props {
    /** The guide this landing page renders. */
    guide: AlternativeGuide
  }

  defineProps<Props>()
</script>

<template>
  <SiteLayout>
    <AzionAlternativeGuide :guide="guide" />
  </SiteLayout>
</template>
