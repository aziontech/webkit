<script setup>
  import Field from '@aziontech/webkit/field'
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const password = ref('')
</script>

<template>
  <Field class="w-full max-w-(--container-xs)">
    <Field.Label>Password</Field.Label>
    <PasswordInput
      v-model="password"
      autocomplete="new-password"
      :max-length="128"
    />
    <Field.Description>12 to 128 characters. Passphrases are welcome.</Field.Description>
  </Field>
</template>
