<script setup>
  import Calendar from '@aziontech/webkit/calendar'
  import { ref } from 'vue'

  const now = new Date()
  const daysAgo = (n) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - n)
  const range = ref(null)
  const presets = [
    { label: 'Last 3 days', value: { start: daysAgo(3), end: now } },
    { label: 'Last 7 days', value: { start: daysAgo(7), end: now } },
    { label: 'Last 14 days', value: { start: daysAgo(14), end: now } },
    { label: 'Last month', value: { start: daysAgo(30), end: now } }
  ]
</script>

<template>
  <Calendar
    v-model="range"
    mode="range"
    :presets="presets"
  />
</template>
