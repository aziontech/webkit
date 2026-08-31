<script setup>
  // Routed landing-page example: the azion.com/en/solutions/financial-services/ solution
  // page recreated inside the segregated marketing shell (website nav + footer, no console
  // sidebar). Add further examples by pairing SiteLayout with a new content component the
  // same way.
  import AzionFinancialServices from '../components/AzionFinancialServices.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionFinancialServices />
  </SiteLayout>
</template>
