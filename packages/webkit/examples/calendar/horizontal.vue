<script setup>
  import Calendar from '@aziontech/webkit/calendar-root'
  import { ref } from 'vue'

  const range = ref(null)
</script>

<template>
  <Calendar
    v-model="range"
    mode="range"
    horizontal
    clearable
    show-time
  />
</template>
