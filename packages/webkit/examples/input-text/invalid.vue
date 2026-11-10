<script setup>
  import InputText from '@aziontech/webkit/input-text'
  import { ref } from 'vue'

  const value = ref('invalid value')
</script>

<template>
  <InputText
    v-model="value"
    placeholder="Type something"
    invalid
  />
</template>
