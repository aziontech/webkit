<script setup>
  import DatePicker from '@aziontech/webkit/date-picker'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const date = ref(new Date(2026, 9, 1))
</script>

<template>
  <Field>
    <Field.Label>Release date</Field.Label>
    <DatePicker v-model="date">
      <template #footer>
        <DatePicker.Clear>Clear</DatePicker.Clear>
      </template>
    </DatePicker>
  </Field>
</template>
