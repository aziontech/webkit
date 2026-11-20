<script setup>
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const password = ref('disabled-value')
</script>

<template>
  <PasswordInput
    v-model="password"
    disabled
    placeholder="Enter your password"
  />
</template>
