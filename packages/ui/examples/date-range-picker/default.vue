<script setup>
  import DateRangePicker from '@aziontech/ui/date-range-picker'
  import { ref } from 'vue'

  const range = ref({ type: 'relative', amount: 15, unit: 'minute', key: 'last-15-minutes' })
  const runQuery = () => {}
</script>

<template>
  <DateRangePicker
    v-model="range"
    aria-label="Events time range"
    @refresh="runQuery"
  />
</template>
