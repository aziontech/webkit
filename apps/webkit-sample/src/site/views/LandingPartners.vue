<script setup>
  // Routed partners-page example: the azion.com partners recreation, rendered inside the
  // segregated marketing shell (website nav + footer, no console sidebar) — the same pairing
  // every other landing example uses.
  import AzionPartners from '../components/AzionPartners.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionPartners />
  </SiteLayout>
</template>
