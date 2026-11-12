<script setup>
  import CalendarRoot from '@aziontech/webkit/calendar-root'
  import { ref } from 'vue'

  const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })
</script>

<template>
  <CalendarRoot
    v-model="range"
    mode="range"
    clearable
  />
</template>
