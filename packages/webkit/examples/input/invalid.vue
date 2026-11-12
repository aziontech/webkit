<script setup>
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const value = ref('invalid value')
</script>

<template>
  <Input
    v-model="value"
    placeholder="Type something"
    invalid
  />
</template>
