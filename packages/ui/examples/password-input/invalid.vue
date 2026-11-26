<script setup>
  import Field from '@aziontech/webkit/field'
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const password = ref('weak')
</script>

<template>
  <Field
    invalid
    class="w-full max-w-(--container-xs)"
  >
    <Field.Label>Password</Field.Label>
    <PasswordInput
      v-model="password"
      autocomplete="new-password"
    />
    <Field.Error>Use at least 12 characters.</Field.Error>
  </Field>
</template>
