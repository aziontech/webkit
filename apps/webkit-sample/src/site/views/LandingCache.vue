<script setup>
  // Routed product-page example: the azion.com Cache page recreation, rendered inside the
  // segregated marketing shell (website nav + footer, no console sidebar) — the same pairing
  // LandingAzion, LandingFunctions and LandingApplicationAccelerator use.
  import AzionCache from '../components/AzionCache.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionCache />
  </SiteLayout>
</template>
