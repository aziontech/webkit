<script setup>
  import FieldPassword from '@aziontech/webkit/field-password'
  import { ref } from 'vue'

  const password = ref('locked-value')
</script>

<template>
  <FieldPassword
    v-model="password"
    label="Password"
    placeholder="Enter your password"
    helper-text="This field is locked."
    requirements
    disabled
  />
</template>
