<script setup lang="ts">
  import { sampleTables } from '../sample'
  import ViewQueryEditor from '../view-query-editor.vue'
</script>

<template>
  <ViewQueryEditor
    :tables="sampleTables"
    error="Couldn't load the rows of customers. Check your connection and retry."
  />
</template>
