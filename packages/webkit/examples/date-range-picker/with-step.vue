<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({
    type: 'absolute',
    start: '2026-11-10T13:00:00.000Z',
    end: '2026-11-10T14:00:00.000Z'
  })
</script>

<template>
  <DateRangePicker
    v-model="range"
    time-zone="UTC"
    show-step
    aria-label="Trace window"
  />
</template>
