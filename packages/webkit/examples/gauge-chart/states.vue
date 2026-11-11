<script setup>
  import GaugeChart from '@aziontech/webkit/gauge-chart'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-3">
    <GaugeChart
      loading
      aria-label="Cache hit ratio"
    />
    <GaugeChart
      :value="null"
      label="Cache hit ratio"
      empty-description="No request reached this application in the last hour."
    />
    <GaugeChart
      label="Cache hit ratio"
      error="Could not load the cache hit ratio. Try again in a few seconds."
    />
  </div>
</template>
