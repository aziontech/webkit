<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({ type: 'relative', amount: 5, unit: 'minute', key: 'last-5-minutes' })
  const refreshInterval = ref(60)
  const runQuery = () => {}
  const quickRanges = [
    { key: 'today', amount: 1, unit: 'day', snap: true },
    { key: 'this-week', amount: 1, unit: 'week', snap: true },
    { key: 'last-5-minutes', amount: 5, unit: 'minute' },
    { key: 'last-15-minutes', amount: 15, unit: 'minute' },
    { key: 'last-30-minutes', amount: 30, unit: 'minute' },
    { key: 'last-1-hour', amount: 1, unit: 'hour' },
    { key: 'last-24-hours', amount: 24, unit: 'hour' },
    { key: 'last-7-days', amount: 7, unit: 'day' }
  ]
</script>

<template>
  <DateRangePicker
    v-model="range"
    v-model:refresh-interval="refreshInterval"
    :relative-options="quickRanges"
    time-zone="UTC"
    show-step
    aria-label="Events time range"
    @refresh="runQuery"
  />
</template>
