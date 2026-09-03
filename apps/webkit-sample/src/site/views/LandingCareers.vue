<script setup>
  // Routed careers-page example: the azion.com Engineering jobs listing recreation, rendered
  // inside the segregated marketing shell (website nav + footer, no console sidebar) — the
  // same pairing every other landing example uses.
  import AzionCareers from '../components/AzionCareers.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionCareers />
  </SiteLayout>
</template>
