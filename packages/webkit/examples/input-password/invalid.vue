<script setup>
  import InputPassword from '@aziontech/webkit/input-password'
  import { ref } from 'vue'

  const password = ref('weak')
</script>

<template>
  <InputPassword
    v-model="password"
    invalid
    placeholder="Enter your password"
  />
</template>
