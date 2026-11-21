<script setup lang="ts">
  import DeployForm from './form.vue'
</script>

<template>
  <DeployForm
    show-preset
    detected-preset="nuxt"
    default-submitted
    default-build-open
  />
</template>
