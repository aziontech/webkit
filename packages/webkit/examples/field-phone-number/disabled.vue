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
    model-value="11999999999"
    helper-text="Managed by your organization."
    disabled
  />
</template>
