<script setup>
  import InputPassword from '@aziontech/webkit/input-password'
  import { ref } from 'vue'

  const password = ref('')
</script>

<template>
  <InputPassword
    v-model="password"
    placeholder="Enter your password"
    autocomplete="current-password"
  />
</template>
