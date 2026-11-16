<script setup lang="ts">
  import FunctionEditor from '../function-editor.vue'
</script>

<template>
  <FunctionEditor
    default-document="arguments"
    :default-expanded="['field-1']"
  />
</template>
