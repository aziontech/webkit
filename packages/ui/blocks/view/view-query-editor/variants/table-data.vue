<script setup lang="ts">
  import { sampleTablesWithEvents } from '../sample'
  import ViewQueryEditor from '../view-query-editor.vue'
</script>

<template>
  <ViewQueryEditor
    :tables="sampleTablesWithEvents"
    table="tbl-events"
    :default-selected-keys="['ev-3', 'ev-4']"
  />
</template>
