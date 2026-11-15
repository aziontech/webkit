<script setup>
  import DatePickerRoot from '@aziontech/webkit/date-picker-root'
  import { ref } from 'vue'

  const date = ref(new Date(2026, 9, 8, 14, 30))
</script>

<template>
  <DatePickerRoot
    v-model="date"
    show-time
  />
</template>
