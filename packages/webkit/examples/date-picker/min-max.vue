<script setup>
  import DatePickerRoot from '@aziontech/webkit/date-picker-root'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const today = new Date(2026, 10, 10)
  const date = ref(today)
  const min = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate())
  const max = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate())
</script>

<template>
  <Field>
    <Field.Label>Report date</Field.Label>
    <DatePickerRoot
      v-model="date"
      :min="min"
      :max="max"
      clearable
    />
  </Field>
</template>
