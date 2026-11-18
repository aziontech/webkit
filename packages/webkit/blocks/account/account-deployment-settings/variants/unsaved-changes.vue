<script setup lang="ts">
  import AccountDeploymentSettings from '../account-deployment-settings.vue'
</script>

<template>
  <AccountDeploymentSettings :default-draft="{ bindingPolicy: 'FLEXIBLE' }" />
</template>
