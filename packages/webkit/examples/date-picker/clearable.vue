<script setup>
  import DatePickerRoot from '@aziontech/webkit/date-picker-root'
  import { ref } from 'vue'

  const date = ref(new Date(2026, 9, 8))
</script>

<template>
  <DatePickerRoot
    v-model="date"
    clearable
  />
</template>
