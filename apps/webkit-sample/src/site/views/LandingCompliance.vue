<script setup>
  // Routed compliance-page example: the azion.com Compliance page recreation, rendered inside
  // the segregated marketing shell (website nav + footer, no console sidebar) — the same
  // pairing every other landing example uses.
  import AzionCompliance from '../components/AzionCompliance.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionCompliance />
  </SiteLayout>
</template>
