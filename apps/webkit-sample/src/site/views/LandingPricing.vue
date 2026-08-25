<script setup>
  // Routed landing-page example: the azion.com/pt-br/planos pricing page inside the
  // segregated marketing shell (website nav + footer, no console sidebar). The site nav's
  // `Pricing` entry points here.
  import AzionPricing from '../components/AzionPricing.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionPricing />
  </SiteLayout>
</template>
