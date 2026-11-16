<script setup lang="ts">
  import SchemaEditor from '../schema-editor.vue'
</script>

<template>
  <SchemaEditor
    dialog="column"
    :default-column="{ name: 'phone', type: 'varchar' }"
  />
</template>
