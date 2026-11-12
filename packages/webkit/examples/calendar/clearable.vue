<script setup>
  import { ref } from 'vue'

  import Calendar from '@aziontech/webkit/calendar'

  const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })
</script>

<template>
  <Calendar
    v-model="range"
    mode="range"
    clearable
  />
</template>
