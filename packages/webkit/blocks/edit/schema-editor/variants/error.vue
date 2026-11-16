<script setup lang="ts">
  import SchemaEditor from '../schema-editor.vue'
</script>

<template>
  <SchemaEditor
    :default-draft="{ name: 'customers' }"
    error="A table named customers already exists in acme-store."
    default-submitted
  />
</template>
