<script setup>
  // Routed landing-page example: the azion.com Vercel Alternative Guide recreation,
  // rendered inside the segregated marketing shell (website nav + footer, no console
  // sidebar) — the same pairing every other /site page uses.
  import AzionVercelAlternative from '../components/AzionVercelAlternative.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionVercelAlternative />
  </SiteLayout>
</template>
