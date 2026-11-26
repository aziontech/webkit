<script setup>
  import DatePickerRoot from '@aziontech/ui/date-picker-root'
  import Field from '@aziontech/ui/field'
  import { ref } from 'vue'

  const start = ref(new Date(2026, 9, 8))
  const review = ref(new Date(2026, 9, 15))
  const end = ref(new Date(2026, 9, 22))
</script>

<template>
  <div class="flex flex-wrap items-start gap-4">
    <Field class="max-w-fit">
      <Field.Label>Start date</Field.Label>
      <DatePickerRoot
        v-model="start"
        size="small"
      />
    </Field>
    <Field class="max-w-fit">
      <Field.Label>Review date</Field.Label>
      <DatePickerRoot
        v-model="review"
        size="medium"
      />
    </Field>
    <Field class="max-w-fit">
      <Field.Label>End date</Field.Label>
      <DatePickerRoot
        v-model="end"
        size="large"
      />
    </Field>
  </div>
</template>
