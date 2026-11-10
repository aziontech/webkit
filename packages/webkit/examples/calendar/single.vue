<script setup>
  import { ref } from 'vue'

  import Calendar from '@aziontech/webkit/calendar'

  const date = ref(null)
</script>

<template>
  <Calendar
    v-model="date"
    mode="single"
    placeholder="Select date"
  />
</template>
