<script setup>
  import { ref } from 'vue'

  import Calendar from '@aziontech/webkit/calendar'

  const range = ref({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 19) })
</script>

<template>
  <div class="min-h-[640px] w-full max-w-[560px]">
    <Calendar
      v-model="range"
      mode="range"
      :open="true"
      show-time
      show-timezone
      clearable
    />
  </div>
</template>
