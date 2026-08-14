<script setup>
  // Routed product-page example: the azion.com Functions page recreation, rendered inside
  // the segregated marketing shell (website nav + footer, no console sidebar) — the same
  // pairing LandingAzion uses for the homepage.
  import AzionFunctions from './AzionFunctions.vue'
  import SiteLayout from './SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionFunctions />
  </SiteLayout>
</template>
