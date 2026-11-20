<script setup lang="ts">
  import ViewMarketplace from '../view-marketplace.vue'
</script>

<template>
  <ViewMarketplace
    default-integration="request-signer"
    default-application="checkout"
    error="The application already runs 10 functions, the most it can hold."
  />
</template>
