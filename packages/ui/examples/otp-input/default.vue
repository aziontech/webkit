<script setup>
  import Field from '@aziontech/webkit/field'
  import OtpInput from '@aziontech/webkit/otp-input'
  import { ref } from 'vue'

  const code = ref('')
  const complete = ref(false)
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <Field>
      <Field.Label>Authentication code</Field.Label>
      <OtpInput
        v-model="code"
        name="code"
        @update:model-value="complete = false"
        @complete="complete = true"
      />
      <Field.Description>The 6-digit code from your authenticator app.</Field.Description>
    </Field>
    <p
      class="text-body-sm text-(--text-muted)"
      role="status"
    >
      {{ complete ? 'Code complete. Verifying…' : '' }}
    </p>
  </div>
</template>
