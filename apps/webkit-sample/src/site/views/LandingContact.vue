<script setup>
  // Routed contact-page example: the azion.com contact recreation, rendered inside the
  // segregated marketing shell (website nav + footer, no console sidebar) — the same pairing
  // every other landing example uses.
  import AzionContact from '../components/AzionContact.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionContact />
  </SiteLayout>
</template>
