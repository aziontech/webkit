<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const options = [
    { key: 'last-1-hour', amount: 1, unit: 'hour' },
    { key: 'last-24-hours', amount: 24, unit: 'hour' },
    { key: 'last-7-days', amount: 7, unit: 'day' },
    { key: 'last-30-days', amount: 30, unit: 'day' }
  ]

  const range = ref({ type: 'relative', amount: 24, unit: 'hour', key: 'last-24-hours' })
</script>

<template>
  <DateRangePicker
    v-model="range"
    :relative-options="options"
    range-selector-mode="relative-only"
    aria-label="Metrics interval"
  />
</template>
