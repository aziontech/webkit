<script setup lang="ts">
  import CreateResourcePicker from '../create-resource-picker.vue'
  import { sampleProjects } from '../sample'
</script>

<template>
  <CreateResourcePicker
    :projects="sampleProjects"
    error="Select the project this service serves, or create a new one."
  />
</template>
