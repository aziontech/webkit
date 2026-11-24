<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({ type: 'since', start: '2026-11-10T09:30:00.000Z' })
  const runQuery = () => {}
</script>

<template>
  <DateRangePicker
    v-model="range"
    time-zone="UTC"
    show-step
    aria-label="Incident time range"
    @refresh="runQuery"
  />
</template>
