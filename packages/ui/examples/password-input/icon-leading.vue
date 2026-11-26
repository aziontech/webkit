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
      autocomplete="current-password"
    >
      <template #leading>
        <i class="az az-lock" />
      </template>
    </PasswordInput>
  </Field>
</template>
