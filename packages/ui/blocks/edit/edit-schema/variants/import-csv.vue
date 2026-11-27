<script setup lang="ts">
  import EditSchema from '../edit-schema.vue'
  import { sampleCsv, sampleRelations } from '../sample'
</script>

<template>
  <EditSchema
    :default-csv="sampleCsv"
    :default-draft="{ relations: sampleRelations }"
  />
</template>
