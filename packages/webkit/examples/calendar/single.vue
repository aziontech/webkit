<script setup>
  import { ref } from 'vue'

  import CalendarRoot from '@aziontech/webkit/calendar-root'

  const date = ref(null)
</script>

<template>
  <CalendarRoot
    v-model="date"
    mode="single"
    placeholder="Select date"
  />
</template>
