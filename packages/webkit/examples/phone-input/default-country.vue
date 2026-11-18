<script setup>
  import Field from '@aziontech/webkit/field'
  import PhoneInput from '@aziontech/webkit/phone-input'
  import { ref } from 'vue'

  const digits = ref('')
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>Phone</Field.Label>
    <PhoneInput
      v-model="digits"
      default-country="GB"
      name="phone"
    />
    <Field.Description
      >Starts on the United Kingdom; the user can still pick another country.</Field.Description
    >
  </Field>
</template>
