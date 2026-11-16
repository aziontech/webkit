<script setup lang="ts">
  import QueryEditor from '../query-editor.vue'
  import { sampleTablesWithEvents } from '../sample'
</script>

<template>
  <QueryEditor
    :tables="sampleTablesWithEvents"
    table="tbl-events"
    :default-selected-keys="['ev-3', 'ev-4']"
  />
</template>
