<script setup lang="ts">
  import QueryEditor from '../query-editor.vue'
  import { sampleTables } from '../sample'
</script>

<template>
  <QueryEditor
    :tables="sampleTables"
    loading
  />
</template>
