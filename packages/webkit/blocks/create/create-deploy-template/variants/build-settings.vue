<script setup lang="ts">
  import DeployForm from '../parts/deploy-form.vue'
</script>

<template>
  <DeployForm
    show-preset
    detected-preset="nuxt"
    default-submitted
    default-build-open
  />
</template>
