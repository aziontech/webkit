<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({
    type: 'absolute',
    start: '2026-11-03T00:00:00.000Z',
    end: '2026-11-05T23:59:00.000Z'
  })
  const runQuery = () => {}
</script>

<template>
  <DateRangePicker
    v-model="range"
    time-zone="UTC"
    absolute-layout="side-by-side"
    aria-label="Events time range"
    @refresh="runQuery"
  />
</template>
