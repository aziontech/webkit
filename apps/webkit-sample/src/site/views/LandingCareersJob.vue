<script setup>
  // Routed posting page: the azion.com job page rebuilt in this site's language, laid out the way
  // vercel.com lays its own out, inside the segregated marketing shell (website nav + footer, no
  // console sidebar) — the same pairing every other landing example uses. The posting is resolved
  // from the route's `id`, which is the source's own ATS id.
  import AzionCareersJob from '../components/AzionCareersJob.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionCareersJob />
  </SiteLayout>
</template>
