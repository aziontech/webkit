<script setup lang="ts">
  import EditSchema from '../edit-schema.vue'
</script>

<template>
  <EditSchema
    dialog="column"
    :default-column="{ name: 'phone', type: 'varchar' }"
  />
</template>
