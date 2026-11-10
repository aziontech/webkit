<script setup>
  import { ref } from 'vue'

  import Calendar from '@aziontech/webkit/calendar'

  const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })
</script>

<template>
  <div class="flex items-start gap-4">
    <Calendar
      v-model="range"
      mode="range"
      size="small"
    />
    <Calendar
      v-model="range"
      mode="range"
      size="medium"
    />
    <Calendar
      v-model="range"
      mode="range"
      size="large"
    />
  </div>
</template>
