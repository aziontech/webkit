<script setup>
  import Field from '@aziontech/ui/field'
  import PasswordInput from '@aziontech/ui/password-input'
  import { ref } from 'vue'

  const password = ref('disabled-value')
</script>

<template>
  <Field
    disabled
    class="w-full max-w-(--container-xs)"
  >
    <Field.Label>Password</Field.Label>
    <PasswordInput
      v-model="password"
      disabled
    />
  </Field>
</template>
