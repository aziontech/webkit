<script setup lang="ts">
  import EditFunction from '../edit-function.vue'
  import { sampleServiceWithoutArguments } from '../sample'
</script>

<template>
  <EditFunction
    :service="sampleServiceWithoutArguments"
    :fields="[]"
    default-document="arguments"
  />
</template>
