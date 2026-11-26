<script setup>
  import GaugeChart from '@aziontech/ui/gauge-chart'

  const thresholds = [
    { value: 0, severity: 'success', label: 'Healthy' },
    { value: 70, severity: 'warning', label: 'Busy' },
    { value: 90, severity: 'danger', label: 'Critical' }
  ]
  const formatValue = (value) => `${value}%`
</script>

<template>
  <GaugeChart
    :value="74"
    label="CPU usage"
    :thresholds="thresholds"
    :format-value="formatValue"
  />
</template>
