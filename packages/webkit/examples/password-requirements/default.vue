<script setup>
  import { ref } from 'vue'
  import Field from '@aziontech/webkit/field'
  import PasswordInput from '@aziontech/webkit/password-input'
  import PasswordRequirements from '@aziontech/webkit/password-requirements'

  const password = ref('')
</script>

<template>
  <Field
    required
    class="max-w-(--container-xs)"
  >
    <Field.Label>Password</Field.Label>
    <PasswordInput
      v-model="password"
      autocomplete="new-password"
    />
    <PasswordRequirements :value="password" />
  </Field>
</template>
