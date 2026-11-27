<script setup lang="ts">
  import { sampleHistoryAfterSelect, sampleSelectResult, sampleSelectSql } from '../sample'
  import ViewQueryEditor from '../view-query-editor.vue'
</script>

<template>
  <ViewQueryEditor
    tab="editor"
    :sql="sampleSelectSql"
    :history="sampleHistoryAfterSelect"
    :result="sampleSelectResult"
  />
</template>
