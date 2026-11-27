<script setup>
  import Field from '@aziontech/ui/field'
  import PasswordInput from '@aziontech/ui/password-input'
  import PasswordRequirements from '@aziontech/ui/password-requirements-root'
  import { ref } from 'vue'

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
