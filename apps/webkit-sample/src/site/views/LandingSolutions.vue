<script setup>
  // Routed solutions-page example: the solutions index, rendered inside the segregated
  // marketing shell (website nav + footer, no console sidebar) — the same pairing every
  // other landing example uses.
  import AzionSolutions from '../components/AzionSolutions.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionSolutions />
  </SiteLayout>
</template>
