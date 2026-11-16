<script setup lang="ts">
  import { sampleCsv, sampleRelations } from '../sample'
  import SchemaEditor from '../schema-editor.vue'
</script>

<template>
  <SchemaEditor
    :default-csv="sampleCsv"
    :default-draft="{ relations: sampleRelations }"
  />
</template>
