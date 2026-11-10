<script setup>
  import FieldPassword from '@aziontech/webkit/field-password'
  import { ref } from 'vue'

  const password = ref('')
</script>

<template>
  <FieldPassword
    v-model="password"
    label="Password"
    placeholder="Enter your password"
    helper-text="At least 8 characters."
    requirements
  />
</template>
