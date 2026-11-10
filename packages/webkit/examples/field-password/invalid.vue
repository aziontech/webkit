<script setup>
  import FieldPassword from '@aziontech/webkit/field-password'
  import { ref } from 'vue'

  const password = ref('weak')
</script>

<template>
  <FieldPassword
    v-model="password"
    label="Password"
    placeholder="Enter your password"
    helper-text="Password must be at least 8 characters."
    requirements
    invalid
  />
</template>
