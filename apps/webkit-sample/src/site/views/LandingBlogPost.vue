<script setup lang="ts">
  import { computed } from 'vue'

  import SiteLayout from '../components/SiteLayout.vue'
  import { blogPostPage } from '../data/pages/blog-post.js'
  import SitePage from '../ui/SitePage.vue'

  interface Props {
    /** The article's slug. */
    slug: string
  }

  const props = defineProps<Props>()

  const sections = computed(() => blogPostPage(props.slug))
</script>

<template>
  <SiteLayout>
    <SitePage
      :key="slug"
      :sections="sections"
    />
  </SiteLayout>
</template>
