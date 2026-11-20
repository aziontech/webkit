<script setup>
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <Input
    v-model="value"
    placeholder="Type something"
  />
</template>
