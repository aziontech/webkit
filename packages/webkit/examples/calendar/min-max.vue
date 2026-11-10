<script setup>
  import { ref } from 'vue'

  import Calendar from '@aziontech/webkit/calendar'

  const now = new Date()
  const range = ref(null)
  const min = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())
  const max = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())
</script>

<template>
  <Calendar
    v-model="range"
    mode="range"
    :min="min"
    :max="max"
    clearable
  />
</template>
