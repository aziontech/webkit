<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({ type: 'since', start: '2026-11-10T09:30:00.000Z' })
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-xs)">
    <DateRangePicker
      v-model="range"
      time-zone="UTC"
      show-step
      aria-label="Incident time range"
    />
    <p class="text-body-sm m-0 text-(--text-muted)">
      <code>{{ JSON.stringify(range) }}</code>
    </p>
  </div>
</template>
