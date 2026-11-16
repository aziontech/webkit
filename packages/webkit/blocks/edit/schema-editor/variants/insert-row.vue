<script setup lang="ts">
  import SchemaEditor from '../schema-editor.vue'
</script>

<template>
  <SchemaEditor
    dialog="row"
    :default-row="{ id: '', name: 'Dana Reyes', email: '', created_at: '' }"
    default-submitted
  />
</template>
