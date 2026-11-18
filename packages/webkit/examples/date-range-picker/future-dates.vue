<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({
    type: 'absolute',
    start: '2026-11-20T02:00:00.000Z',
    end: '2026-11-20T04:00:00.000Z'
  })
  const earliest = new Date('2026-11-10T00:00:00.000Z')
  const latest = new Date('2027-11-10T23:59:59.000Z')
</script>

<template>
  <DateRangePicker
    v-model="range"
    range-selector-mode="absolute-only"
    time-zone="UTC"
    :min="earliest"
    :max="latest"
    :max-duration="{ amount: 1, unit: 'day' }"
    aria-label="Maintenance window"
  />
</template>
