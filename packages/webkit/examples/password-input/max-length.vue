<script setup>
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const password = ref('')
</script>

<template>
  <PasswordInput
    v-model="password"
    :max-length="8"
    placeholder="Up to 8 characters"
  />
</template>
