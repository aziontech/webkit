<script setup>
  import DatePickerRoot from '@aziontech/webkit/date-picker-root'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const date = ref(new Date(2026, 9, 8))
</script>

<template>
  <Field>
    <Field.Label>Expiry date</Field.Label>
    <DatePickerRoot
      v-model="date"
      clearable
    />
  </Field>
</template>
