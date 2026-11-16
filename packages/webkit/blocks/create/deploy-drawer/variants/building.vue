<script setup lang="ts">
  import DeployDrawer from '../deploy-drawer.vue'
</script>

<template>
  <DeployDrawer :build="{ name: 'web-app', version: 'A77SA473', elapsed: 2 }" />
</template>
