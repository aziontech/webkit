<script setup>
  import { ref } from 'vue'

  import Calendar from '@aziontech/webkit/calendar'

  const range = ref({ start: new Date(2026, 9, 8, 0, 0), end: new Date(2026, 9, 19, 23, 59) })
</script>

<template>
  <Calendar
    v-model="range"
    mode="range"
    show-time
  />
</template>
