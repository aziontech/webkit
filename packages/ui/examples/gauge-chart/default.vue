<script setup>
  import GaugeChart from '@aziontech/webkit/gauge-chart'

  const formatValue = (value) => `${value}%`
</script>

<template>
  <GaugeChart
    :value="74"
    label="Cache hit ratio"
    :format-value="formatValue"
  />
</template>
