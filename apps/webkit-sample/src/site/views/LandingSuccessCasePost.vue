<script setup>
  // Routed success story, rebuilt from azion.com/en/success-case/<slug> inside the marketing
  // shell. Keyed on the slug so moving between two stories remounts the scroll-spy and rail.
  import { useRoute } from 'vue-router'

  import AzionSuccessCasePost from '../components/AzionSuccessCasePost.vue'
  import SiteLayout from '../components/SiteLayout.vue'

  const route = useRoute()
</script>

<template>
  <SiteLayout>
    <AzionSuccessCasePost :key="String(route.params.slug)" />
  </SiteLayout>
</template>
