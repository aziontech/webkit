<script setup>
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <Input
    v-model="value"
    placeholder="Up to 10 characters"
    :max-length="10"
  />
</template>
