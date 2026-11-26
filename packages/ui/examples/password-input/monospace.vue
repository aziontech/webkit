<script setup>
  import CopyButton from '@aziontech/webkit/copy-button'
  import Field from '@aziontech/webkit/field'
  import PasswordInput from '@aziontech/webkit/password-input'

  const token = 'azn_7Kq0lO1Il9xR4vT2mW8pZ3'
</script>

<template>
  <Field class="w-full max-w-(--container-xs)">
    <Field.Label>Personal token</Field.Label>
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <PasswordInput
        :model-value="token"
        autocomplete="off"
        :spellcheck="false"
        readonly
        monospace
        class="min-w-0 flex-1"
      />
      <CopyButton
        :value="token"
        aria-label="Copy the personal token"
        copied-label="Token copied"
        variant="outline"
        size="medium"
      />
    </div>
    <Field.Description>Shown once. Copy it to your secret manager now.</Field.Description>
  </Field>
</template>
