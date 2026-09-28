<script setup>
  // Routed learning-page example: the Learning Center recreation, rendered inside the
  // segregated marketing shell (website nav + footer, no console sidebar) — the same pairing
  // every other landing example uses.
  import AzionLearning from '../components/AzionLearning.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionLearning />
  </SiteLayout>
</template>
