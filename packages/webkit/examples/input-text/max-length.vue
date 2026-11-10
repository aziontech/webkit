<script setup>
  import InputText from '@aziontech/webkit/input-text'
  import { ref } from 'vue'

  const value = ref('')
</script>

<template>
  <InputText
    v-model="value"
    placeholder="Up to 10 characters"
    :max-length="10"
  />
</template>
