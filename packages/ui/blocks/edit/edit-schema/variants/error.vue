<script setup lang="ts">
  import EditSchema from '../edit-schema.vue'
</script>

<template>
  <EditSchema
    :default-draft="{ name: 'customers' }"
    error="A table named customers already exists in acme-store."
    default-submitted
  />
</template>
