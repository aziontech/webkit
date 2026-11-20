<script setup>
  import DatePicker from '@aziontech/webkit/date-picker'
  import { ref } from 'vue'

  const date = ref(new Date(2026, 9, 1))
</script>

<template>
  <DatePicker v-model="date">
    <template #footer>
      <DatePicker.Clear>Clear</DatePicker.Clear>
    </template>
  </DatePicker>
</template>
