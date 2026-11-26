<script setup lang="ts">
  import CreateDrawer from '../create-drawer.vue'
</script>

<template>
  <CreateDrawer
    default-open
    :default-values="{ domain: 'acme-store', environment: 'Production' }"
    error="acme-store.azion.app wasn't added. The request timed out; your values are kept."
  />
</template>
