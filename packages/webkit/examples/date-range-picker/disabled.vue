<script setup>
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  const range = ref({ type: 'relative', amount: 1, unit: 'hour', key: 'last-1-hour' })
</script>

<template>
  <DateRangePicker
    v-model="range"
    disabled
    aria-label="Events time range"
  />
</template>
