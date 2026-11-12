<script setup>
  import CalendarRoot from '@aziontech/webkit/calendar-root'
  import { ref } from 'vue'

  const range = ref(null)
</script>

<template>
  <CalendarRoot
    v-model="range"
    mode="range"
    horizontal
    clearable
    show-time
  />
</template>
