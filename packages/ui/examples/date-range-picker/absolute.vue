<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({
    type: 'absolute',
    start: '2026-11-10T12:00:00.000Z',
    end: '2026-11-10T18:30:00.000Z'
  })
</script>

<template>
  <DateRangePicker
    v-model="range"
    range-selector-mode="absolute-only"
    time-zone="UTC"
    :max="new Date('2026-11-11T00:00:00.000Z')"
    aria-label="Billing window"
  />
</template>
