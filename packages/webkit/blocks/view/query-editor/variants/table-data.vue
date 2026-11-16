<script setup lang="ts">
  import QueryEditor from '../query-editor.vue'
  import { sampleTablesWithEvents } from '../sample'
</script>

<template>
  <QueryEditor
    :tables="sampleTablesWithEvents"
    table="tbl-events"
    :default-row-selection="{ 'ev-3': true, 'ev-4': true }"
  />
</template>
