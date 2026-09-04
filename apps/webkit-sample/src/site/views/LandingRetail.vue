<script setup>
  // Routed landing-page example: the azion.com/en/solutions/retail/ solution page recreated
  // inside the segregated marketing shell (website nav + footer, no console sidebar). Add
  // further examples by pairing SiteLayout with a new content component the same way.
  import AzionRetail from '../components/AzionRetail.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionRetail />
  </SiteLayout>
</template>
