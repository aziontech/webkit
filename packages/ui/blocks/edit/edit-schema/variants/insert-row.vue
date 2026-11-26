<script setup lang="ts">
  import EditSchema from '../edit-schema.vue'
</script>

<template>
  <EditSchema
    dialog="row"
    :default-row="{ id: '', name: 'Dana Reyes', email: '', created_at: '' }"
    default-submitted
  />
</template>
