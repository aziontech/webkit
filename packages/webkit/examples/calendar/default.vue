<script setup>
  import { ref } from 'vue'

  import CalendarRoot from '@aziontech/webkit/calendar-root'

  const range = ref(null)
</script>

<template>
  <CalendarRoot
    v-model="range"
    mode="range"
    clearable
    show-time
    show-timezone
  />
</template>
