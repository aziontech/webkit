<script setup lang="ts">
  import { sampleTables } from '../sample'
  import ViewQueryEditor from '../view-query-editor.vue'
</script>

<template>
  <ViewQueryEditor
    :tables="sampleTables"
    loading
  />
</template>
