<script setup lang="ts">
  import CreateWizard from '../create-wizard.vue'
</script>

<template>
  <CreateWizard
    default-step="settings"
    default-policy="acme-production"
    :default-values="{ name: 'office-ranges' }"
  />
</template>
