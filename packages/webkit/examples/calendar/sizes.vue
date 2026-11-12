<script setup>
  import { ref } from 'vue'

  import CalendarRoot from '@aziontech/webkit/calendar-root'

  const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })
</script>

<template>
  <div class="flex flex-wrap items-start gap-4">
    <CalendarRoot
      v-model="range"
      mode="range"
      size="small"
    />
    <CalendarRoot
      v-model="range"
      mode="range"
      size="medium"
    />
    <CalendarRoot
      v-model="range"
      mode="range"
      size="large"
    />
  </div>
</template>
