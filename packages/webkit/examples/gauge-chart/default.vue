<script setup>
  import GaugeChart from '@aziontech/webkit/gauge-chart'

  const thresholds = [
    { value: 0, color: 'success', label: 'Healthy' },
    { value: 70, color: 'warning', label: 'Busy' },
    { value: 90, color: 'danger', label: 'Critical' }
  ]
  const formatValue = (value) => `${value}%`
</script>

<template>
  <GaugeChart
    :value="74"
    label="Cache hit ratio"
    :thresholds="thresholds"
    :format-value="formatValue"
  />
</template>
