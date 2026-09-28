<script setup>
  // Routed landing-page example: the azion.com/en/success-case/ library recreated inside the
  // segregated marketing shell (website nav + footer, no console sidebar). Add further
  // examples by pairing SiteLayout with a new content component the same way.
  import AzionSuccessCases from '../components/AzionSuccessCases.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionSuccessCases />
  </SiteLayout>
</template>
