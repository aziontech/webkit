<script setup>
  import Field from '@aziontech/webkit/field'
  import PasswordInput from '@aziontech/webkit/password-input'
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
      <Field.Description>With the show and hide toggle (default).</Field.Description>
    </Field>
    <Field>
      <Field.Label>Recovery code</Field.Label>
      <PasswordInput
        v-model="withoutToggle"
        :toggleable="false"
        autocomplete="off"
      />
      <Field.Description>Without the toggle.</Field.Description>
    </Field>
  </div>
</template>
