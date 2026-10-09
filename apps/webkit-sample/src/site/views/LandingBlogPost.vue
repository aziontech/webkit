<script setup>
  // Routed blog article, rebuilt from azion.com/en/blog/<slug> inside the marketing shell.
  // Keyed on the slug so moving between two articles remounts the scroll-spy and rail.
  import { useRoute } from 'vue-router'

  import AzionBlogPost from '../components/AzionBlogPost.vue'
  import SiteLayout from '../components/SiteLayout.vue'

  const route = useRoute()
</script>

<template>
  <SiteLayout>
    <AzionBlogPost :key="String(route.params.slug)" />
  </SiteLayout>
</template>
