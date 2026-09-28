<script setup>
  // Routed solution-page example: the azion.com Technology page recreation, rendered inside
  // the segregated marketing shell (website nav + footer, no console sidebar) — the same
  // pairing LandingFinancialServices and LandingWebApps use for the other two solution pages.
  import AzionTechnology from '../components/AzionTechnology.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionTechnology />
  </SiteLayout>
</template>
