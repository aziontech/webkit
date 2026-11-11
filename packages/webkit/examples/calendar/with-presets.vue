<script setup>
  import { ref } from 'vue'

  import Calendar from '@aziontech/webkit/calendar'

  const today = new Date(2026, 10, 10)
  const daysAgo = (n) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - n)
  const presets = [
    { label: 'Last 3 Days', value: { start: daysAgo(3), end: today } },
    { label: 'Last 7 Days', value: { start: daysAgo(7), end: today } },
    { label: 'Last 14 Days', value: { start: daysAgo(14), end: today } },
    { label: 'Last Month', value: { start: daysAgo(30), end: today } }
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
