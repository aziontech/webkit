<script setup>
  // Routed solution-page example: the azion.com Web Apps page recreation, rendered inside
  // the segregated marketing shell (website nav + footer, no console sidebar) — the same
  // pairing every other landing example uses.
  import AzionWebApps from '../components/AzionWebApps.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionWebApps />
  </SiteLayout>
</template>
