<script setup>
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const password = ref('super-secret-value')
</script>

<template>
  <PasswordInput
    v-model="password"
    placeholder="Enter your password"
  />
</template>
