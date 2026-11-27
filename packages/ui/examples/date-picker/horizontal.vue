<script setup>
  import DatePickerRoot from '@aziontech/ui/date-picker-root'
  import Field from '@aziontech/ui/field'
  import { ref } from 'vue'

  const date = ref(null)
</script>

<template>
  <Field>
    <Field.Label>Maintenance start</Field.Label>
    <DatePickerRoot
      v-model="date"
      orientation="horizontal"
      clearable
      show-time
    />
  </Field>
</template>
