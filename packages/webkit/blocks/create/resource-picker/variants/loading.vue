<script setup lang="ts">
  import ResourcePicker from '../resource-picker.vue'
  import { sampleProjects, sampleSelected } from '../sample'
</script>

<template>
  <ResourcePicker
    :projects="sampleProjects"
    :model-value="sampleSelected"
    loading
  />
</template>
