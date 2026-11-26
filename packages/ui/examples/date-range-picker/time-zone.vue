<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const zones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo']
  const timeZone = ref('UTC')
  const range = ref({
    type: 'absolute',
    start: '2026-11-10T11:00:00.000Z',
    end: '2026-11-10T23:00:00.000Z'
  })
  const runQuery = () => {}
</script>

<template>
  <DateRangePicker
    v-model="range"
    v-model:time-zone="timeZone"
    :time-zones="zones"
    show-time-zone
    aria-label="Log window"
    @refresh="runQuery"
  />
</template>
