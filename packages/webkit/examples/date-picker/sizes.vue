<script setup>
  import DatePickerRoot from '@aziontech/webkit/date-picker-root'
  import { ref } from 'vue'

  const date = ref(new Date(2026, 9, 8))
</script>

<template>
  <div class="flex flex-wrap items-start gap-4">
    <DatePickerRoot
      v-model="date"
      size="small"
    />
    <DatePickerRoot
      v-model="date"
      size="medium"
    />
    <DatePickerRoot
      v-model="date"
      size="large"
    />
  </div>
</template>
