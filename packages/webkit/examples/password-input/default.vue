<script setup>
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const password = ref('')
</script>

<template>
  <PasswordInput
    v-model="password"
    placeholder="Enter your password"
    autocomplete="current-password"
  />
</template>
