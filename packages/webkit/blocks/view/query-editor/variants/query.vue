<script setup lang="ts">
  import QueryEditor from '../query-editor.vue'
  import { sampleHistoryAfterSelect, sampleSelectResult, sampleSelectSql } from '../sample'
</script>

<template>
  <QueryEditor
    tab="editor"
    :sql="sampleSelectSql"
    :history="sampleHistoryAfterSelect"
    :result="sampleSelectResult"
  />
</template>
