<script setup>
  import { ref } from 'vue'

  import Calendar from '@aziontech/webkit/calendar'

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
