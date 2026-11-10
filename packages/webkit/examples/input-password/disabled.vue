<script setup>
  import InputPassword from '@aziontech/webkit/input-password'
  import { ref } from 'vue'

  const password = ref('disabled-value')
</script>

<template>
  <InputPassword
    v-model="password"
    disabled
    placeholder="Enter your password"
  />
</template>
