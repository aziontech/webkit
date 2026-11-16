<script setup lang="ts">
  import Marketplace from '../marketplace.vue'
</script>

<template>
  <Marketplace
    default-integration="request-signer"
    default-application="checkout"
    error="The application already runs 10 functions, the most it can hold."
  />
</template>
