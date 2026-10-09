<script setup lang="ts">
  import { computed } from 'vue'

  import SiteLayout from '../components/SiteLayout.vue'
  import { successCasePostPage } from '../data/pages/success-case-post.js'
  import SitePage from '../ui/SitePage.vue'

  interface Props {
    /** The story's slug. */
    slug: string
  }

  const props = defineProps<Props>()

  const sections = computed(() => successCasePostPage(props.slug))
</script>

<template>
  <SiteLayout>
    <SitePage
      :key="slug"
      :sections="sections"
    />
  </SiteLayout>
</template>
