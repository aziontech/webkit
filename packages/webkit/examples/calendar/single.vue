<script setup>
  import Calendar from '@aziontech/webkit/calendar-root'
  import { ref } from 'vue'

  const date = ref(null)
</script>

<template>
  <Calendar
    v-model="date"
    mode="single"
    placeholder="Select date"
  />
</template>
