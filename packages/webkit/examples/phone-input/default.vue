<script setup>
  import Field from '@aziontech/webkit/field'
  import PhoneInput from '@aziontech/webkit/phone-input'
  import { ref } from 'vue'

  const digits = ref('')
  const country = ref('US')
  const phone = ref(null)
</script>

<template>
  <Field
    required
    class="max-w-(--container-xs)"
  >
    <Field.Label>Phone</Field.Label>
    <PhoneInput
      v-model="digits"
      v-model:country="country"
      name="phone"
      @update:phone="phone = $event"
    />
    <Field.Description>We'll use this to send the verification code.</Field.Description>
  </Field>
</template>
