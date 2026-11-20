<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({ type: 'relative', amount: 24, unit: 'hour', key: 'last-24-hours' })
  const runQuery = () => {}
</script>

<template>
  <DateRangePicker
    v-model="range"
    range-selector-mode="relative-only"
    aria-label="Metrics interval"
    @refresh="runQuery"
  />
</template>
