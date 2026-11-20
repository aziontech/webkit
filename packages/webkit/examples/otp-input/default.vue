<script setup>
  import Field from '@aziontech/webkit/field'
  import OtpInput from '@aziontech/webkit/otp-input'
  import { ref } from 'vue'

  const code = ref('')
  const entered = ref('')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <Field>
      <Field.Label>Authentication code</Field.Label>
      <OtpInput
        v-model="code"
        name="code"
        @complete="(value) => (entered = value)"
      />
      <Field.Description>The 6-digit code from your authenticator app.</Field.Description>
    </Field>
    <p
      class="text-body-sm text-(--text-muted)"
      role="status"
    >
      {{ entered ? `Code ${entered} entered.` : '' }}
    </p>
  </div>
</template>
