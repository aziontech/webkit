<script setup>
  import Calendar from '@aziontech/webkit/calendar'
  import { ref } from 'vue'

  const range = ref({ start: null, end: null })
  const quarters = [
    { label: 'Q3 2026', value: { start: new Date(2026, 6, 1), end: new Date(2026, 8, 30) } },
    { label: 'Q4 2026', value: { start: new Date(2026, 9, 1), end: new Date(2026, 11, 31) } }
  ]
</script>

<template>
  <Calendar
    v-model="range"
    mode="range"
  >
    <template #presets>
      <Calendar.Preset
        v-for="quarter in quarters"
        :key="quarter.label"
        :value="quarter.value"
      >
        {{ quarter.label }}
      </Calendar.Preset>
    </template>
    <template #footer>
      <Calendar.Clear>Clear</Calendar.Clear>
    </template>
  </Calendar>
</template>
