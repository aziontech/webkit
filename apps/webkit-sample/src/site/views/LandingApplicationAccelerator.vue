<script setup>
  // Routed product-page example: the azion.com Application Accelerator page recreation,
  // rendered inside the segregated marketing shell (website nav + footer, no console
  // sidebar) — the same pairing LandingAzion and LandingFunctions use.
  import AzionApplicationAccelerator from '../components/AzionApplicationAccelerator.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionApplicationAccelerator />
  </SiteLayout>
</template>
