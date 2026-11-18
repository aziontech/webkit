<script setup lang="ts">
  import EditFunction from '../edit-function.vue'
  import { sampleService } from '../sample'

  const code = sampleService.code.replace("'avif']", "'avif', 'jpeg']")
</script>

<template>
  <EditFunction
    :default-draft="{ code }"
    loading
  />
</template>
