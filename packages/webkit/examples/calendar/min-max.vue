<script setup>
  import { ref } from 'vue'

  import Calendar from '@aziontech/webkit/calendar'

  const today = new Date(2026, 10, 10)
  const range = ref({ start: new Date(2026, 10, 3), end: today })
  const min = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate())
  const max = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate())
</script>

<template>
  <Calendar
    v-model="range"
    mode="range"
    :min="min"
    :max="max"
    clearable
  />
</template>
