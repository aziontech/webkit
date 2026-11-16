<script setup lang="ts">
  import ResourcePicker from '../resource-picker.vue'
  import { sampleProjects } from '../sample'
</script>

<template>
  <ResourcePicker
    :projects="sampleProjects"
    error="Select the project this service serves, or create a new one."
  />
</template>
