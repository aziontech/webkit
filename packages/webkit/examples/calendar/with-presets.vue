<script setup>
  import Calendar from '@aziontech/webkit/calendar-root'
  import { ref } from 'vue'

  const today = new Date(2026, 10, 10)
  const daysAgo = (n) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - n)
  const presets = [
    { label: 'Last 3 days', value: { start: daysAgo(3), end: today } },
    { label: 'Last 7 days', value: { start: daysAgo(7), end: today } },
    { label: 'Last 14 days', value: { start: daysAgo(14), end: today } },
    { label: 'Last month', value: { start: daysAgo(30), end: today } }
  ]
  const range = ref(presets[1].value)
</script>

<template>
  <Calendar
    v-model="range"
    mode="range"
    :presets="presets"
  />
</template>
