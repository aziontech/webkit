<script setup>
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const password = ref('weak')
</script>

<template>
  <PasswordInput
    v-model="password"
    invalid
    placeholder="Enter your password"
  />
</template>
