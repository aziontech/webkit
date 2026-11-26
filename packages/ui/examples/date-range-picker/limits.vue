<script setup>
  import DateRangePicker from '@aziontech/ui/date-range-picker'
  import { ref } from 'vue'

  const range = ref({ type: 'relative', amount: 24, unit: 'hour', key: 'last-24-hours' })
  const runQuery = () => {}
</script>

<template>
  <DateRangePicker
    v-model="range"
    :max-duration="{ amount: 90, unit: 'day' }"
    aria-label="Metrics time range"
    @refresh="runQuery"
  />
</template>
