<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({ type: 'relative', amount: 15, unit: 'minute', key: 'last-15-minutes' })
  const runQuery = () => {}
</script>

<template>
  <DateRangePicker
    v-model="range"
    time-zone="UTC"
    custom-range-display="inline"
    aria-label="Events time range"
    @refresh="runQuery"
  />
</template>
