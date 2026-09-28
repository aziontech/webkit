<script setup>
  // Routed products-page example: the platform catalogue, rendered inside the segregated
  // marketing shell (website nav + footer, no console sidebar) — the same pairing every
  // other landing example uses.
  import AzionProducts from '../components/AzionProducts.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionProducts />
  </SiteLayout>
</template>
