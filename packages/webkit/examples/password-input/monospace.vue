<script setup>
  import Field from '@aziontech/webkit/field'
  import PasswordInput from '@aziontech/webkit/password-input'
  import { ref } from 'vue'

  const token = ref('azn_7Kq0lO1Il9xR4vT2mW8pZ3')
</script>

<template>
  <Field class="w-full max-w-(--container-xs)">
    <Field.Label>Personal token</Field.Label>
    <PasswordInput
      v-model="token"
      autocomplete="off"
      :spellcheck="false"
      monospace
    />
    <Field.Description>Shown once. Store it in your secret manager.</Field.Description>
  </Field>
</template>
