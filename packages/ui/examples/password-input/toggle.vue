<script setup>
  import Field from '@aziontech/ui/field'
  import PasswordInput from '@aziontech/ui/password-input'
  import { ref } from 'vue'

  const withToggle = ref('')
  const withoutToggle = ref('')
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col items-stretch gap-(--spacing-md)">
    <Field>
      <Field.Label>Password</Field.Label>
      <PasswordInput
        v-model="withToggle"
        :toggleable="true"
        autocomplete="current-password"
      />
      <Field.Description>At least 12 characters.</Field.Description>
    </Field>
    <Field>
      <Field.Label>Recovery code</Field.Label>
      <PasswordInput
        v-model="withoutToggle"
        :toggleable="false"
        autocomplete="off"
      />
      <Field.Description>Shown once when you set up two-factor authentication.</Field.Description>
    </Field>
  </div>
</template>
