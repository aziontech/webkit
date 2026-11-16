<script setup lang="ts">
  import CreateWizard from '../create-wizard.vue'

  const values = {
    name: 'office-ranges',
    items: '13335\n53331\n64512\n64513\n65001\n65002\n65010'
  }
</script>

<template>
  <CreateWizard
    default-step="review"
    default-policy="acme-production"
    :default-values="values"
  />
</template>
