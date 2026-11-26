<script setup>
  import Field from '@aziontech/webkit/field'
  import OtpInput from '@aziontech/webkit/otp-input'
  import { ref } from 'vue'

  const rejected = ref('')
  const checking = ref('482913')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <Field invalid>
      <Field.Label>Authentication code</Field.Label>
      <OtpInput v-model="rejected" />
      <Field.Description
        >That code is not valid. Enter the current code from your app.</Field.Description
      >
    </Field>
    <Field disabled>
      <Field.Label>Authentication code</Field.Label>
      <OtpInput v-model="checking" />
      <Field.Description>Checking the code.</Field.Description>
    </Field>
  </div>
</template>
