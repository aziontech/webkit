<script setup>
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
  import { ref } from 'vue'

  const country = ref('BR')
  const phone = ref('')
</script>

<template>
  <FieldPhoneNumber
    v-model="phone"
    v-model:country="country"
    label="Phone"
    model-value="119"
    helper-text="Enter a valid phone number."
    invalid
  />
</template>
