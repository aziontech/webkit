<script setup>
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const value = ref('Example value')
</script>

<template>
  <Input
    v-model="value"
    placeholder="Type something"
  />
</template>
