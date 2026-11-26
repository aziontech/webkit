<script setup>
  import GaugeChart from '@aziontech/webkit/gauge-chart'

  const formatValue = (value) => `${value} ms`
</script>

<template>
  <div class="flex flex-wrap items-end gap-(--spacing-lg)">
    <GaugeChart
      :value="38"
      :max="200"
      size="small"
      label="Edge latency, p50"
      :format-value="formatValue"
    />
    <GaugeChart
      :value="92"
      :max="200"
      size="medium"
      label="Edge latency, p95"
      :format-value="formatValue"
    />
    <GaugeChart
      :value="164"
      :max="200"
      size="large"
      label="Edge latency, p99"
      :format-value="formatValue"
    />
  </div>
</template>
