<script setup lang="ts">
  import FunctionEditor from '../function-editor.vue'
  import { sampleService } from '../sample'

  const code = sampleService.code.replace("'avif']", "'avif', 'jpeg']")
</script>

<template>
  <FunctionEditor
    :default-draft="{ code }"
    loading
  />
</template>
