<script setup>
  import Field from '@aziontech/webkit/field'
  import OtpInput from '@aziontech/webkit/otp-input'
  import { ref } from 'vue'

  const code = ref('')
  const recovery = ref('')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <Field>
      <Field.Label>Verification code</Field.Label>
      <OtpInput
        v-model="code"
        :group="3"
      />
      <Field.Description>We sent a 6-digit code to the email on the account.</Field.Description>
    </Field>
    <Field>
      <Field.Label>Recovery code</Field.Label>
      <OtpInput
        v-model="recovery"
        mode="alphanumeric"
        :length="8"
        :group="4"
      />
      <Field.Description
        >One of the 8-character codes you saved when you set up MFA.</Field.Description
      >
    </Field>
  </div>
</template>
