<script setup>
  // Routed landing-page example: the azion.com/pt-br homepage recreation rendered
  // inside the segregated marketing shell (website nav + footer, no console
  // sidebar). Add further examples by pairing SiteLayout with a new content
  // component the same way.
  import AzionHome from './AzionHome.vue'
  import SiteLayout from './SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionHome />
  </SiteLayout>
</template>
