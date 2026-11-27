<script setup lang="ts">
  import CreateResourcePicker from '../create-resource-picker.vue'
  import { sampleProjects, sampleSelected } from '../sample'
</script>

<template>
  <CreateResourcePicker
    :projects="sampleProjects"
    :model-value="sampleSelected"
    loading
  />
</template>
