<script setup>
  import Field from '@aziontech/ui/field'
  import PasswordInput from '@aziontech/ui/password-input'
  import { ref } from 'vue'

  const password = ref('super-secret-value')
</script>

<template>
  <Field class="w-full max-w-(--container-xs)">
    <Field.Label>Password</Field.Label>
    <PasswordInput
      v-model="password"
      autocomplete="current-password"
    />
  </Field>
</template>
