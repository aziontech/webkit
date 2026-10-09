<script setup>
  // Routed landing-page example: the azion.com/en/blog index recreated inside the marketing
  // shell (website nav + footer, no console sidebar).
  import AzionBlog from '../components/AzionBlog.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionBlog />
  </SiteLayout>
</template>
