<script setup lang="ts">
  import DeploymentSettings from '../deployment-settings.vue'
</script>

<template>
  <DeploymentSettings :default-draft="{ bindingPolicy: 'FLEXIBLE' }" />
</template>
