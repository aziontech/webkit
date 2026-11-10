<script setup>
  import { ref } from 'vue'

  import Calendar from '@aziontech/webkit/calendar'

  const now = new Date()
  const daysAgo = (n) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - n)
  const range = ref(null)
  const presets = [
    { label: 'Last 3 Days', value: { start: daysAgo(3), end: now } },
    { label: 'Last 7 Days', value: { start: daysAgo(7), end: now } },
    { label: 'Last 14 Days', value: { start: daysAgo(14), end: now } },
    { label: 'Last Month', value: { start: daysAgo(30), end: now } }
  ]
</script>

<template>
  <Calendar
    v-model="range"
    mode="range"
    :presets="presets"
  />
</template>
