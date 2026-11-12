<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const zones = ['UTC', 'America/Sao_Paulo', 'America/New_York', 'Europe/Lisbon', 'Asia/Tokyo']
  const timeZone = ref('America/Sao_Paulo')
  const range = ref({
    type: 'absolute',
    start: '2026-11-10T11:00:00.000Z',
    end: '2026-11-10T23:00:00.000Z'
  })
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-xs)">
    <DateRangePicker
      v-model="range"
      v-model:time-zone="timeZone"
      :time-zones="zones"
      aria-label="Log window"
    />
    <p class="text-body-sm text-(--text-muted) tabular-nums">{{ range.start }} – {{ range.end }}</p>
  </div>
</template>
