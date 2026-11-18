<script setup lang="ts">
  import CreateDeployDrawer from '../create-deploy-drawer.vue'
</script>

<template>
  <CreateDeployDrawer :build="{ name: 'web-app', version: 'A77SA473', elapsed: 2 }" />
</template>
