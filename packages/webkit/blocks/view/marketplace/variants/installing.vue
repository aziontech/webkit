<script setup lang="ts">
  import Marketplace from '../marketplace.vue'
</script>

<template>
  <Marketplace
    default-integration="request-signer"
    default-application="storefront"
    installing
  />
</template>
