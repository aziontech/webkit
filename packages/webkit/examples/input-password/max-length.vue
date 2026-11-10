<script setup>
  import InputPassword from '@aziontech/webkit/input-password'
  import { ref } from 'vue'

  const password = ref('')
</script>

<template>
  <InputPassword
    v-model="password"
    :max-length="8"
    placeholder="Up to 8 characters"
  />
</template>
