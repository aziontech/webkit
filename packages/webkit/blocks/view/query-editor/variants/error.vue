<script setup lang="ts">
  import QueryEditor from '../query-editor.vue'
  import { sampleTables } from '../sample'
</script>

<template>
  <QueryEditor
    :tables="sampleTables"
    error="Couldn't load the rows of customers. Check your connection and retry."
  />
</template>
