<script setup>
  // Routed hero catalogue: the Site's opening bands, side by side, rendered inside the
  // segregated marketing shell (website nav + footer, no console sidebar) — the same
  // pairing every other landing example uses, which is what puts each specimen under the
  // real nav it has to clear.
  import AzionHeros from '../components/AzionHeros.vue'
  import SiteLayout from '../components/SiteLayout.vue'
</script>

<template>
  <SiteLayout>
    <AzionHeros />
  </SiteLayout>
</template>
