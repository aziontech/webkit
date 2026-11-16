<script setup lang="ts">
  import FunctionEditor from '../function-editor.vue'
  import { sampleServiceWithoutArguments } from '../sample'
</script>

<template>
  <FunctionEditor
    :service="sampleServiceWithoutArguments"
    :fields="[]"
    default-document="arguments"
  />
</template>
