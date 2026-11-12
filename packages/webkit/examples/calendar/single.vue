<script setup>
  import CalendarRoot from '@aziontech/webkit/calendar-root'
  import { ref } from 'vue'

  const date = ref(null)
</script>

<template>
  <CalendarRoot
    v-model="date"
    mode="single"
    placeholder="Select date"
  />
</template>
