<script setup>
  // Routed product-page example: the AI Inference page prototype, rendered inside the
  // segregated marketing shell (website nav + footer, no console sidebar) — the same
  // pairing LandingFunctions/LandingCache use for the other product pages.
  import AzionAiInference from '../components/AzionAiInference.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionAiInference />
  </SiteLayout>
</template>
