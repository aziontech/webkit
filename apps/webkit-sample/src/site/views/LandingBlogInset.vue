<script setup>
  // The blog index with the inset post cards (framed image, date first, arrow corner), for
  // comparison with /site/blog. Same page, same data; only the card style differs.
  import AzionBlog from '../components/AzionBlog.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionBlog cards="inset" />
  </SiteLayout>
</template>
